// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let x;
let time;
let rects = [];
let rectNumber;
let rectWidth;

function setup() {
  createCanvas(700, 700);
  time = 0;
  rectNumber = 65;
  rectWidth = 700 / rectNumber;
  generateRectangles();
}

function draw() {
  background(0,255,255);
  fill(255);
  noStroke();
  displayRects();
}

function mousePressed(){
  location.href = self.location;
}

function displayRects() {
  for(let i=0; i<rects.length; i++){
    rect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
  }
}

function generateRectangles(){
  for(let i=0; i < rectNumber; i++){
    let rectHeight = noise(time) * 700;
    let someRect = {
      x: i * rectWidth,
      y: 700 - rectHeight,
      width: rectWidth,
      height: rectHeight
    };
    rects.push(someRect);
    time += 0.01;
  }
}
