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
  createCanvas(windowWidth, windowHeight);
  time = 0;
  rectNumber = 400;
  rectWidth = windowWidth / rectNumber;
  generateRectangles();
}

function draw() {
  background(255);
  fill(0);
  displayRects();
}

function displayRects() {
  for(let i=0; i<rects.length; i++){
    rect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
  }
}

function generateRectangles(){
  for(let i=0; i < rectNumber; i++){
    let rectHeight = noise(time) * height;
    let someRect = {
      x: i * rectWidth,
      y: height - rectHeight,
      width: rectWidth,
      height: rectHeight
    };
    rects.push(someRect);
    time += 0.01;
  }
}
