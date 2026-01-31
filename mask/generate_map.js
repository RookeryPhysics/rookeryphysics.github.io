const fs = require('fs');

try {
    const treeData = JSON.parse(fs.readFileSync('tree.json', 'utf8'));
    const treeBlocks = treeData.blocks;

    if (!treeBlocks || treeBlocks.length === 0) {
        console.error("No blocks in tree.json");
        process.exit(1);
    }

    // 1. Find the bounding box/center of the tree
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    treeBlocks.forEach(b => {
        if (b.x < minX) minX = b.x;
        if (b.x > maxX) maxX = b.x;
        if (b.y < minY) minY = b.y;
        if (b.y > maxY) maxY = b.y;
        if (b.z < minZ) minZ = b.z;
        if (b.z > maxZ) maxZ = b.z;
    });

    // We'll use the center of the base (lowest Y) as the pivot
    // Note: Since grid is odd integers (1, 3, 5...), the center calculation needs care.
    // If we just take the raw average, we might end up with non-integers.
    // We want the offset to be such that when we apply it, we still land on the grid (odd integers).
    // So (b.x - pivotX) should be an even number (or 0).
    // This implies pivotX must be an odd integer.

    // Let's pick the block with min Y and approximate center X/Z as the pivot anchor.
    // Or just pick (minX + maxX) / 2 and round to nearest odd integer?
    // Let's just use the first block at minY as a reference, or something simple.
    // Actually, simply finding the geometric center and snapping to the nearest odd integer is safer for rotation.

    const centerX = Math.floor((minX + maxX) / 2);
    const centerZ = Math.floor((minZ + maxZ) / 2);

    // Ensure pivot is an odd integer (assuming grid is 1, 3, 5...)
    const pivotX = (centerX % 2 === 0) ? centerX + 1 : centerX;
    const pivotZ = (centerZ % 2 === 0) ? centerZ + 1 : centerZ;
    const pivotY = minY;

    console.log(`Tree Pivot: ${pivotX}, ${pivotY}, ${pivotZ}`);

    const mapBlocks = [];
    const usedPositions = new Set();

    /**
     * Adds a unique block to the map data.
     * @param {number} x - World X position.
     * @param {number} y - World Y position.
     * @param {number} z - World Z position.
     * @param {number} c - Hex color code.
     * @returns {void}
     */
    function addBlock(x, y, z, c) {
        const key = `${x},${y},${z}`;
        if (!usedPositions.has(key)) {
            mapBlocks.push({ x, y, z, c });
            usedPositions.add(key);
        }
    }

    // Map size is 400x400, so -200 to 200.
    // We'll spawn trees in range -180 to 180.
    const mapRange = 180;
    const numTrees = 50; // Populate "most" of the map
    const minDistance = 15; // Minimum distance between tree centers to avoid clutter

    const treePositions = [];

    for (let i = 0; i < numTrees; i++) {
        let posX, posZ;
        let valid = false;
        let attempts = 0;

        while (!valid && attempts < 100) {
            // Generate random even coordinate offset
            // Range: -mapRange to mapRange
            // Math.random() * (2 * mapRange) - mapRange

            const rawX = Math.floor(Math.random() * (mapRange * 2)) - mapRange;
            const rawZ = Math.floor(Math.random() * (mapRange * 2)) - mapRange;

            // Snap to even numbers so that Odd + Even = Odd
            posX = (rawX % 2 !== 0) ? rawX + 1 : rawX;
            posZ = (rawZ % 2 !== 0) ? rawZ + 1 : rawZ;

            // Check distance to other trees
            valid = true;
            for (const p of treePositions) {
                const dist = Math.sqrt((p.x - posX) ** 2 + (p.z - posZ) ** 2);
                if (dist < minDistance) {
                    valid = false;
                    break;
                }
            }
            attempts++;
        }

        if (valid) {
            treePositions.push({ x: posX, z: posZ });

            // Random rotation: 0, 90, 180, 270
            const rotation = Math.floor(Math.random() * 4); // 0, 1, 2, 3

            treeBlocks.forEach(b => {
                // Local coordinates relative to pivot
                const lx = b.x - pivotX;
                const ly = b.y - pivotY;
                const lz = b.z - pivotZ;

                // Rotate
                let rx, rz;
                if (rotation === 0) { // 0 deg
                    rx = lx;
                    rz = lz;
                } else if (rotation === 1) { // 90 deg
                    rx = -lz;
                    rz = lx;
                } else if (rotation === 2) { // 180 deg
                    rx = -lx;
                    rz = -lz;
                } else { // 270 deg
                    rx = lz;
                    rz = -lx;
                }

                // Transform to world space
                const finalX = rx + posX;
                const finalY = ly + 1; // Start at y=1 (ground level)
                const finalZ = rz + posZ;

                addBlock(finalX, finalY, finalZ, b.c);
            });
        }
    }

    const output = { blocks: mapBlocks };
    fs.writeFileSync('map.json', JSON.stringify(output, null, 0)); // Minified for size
    console.log(`Generated map.json with ${mapBlocks.length} blocks (${treePositions.length} trees).`);

} catch (err) {
    console.error("Error:", err);
    process.exit(1);
}
