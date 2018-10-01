// Pirate Game
// Michael McGee
// 2018-09-29
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let shipX, shipY;
let state;
let waveSpeed, wavePos, wavePosB
let waveHit;
let isWaveHit;
let isWaveBHit;
let jumped;
let currentTooStrong;
let discoveredStateTwo;
let discoveredStateThree;
let discoveredStateFour;
let discoveredStateFive;
let discoveredStateSix;
let discoveredStateSeven;
let discoveredStateEight;
let lastStateDiscovered;
let boat;
let redBoat;
let lineY1A;
let lineY1B;
let lineX1A;
let lineX2A;
let lineY2A;
let lineX1B;
let lineX2B;
let lineY2B;
let distFromIsland;
let yourFriendlyNeighborhoodVariable;
let goingForward;

function setup() {
  createCanvas(windowWidth, windowHeight);
  boat = loadImage("assets/goodship.png");
  redBoat = loadImage("assets/evilship.png");
  shipX = width/2;
  shipY = height/2;
  state = 1;
  lineY1A = 0.2*height;
  lineY1B = 0.2*height;
  waveSpeed = 2;
  wavePos = pickLineX();
  wavePosB = pickLineX();
  waveHit = 0;
  isWaveHit = false;
  isWaveBHit = false;
  jumped = false;
  currentTooStrong = false;
  //discovered vars could be turned into a single numerical variable called lastStateDiscovered
  lastStateDiscovered = 1;
  discoveredStateTwo = false;
  discoveredStateThree = false;
  discoveredStateFour = false;
  discoveredStateFive = false;
  discoveredStateSix = false;
  discoveredStateSeven = false;
  discoveredStateEight = false;
  goingForward = true;
}

function draw() {
  background(0,140,140);
  loadState();
}

function loadState(){
  if(state === 1){
    controlShip();
    stateLord();
    keepWaveHitPositive();
    createWaveS();
    encloseRightState();
    displayGUI();
  }

  if(state === 2){
    controlShip();
    stateLord();
    encloseLeftState();
    showIsland();
    displayGUI();
    discoveredStateTwo = true;
  }

  if(state === 3){
    controlShip();
    stateLord();
    encloseLeftState();
    displayGUI();
    discoveredStateThree = true;
  }

  if(state === 4){
    controlShip();
    stateLord();
    encloseLeftState();
    displayGUI();
    discoveredStateFour = true;
  }

  if(state === 5){
    controlShip();
    stateLord();
    encloseLeftState();
    displayGUI();
    discoveredStateFive = true;
  }

  if(state === 6){
    controlShip();
    stateLord();
    encloseLeftState();
    displayGUI();
    discoveredStateSix = true;
  }

  if(state === 7){
    controlShip();
    stateLord();
    encloseLeftState();
    displayGUI();
    discoveredStateSeven = true;
  }

  if(state === 8){
    controlShip();
    stateLord();
    encloseLeftState();
    displayGUI();
    discoveredStateEight = true;
  }
}

function keepWaveHitPositive(){
  if(waveHit < 0){
    waveHit = 0;
    console.log("THIS CODE ACTUALLY DOES SOMETHING");
  }
}

function mouseClicked(){
  if(mouseX < 100 && mouseY < 100){
    if(goingForward){
      goingForward = false;
    }
    else if(!goingForward){
      goingForward = true;
    }
  }
}
//displays GUI
function displayGUI(){
  fill(255,0,0);
  rect(0,0,100,100);
}

//determines what state should be entered
function stateLord(){
  if(state === 1 && shipX < 0 && waveHit < 11){
    state = 2;
    shipX = width - 100;
  }
  else if(state === 2 && shipX > width || state === 3 && shipX > width || state === 4 && shipX > width || state === 5 && shipX > width || state === 6 && shipX > width || state === 7 && shipX > width || state === 8 && shipX > width){
    state = 1;
    shipX = 100;
    currentTooStrong = false;
  }
  else if(state === 1 && shipX < 0 && waveHit > 10 && waveHit < 21){
    state = 3;
    shipX = width - 100;
  }
  else if(state === 1 && shipX < 0 && waveHit > 20 && waveHit < 31){
    state = 4;
    shipX = width - 100;
  }
  else if(state === 1 && shipX < 0 && waveHit > 30 && waveHit < 41){
    state = 5;
    shipX = width - 100;
  }
  else if(state === 1 && shipX < 0 && waveHit > 40 && waveHit < 51){
    state = 6;
    shipX = width - 100;
  }
  else if(state === 1 && shipX < 0 && waveHit > 50 && waveHit < 56){
    state = 7;
    shipX = width - 100;
  }
  else if(state === 1 && shipX < 0 && waveHit > 55){
    state = 8;
    shipX = width - 100;
  }
}

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

function encloseIsland(){
  if(shipX < width / 2 + 300 && keyIsDown(37)){
    shipX += 4;
  }
}

function controlShip(){
  fill(255,0,0);
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

function createWaveS(){
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
        waveHit += 1;
      }
      else if(!goingForward){
        waveHit -= 1;
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
        waveHit += 1;
      }
      else if(!goingForward){
        waveHit -= 1;
      }
    }
    isWaveBHit = true;
    console.log(str(waveHit));
    shipY -= 100;
    lineY1A += 100;
  }
  respawnWave();
  determineIfCurrentStrong();
}

function determineIfCurrentStrong(){
  if(waveHit === 10){
    if(!discoveredStateTwo){
      currentTooStrong = true;
      textSize(30);
      text("Cureent is too strong. Pull to the left to stop.", width/2, height - 100);
    }
  }
  if(waveHit === 20){
    if(!discoveredStateThree){
      currentTooStrong = true;
      textSize(30);
      text("Cureent is too strong. Pull to the left to stop.", width/2, height - 100);
    }
  }
  if(waveHit === 30){
    if(!discoveredStateFour){
      currentTooStrong = true;
      textSize(30);
      text("Cureent is too strong. Pull to the left to stop.", width/2, height - 100);
    }
  }
  if(waveHit === 40){
    if(!discoveredStateFive){
      currentTooStrong = true;
      textSize(30);
      text("Cureent is too strong. Pull to the left to stop.", width/2, height - 100);
    }
  }
  if(waveHit === 50){
    if(!discoveredStateSix){
      currentTooStrong = true;
      textSize(30);
      text("Cureent is too strong. Pull to the left to stop.", width/2, height - 100);
    }
  }
  if(waveHit === 55){
    if(!discoveredStateSeven){
      currentTooStrong = true;
      textSize(30);
      text("Cureent is too strong. Pull to the left to stop.", width/2, height - 100);
    }
  }
  if(waveHit === 60){
    if(!discoveredStateEight){
      currentTooStrong = true;
      textSize(30);
      text("WOW", width/2, height - 100);
    }
  }
}

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

function pickLineX(){
  yourFriendlyNeighborhoodVariable = random(width);
  return yourFriendlyNeighborhoodVariable;
}
