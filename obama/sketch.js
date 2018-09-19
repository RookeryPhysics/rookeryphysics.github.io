// Messing with images
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let obama;

function preload(){
  obama = loadImage("assets/obama.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  scalar = 1.0;
}

function draw() {
  image(obama, mouseX, mouseY, obama.width * scalar, obama.height * scalar);
}

function mouseWheel(event){
  if(event.delta > 0){
    scalar *= 1.1;
  }
  else{
    scalar *= 0.9;
  }
  console.log(event);
}
