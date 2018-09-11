// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let x;
let dx;
let rectWidth;

function setup() {
  createCanvas(windowWidth, windowHeight);
  x = width/2;
  dx = 10;
  rectWidth = 50;
}

function draw() {
  background(255,0,0);

  //move rectangle
  x += dx;

  //check if hitting wall
  if(x > width - 50|| x < 0 || x === mouseX && x === mouseY) {
    dx = dx * -1;
  }

  //display rectangle
  fill(0,255,0);
  rect(x, 400, rectWidth, rectWidth);

  //display and control paddle
  rect(mouseX, mouseY, 20, 150);
}
