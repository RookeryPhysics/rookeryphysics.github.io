// Pirate Game
// Michael McGee
// 2018-09-29
//
// Extra for Experts:
// -made the game work upside down, created a gui

let shipX, shipY;
let state;
let waves;
let waveSpeed, wavePos, wavePosB;
let waveHit;
let isWaveHit;
let isWaveBHit;
let currentTooStrong;
let discoveredState;
let boat;
let boatDown;
let redBoat;
let lineY1A, lineY1B, lineX1A, lineX2A, lineY2A, lineX1B, lineX2B, lineY2B;
let yourFriendlyNeighborhoodVariable;
let goingForward;
let turnButton;
let resource;
let pirateX;
let level;
let smile;
let attackDone;
let pirateMovingRight;
let upArrow, downArrow;
let pirateBMovingRight, pirateCMovingRight, pirateDMovingRight, pirateEMovingRight, pirateFMovingRight;
let pirateXB, pirateXC, pirateXD, pirateXE, pirateXF;
let killPlayer;

const pirateSpeed = 1;
const pirateSpeedFast = 2;

function preload(){
  boat = loadImage("assets/goodship.png");
  boatDown = loadImage("assets/goodshipdown.png");
  redBoat = loadImage("assets/evilship.png");
  turnButton = loadImage("assets/turn.png");
  upArrow = loadImage("assets/uparrow.png");
  downArrow = loadImage("assets/downarrow.png");
  smile = loadImage("assets/smile.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  shipX = width/2;
  shipY = height/2;
  state = 1;
  level = 1;
  lineY1A = 0.2*height;
  lineY1B = 0.2*height;
  waves = {
    waveSpeed:2,
    wavePos: pickLineX(),
    wavePosB: pickLineX(),
    waveHit: 0,
    isWaveHit: false,
    isWaveBHit:false,
  };
  waveSpeed = 2;
  pirateX = windowWidth / 2 + 50;
  pirateXB = windowWidth / 2 - 50;
  pirateXC = windowWidth / 2 - 200;
  pirateXD = windowWidth / 2 + 100;
  pirateXE = windowWidth / 2 + 150;
  pirateXF = windowWidth / 2 - 300;
  pirateMovingRight = true;
  pirateBMovingRight = false;
  pirateCMovingRight = false;
  pirateDMovingRight = true;
  pirateEMovingRight = false;
  pirateFMovingRight = true;
  wavePos = pickLineX();
  wavePosB = pickLineX();
  waveHit = 0;
  isWaveHit = false;
  isWaveBHit = false;
  currentTooStrong = false;
  killPlayer = false;
  discoveredState = {
    two: false,
    three: false,
    four: false,
    five: false,
    six: false,
    seven: false,
    eight: false
  };
  goingForward = true;
  resource = {
    money: 0,
    oil:0
  };
}

function draw() {
  background(0,140,140);
  if(killPlayer === true){
    sad();
  }
  else {
    loadState();
  }
}

function sad(){
  background(255);
  fill(0);
  textSize(40);
  text("You died a sad death.", 400, 400);
}

function loadState(){
  if(state === 0){
    controlShipDown();
    stateLord();
    keepWaveHitPositve();
    createWaves();
    encloseRightState();
    displayGUI();
    jumpScare();
  }

  if(state === 1){
    tint(255);
    controlShip();
    stateLord();
    keepWaveHitPositve();
    createWaves();
    encloseRightState();
    displayGUI();
    showPirateA();
  }

  if(state === 2){
    tint(255);
    controlShip();
    stateLord();
    portal();
    encloseLeftState();
    showIsland();
    displayGUI();
    discoveredState.two = true;
  }

  if(state === 3){
    tint(255);
    controlShip();
    stateLord();
    encloseLeftState();
    showRig();
    displayGUI();
    discoveredState.three = true;
  }

  if(state === 4){
    tint(255);
    controlShip();
    stateLord();
    encloseLeftState();
    displayGUI();
    pirateMath();
    showPirateA();
    showPirateB();
    showPirateC();
    showPirateD();
    showPirateE();
    showPirateF();
    discoveredState.four = true;
  }

  if(state === 5){
    tint(255);
    controlShip();
    stateLord();
    encloseLeftState();
    displayGUI();
    discoveredState.five = true;
  }

  if(state === 6){
    tint(255);
    controlShip();
    stateLord();
    encloseLeftState();
    displayGUI();
    discoveredState.six = true;
  }

  if(state === 7){
    tint(255);
    controlShip();
    stateLord();
    encloseLeftState();
    showPalmIsland();
    displayGUI();
    discoveredState.seven = true;
  }

  if(state === 8){
    tint(255);
    controlShip();
    stateLord();
    encloseLeftState();
    displayGUI();
    discoveredState.eight = true;
  }
  if(state === 9){
    tint(255);
    textSize(40);
    text("Your ship sank.", width/2 - 75, height/2);
  }
}

//does exactly what one might expect it to do(allegedly)
function keepWaveHitPositve(){
  if(waveHit < 0){
    waveHit = 0;
  }
}

function pirateMath(){
  if(abs(pirateX - shipX) < 5 && abs(200 - shipY) < 5){
    killPlayer = true;
  }
  if(abs(pirateXB - shipX) < 3 && abs(300 - shipY) < 3){
    killPlayer = true;
  }
  if(abs(pirateXC - shipX) < 3 && abs(400 - shipY) < 3){
    killPlayer = true;
  }
  if(abs(pirateXD - shipX) < 3 && abs(500 - shipY) < 3){
    killPlayer = true;
  }
  if(abs(pirateXE - shipX) < 3 && abs(350 - shipY) < 3){
    killPlayer = true;
  }
  if(abs(pirateXF - shipX) < 3 && abs(600 - shipY) < 3){
    killPlayer = true;
  }
}

//displays and controls pirate ship
function showPirateA(){
  image(redBoat, pirateX, 200);
  if(pirateX < width && pirateMovingRight){
    pirateX += pirateSpeed;
  }
  else if(pirateX >= width || !pirateMovingRight){
    pirateMovingRight = false;
    pirateX -= pirateSpeed;
    if(pirateX <= 0){
      pirateMovingRight = true;
    }
  }
}

function showPirateB(){
  image(redBoat, pirateXB, 300);
  if(pirateXB < width && pirateBMovingRight){
    pirateXB += pirateSpeed;
  }
  else if(pirateXB >= width || !pirateBMovingRight){
    pirateBMovingRight = false;
    pirateXB -= pirateSpeedFast;
    if(pirateXB <= 0){
      pirateBMovingRight = true;
    }
  }
}

function showPirateC(){
  image(redBoat, pirateXC, 400);
  if(pirateXC < width && pirateCMovingRight){
    pirateXC += pirateSpeedFast;
  }
  else if(pirateXC >= width || !pirateCMovingRight){
    pirateCMovingRight = false;
    pirateXC -= pirateSpeed;
    if(pirateXC <= 0){
      pirateCMovingRight = true;
    }
  }
}

function showPirateD(){
  image(redBoat, pirateXD, 500);
  if(pirateXD < width && pirateDMovingRight){
    pirateXD += pirateSpeed;
  }
  else if(pirateXD >= width || !pirateDMovingRight){
    pirateDMovingRight = false;
    pirateXD -= pirateSpeed;
    if(pirateXD <= 0){
      pirateDMovingRight = true;
    }
  }
}

function showPirateE(){
  image(redBoat, pirateXE, 350);
  if(pirateXE < width && pirateEMovingRight){
    pirateXE += pirateSpeed;
  }
  else if (pirateXE >= width || !pirateEMovingRight){
    pirateEMovingRight = false;
    pirateXE -= pirateSpeedFast;
    if(pirateXE <= 0){
      pirateEMovingRight = true;
    }
  }
}

function showPirateF(){
  image(redBoat, pirateXF, 600);
  if(pirateXF < width && pirateFMovingRight){
    pirateXF += pirateSpeedFast;
  }
  else if (pirateXF >= width || !pirateFMovingRight){
    pirateFMovingRight = false;
    pirateXF -= pirateSpeedFast;
    if(pirateXF <= 0){
      pirateFMovingRight = true;
    }
  }
}

//called when mouse is clicked, performs a variety of functions
function mouseClicked(){
  if(state === 7 && mouseX < 400 && mouseX > 200 && mouseY < 400 && mouseY > 200){
    window.open("https://rookeryphysics.github.io/palmpong/index.html");
  }
  if(mouseX < shipX + 50 && mouseX > shipX && mouseY < shipY && mouseY > shipY + 50){
    state = 9;
  }
  if(state === 3 && resource.oil < 500){
    resource.oil = resource.oil + 10;
  }
  if(mouseX < 100 && mouseY < 100){
    if(goingForward){
      goingForward = false;
      if(state === 1){
        state = 0;
      }
    }
    else if(!goingForward){
      goingForward = true;
      if(state === 0){
        state = 1;
      }
    }
  }
}

//changes the travelling direction indicator
function arrowChange(){
  if(goingForward === true){
    image(upArrow, 100, 0, 100, 100);
  }
  else if(goingForward === false){
    image(downArrow, 100, 0, 100, 100);
  }
}

//displays GUI
function displayGUI(){
  image(turnButton, 0, 0, 100, 100);
  arrowChange();
  displayMoney();
  displayOil();
  displayLevel();
}

//shows player funds
function displayMoney(){
  textSize(50);
  fill(0, 255, 0);
  text("$ " + str(resource.money), 200, 70);
}

//shows player oil
function displayOil(){
  textSize(50);
  fill(0);
  text(str(resource.oil) + " OIL", windowWidth - 200, 70);
}

//shows level or where you will be when you go to the left
function displayLevel(){
  textSize(50);
  fill(0,0,255);
  level = getLevel();
  text("Level " + str(level), windowWidth - 400, 70);
}

//computes the level to be displayed
function getLevel(){
  if(state === 2 || waveHit < 11){
    return 1;
  }
  else if(state === 3 || waveHit < 21 && waveHit > 10){
    return 2;
  }
  else if(state === 4 || waveHit < 31 && waveHit > 20){
    return 3;
  }
  else if(state === 5 || waveHit < 41 && waveHit > 30){
    return 4;
  }
  else if(state === 6 || waveHit < 51 && waveHit > 40){
    return 5;
  }
  else if(state === 7 || waveHit < 56 && waveHit > 50){
    return 6;
  }
  else if(state === 8 || waveHit > 55){
    return 7;
  }
}

//creates a blue tinted portal
function portal(){
  for (let i=100; i<200; i+= 5) {
    for (let j=100; j<200; j+=5) {
      fill(int(random(180)), int(random(180)), int(random(255)));
      noStroke();
      rect(i,j,5,5);
    }
  }
}

//determines what state should be entered
function stateLord(){
  if(state === 1 && shipX < 0 && waveHit < 11 || state === 0 && shipX < 0 && waveHit < 11){
    state = 2;
    shipX = width - 100;
  }
  else if(state === 2 && shipX > width || state === 3 && shipX > width || state === 4 && shipX > width || state === 5 && shipX > width || state === 6 && shipX > width || state === 7 && shipX > width || state === 8 && shipX > width){
    if(goingForward){
      state = 1;
    }
    else if(!goingForward){
      state = 0;
    }
    shipX = 100;
    currentTooStrong = false;
  }
  else if(state === 2 && shipX > width || state === 3 && shipX > width || state === 4 && shipX > width || state === 5 && shipX > width || state === 6 && shipX > width || state === 7 && shipX > width || state === 8 && shipX > width){
    state = 1;
    shipX = 100;
    currentTooStrong = false;
  }
  else if(state === 1 && shipX < 0 && waveHit > 10 && waveHit < 21 || state === 0 && shipX < 0 && waveHit > 55){
    state = 3;
    shipX = width - 100;
  }
  else if(state === 1 && shipX < 0 && waveHit > 20 && waveHit < 31 || state === 0 && shipX < 0 && waveHit > 55){
    state = 4;
    shipX = width - 100;
  }
  else if(state === 1 && shipX < 0 && waveHit > 30 && waveHit < 41 || state === 0 && shipX < 0 && waveHit > 55){
    state = 5;
    shipX = width - 100;
  }
  else if(state === 1 && shipX < 0 && waveHit > 40 && waveHit < 51 || state === 0 && shipX < 0 && waveHit > 55){
    state = 6;
    shipX = width - 100;
  }
  else if(state === 1 && shipX < 0 && waveHit > 50 && waveHit < 56 || state === 0 && shipX < 0 && waveHit > 55){
    state = 7;
    shipX = width - 100;
  }
  else if(state === 1 && shipX < 0 && waveHit > 55 || state === 0 && shipX < 0 && waveHit > 55){
    state = 8;
    shipX = width - 100;
  }
}

//closes right states to prevent ship from leaving screen
function encloseRightState(){
  if(shipY < 0){
    shipY = 0;
  }
  if(shipY > height - 50){
    shipY = height - 50;
  }
  if(shipX > width - 40){
    shipX = width - 40;
  }
}

//closes left states to prevent ship from leaving screen
function encloseLeftState(){
  if(shipY < 0){
    shipY = 0;
  }
  if(shipY > height - 50){
    shipY = height - 50;
  }
  if(shipX < 0){
    shipX = 0;
  }
}

//shows island
function showIsland(){
  fill(96,90,70);
  noStroke();
  ellipse(windowWidth / 2, windowHeight / 2, windowWidth / 3, windowHeight / 3);
  fill(0,255,0);
  textSize(40);
  text("🌵Home Island🌵", windowWidth / 2.3, 0.1 * windowHeight);
  fill(78,46,40);
  rect(windowWidth / 2 + 80, windowHeight / 2 - 60, windowWidth / 5, windowHeight / 10);
  encloseIsland();
}

//prevents player from boating on island
function encloseIsland(){
  if(shipX < width / 2 + 300 && keyIsDown(37)){
    shipX += 4;
  }
}

//shows oil rig
function showRig(){
  fill(150);
  rect(windowWidth/3, windowHeight / 3, 200, 250);
  fill(random(255));
  rect(windowWidth/2 - 80 ,windowHeight/2, 50, 50);
  fill(255,0,0);
  textSize(40);
  text("⛽OIL RIG⛽", windowWidth / 2.3, 0.1 * windowHeight);
  encloseRig();
}

//prevents player from boating on oil rig
function encloseRig(){
  if(shipX < width / 3 + 200 && keyIsDown(37)){
    shipX+=4;
  }
}

function showPalmIsland(){
  fill(237, 201, 175);
  ellipse(300, 300, 400, 400);
  textSize(100);
  text("🌴", 320, 320);
  textSize(30);
  text("CLICK CENTER OF ISLAND TO PLAY PALM TREE PONG", windowWidth/2.2, windowHeight * 0.2);
}

//displays and controls ship
function controlShip(){
  if(!keyIsDown(37) && !keyIsDown(39)){
    image(boat, shipX, shipY);
  }
  else if(keyIsDown(37)){
    shipX -= 4;
    image(boat, shipX, shipY);
  }
  else if(keyIsDown(39)){
    shipX += 4;
    image(boat, shipX, shipY);
  }
  if(keyIsDown(38) && !keyIsDown(37) && !keyIsDown(39)){
    shipY -= 2;
    waveSpeed = 3;
    image(boat, shipX, shipY);
  }
  else if(keyIsDown(40) && !keyIsDown(37) && !keyIsDown(39)){
    shipY += 2;
    waveSpeed = 1.5;
    image(boat, shipX, shipY);
  }
  else{
    waveSpeed = 2;
  }
  if(state === 1){
    shipY += 0.35;
  }
}

//displays and controls ship in state 0 or while going backwards
function controlShipDown(){
  if(!keyIsDown(37) && !keyIsDown(39)){
    image(boatDown, shipX, shipY);
  }
  else if(keyIsDown(37)){
    shipX -= 4;
    image(boatDown, shipX, shipY);
  }
  else if(keyIsDown(39)){
    shipX += 4;
    image(boatDown, shipX, shipY);
  }
  if(keyIsDown(38) && !keyIsDown(37) && !keyIsDown(39)){
    shipY -= 2;
    waveSpeed = 1;
    image(boatDown, shipX, shipY);
  }
  else if(keyIsDown(40) && !keyIsDown(37) && !keyIsDown(39)){
    shipY += 2;
    waveSpeed = + 3;
    image(boatDown, shipX, shipY);
  }
  else{
    waveSpeed = 2;
  }
  if(state === 0){
    shipY -= 0.35;
  }
}

//spawns waves
function createWaves(){
  if(state === 0){
    waveSpeed = waveSpeed * -1;
  }
  lineX1A = wavePos;
  lineY1A += waveSpeed;
  lineX2A = lineX1A + 50;
  lineY2A = lineY1A;
  lineX1B = wavePosB;
  lineY1B += waveSpeed;
  lineX2B = lineX1B + 50;
  lineY2B = lineY1B;
  if(!isWaveHit){
    stroke(0,0,255);
    line(lineX1A, lineY1A, lineX2A, lineY2A);
  }
  if(!isWaveBHit){
    stroke(0,0,255);
    line(lineX1B, lineY1B, lineX2B, lineY2B);
  }
  if(shipX + 20 < lineX2A && shipX + 20 > lineX1A && shipY > lineY1A - 20 && shipY < lineY1A + 20 && !isWaveHit){
    console.log("WAVEHITA");
    if(!currentTooStrong){
      if(goingForward){
        waveHit++;
        resource.money = resource.money + 299792458;
      }
      else if(!goingForward){
        waveHit--;
        resource.money = resource.money + 299792458;
      }
    }
    isWaveHit = true;
    console.log(str(waveHit));
    shipY -= 100;
    lineY1B += 100;
  }
  if(shipX + 20 < lineX2B && shipX + 20 > lineX1B && shipY > lineY1B - 20 && shipY < lineY1B + 20 && !isWaveBHit){
    console.log("WAVEHITB");
    if(!currentTooStrong){
      if(goingForward){
        waveHit ++;
        resource.money = resource.money + 299792458;
      }
      else if(!goingForward){
        waveHit --;
        resource.money = resource.money + 299792458;
      }
    }
    isWaveBHit = true;
    console.log(str(waveHit));
    shipY -= 100;
    lineY1A += 100;
  }
  if(state === 1){
    respawnWave();
    determineIfCurrentStrong();
  }
  if(state === 0 && lineY1A < height || state === 0 && lineY1B < height){
    respawnWaveDown();
  }
}


//respawns wave when it hits bottom of screen
function respawnWave(){
  if(lineY1A > height){
    lineY1A -= height;
    wavePos = pickLineX();
    isWaveHit = false;
  }
  if(lineY1B > height){
    lineY1B -= height;
    wavePosB = pickLineX();
    isWaveBHit = false;
  }
}

//respawns wave when it leaves top of screen
function respawnWaveDown(){
  if(lineY1A < 0){
    lineY1A = height - 100;
    wavePos = pickLineX();
    isWaveHit = false;
  }
  if(lineY1B < 0){
    lineY1B = height - 100;
    wavePosB = pickLineX();
    isWaveBHit = false;
  }
}

//determines if player can continue going forward based on if they have visited the level they are at
function determineIfCurrentStrong(){
  fill(255,0,0);
  if(waveHit === 10 && !discoveredState.two){
    currentTooStrong = true;
    textSize(30);
    text("Current is too strong. Pull to the left to stop.", width/2, height - 100);
  }
  if(waveHit === 20 && !discoveredState.three){
    currentTooStrong = true;
    textSize(30);
    text("Current is too strong. Pull to the left to stop.", width/2, height - 100);
  }
  if(waveHit === 30 && !discoveredState.four){
    currentTooStrong = true;
    textSize(30);
    text("Current is too strong. Pull to the left to stop.", width/2, height - 100);
  }
  if(waveHit === 40 && !discoveredState.five){
    currentTooStrong = true;
    textSize(30);
    text("Current is too strong. Pull to the left to stop.", width/2, height - 100);
  }
  if(waveHit === 50 && !discoveredState.six){
    currentTooStrong = true;
    textSize(30);
    text("Current is too strong. Pull to the left to stop.", width/2, height - 100);
  }
  if(waveHit === 55 && !discoveredState.seven){
    currentTooStrong = true;
    textSize(30);
    text("Current is too strong. Pull to the left to stop.", width/2, height - 100);
  }
  if(waveHit === 60 && !discoveredState.eight){
    currentTooStrong = true;
    textSize(30);
    text("WOW", width/2, height - 100);
  }
}

//picks a random X position for waves
function pickLineX(){
  yourFriendlyNeighborhoodVariable = random(width);
  return yourFriendlyNeighborhoodVariable;
}

function jumpScare(){
  tint(255, 127);
  image(smile, 0, 0, windowWidth, windowHeight);
}
