// DVD Bounce
// Michael McGee
// 18/9/2018
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let dvd;
let move
let x, y;
let dx, dy;

function preload() {
  dvd = loadImage("assets/download.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  x = width/2 - dvd.width/2;
  y = height/2 - dvd.height/2;
  dx = 5;
  dy = 5;
}

function draw() {
  moveDVD();
  displayDVD();
}

function displayDVD() {
  background(10);
  image(dvd, x, y);
}

function moveDVD() {
  x += dx;
  y += dy;
  if(x > windowWidth - dvd.width || x < 0){
    dx = dx * -1;
  }
  if(y > windowHeight - dvd.height || y < 0){
    dy = dy * -1;
  }
}
