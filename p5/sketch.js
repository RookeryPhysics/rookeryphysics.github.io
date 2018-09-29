// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let shipX;
let shipY;
let state;
let waveSpeed;
let wavePos;
let waveHit;
let isWaveHit;
let jumped;
let currentTooStrong;
let discoveredStateTwo;
let discoveredStateThree;
let discoveredStateFour;
let discoveredStateFive;
let discoveredStateSix;
let discoveredStateSeven;
let discoveredStateEight;

function setup() {
  createCanvas(windowWidth, windowHeight);
  boat = loadImage("assets/goodship.png");
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
  discoveredStateTwo = false;
  discoveredStateThree = false;
  discoveredStateFour = false;
  discoveredStateFive = false;
  discoveredStateSix = false;
  discoveredStateSeven = false;
  discoveredStateEight = false;
}

function draw() {
  background(0,140,140);
  loadState();
}

function loadState(){
  if(state === 1){
    controlShip();
    stateLord();
    createWaveS();
    encloseRightState();
  }
  if(state === 2){
    controlShip();
    stateLord();
    encloseLeftState();
    discoveredStateTwo = true;
  }
  if(state === 3){
    controlShip();
    stateLord();
    encloseLeftState();
    discoveredStateThree = true;
  }
  if(state === 4){
    controlShip();
    stateLord();
    encloseLeftState();
    discoveredStateFour = true;
  }
  if(state === 5){
    controlShip();
    stateLord();
    encloseLeftState();
    discoveredStateFive = true;
  }
  if(state === 6){
    controlShip();
    stateLord();
    encloseLeftState();
    discoveredStateSix = true;
  }
  if(state === 7){
    controlShip();
    stateLord();
    encloseLeftState();
    discoveredStateSeven = true;
  }
  if(state === 8){
    controlShip();
    stateLord();
    encloseLeftState();
    discoveredStateEight = true;
  }
}

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
    shipY += 3;
    waveSpeed = 1;
    image(boat, shipX, shipY);
  }
  else{
    waveSpeed = 2;
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
      waveHit += 1;
    }
    isWaveHit = true;
    console.log(str(waveHit));
    shipY -= 100;
    lineY1B += 100;
  }
  if(shipX + 20 < lineX2B && shipX + 20 > lineX1B && shipY > lineY1B - 20 && shipY < lineY1B + 20 && !isWaveBHit){
    console.log("WAVEHITB");
    if(!currentTooStrong){
      waveHit += 1;
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
    wavePos = pickLineX();;
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
