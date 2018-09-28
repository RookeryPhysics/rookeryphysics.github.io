// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let shipX;
let shipY;
let state;

function setup() {
  createCanvas(windowWidth, windowHeight);
  shipX = width/2;
  shipY = height/2;
  state = 1;
}

function draw() {
  background(0,140,140);
  if(state === 1){
    controlShip();
    createWaves();
  }
}

function controlShip(){
  fill(255,0,0);
  if(!keyIsDown(37) && !keyIsDown(39)){
    rect(shipX, shipY, 10, 30);
  }
  else if(keyIsDown(37)){
    shipX -= 4;
    rect(shipX, shipY, 30, 10);
  }
  else if(keyIsDown(39)){
    shipX += 4;
    rect(shipX, shipY, 30, 10);
  }
  if(keyIsDown(38) && !keyIsDown(37) && !keyIsDown(39)){
    shipY -= 2;
    rect(shipX, shipY, 10, 30);
  }
  else if(keyIsDown(40) && !keyIsDown(37) && !keyIsDown(39)){
    shipY += 5;
    rect(shipX, shipY, 10, 30);
  }
}

function createWaves(){
}
