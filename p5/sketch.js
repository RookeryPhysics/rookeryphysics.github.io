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
}

function draw() {
  background(0,140,140);
  if(state === 1){
    controlShip();
    stateLord();
    createWave();
  }
  if(state === 2){
    controlShip();
    stateLord();
  }
}

function stateLord(){
  if(state === 1 && shipX < 0){
    state = 2;
  }
  else if(state === 2 && shipX > width){
    state = 1;
  }
  else {
    return;
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
    image(boat, shipX, shipY);
  }
  else if(keyIsDown(40) && !keyIsDown(37) && !keyIsDown(39)){
    shipY += 5;
    image(boat, shipX, shipY);
  }
}

function createWave(){
  lineX1A = wavePos;
  lineY1A += waveSpeed;
  lineX2A = lineX1A + 50;
  lineY2A = lineY1A;
  stroke(0,0,255);
  line(lineX1A, lineY1A, lineX2A, lineY2A);
  lineX1B = wavePosB;
  lineY1B += waveSpeed;
  lineX2B = lineX1B + 50;
  lineY2B = lineY1B;
  line(lineX1B, lineY1B, lineX2B, lineY2B);

}

function pickLineX(){
  yourFriendlyNeighborhoodVariable = random(width);
  return yourFriendlyNeighborhoodVariable;
}
