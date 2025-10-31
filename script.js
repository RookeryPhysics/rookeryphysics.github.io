import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

let animationFrameId;
let scene, camera, renderer, stats;
let raycaster;
let projectileRaycaster;
let originalFog;
let noise;
let worldSeedString = ""; 
let isMobileDevice = false;
let playerCube;
let rifle; 
let playerSpawnPoint = new THREE.Vector3();
const playerHeight = 1.6; 
const playerWidth = 0.8;  
const playerMoveSpeed = 6.0;
const playerJumpHeight = 10.0;
const gravity = -25;
let playerVelocity = new THREE.Vector3();
let playerOnGround = false;
let playerJumpCount = 0;
let isFlying = false;
const flyingSpeed = 25.0;
const keys = {};
let spaceWasPressedLastFrame = false;
const clock = new THREE.Clock();
let isAiming = false;
const DESKTOP_HIP_RIFLE_POS = new THREE.Vector3(0.4, -0.25, -0.7);
const DESKTOP_ADS_RIFLE_POS = new THREE.Vector3(0, -0.2, -0.5); 
const MOBILE_HIP_RIFLE_POS = new THREE.Vector3(0.3, -0.25, -0.65); // More left (less X) and more forward (less neg Z)
const MOBILE_ADS_RIFLE_POS = new THREE.Vector3(0, -0.2, -0.5); // Same as desktop
let isFiring = false;

const modes = ['shoot', 'missile', 'toolgun', 'add']; 
let currentModeIndex = 0;
let currentMode = 'shoot';
let currentColor = 0x999999;
const modifiedBlocks = new Map();
 
let blockInventory = 0;
let goldInventory = 0;
let goldNuggets = [];
const MAX_ORB_LIGHTS = 10; // Max number of orb lights allowed at once
 
let heldBlock = null;
let toolgunLaser = null;
let isToolgunActive = false;

let projectiles = [];
let shootCooldown = 0;
const FIRE_RATE = 0.1; // 10 shots per second
const PROJECTILE_SPEED = 160.0;
let missiles = [];
const MISSILE_SPEED = 40.0;
const MISSILE_EXPLOSION_RADIUS = 3;
const MISSILE_EXPLOSION_DURATION = 0.5;
const MISSILE_KNOCKBACK_FORCE = 25.0;
let explosions = [];
let muzzleFlashes = [];
const MUZZLE_FLASH_DURATION = 0.05;
let laserFlashes = [];
const LASER_FLASH_DURATION = 0.05;
let droppedBlocks = []; 
let snowflakes = []; 
let lastPlayerPos = new THREE.Vector3(); 

const CHUNK_SIZE = 16;
const RENDER_DISTANCE = 4;
const TERRAIN_SCALE = 50;
const TERRAIN_AMPLITUDE = 30;
const loadedChunks = new Map();
let currentPlayerChunkX, currentPlayerChunkZ;
const BEDROCK_LEVEL = -30;

const DIRT_COLOR_1 = new THREE.Color(0x8B4513);
const DIRT_COLOR_2 = new THREE.Color(0x654321);
const STONE_COLOR_1 = new THREE.Color(0x808080);
const STONE_COLOR_2 = new THREE.Color(0x696969);
const SNOW_COLOR = new THREE.Color(0xFFFFFF);
const BEDROCK_COLOR_1 = new THREE.Color(0x303030);
const BEDROCK_COLOR_2 = new THREE.Color(0x3a3a3a);


function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}

function getTerrainHeight(worldX, worldZ) {
	let height = noise.perlin2(worldX / TERRAIN_SCALE, worldZ / TERRAIN_SCALE); 
	return Math.floor(height * TERRAIN_AMPLITUDE);
}

function getBlock(x, y, z) {
    const floorX = Math.floor(x);
    const floorY = Math.floor(y);
    const floorZ = Math.floor(z);

	const blockKey = `${floorX},${floorY},${floorZ}`;
	if (modifiedBlocks.has(blockKey)) {
		return modifiedBlocks.get(blockKey);
	}
    
    if (floorY <= BEDROCK_LEVEL) {
        const isEven = (floorX + floorZ) % 2 === 0;
        return { color: isEven ? BEDROCK_COLOR_1 : BEDROCK_COLOR_2, type: 'bedrock' };
    }
	const height = getTerrainHeight(floorX, floorZ); 
    if (floorY > height) {
        return null;
    }
	const isEven = (floorX + floorZ) % 2 === 0;
	let color;
    let blockType;
	if (floorY === height) {
		color = SNOW_COLOR;
        blockType = 'snow';
	} else if (floorY > height - 4) {
		color = isEven ? DIRT_COLOR_1 : DIRT_COLOR_2;
        blockType = 'dirt';
	} else {
		color = isEven ? STONE_COLOR_1 : STONE_COLOR_2;
        blockType = 'stone';
	}
	return { color, type: blockType };
}

function generateChunk(chunkX, chunkZ) {
	const chunkKey = `${chunkX},${chunkZ}`;
	if (loadedChunks.has(chunkKey)) {
		const existing = loadedChunks.get(chunkKey);
		if (!existing.needsRegeneration) return;
		unloadChunk(chunkX, chunkZ, false);
	}
	const geometries = [];
	const matrix = new THREE.Matrix4();
    const boxGeometry = new THREE.BoxGeometry(0.9999, 0.9999, 0.9999);
	const worldXStart = chunkX * CHUNK_SIZE;
	const worldZStart = chunkZ * CHUNK_SIZE;
	let maxHeight = -Infinity;
	for (let x = 0; x < CHUNK_SIZE; x++) {
		for (let z = 0; z < CHUNK_SIZE; z++) {
			const worldX = worldXStart + x;
			const worldZ = worldZStart + z;
			const h = getTerrainHeight(worldX, worldZ); 
			if (h > maxHeight) maxHeight = h;
		}
	}
	const minY = BEDROCK_LEVEL;
	const maxY = maxHeight + 40;
	for (let x = 0; x < CHUNK_SIZE; x++) {
		for (let z = 0; z < CHUNK_SIZE; z++) {
			const worldX = worldXStart + x;
			const worldZ = worldZStart + z;
			for (let y = minY; y <= maxY; y++) {
				const block = getBlock(worldX, y, worldZ); 
				if (!block) continue;
                
                if (heldBlock && heldBlock.originalPos.x === worldX && heldBlock.originalPos.y === y && heldBlock.originalPos.z === worldZ) {
                    continue;
                }

				if (getBlock(worldX + 1, y, worldZ) && getBlock(worldX - 1, y, worldZ) && getBlock(worldX, y + 1, worldZ) && getBlock(worldX, y - 1, worldZ) && getBlock(worldX, y, worldZ + 1) && getBlock(worldX, y, worldZ - 1)) {
					continue;
				}
				const newGeo = boxGeometry.clone();
				const colorAttr = new THREE.BufferAttribute(new Float32Array(newGeo.attributes.position.count * 3), 3);
				for (let i = 0; i < colorAttr.count; i++) {
					colorAttr.setXYZ(i, block.color.r, block.color.g, block.color.b);
				}
				newGeo.setAttribute('color', colorAttr);
				matrix.setPosition(worldX + 0.5, y + 0.5, worldZ + 0.5);
				newGeo.applyMatrix4(matrix);
				geometries.push(newGeo);
			}
		}
	}
    boxGeometry.dispose();
	if (geometries.length === 0) {
		loadedChunks.set(chunkKey, { mesh: null, needsRegeneration: false });
		return;
	}
	const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);
	const material = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0, roughness: 1 });
	const chunkMesh = new THREE.Mesh(mergedGeometry, material);
	chunkMesh.userData.key = chunkKey;
	scene.add(chunkMesh);
	loadedChunks.set(chunkKey, { mesh: chunkMesh, needsRegeneration: false });
}

function unloadChunk(chunkX, chunkZ, removeFromMap = true) {
	const chunkKey = `${chunkX},${chunkZ}`;
	const chunkData = loadedChunks.get(chunkKey);
	if (!chunkData || !chunkData.mesh) return;
	scene.remove(chunkData.mesh);
	chunkData.mesh.geometry.dispose();
	chunkData.mesh.material.dispose();
	if (removeFromMap) {
		loadedChunks.delete(chunkKey);
	}
}

function updateWorld() {
    if (!playerCube) return;
	const playerChunkX = Math.floor(playerCube.position.x / CHUNK_SIZE);
	const playerChunkZ = Math.floor(playerCube.position.z / CHUNK_SIZE);

	for (const [key, chunkData] of loadedChunks.entries()) {
		if (chunkData.needsRegeneration) {
			const [cx, cz] = key.split(',').map(Number);
			generateChunk(cx, cz);
            return; 
		}
	}

	if (currentPlayerChunkX === playerChunkX && currentPlayerChunkZ === playerChunkZ) return;
	currentPlayerChunkX = playerChunkX;
	currentPlayerChunkZ = playerChunkZ;

	for (let x = playerChunkX - RENDER_DISTANCE; x <= playerChunkX + RENDER_DISTANCE; x++) {
		for (let z = playerChunkZ - RENDER_DISTANCE; z <= playerChunkZ + RENDER_DISTANCE; z++) {
			generateChunk(x, z);
		}
	}
	for (const [key] of loadedChunks.entries()) {
		const [cx, cz] = key.split(',').map(Number);
		if (Math.abs(cx - playerChunkX) > RENDER_DISTANCE + 1 || Math.abs(cz - playerChunkZ) > RENDER_DISTANCE + 1) {
			unloadChunk(cx, cz);
		}
	}
}

function markChunkForRegeneration(worldX, worldZ) {
    const chunkX = Math.floor(worldX / CHUNK_SIZE);
    const chunkZ = Math.floor(worldZ / CHUNK_SIZE);
    const chunk = loadedChunks.get(`${chunkX},${chunkZ}`);
    if (chunk) chunk.needsRegeneration = true;
    
    const localX = worldX - chunkX * CHUNK_SIZE;
    const localZ = worldZ - chunkZ * CHUNK_SIZE;

    if (localX === 0) {
        const neighborChunk = loadedChunks.get(`${chunkX - 1},${chunkZ}`);
        if (neighborChunk) neighborChunk.needsRegeneration = true;
    } else if (localX === CHUNK_SIZE - 1) {
        const neighborChunk = loadedChunks.get(`${chunkX + 1},${chunkZ}`);
        if (neighborChunk) neighborChunk.needsRegeneration = true;
    }
    if (localZ === 0) {
        const neighborChunk = loadedChunks.get(`${chunkX},${chunkZ - 1}`);
        if (neighborChunk) neighborChunk.needsRegeneration = true;
    } else if (localZ === CHUNK_SIZE - 1) {
        const neighborChunk = loadedChunks.get(`${chunkX},${chunkZ + 1}`);
        if (neighborChunk) neighborChunk.needsRegeneration = true;
    }
}

function updateBlockCounter() {
    const counterElement = document.getElementById('block-counter');
    if (counterElement) {
        counterElement.innerText = `Blocks: ${blockInventory}`;
    }
}

function updateXPCounter() {
    const counterElement = document.getElementById('xp-counter');
    if (counterElement) {
        counterElement.innerText = `XP: ${goldInventory}`;
    }
}

function fireSphere() {
    createMuzzleFlash(); 
    const projectileGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const projectileMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffa500,
        emissive: 0xffa500, 
        emissiveIntensity: 1.0,
        metalness: 0,
        roughness: 0.5
    });
    const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    const startPosition = new THREE.Vector3();
    camera.getWorldPosition(startPosition);
    projectile.position.copy(startPosition).add(direction.clone().multiplyScalar(0.5));
    const velocity = direction.clone().multiplyScalar(PROJECTILE_SPEED);
    projectiles.push({ mesh: projectile, velocity: velocity });
    scene.add(projectile);
}

function fireMissile() {
    const missileGroup = new THREE.Group();
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.6, roughness: 0.4 });
    const tipMaterial = new THREE.MeshStandardMaterial({ color: 0xcc3333, metalness: 0.4, roughness: 0.5 });
    const finMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.6, roughness: 0.4 });
    const bodyLength = 0.7;
    const bodyRadius = 0.08;
    const bodyGeometry = new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyLength, 10);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0;
    missileGroup.add(body);
    const tipHeight = 0.2;
    const tipGeometry = new THREE.ConeGeometry(bodyRadius, tipHeight, 10);
    const tip = new THREE.Mesh(tipGeometry, tipMaterial);
    tip.position.y = (bodyLength / 2) + (tipHeight / 2);
    missileGroup.add(tip);
    const finWidth = 0.2; 
    const finHeight = 0.15;
    const finThickness = 0.02;
    const finGeometry = new THREE.BoxGeometry(finWidth, finHeight, finThickness);
    const fin1 = new THREE.Mesh(finGeometry, finMaterial);
    fin1.rotation.y = Math.PI / 2;
    fin1.position.set(bodyRadius + finHeight / 2, -bodyLength / 2 + finWidth / 2, 0);
    missileGroup.add(fin1);
    const fin2 = new THREE.Mesh(finGeometry, finMaterial);
    fin2.rotation.y = Math.PI / 2;
    fin2.position.set(-(bodyRadius + finHeight / 2), -bodyLength / 2 + finWidth / 2, 0);
    missileGroup.add(fin2);
    const fin3 = new THREE.Mesh(finGeometry, finMaterial);
    fin3.position.set(0, -bodyLength / 2 + finWidth / 2, bodyRadius + finHeight / 2);
    missileGroup.add(fin3);
    const fin4 = new THREE.Mesh(finGeometry, finMaterial);
    fin4.position.set(0, -bodyLength / 2 + finWidth / 2, -(bodyRadius + finHeight / 2));
    missileGroup.add(fin4);
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    const startPosition = new THREE.Vector3();
    camera.getWorldPosition(startPosition);
    missileGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    missileGroup.position.copy(startPosition).add(direction.clone().multiplyScalar(0.7));
    const velocity = direction.clone().multiplyScalar(MISSILE_SPEED);
    missiles.push({ mesh: missileGroup, velocity: velocity, lifetime: 0 });
    scene.add(missileGroup);
}

// Helper function to check if a block position is occupied by the player
function isPlayerOccupying(finalX, finalY, finalZ) {
    if (!playerCube) return false;
    const halfWidth = playerWidth / 2;
    const playerMinX = Math.floor(playerCube.position.x - halfWidth);
    const playerMaxX = Math.floor(playerCube.position.x + halfWidth);
    const playerMinY = Math.floor(playerCube.position.y);
    const playerMaxY = Math.floor(playerCube.position.y + playerHeight);
    const playerMinZ = Math.floor(playerCube.position.z - halfWidth);
    const playerMaxZ = Math.floor(playerCube.position.z + halfWidth);
    
    return (finalX >= playerMinX && finalX <= playerMaxX && 
            finalY >= playerMinY && finalY <= playerMaxY && 
            finalZ >= playerMinZ && finalZ <= playerMaxZ);
}


function performAction() {
    if (currentMode === 'toolgun') {
        if (heldBlock) {
            placeBlock();
        } else {
            pickupBlock();
        }
        return;
    }

    if (currentMode === 'missile') {
        fireMissile();
        return;
    }

	const meshes = Array.from(loadedChunks.values()).map(c => c.mesh).filter(m => m);
	if (meshes.length === 0) return;
	
    const mouse = new THREE.Vector2(0, 0);
	raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);

	if (intersects.length > 0) {
		const intersect = intersects[0];
		let finalX, finalY, finalZ;
		
        if (currentMode === 'add') {
            if (blockInventory <= 0) {
                return; 
            }

			const adjacentBlockPos = intersect.point.clone().add(intersect.face.normal.clone().multiplyScalar(0.01));
			[finalX, finalY, finalZ] = [Math.floor(adjacentBlockPos.x), Math.floor(adjacentBlockPos.y), Math.floor(adjacentBlockPos.z)];
            
            if (isPlayerOccupying(finalX, finalY, finalZ)) {
                return; 
            }
            
			modifiedBlocks.set(`${finalX},${finalY},${finalZ}`, { color: new THREE.Color(currentColor), type: 'normal' });
            blockInventory--;
            updateBlockCounter();
            markChunkForRegeneration(finalX, finalZ);
            createLaserFlash(new THREE.Vector3(finalX + 0.5, finalY + 0.5, finalZ + 0.5));

		} else if (currentMode === 'remove') { 
            const blockPos = intersect.point.clone().sub(intersect.face.normal.clone().multiplyScalar(0.01));
            [finalX, finalY, finalZ] = [Math.floor(blockPos.x), Math.floor(blockPos.y), Math.floor(blockPos.z)];

            const block = getBlock(finalX, finalY, finalZ);
            if (block && block.type !== 'bedrock') {
                // 10% chance to spawn a dropped block
                if (Math.random() < 0.1) {
                    createDroppedBlock(new THREE.Vector3(finalX + 0.5, finalY + 0.5, finalZ + 0.5), block);
                }
                modifiedBlocks.set(`${finalX},${finalY},${finalZ}`, null);
                markChunkForRegeneration(finalX, finalZ);
            }
        }
	}
}

function onMouseDown(event) {
    if (!isMobileDevice && document.pointerLockElement !== renderer.domElement) return;
    
    if (event.preventDefault) event.preventDefault();

    if (event.button === 0) {
        isFiring = true;
        if (currentMode === 'toolgun') {
            isToolgunActive = true; 
            pickupBlock(); 
        } else if (currentMode !== 'shoot') { // 'shoot' is handled in animate loop
            performAction(); 
        }
    }
    else if (event.button === 2) {
        isAiming = true;
    }
}

function onMouseUp(event) {
    if (isMobileDevice) return; 
    
    if (event.preventDefault) event.preventDefault();

    if (event.button === 0) {
        isFiring = false;
        if (currentMode === 'toolgun') {
            isToolgunActive = false; 
            placeBlock(); 
        }
    }
    else if (event.button === 2) {
        isAiming = false;
    }
}

function init(seedString) {
    isMobileDevice = isMobile(); 

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    if (toolgunLaser) {
        scene.remove(toolgunLaser);
        toolgunLaser.geometry.dispose();
        toolgunLaser.material.dispose();
        toolgunLaser = null;
    }
    if (heldBlock) {
        if (heldBlock.glowMesh) {
            heldBlock.mesh.remove(heldBlock.glowMesh); 
            heldBlock.glowMesh.geometry.dispose();
            heldBlock.glowMesh.material.dispose();
        }
        scene.remove(heldBlock.mesh);
        heldBlock.mesh.geometry.dispose();
        heldBlock.mesh.material.dispose();
        heldBlock = null;
    }

    if (renderer) {
        document.body.removeChild(renderer.domElement);
        renderer.dispose();
    }
    if (stats) {
        if (stats.dom.parentElement) {
            document.body.removeChild(stats.dom);
        }
    }
    if (scene) {
        scene.traverse(object => {
             // Dispose lights properly
            if (object.isLight) {
                 if (object.dispose) object.dispose();
            }
            if (object.isMesh) {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            }
        });
        while(scene.children.length > 0){ 
            scene.remove(scene.children[0]); 
        }
    }
    loadedChunks.clear();
    modifiedBlocks.clear(); 
    projectiles = [];
    missiles = [];
    explosions = [];
    muzzleFlashes = []; 
    laserFlashes = [];
    droppedBlocks = []; 
    snowflakes = []; 
    goldNuggets = [];
    currentPlayerChunkX = undefined;
    currentPlayerChunkZ = undefined;
    
    blockInventory = 0;
    goldInventory = 0;
    updateBlockCounter();
    updateXPCounter();
 
    worldSeedString = seedString;
    let seedValue;
    if (seedString && seedString.trim() !== "") {
        seedValue = 0;
        for (let i = 0; i < seedString.length; i++) {
            let char = seedString.charCodeAt(i);
            seedValue = ((seedValue << 5) - seedValue) + char;
            seedValue = seedValue & seedValue;
        }
    } else {
        seedValue = Math.random();
        worldSeedString = seedValue.toString();
    }
    noise = new Noise(seedValue);

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x87CEEB);
	scene.fog = new THREE.Fog(0x87CEEB, RENDER_DISTANCE * CHUNK_SIZE / 2, RENDER_DISTANCE * CHUNK_SIZE);
    originalFog = scene.fog;
    
	const farPlane = (RENDER_DISTANCE + 2) * CHUNK_SIZE;
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, farPlane);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	stats = new Stats();
    if (!isMobileDevice) {
	    document.body.appendChild(stats.dom);
	    stats.dom.style.position = 'fixed';
	    stats.dom.style.top = '10px';
	    stats.dom.style.right = '10px';
	    stats.dom.style.left = 'auto';
	    stats.dom.style.zIndex = '100';
    }

	const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
	scene.add(ambientLight);
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
	directionalLight.position.set(50, 50, 25);
	scene.add(directionalLight);

	raycaster = new THREE.Raycaster();
    projectileRaycaster = new THREE.Raycaster();

	createPlayer(); 
	updateWorld();

	setupEventListeners();
    lastPlayerPos.copy(playerCube.position); 
	animate(); 
}

function createPlayer() {
	const startY = getTerrainHeight(0, 0) + 5; 
	const geometry = new THREE.BoxGeometry(playerWidth, playerHeight, playerWidth);
    geometry.translate(0, playerHeight / 2, 0); 
	const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, visible: false });
	playerCube = new THREE.Mesh(geometry, material);
	playerCube.position.set(0, startY, 0);
    playerSpawnPoint.copy(playerCube.position);
	scene.add(playerCube);

	camera.position.set(0, 1.4, 0); 
	playerCube.add(camera);

    rifle = createRifle(); 
    // Set initial position based on device
    if (isMobileDevice) {
        rifle.position.copy(MOBILE_HIP_RIFLE_POS);
    } else {
        rifle.position.copy(DESKTOP_HIP_RIFLE_POS);
    }
    rifle.rotation.y = Math.PI / 2;
    rifle.scale.set(0.5, 0.5, 0.5);
    camera.add(rifle);

    lastPlayerPos.copy(playerCube.position);
}

function createRifle() {
    const rifleGroup = new THREE.Group();
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x222228, metalness: 0.2, roughness: 0.6 });
    const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.4 });
    const emissiveMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5 });
    const bodyGeo = new THREE.BoxGeometry(0.7, 0.2, 0.15);
    const body = new THREE.Mesh(bodyGeo, bodyMaterial);
    body.position.set(0, 0, 0);
    rifleGroup.add(body);
    const stockBarGeo = new THREE.BoxGeometry(0.4, 0.05, 0.05);
    const stockBar = new THREE.Mesh(stockBarGeo, metalMaterial);
    stockBar.position.set(-0.45, 0.05, 0);
    rifleGroup.add(stockBar);
    const stockPadGeo = new THREE.BoxGeometry(0.1, 0.2, 0.12);
    const stockPad = new THREE.Mesh(stockPadGeo, bodyMaterial);
    stockPad.position.set(-0.6, 0.0, 0);
    rifleGroup.add(stockPad);

    const barrelMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.4 });
    const barrelGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.9, 12);
    const barrel = new THREE.Mesh(barrelGeo, barrelMaterial);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0.8, 0.05, 0);
    rifleGroup.add(barrel);
    rifleGroup.barrel = barrel; 

    const muzzleGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.15, 6);
    const muzzle = new THREE.Mesh(muzzleGeo, metalMaterial);
    muzzle.rotation.z = Math.PI / 2;
    muzzle.position.set(1.3, 0.05, 0);
    rifleGroup.add(muzzle);
    const handguardShape = new THREE.Shape();
    handguardShape.moveTo(0, 0);
    handguardShape.lineTo(0.6, 0);
    handguardShape.lineTo(0.6, -0.05);
    handguardShape.lineTo(0.5, -0.15);
    handguardShape.lineTo(0, -0.15);
    handguardShape.lineTo(0, 0);
    const extrudeSettings = { depth: 0.16, bevelEnabled: false };
    const handguardGeo = new THREE.ExtrudeGeometry(handguardShape, extrudeSettings);
    const handguard = new THREE.Mesh(handguardGeo, bodyMaterial);
    handguard.position.set(0.35, 0.1, -0.08);
    rifleGroup.add(handguard);
    const gripGeo = new THREE.BoxGeometry(0.12, 0.4, 0.12);
    const grip = new THREE.Mesh(gripGeo, bodyMaterial);
    grip.position.set(-0.1, -0.2, 0);
    grip.rotation.z = 0.2; 
    rifleGroup.add(grip);
    const magGeo = new THREE.BoxGeometry(0.15, 0.35, 0.12);
    const mag = new THREE.Mesh(magGeo, bodyMaterial);
    mag.position.set(0.15, -0.25, 0);
    rifleGroup.add(mag);
    const emissiveStripGeo = new THREE.BoxGeometry(0.02, 0.3, 0.13);
    const emissiveStrip = new THREE.Mesh(emissiveStripGeo, emissiveMaterial);
    emissiveStrip.position.set(0.23, -0.25, 0);
    rifleGroup.add(emissiveStrip);
    const sightBaseGeo = new THREE.BoxGeometry(0.25, 0.05, 0.12);
    const sightBase = new THREE.Mesh(sightBaseGeo, metalMaterial);
    sightBase.position.set(0.1, 0.2, 0);
    rifleGroup.add(sightBase);
    const sightHousingGeo = new THREE.BoxGeometry(0.05, 0.15, 0.1);
    const sightHousing = new THREE.Mesh(sightHousingGeo, metalMaterial);
    sightHousing.position.set(0.2, 0.25, 0);
    rifleGroup.add(sightHousing);
    const sightEmissiveGeo = new THREE.BoxGeometry(0.06, 0.02, 0.02);
    const sightEmissive = new THREE.Mesh(sightEmissiveGeo, emissiveMaterial);
    sightEmissive.position.set(0.2, 0.18, 0);
    rifleGroup.add(sightEmissive);
    return rifleGroup;
}

function createMuzzleFlash() {
    if (!rifle) return; 
    const flashGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const flashMat = new THREE.MeshBasicMaterial({ 
        color: 0xFFFF99, 
        transparent: true, 
        opacity: 0.9, 
        blending: THREE.AdditiveBlending 
    });
    const flashMesh = new THREE.Mesh(flashGeo, flashMat);
    const muzzleLocalPos = new THREE.Vector3(1.3, 0.05, 0);
    flashMesh.position.copy(muzzleLocalPos);
    rifle.add(flashMesh);
    muzzleFlashes.push({ mesh: flashMesh, timer: MUZZLE_FLASH_DURATION });
}

function createLaserFlash(targetPosition) {
    if (!rifle) return;

    const laserGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8); 
    const laserMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00FFFF, 
        transparent: true, 
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    const laserMesh = new THREE.Mesh(laserGeo, laserMaterial);

    const laserStart = new THREE.Vector3(1.3, 0.05, 0); 
    rifle.updateWorldMatrix(true, false); 
    laserStart.applyMatrix4(rifle.matrixWorld); 
    
    const laserEnd = targetPosition;
    
    const distance = laserStart.distanceTo(laserEnd);
    laserMesh.scale.y = distance; 
    laserMesh.position.copy(laserStart).add(laserEnd).multiplyScalar(0.5); 
    laserMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), laserEnd.clone().sub(laserStart).normalize()); 

    scene.add(laserMesh);
    laserFlashes.push({ mesh: laserMesh, timer: LASER_FLASH_DURATION });
}


function createExplosion(position) {
    const geometry = new THREE.SphereGeometry(MISSILE_EXPLOSION_RADIUS, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.8 });
    const explosionMesh = new THREE.Mesh(geometry, material);
    explosionMesh.position.copy(position);
    scene.add(explosionMesh);
    explosions.push({ mesh: explosionMesh, timer: MISSILE_EXPLOSION_DURATION });

    if (playerCube && !isFlying) {
        const playerPos = playerCube.position.clone().add(new THREE.Vector3(0, playerHeight / 2, 0)); 
        const explosionPos = position;
        const distance = playerPos.distanceTo(explosionPos);
        const radius = MISSILE_EXPLOSION_RADIUS + (playerWidth / 2); 

        if (distance < radius) {
            const knockbackDir = playerPos.clone().sub(explosionPos).normalize();
            
            const forceFalloff = 1 - (distance / radius); 
            const finalForce = MISSILE_KNOCKBACK_FORCE * forceFalloff;

            if (knockbackDir.y < 0.3) {
                knockbackDir.y = 0.3;
                knockbackDir.normalize();
            }

            playerVelocity.add(knockbackDir.multiplyScalar(finalForce));
            playerOnGround = false; 
        }
    }

    const snowKnockbackRadius = MISSILE_EXPLOSION_RADIUS * 3; 
    const SNOWFLAKE_KNOCKBACK_FORCE = 15.0; 

    for (const snow of snowflakes) {
        const snowPos = snow.mesh.position;
        const distance = snowPos.distanceTo(position);

        if (distance < snowKnockbackRadius && distance > 0) { 
            const knockbackDir = snowPos.clone().sub(position).normalize();
            
            const forceFalloff = 1 - (distance / snowKnockbackRadius); 
            const finalForce = SNOWFLAKE_KNOCKBACK_FORCE * forceFalloff;

            snow.velocity.add(knockbackDir.multiplyScalar(finalForce));
        }
    }


    const chunksToUpdate = new Set();
    const radius = MISSILE_EXPLOSION_RADIUS;
    const cX = Math.floor(position.x);
    const cY = Math.floor(position.y);
    const cZ = Math.floor(position.z);
    for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
            for (let z = -radius; z <= radius; z++) {
                const pX = cX + x;
                const pY = cY + y;
                const pZ = cZ + z;
                const distSq = x*x + y*y + z*z;
                if (distSq <= radius * radius) {
                    const block = getBlock(pX, pY, pZ);
                    if (block && block.type !== 'bedrock') {
                        // 10% chance to spawn a dropped block
                        if (Math.random() < 0.1) {
                            createDroppedBlock(new THREE.Vector3(pX + 0.5, pY + 0.5, pZ + 0.5), block);
                        }
                        modifiedBlocks.set(`${pX},${pY},${pZ}`, null);
                        const chunkX = Math.floor(pX / CHUNK_SIZE);
                        const chunkZ = Math.floor(pZ / CHUNK_SIZE);
                        chunksToUpdate.add(`${chunkX},${chunkZ}`);
                        
                        const localX = pX - chunkX * CHUNK_SIZE;
                        const localZ = pZ - chunkZ * CHUNK_SIZE;
                        if (localX === 0) chunksToUpdate.add(`${chunkX - 1},${chunkZ}`);
                        if (localX === CHUNK_SIZE - 1) chunksToUpdate.add(`${chunkX + 1},${chunkZ}`);
                        if (localZ === 0) chunksToUpdate.add(`${chunkX},${chunkZ - 1}`);
                        if (localZ === CHUNK_SIZE - 1) chunksToUpdate.add(`${chunkX},${chunkZ + 1}`);
                    }
                }
            }
        }
    }
    for (const chunkKey of chunksToUpdate) {
        const chunk = loadedChunks.get(chunkKey);
        if (chunk) {
            chunk.needsRegeneration = true;
        }
    }
}

function createDroppedBlock(position, blockData) {
    if (blockData.type === 'stone' && Math.random() < 0.01) {
        createGoldNugget(position);
    }

    const dropGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const dropMat = new THREE.MeshStandardMaterial({
        color: blockData.color,
        transparent: true,
        opacity: 0.7
    });
    const dropMesh = new THREE.Mesh(dropGeo, dropMat);
    dropMesh.position.copy(position);

    const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 2, 
        Math.random() * 2 + 1,   
        (Math.random() - 0.5) * 2  
    );

    scene.add(dropMesh);
    droppedBlocks.push({
        mesh: dropMesh,
        velocity: velocity,
        lifetime: 5.0 
    });
}


function createGoldNugget(position) {
    const nuggetGeo = new THREE.IcosahedronGeometry(0.1, 0);
    const nuggetMat = new THREE.MeshStandardMaterial({
        color: 0x00FFFF,
        emissive: 0x55DDFF,
        emissiveIntensity: 1.0,
        metalness: 0.8,
        roughness: 0.4
    });
    const nuggetMesh = new THREE.Mesh(nuggetGeo, nuggetMat);
    nuggetMesh.position.copy(position);

    // Always create the light, but set initial visibility based on proximity later
    const light = new THREE.PointLight(0x55DDFF, 3.0, 2.0); // color, intensity, distance
    light.visible = false; // Start hidden, will be updated in updateGoldNuggets
    nuggetMesh.add(light);
    
    const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        Math.random() * 4 + 2,   
        (Math.random() - 0.5) * 3
    );

    scene.add(nuggetMesh);
    goldNuggets.push({
        mesh: nuggetMesh,
        velocity: velocity,
        lifetime: 60.0,
        onGround: false,
        light: light // Store reference to the light
    });
}


function createSnowflake(playerPos, playerVel) {
    const snowGeo = new THREE.BoxGeometry(0.165, 0.165, 0.165);
    const snowMat = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.0, 
        metalness: 0,
        roughness: 1
    });
    const snowMesh = new THREE.Mesh(snowGeo, snowMat);

    const spawnX = playerPos.x + (Math.random() * 48 - 24);
    const spawnZ = playerPos.z + (Math.random() * 48 - 24);
    
    const spawnY = playerPos.y + playerHeight + 5 + (Math.random() * 3); 
    const spawnFloorX = Math.floor(spawnX);
    const spawnFloorZ = Math.floor(spawnZ);
    const spawnFloorY = Math.floor(spawnY);

    if (playerCube) { 
        for (let y = spawnFloorY; y < spawnFloorY + 50; y++) {
            if (getBlock(spawnFloorX, y, spawnFloorZ)) {
                snowGeo.dispose();
                snowMat.dispose();
                snowMesh.geometry.dispose(); 
                snowMesh.material.dispose();
                return;
            }
        }
    }


    snowMesh.position.set(spawnX, spawnY, spawnZ);

    const velocity = new THREE.Vector3(
        -playerVel.x + (Math.random() - 0.5) * 0.5, 
        -Math.random() * 1.5 - 0.5, 
        -playerVel.z + (Math.random() - 0.5) * 0.5 
    );

    scene.add(snowMesh);
    snowflakes.push({
        mesh: snowMesh,
        velocity: velocity,
        lifetime: 8.0 
    });
}

function updateSnowflakes(deltaTime, playerVel) {
    if (!playerCube) return;

    for (let i = 0; i < 10; i++) {
        createSnowflake(playerCube.position, playerVel);
    }

    const playerCenter = playerCube.position.clone().add(new THREE.Vector3(0, playerHeight / 2, 0));
    
    for (let i = snowflakes.length - 1; i >= 0; i--) {
        const snow = snowflakes[i];
        const mesh = snow.mesh;

        snow.lifetime -= deltaTime;
        
        const distanceToPlayer = mesh.position.distanceTo(playerCenter);
        if (snow.lifetime <= 0 || distanceToPlayer > 30.0) { 
            scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            snowflakes.splice(i, 1);
            continue;
        }

        const targetVelX = -playerVel.x + (Math.random() - 0.5) * 0.5;
        const targetVelZ = -playerVel.z + (Math.random() - 0.5) * 0.5;

        snow.velocity.x = THREE.MathUtils.lerp(snow.velocity.x, targetVelX, 0.05);
        snow.velocity.z = THREE.MathUtils.lerp(snow.velocity.z, targetVelZ, 0.05);

        snow.velocity.y += (gravity * 0.05) * deltaTime;
        
        if (snow.velocity.y < -2.0) {
            snow.velocity.y = -2.0;
        }

        mesh.position.add(snow.velocity.clone().multiplyScalar(deltaTime));

        const snowX = Math.floor(mesh.position.x);
        const snowY = Math.floor(mesh.position.y);
        const snowZ = Math.floor(mesh.position.z);
        
        if (getBlock(snowX, snowY, snowZ)) {
            scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            snowflakes.splice(i, 1);
            continue; 
        }

        mesh.rotation.x += 1.0 * deltaTime;
        mesh.rotation.y += 0.8 * deltaTime;

        mesh.material.opacity = (1.0 - (snow.lifetime / 8.0)) * 0.9;
    }
}

function updateProjectiles(deltaTime) {
    const meshes = Array.from(loadedChunks.values()).map(c => c.mesh).filter(m => m);
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        const pMesh = projectile.mesh;
        const oldPosition = pMesh.position.clone();
        pMesh.position.add(projectile.velocity.clone().multiplyScalar(deltaTime));
        const newPosition = pMesh.position;
        const distance = oldPosition.distanceTo(newPosition);
        if (distance === 0) continue; 
        const direction = newPosition.clone().sub(oldPosition).normalize();
        projectileRaycaster.set(oldPosition, direction);
        projectileRaycaster.far = distance;
        const intersects = projectileRaycaster.intersectObjects(meshes);
        let hit = false;
        if (intersects.length > 0) {
            const intersect = intersects[0]; 
            const clickedBlockPos = intersect.point.clone().sub(intersect.face.normal.clone().multiplyScalar(0.01));
            const pX = Math.floor(clickedBlockPos.x);
            const pY = Math.floor(clickedBlockPos.y);
            const pZ = Math.floor(clickedBlockPos.z);
            const block = getBlock(pX, pY, pZ);
            if (block && block.type !== 'bedrock') {
                // 10% chance to spawn a dropped block
                if (Math.random() < 0.1) {
                    createDroppedBlock(new THREE.Vector3(pX + 0.5, pY + 0.5, pZ + 0.5), block);
                }
                modifiedBlocks.set(`${pX},${pY},${pZ}`, null); 
                markChunkForRegeneration(pX, pZ);
                hit = true;
            }
        }
        const playerDistance = pMesh.position.distanceTo(playerCube.position);
        if (hit || playerDistance > RENDER_DISTANCE * CHUNK_SIZE) {
            scene.remove(pMesh);
            pMesh.geometry.dispose();
            pMesh.material.dispose();
            projectiles.splice(i, 1);
        }
    }
}

function updateMissiles(deltaTime) {
    const meshes = Array.from(loadedChunks.values()).map(c => c.mesh).filter(m => m);
    for (let i = missiles.length - 1; i >= 0; i--) {
        const missile = missiles[i];
        const mMesh = missile.mesh;
        missile.lifetime += deltaTime;
        const oldPosition = mMesh.position.clone();
        mMesh.position.add(missile.velocity.clone().multiplyScalar(deltaTime));
        const newPosition = mMesh.position;
        const distance = oldPosition.distanceTo(newPosition);
        if (distance === 0) continue; 
        const direction = newPosition.clone().sub(oldPosition).normalize();
        projectileRaycaster.set(oldPosition, direction);
        projectileRaycaster.far = distance;
        let hit = false;
        let hitPosition = null;
        if (meshes.length > 0) {
            const intersects = projectileRaycaster.intersectObjects(meshes);
            if (intersects.length > 0) {
                hitPosition = intersects[0].point.clone();
                hit = true;
            }
        }
        if (hit || missile.lifetime > 10.0) {
            createExplosion(hitPosition || newPosition);
            scene.remove(mMesh);
            mMesh.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => material.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                }
            });
            missiles.splice(i, 1);
        }
    }
}

function updateExplosions(deltaTime) {
    for (let i = explosions.length - 1; i >= 0; i--) {
        const explosion = explosions[i];
        explosion.timer -= deltaTime;
        if (explosion.mesh.material.opacity > 0) {
            explosion.mesh.material.opacity = (explosion.timer / MISSILE_EXPLOSION_DURATION) * 0.8;
        }
        if (explosion.timer <= 0) {
            scene.remove(explosion.mesh);
            explosion.mesh.geometry.dispose();
            explosion.mesh.material.dispose();
            explosions.splice(i, 1);
        }
    }
}

function updateMuzzleFlashes(deltaTime) {
    for (let i = muzzleFlashes.length - 1; i >= 0; i--) {
        const flash = muzzleFlashes[i];
        flash.timer -= deltaTime;
        
        const fade = Math.max(0, flash.timer / MUZZLE_FLASH_DURATION);
        flash.mesh.material.opacity = fade * 0.9;

        if (flash.timer <= 0) {
            if (rifle) {
                rifle.remove(flash.mesh);
            }
            flash.mesh.geometry.dispose();
            flash.mesh.material.dispose();
            muzzleFlashes.splice(i, 1);
        }
    }
}

function updateLaserFlashes(deltaTime) {
    for (let i = laserFlashes.length - 1; i >= 0; i--) {
        const flash = laserFlashes[i];
        flash.timer -= deltaTime;
        
        const fade = Math.max(0, flash.timer / LASER_FLASH_DURATION);
        flash.mesh.material.opacity = fade * 0.7;

        if (flash.timer <= 0) {
            scene.remove(flash.mesh);
            flash.mesh.geometry.dispose();
            flash.mesh.material.dispose();
            laserFlashes.splice(i, 1);
        }
    }
}

function updateGoldNuggets(deltaTime) {
    if (!playerCube) return;
    const playerCenter = playerCube.position.clone().add(new THREE.Vector3(0, playerHeight / 2, 0));
    const suckRadius = 4.0;
    const collectRadius = 1.0;

    const checkCollisionSimple = (pos) => {
        const floorX = Math.floor(pos.x);
        const floorY = Math.floor(pos.y);
        const floorZ = Math.floor(pos.z);
        return !!getBlock(floorX, floorY, floorZ);
    };

    // Array to hold orbs and their distances for sorting
    const orbsWithDistances = [];
    
    // First pass: Update physics and remove expired/collected orbs
    for (let i = goldNuggets.length - 1; i >= 0; i--) {
        const nugget = goldNuggets[i];
        const mesh = nugget.mesh;

        nugget.lifetime -= deltaTime;
        if (nugget.lifetime <= 0) {
            scene.remove(mesh); // Light is child, removed automatically
            mesh.geometry.dispose();
            mesh.material.dispose();
            goldNuggets.splice(i, 1);
            continue;
        }

        const distanceToPlayer = mesh.position.distanceTo(playerCenter);
        if (distanceToPlayer < collectRadius) {
            goldInventory += 10;
            updateXPCounter();
            
            scene.remove(mesh); // Light is child, removed automatically
            mesh.geometry.dispose();
            mesh.material.dispose();
            goldNuggets.splice(i, 1);
            continue;
        }

        // Add to distance array for sorting later
        orbsWithDistances.push({ nugget, distance: distanceToPlayer });

        // Physics update
        if (distanceToPlayer < suckRadius) {
            const directionToPlayer = playerCenter.clone().sub(mesh.position).normalize();
            nugget.velocity.lerp(directionToPlayer.multiplyScalar(15.0), 0.1); 
            nugget.onGround = false;
        } else {
             // Only apply gravity if not being sucked
             if (!nugget.onGround) {
                nugget.velocity.y += (gravity * 0.5) * deltaTime;
             }
        }
        
        const desiredMoveX = nugget.velocity.x * deltaTime;
        const desiredMoveY = nugget.velocity.y * deltaTime;
        const desiredMoveZ = nugget.velocity.z * deltaTime;

        mesh.position.x += desiredMoveX;
        if (checkCollisionSimple(mesh.position)) {
            mesh.position.x -= desiredMoveX;
            nugget.velocity.x *= 0.6; // Dampen on wall hit, don't bounce
        }
        
        mesh.position.z += desiredMoveZ;
        if (checkCollisionSimple(mesh.position)) {
            mesh.position.z -= desiredMoveZ;
            nugget.velocity.z *= 0.6; // Dampen on wall hit, don't bounce
        }
        
        mesh.position.y += desiredMoveY;
        if (checkCollisionSimple(mesh.position)) {
            mesh.position.y -= desiredMoveY; // Move back to pre-collision position
            if (nugget.velocity.y < 0) { // Moving down, hit ground
                if (!nugget.onGround) { // Only reset Y velocity if it just landed
                     nugget.velocity.y = 0;
                     // Set position explicitly to ground + float
                     mesh.position.y = Math.floor(mesh.position.y) + 0.1; 
                     if(distanceToPlayer >= suckRadius) {
                         nugget.velocity.x *= 0.6;
                         nugget.velocity.z *= 0.6;
                     }
                }
                nugget.onGround = true;
            } else { // Moving up, hit ceiling
                 nugget.velocity.y *= -0.3; // Keep ceiling bounce
            }
        } else {
            // We are not currently colliding, check if we're floating just above ground
            // ONLY set onGround to false if we are NOT being sucked
            if (distanceToPlayer >= suckRadius) {
                // Check for ground *just* below
                let groundCheckPos = mesh.position.clone();
                groundCheckPos.y -= 0.15; // (orb radius is 0.1 + 0.05 buffer)
                if (checkCollisionSimple(groundCheckPos) && nugget.velocity.y <= 0) {
                    nugget.onGround = true;
                    nugget.velocity.y = 0; // Make sure it doesn't fall
                    mesh.position.y = Math.floor(mesh.position.y) + 0.1; // Re-snap to float position
                } else {
                    nugget.onGround = false; // No ground below, so we are in the air
                }
            } else {
                 nugget.onGround = false; // Being sucked, so not on ground
            }
        }
       
        // Apply ground friction if on ground and not being sucked
        if (nugget.onGround && distanceToPlayer >= suckRadius) {
            nugget.velocity.x *= 0.8;
            nugget.velocity.z *= 0.8;
        }
        
        mesh.rotation.x += 1.5 * deltaTime;
        mesh.rotation.y += 1.0 * deltaTime;
    }

    // Second pass: Sort by distance and manage light visibility
    orbsWithDistances.sort((a, b) => a.distance - b.distance);

    for (let i = 0; i < orbsWithDistances.length; i++) {
        const { nugget } = orbsWithDistances[i];
        if (nugget.light) { // Check if the light exists
             nugget.light.visible = (i < MAX_ORB_LIGHTS);
        }
    }
}


function updateDroppedBlocks(deltaTime) {
    if (!playerCube) return;
    const playerCenter = playerCube.position.clone().add(new THREE.Vector3(0, playerHeight / 2, 0));
    const suckRadius = 2.0;
    const collectRadius = 0.75;
    
    for (let i = droppedBlocks.length - 1; i >= 0; i--) {
        const drop = droppedBlocks[i];
        const mesh = drop.mesh;

        const distanceToPlayer = mesh.position.distanceTo(playerCenter);
        if (distanceToPlayer < collectRadius) {
            blockInventory++;
            updateBlockCounter();
            
            scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            droppedBlocks.splice(i, 1);
            continue;
        }

        if (distanceToPlayer < suckRadius) {
            const directionToPlayer = playerCenter.clone().sub(mesh.position).normalize();
            drop.velocity.lerp(directionToPlayer.multiplyScalar(15.0), 0.1); 
        } else {
            drop.velocity.y += (gravity * 0.2) * deltaTime; 
            drop.velocity.multiplyScalar(0.98); 
        }

        mesh.position.add(drop.velocity.clone().multiplyScalar(deltaTime));

        mesh.rotation.x += 1.5 * deltaTime;
        mesh.rotation.y += 1.0 * deltaTime;

        drop.lifetime -= deltaTime;
        mesh.material.opacity = Math.max(0, (drop.lifetime / 5.0) * 0.7); 

        if (drop.lifetime <= 0) {
            scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            droppedBlocks.splice(i, 1);
        }
    }
}

function checkCollision(pos) {
    if (isFlying) return false;
	const halfWidth = playerWidth / 2;
	const minX = Math.floor(pos.x - halfWidth);
	const maxX = Math.floor(pos.x + halfWidth);
	const minY = Math.floor(pos.y); 
	const maxY = Math.floor(pos.y + playerHeight);
	const minZ = Math.floor(pos.z - halfWidth);
	const maxZ = Math.floor(pos.z + halfWidth);
	for (let x = minX; x <= maxX; x++) {
		for (let y = minY; y <= maxY; y++) {
			for (let z = minZ; z <= maxZ; z++) {
				if (getBlock(x, y, z)) return true;
			}
		}
	}
	return false;
}

function updateRiflePosition(deltaTime) {
    if (!rifle) return;

    let targetPosition;
    if (isMobileDevice) {
        targetPosition = isAiming ? MOBILE_ADS_RIFLE_POS : MOBILE_HIP_RIFLE_POS;
    } else {
        targetPosition = isAiming ? DESKTOP_ADS_RIFLE_POS : DESKTOP_HIP_RIFLE_POS;
    }
    
    const lerpSpeed = 10.0 * deltaTime; 
    
    rifle.position.lerp(targetPosition, lerpSpeed);
}

function pickupBlock() {
    if (heldBlock) return; 

    const meshes = Array.from(loadedChunks.values()).map(c => c.mesh).filter(m => m);
	if (meshes.length === 0) return;
	
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
        const intersect = intersects[0];
        const blockPos = intersect.point.clone().sub(intersect.face.normal.clone().multiplyScalar(0.01));
        const [pX, pY, pZ] = [Math.floor(blockPos.x), Math.floor(blockPos.y), Math.floor(blockPos.z)];

        const blockData = getBlock(pX, pY, pZ);
        if (!blockData || blockData.type === 'bedrock') return;

        // REMOVED: createDroppedBlock(new THREE.Vector3(pX + 0.5, pY + 0.5, pZ + 0.5), blockData);

        const originalPos = { x: pX, y: pY, z: pZ };
        
        modifiedBlocks.set(`${pX},${pY},${pZ}`, null);
        markChunkForRegeneration(pX, pZ);

        const heldGeo = new THREE.BoxGeometry(1, 1, 1);
        const heldMat = new THREE.MeshStandardMaterial({ 
            color: blockData.color, 
            transparent: true, 
            opacity: 0.8 
        });
        const heldMesh = new THREE.Mesh(heldGeo, heldMat);
        
        const glowGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1); 
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending, 
            side: THREE.BackSide 
        });
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        heldMesh.add(glowMesh); 

        heldMesh.position.set(pX + 0.5, pY + 0.5, pZ + 0.5); 
        scene.add(heldMesh);

        heldBlock = { 
            mesh: heldMesh, 
            glowMesh: glowMesh, 
            data: blockData, 
            originalPos: originalPos, 
            targetDistance: 5.0, 
            isPlacing: false, 
            targetPlacePosition: null,
            finalWorldPos: null
        };
    }
}

function placeBlock(instant = false) {
    if (!heldBlock) return;

    // REMOVED the "if (blockInventory <= 0)" check that returned the block.
    // The toolgun should not check inventory.

    const meshes = Array.from(loadedChunks.values()).map(c => c.mesh).filter(m => m);
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const intersects = raycaster.intersectObjects(meshes);

    let finalX, finalY, finalZ;

    if (intersects.length > 0) {
        const adjacentBlockPos = intersects[0].point.clone().add(intersects[0].face.normal.clone().multiplyScalar(0.01));
        [finalX, finalY, finalZ] = [Math.floor(adjacentBlockPos.x), Math.floor(adjacentBlockPos.y), Math.floor(adjacentBlockPos.z)];
    } else {
        const targetPos = new THREE.Vector3(0, 0, -5).applyMatrix4(camera.matrixWorld);
        [finalX, finalY, finalZ] = [Math.floor(targetPos.x), Math.floor(targetPos.y - 1), Math.floor(targetPos.z)];
    }
    
    if (isPlayerOccupying(finalX, finalY, finalZ)) {
        [finalX, finalY, finalZ] = [heldBlock.originalPos.x, heldBlock.originalPos.y, heldBlock.originalPos.z];
        
        if (instant) {
            modifiedBlocks.set(`${finalX},${finalY},${finalZ}`, heldBlock.data);
            markChunkForRegeneration(finalX, finalZ);
        } else {
            heldBlock.isPlacing = true;
            heldBlock.targetPlacePosition = new THREE.Vector3(finalX + 0.5, finalY + 0.5, finalZ + 0.5);
            heldBlock.finalWorldPos = { x: finalX, y: finalY, z: finalZ }; 
            heldBlock.mesh.rotation.set(0, 0, 0); 
            return;
        }
    }
    // REMOVED the "else" block that decremented blockInventory.
    // Placing a block with the toolgun is free.


    if (instant) {
        modifiedBlocks.set(`${finalX},${finalY},${finalZ}`, heldBlock.data);
        markChunkForRegeneration(finalX, finalZ);

        if (heldBlock.glowMesh) {
            heldBlock.mesh.remove(heldBlock.glowMesh);
            heldBlock.glowMesh.geometry.dispose();
            heldBlock.glowMesh.material.dispose();
        }

        scene.remove(heldBlock.mesh);
        heldBlock.mesh.geometry.dispose();
        heldBlock.mesh.material.dispose();
        heldBlock = null;
    } else {
        heldBlock.isPlacing = true;
        heldBlock.targetPlacePosition = new THREE.Vector3(finalX + 0.5, finalY + 0.5, finalZ + 0.5);
        heldBlock.finalWorldPos = { x: finalX, y: finalY, z: finalZ }; 
        
        heldBlock.mesh.rotation.set(0, 0, 0); 
    }
}

function updateHeldBlockPosition(deltaTime) {
    if (!heldBlock) return;

    let targetPos;
    const lerpSpeed = 10.0 * deltaTime;
    let targetScale; 

    if (heldBlock.isPlacing) { 
        targetPos = heldBlock.targetPlacePosition;
        targetScale = new THREE.Vector3(1, 1, 1); 
        
        heldBlock.mesh.position.lerp(targetPos, lerpSpeed);
        heldBlock.mesh.scale.lerp(targetScale, lerpSpeed); 
        
        if (heldBlock.mesh.position.distanceTo(targetPos) < 0.05) {
            const { x, y, z } = heldBlock.finalWorldPos;
            
            modifiedBlocks.set(`${x},${y},${z}`, heldBlock.data);
            markChunkForRegeneration(x, z);

            if (heldBlock.glowMesh) {
                heldBlock.mesh.remove(heldBlock.glowMesh);
                heldBlock.glowMesh.geometry.dispose();
                heldBlock.glowMesh.material.dispose();
            }

            scene.remove(heldBlock.mesh);
            heldBlock.mesh.geometry.dispose();
            heldBlock.mesh.material.dispose();
            heldBlock = null;
        }

    } else {
        targetScale = new THREE.Vector3(0.666, 0.666, 0.666); 
        let verticalOffset = 0.0; 

        const meshes = Array.from(loadedChunks.values()).map(c => c.mesh).filter(m => m);
        let distance = Infinity; 

        if (meshes.length > 0) {
            raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
            const intersects = raycaster.intersectObjects(meshes);

            if (intersects.length > 0) {
                distance = intersects[0].distance;
                if (distance < 2.0) heldBlock.targetDistance = 1.5;
                else if (distance < 2.5) heldBlock.targetDistance = 2.0;
                else if (distance < 3.0) heldBlock.targetDistance = 2.5;
                else if (distance < 3.5) heldBlock.targetDistance = 3.0;
                else if (distance < 4.0) heldBlock.targetDistance = 3.5;
                else if (distance < 4.5) heldBlock.targetDistance = 4.0;
                else if (distance < 5.0) heldBlock.targetDistance = 4.5;
                else if (distance < 5.5) heldBlock.targetDistance = 5.0;
                else if (distance < 6.0) heldBlock.targetDistance = 5.5;
                else if (distance < 6.5) heldBlock.targetDistance = 6.0;
                else if (distance < 7.0) heldBlock.targetDistance = 6.5;
                else if (distance < 7.5) heldBlock.targetDistance = 7.0;
                else if (distance < 8.0) heldBlock.targetDistance = 7.5;
                else heldBlock.targetDistance = 8.0;
            } else {
                heldBlock.targetDistance = 8.0; 
            }

            if (distance <= 7.0) {
                verticalOffset = 0.5;
            }
        }


        const targetDist = heldBlock.targetDistance;
        const cameraPos = new THREE.Vector3();
        camera.getWorldPosition(cameraPos);
        const cameraDir = new THREE.Vector3();
        camera.getWorldDirection(cameraDir);
        targetPos = cameraPos.clone().add(cameraDir.clone().multiplyScalar(targetDist));
        
        targetPos.y += verticalOffset; 

        heldBlock.mesh.position.lerp(targetPos, lerpSpeed);
        heldBlock.mesh.scale.lerp(targetScale, lerpSpeed); 
        
        heldBlock.mesh.rotation.y += 0.5 * deltaTime;
        heldBlock.mesh.rotation.x += 0.2 * deltaTime;
    }
}

function updateToolgunLaser() {
    if (!toolgunLaser) {
        const laserGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8); 
        const laserMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00FFFF, 
            transparent: true, 
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        toolgunLaser = new THREE.Mesh(laserGeo, laserMaterial);
        scene.add(toolgunLaser);
    }

    const laserStart = new THREE.Vector3(1.3, 0.05, 0); 
    rifle.updateWorldMatrix(true, false); 
    laserStart.applyMatrix4(rifle.matrixWorld); 
    
    const laserDir = new THREE.Vector3();
    camera.getWorldDirection(laserDir);

    let laserEnd;

    if (heldBlock) {
        laserEnd = heldBlock.mesh.position.clone();
    } else {
        const meshes = Array.from(loadedChunks.values()).map(c => c.mesh).filter(m => m);
        const cameraRaycaster = new THREE.Raycaster();
        cameraRaycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const intersects = cameraRaycaster.intersectObjects(meshes);
        
        if (intersects.length > 0) {
            laserEnd = intersects[0].point;
        } else {
            const cameraPos = new THREE.Vector3();
            camera.getWorldPosition(cameraPos);
            laserEnd = cameraPos.clone().add(laserDir.clone().multiplyScalar(100));
        }
    }
    
    const distance = laserStart.distanceTo(laserEnd);
    toolgunLaser.scale.y = distance; 
    toolgunLaser.position.copy(laserStart).add(laserEnd).multiplyScalar(0.5); 
    toolgunLaser.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), laserEnd.clone().sub(laserStart).normalize()); 
}

function updateToolgun(deltaTime) {
    if (currentMode !== 'toolgun') {
        if (toolgunLaser) {
            scene.remove(toolgunLaser);
            toolgunLaser.geometry.dispose();
            toolgunLaser.material.dispose();
            toolgunLaser = null;
        }
        if (heldBlock) {
            placeBlock(true);
        }
        isToolgunActive = false; 
        return;
    }
    
    const shouldShowLaser = (isMobileDevice && heldBlock) || (!isMobileDevice && isToolgunActive);

    if (shouldShowLaser) {
        updateToolgunLaser();
    } else if (toolgunLaser) {
        scene.remove(toolgunLaser);
        toolgunLaser.geometry.dispose();
        toolgunLaser.material.dispose();
        toolgunLaser = null;
    }

    if (heldBlock) {
        updateHeldBlockPosition(deltaTime);
    }
}

function updatePlayer(deltaTime) {
    if (!playerCube) return;
	const moveVector = new THREE.Vector3(0, 0, 0);
	if (keys['KeyS']) moveVector.z += 1;
	if (keys['KeyW']) moveVector.z -= 1;
	if (keys['KeyD']) moveVector.x += 1;
	if (keys['KeyA']) moveVector.x -= 1;

    if (isFlying) {
        if (keys['Space']) moveVector.y += 1;
        if (keys['ShiftLeft']) moveVector.y -= 1;

        if (moveVector.lengthSq() > 0) moveVector.normalize();
        
        moveVector.applyQuaternion(playerCube.quaternion);
        playerCube.position.add(moveVector.multiplyScalar(flyingSpeed * deltaTime));
        playerOnGround = false;
        playerVelocity.set(0, 0, 0);

    } else {
        if (moveVector.lengthSq() > 0) moveVector.normalize();
        
        moveVector.applyQuaternion(playerCube.quaternion);
        const desiredMoveX = moveVector.x * playerMoveSpeed * deltaTime;
        const desiredMoveZ = moveVector.z * playerMoveSpeed * deltaTime;

        playerVelocity.y += gravity * deltaTime;

        const isSpacePressed = !!keys['Space'];
        const justPressedSpace = isSpacePressed && !spaceWasPressedLastFrame;
        spaceWasPressedLastFrame = isSpacePressed;

        if (justPressedSpace) {
            if (playerOnGround) {
                playerVelocity.y = playerJumpHeight;
                playerOnGround = false;
                playerJumpCount = 1;
            } else if (playerJumpCount < 2) {
                playerVelocity.y = playerJumpHeight * 0.9;
                playerJumpCount++;
            }
        }
        
        const desiredMoveY = playerVelocity.y * deltaTime;
        const desiredKnockbackX = playerVelocity.x * deltaTime;
        const desiredKnockbackZ = playerVelocity.z * deltaTime;

        playerCube.position.x += desiredMoveX + desiredKnockbackX;
        if (checkCollision(playerCube.position)) {
            playerCube.position.x -= (desiredMoveX + desiredKnockbackX);
            playerVelocity.x = 0; 
        }
        
        playerCube.position.z += desiredMoveZ + desiredKnockbackZ;
        if (checkCollision(playerCube.position)) {
            playerCube.position.z -= (desiredMoveZ + desiredKnockbackZ);
            playerVelocity.z = 0; 
        }
        
        playerCube.position.y += desiredMoveY;
        if (checkCollision(playerCube.position)) {
            playerCube.position.y -= desiredMoveY;
            if (playerVelocity.y < 0) {
                playerOnGround = true;
                playerJumpCount = 0;
            }
            playerVelocity.y = 0;
        } else {
            playerOnGround = false;
        }

        playerVelocity.x *= 0.98;
        playerVelocity.z *= 0.98;
        if (Math.abs(playerVelocity.x) < 0.01) playerVelocity.x = 0;
        if (Math.abs(playerVelocity.z) < 0.01) playerVelocity.z = 0;

    }

	if (playerCube.position.y < BEDROCK_LEVEL - 20) respawnPlayer();
}

function respawnPlayer() {
    if (heldBlock) placeBlock(true);
    playerCube.position.copy(playerSpawnPoint);
    playerVelocity.set(0, 0, 0);
    isFlying = false;
}

function animate() {
	animationFrameId = requestAnimationFrame(animate); 
	if (!isMobileDevice) stats.begin();

	const deltaTime = Math.min(0.05, clock.getDelta());
    const elapsedTime = clock.getElapsedTime();
    
    shootCooldown = Math.max(0, shootCooldown - deltaTime);

    if (isFiring && currentMode === 'shoot' && shootCooldown <= 0) {
        fireSphere();
        shootCooldown = FIRE_RATE;
    }

    let playerHorizontalVelocity = new THREE.Vector3(0, 0, 0);
    if (playerCube && deltaTime > 0) {
         playerHorizontalVelocity.set(
            (playerCube.position.x - lastPlayerPos.x) / deltaTime,
            0,
            (playerCube.position.z - lastPlayerPos.z) / deltaTime
        );
    }
    
	updatePlayer(deltaTime);
    updateRiflePosition(deltaTime);

    if (rifle && rifle.barrel) {
        const barrelMaterial = rifle.barrel.material;
        if (['add', 'toolgun'].includes(currentMode)) {
            const pulse = (Math.sin(elapsedTime * 4) + 1) / 2;
            barrelMaterial.emissive.setHex(0x00ffff);
            barrelMaterial.emissiveIntensity = pulse * 1.5;
        } else {
            barrelMaterial.emissiveIntensity = 0;
        }
    }

    updateToolgun(deltaTime);
    updateProjectiles(deltaTime);
    updateMissiles(deltaTime);
    updateExplosions(deltaTime);
    updateMuzzleFlashes(deltaTime); 
    updateLaserFlashes(deltaTime);
    updateDroppedBlocks(deltaTime); 
    updateGoldNuggets(deltaTime); // This now handles light visibility updates
    updateSnowflakes(deltaTime, playerHorizontalVelocity); 
	updateWorld();

	renderer.render(scene, camera);

    if (playerCube) {
        lastPlayerPos.copy(playerCube.position); 
    }
	
    if (!isMobileDevice) stats.end();
}

const PI_2 = Math.PI / 2;
function onMouseMove(event) {
    if (!isMobileDevice && document.pointerLockElement !== renderer.domElement) return;

    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;
    
    const sensitivity = isMobileDevice ? 0.0025 : 0.0015;

    playerCube.rotation.y -= movementX * sensitivity;
    camera.rotation.x -= movementY * sensitivity;
    camera.rotation.x = Math.max(-PI_2, Math.min(PI_2, camera.rotation.x));
}

function saveWorld() {
    if (heldBlock) {
        placeBlock(true);
    }

    const serializableBlocks = {};
    for (const [key, blockData] of modifiedBlocks.entries()) {
        if (blockData) {
            serializableBlocks[key] = { color: blockData.color.getHexString(), type: blockData.type };
        } else {
            serializableBlocks[key] = null; 
        }
    }

    const worldData = {
        seed: worldSeedString,
        blocks: serializableBlocks
    };

    const jsonString = JSON.stringify(worldData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeSeed = worldSeedString.length > 10 ? worldSeedString.substring(0, 10) : worldSeedString;
    a.download = `world_seed_${safeSeed}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function loadModifications(loadedBlocks) {
    modifiedBlocks.clear();
    for (const key in loadedBlocks) {
        const blockData = loadedBlocks[key];
        if (blockData) {
            modifiedBlocks.set(key, { 
                color: new THREE.Color("#" + blockData.color), 
                type: blockData.type || 'normal'
            });
        } else {
            modifiedBlocks.set(key, null);
        }
    }
    for (const chunkData of loadedChunks.values()) {
        chunkData.needsRegeneration = true;
    }
}

let onWindowResize;
let onKeyDown, onKeyUp, onRendererClick, onPointerLockChange, onDocMouseDown, onDocMouseUp, onDocContextMenu;
let joystickStart, windowTouchMove, endJoystickHandler;
let jumpStart, jumpEnd, actionStart, actionEnd, switchModeStart;
let rendererTouchStart, rendererTouchMove, endLookTouchHandler;


function setupEventListeners() {
    if (onWindowResize) window.removeEventListener('resize', onWindowResize, false);
	onWindowResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	};
    window.addEventListener('resize', onWindowResize, false);


    if (isMobileDevice) {
        cleanupDesktopControls(); 
        setupMobileControls();
        document.getElementById('info').style.display = 'none';
    } else {
        cleanupMobileControls(); 
        setupDesktopControls();
    }

	document.getElementById('add-mode-btn').addEventListener('click', () => { currentMode = 'add'; updateModeButtons(); });
	document.getElementById('shoot-mode-btn').addEventListener('click', () => { currentMode = 'shoot'; updateModeButtons(); });
    document.getElementById('missile-mode-btn').addEventListener('click', () => {
        currentMode = 'missile';
        updateModeButtons(); 
    });
    document.getElementById('toolgun-mode-btn').addEventListener('click', () => { currentMode = 'toolgun'; updateModeButtons(); });

    document.getElementById('save-world-btn').addEventListener('click', saveWorld);
    document.getElementById('ingame-load-world-btn').addEventListener('click', () => {
        document.getElementById('load-file-input').click();
    });

	const colorPicker = document.getElementById('cube-color-picker');
	colorPicker.addEventListener('input', (event) => { currentColor = parseInt(event.target.value.substring(1), 16); });
	currentColor = parseInt(colorPicker.value.substring(1), 16);
	updateModeButtons();
}

function cleanupDesktopControls() {
    if (onKeyDown) document.removeEventListener('keydown', onKeyDown);
    if (onKeyUp) document.removeEventListener('keyup', onKeyUp);
    if (renderer && onRendererClick) renderer.domElement.removeEventListener('click', onRendererClick);
    if (onPointerLockChange) document.removeEventListener('pointerlockchange', onPointerLockChange);
    if (onDocMouseDown) document.removeEventListener('mousedown', onDocMouseDown, false);
    if (onDocMouseUp) document.removeEventListener('mouseup', onDocMouseUp, false);
    if (onDocContextMenu) document.removeEventListener('contextmenu', onDocContextMenu, false);
    document.removeEventListener("mousemove", onMouseMove, false); 
    
    onKeyDown = onKeyUp = onRendererClick = onPointerLockChange = onDocMouseDown = onDocMouseUp = onDocContextMenu = null;
}

function setupDesktopControls() {
    cleanupDesktopControls(); 
    
    onKeyDown = (event) => {
        keys[event.code] = true;
        if (event.code === 'Digit1') currentMode = 'shoot', updateModeButtons();
        else if (event.code === 'Digit2') currentMode = 'missile', updateModeButtons();
        else if (event.code === 'Digit3') currentMode = 'toolgun', updateModeButtons();
        else if (event.code === 'Digit4') currentMode = 'add', updateModeButtons();
        else if (event.code === 'KeyF') {
            isFlying = !isFlying;
            playerJumpCount = isFlying ? 0 : playerJumpCount;
        }
    };
	onKeyUp = (event) => { keys[event.code] = false; };

    onRendererClick = () => {
        if (document.getElementById('seed-overlay').style.display === 'none') {
            renderer.domElement.requestPointerLock();
        }
    };
	onPointerLockChange = () => {
        if (document.pointerLockElement === renderer.domElement) {
            document.addEventListener("mousemove", onMouseMove, false);
        } else {
            document.removeEventListener("mousemove", onMouseMove, false);
        }
    };

	onDocMouseDown = onMouseDown; 
    onDocMouseUp = onMouseUp; 
    onDocContextMenu = (event) => {
        if (!isMobileDevice) event.preventDefault();
    };

    document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
    renderer.domElement.addEventListener('click', onRendererClick);
	document.addEventListener('pointerlockchange', onPointerLockChange);
	document.addEventListener('mousedown', onDocMouseDown, false);
    document.addEventListener('mouseup', onDocMouseUp, false); 
    document.addEventListener('contextmenu', onDocContextMenu, false);
}

function cleanupMobileControls() {
    const joystick = document.getElementById('joystick-container');
    if (joystickStart) joystick.removeEventListener('touchstart', joystickStart, { passive: false });
    if (windowTouchMove) window.removeEventListener('touchmove', windowTouchMove, { passive: false });
    if (endJoystickHandler) {
        window.removeEventListener('touchend', endJoystickHandler);
        window.removeEventListener('touchcancel', endJoystickHandler);
    }

    const jumpBtn = document.getElementById('mobile-jump-btn');
    const actionBtn = document.getElementById('mobile-action-btn');
    const switchModeBtn = document.getElementById('mobile-switch-mode-btn');

    if (jumpStart) jumpBtn.removeEventListener('touchstart', jumpStart, { passive: false });
    if (jumpEnd) jumpBtn.removeEventListener('touchend', jumpEnd, { passive: false });
    if (actionStart) actionBtn.removeEventListener('touchstart', actionStart, { passive: false });
    if (actionEnd) {
        actionBtn.removeEventListener('touchend', actionEnd, { passive: false });
        actionBtn.removeEventListener('touchcancel', actionEnd, { passive: false });
    }
    if (switchModeStart) switchModeBtn.removeEventListener('touchstart', switchModeStart, { passive: false });

    if (renderer && rendererTouchStart) renderer.domElement.removeEventListener('touchstart', rendererTouchStart, { passive: false });
    if (renderer && rendererTouchMove) renderer.domElement.removeEventListener('touchmove', rendererTouchMove, { passive: false });
    if (renderer && endLookTouchHandler) {
        renderer.domElement.removeEventListener('touchend', endLookTouchHandler);
        renderer.domElement.removeEventListener('touchcancel', endLookTouchHandler);
    }

    joystickStart = windowTouchMove = endJoystickHandler = jumpStart = jumpEnd = actionStart = actionEnd = switchModeStart = rendererTouchStart = rendererTouchMove = endLookTouchHandler = null;
}

function setupMobileControls() {
    cleanupMobileControls(); 
    document.getElementById('mobile-controls-container').classList.add('active');
    document.getElementById('mode-selector').style.display = 'none';

    const joystick = document.getElementById('joystick-container');
    const thumb = document.getElementById('joystick-thumb');
    const maxRadius = joystick.offsetWidth / 2;
    let joystickActive = false;
    let joystickTouchId = null;
    let startPos = { x: 0, y: 0 };

    joystickStart = (e) => {
        e.preventDefault();
        if (joystickActive) return;
        const joystickRect = joystick.getBoundingClientRect();
        joystickActive = true;
        const touch = e.changedTouches[0];
        joystickTouchId = touch.identifier;
        startPos.x = joystickRect.left + maxRadius;
        startPos.y = joystickRect.top + maxRadius;
    };
    joystick.addEventListener('touchstart', joystickStart, { passive: false });

    windowTouchMove = (e) => {
        if (!joystickActive) return;
        
        let foundTouch = null;
        for (let touch of e.touches) {
            if (touch.identifier === joystickTouchId) {
                foundTouch = touch;
                break;
            }
        }
        if (!foundTouch) return;

        e.preventDefault(); 

        const currentX = foundTouch.clientX;
        const currentY = foundTouch.clientY;
        let deltaX = currentX - startPos.x;
        let deltaY = currentY - startPos.y;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const deadzone = maxRadius * 0.15;
        if (distance < deadzone) {
            deltaX = 0;
            deltaY = 0;
        }

        if (distance > maxRadius) {
            deltaX = (deltaX / distance) * maxRadius;
            deltaY = (deltaY / distance) * maxRadius;
        }

        thumb.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
        
        const moveThreshold = maxRadius * 0.2;
        keys['KeyW'] = deltaY < -moveThreshold;
        keys['KeyS'] = deltaY > moveThreshold;
        keys['KeyA'] = deltaX < -moveThreshold;
        keys['KeyD'] = deltaX > moveThreshold;

    };
    window.addEventListener('touchmove', windowTouchMove, { passive: false });

    endJoystickHandler = (e) => {
        if (!joystickActive) return;
        
        let foundTouch = false;
        for (let touch of e.changedTouches) {
            if (touch.identifier === joystickTouchId) {
                foundTouch = true;
                break;
            }
        }
        if (!foundTouch) return;

        joystickActive = false;
        joystickTouchId = null;
        thumb.style.transform = 'translate(-50%, -50%)';
        keys['KeyW'] = keys['KeyS'] = keys['KeyA'] = keys['KeyD'] = false;
    };
    
    window.addEventListener('touchend', endJoystickHandler);
    window.addEventListener('touchcancel', endJoystickHandler);


    const jumpBtn = document.getElementById('mobile-jump-btn');
    const actionBtn = document.getElementById('mobile-action-btn');
    const switchModeBtn = document.getElementById('mobile-switch-mode-btn');

    jumpStart = (e) => { e.preventDefault(); keys['Space'] = true; };
    jumpEnd = (e) => { e.preventDefault(); keys['Space'] = false; };
    jumpBtn.addEventListener('touchstart', jumpStart, { passive: false });
    jumpBtn.addEventListener('touchend', jumpEnd, { passive: false });

    actionStart = (e) => { 
        e.preventDefault(); 
        isFiring = true;

        if (currentMode === 'toolgun') {
            isToolgunActive = true;
            performAction(); // This will pickup or place
            isToolgunActive = false;
        } else if (currentMode !== 'shoot') {
            performAction(); // Fire once for other modes
        }
        // If mode is 'shoot', isFiring is set to true, and animate loop handles it.
    };
    actionEnd = (e) => { e.preventDefault(); isFiring = false; };
    actionBtn.addEventListener('touchstart', actionStart, { passive: false });
    actionBtn.addEventListener('touchend', actionEnd, { passive: false });
    actionBtn.addEventListener('touchcancel', actionEnd, { passive: false });
 
 
    switchModeStart = (e) => {
        e.preventDefault();
        currentModeIndex = (currentModeIndex + 1) % modes.length;
        currentMode = modes[currentModeIndex];
        updateModeButtons();
    };
    switchModeBtn.addEventListener('touchstart', switchModeStart, { passive: false });
 
    let lookTouchId = null;
    let lastLookPos = { x: 0, y: 0 };

    rendererTouchStart = (e) => {
        if (e.target.closest('#joystick-container, #action-buttons-container')) return;
        if (lookTouchId === null) {
            e.preventDefault();
            const touch = e.changedTouches[0];
            lookTouchId = touch.identifier;
            lastLookPos.x = touch.clientX;
            lastLookPos.y = touch.clientY;
        }
    };
    renderer.domElement.addEventListener('touchstart', rendererTouchStart, { passive: false });

    rendererTouchMove = (e) => {
        e.preventDefault();
        for (let touch of e.changedTouches) {
            if (touch.identifier === lookTouchId) {
                const movementX = touch.clientX - lastLookPos.x;
                const movementY = touch.clientY - lastLookPos.y;
                onMouseMove({ movementX, movementY });
                lastLookPos.x = touch.clientX;
                lastLookPos.y = touch.clientY;
            }
        }
    };
    renderer.domElement.addEventListener('touchmove', rendererTouchMove, { passive: false });

    endLookTouchHandler = (e) => {
        for (let touch of e.changedTouches) {
            if (touch.identifier === lookTouchId) {
                lookTouchId = null;
            }
        }
    };
    renderer.domElement.addEventListener('touchend', endLookTouchHandler);
    renderer.domElement.addEventListener('touchcancel', endLookTouchHandler);
}

function updateModeButtons() {
	document.getElementById('add-mode-btn').classList.toggle('active', currentMode === 'add');
	document.getElementById('shoot-mode-btn').classList.toggle('active', currentMode === 'shoot');
    
    const missileBtn = document.getElementById('missile-mode-btn');
    missileBtn.classList.toggle('active', currentMode === 'missile');
    missileBtn.innerText = 'Explode (2)';
    missileBtn.style.color = '';
    missileBtn.style.backgroundColor = '';
 
    document.getElementById('toolgun-mode-btn').classList.toggle('active', currentMode === 'toolgun');

	document.getElementById('color-selector').style.display = currentMode === 'add' && !isMobileDevice ? 'flex' : 'none';
 
    if (isMobileDevice) {
        const modeDisplay = document.getElementById('mobile-mode-display');
        if (modeDisplay) {
            let modeText;
            if (currentMode === 'shoot') modeText = 'Shoot';
            else if (currentMode === 'missile') modeText = 'Explode';
            else if (currentMode === 'toolgun') modeText = 'Tool Gun';
            else if (currentMode === 'add') modeText = 'Create';
            else modeText = currentMode.charAt(0).toUpperCase() + currentMode.slice(1);

            if (currentMode === 'add') {
                modeDisplay.style.backgroundColor = `#${currentColor.toString(16).padStart(6, '0')}`;
                if (currentColor > 0xAAAAAA) {
                    modeDisplay.style.color = '#333333';
                } else {
                    modeDisplay.style.color = '#FFFFFF';
                }
            } else {
                modeDisplay.style.backgroundColor = 'rgba(0,0,0,0.5)';
                modeDisplay.style.color = '#FFFFFF';
            }
            modeDisplay.textContent = modeText;
        }
    }
}
 
document.getElementById('start-game-btn').addEventListener('click', () => {
    const seed = document.getElementById('seed-input').value;
    document.getElementById('seed-overlay').style.display = 'none';
    init(seed); 
});

document.getElementById('load-world-btn').addEventListener('click', () => {
    document.getElementById('load-file-input').click();
});

document.getElementById('load-file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const parsedData = JSON.parse(e.target.result);
            if (parsedData.seed === undefined || !parsedData.blocks) {
                throw new Error("Invalid world file format.");
            }
            document.getElementById('seed-overlay').style.display = 'none';
            init(parsedData.seed); 
            loadModifications(parsedData.blocks); 
        } catch (error) {
            console.error("Failed to load world:", error);
        }
        event.target.value = '';
    };
    reader.readText(file);
});

document.getElementById('seed-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('start-game-btn').click();
    }
});
