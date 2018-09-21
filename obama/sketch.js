// Messing with images
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let obama;
let scalar;

function preload(){
  obama = loadImage("assets/obama.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  scalar = 1.0;
  alert("Press S for Shia and O for Obama.\nUse scroll wheel to alter size.");
}

function switchCheck(){
  if(keyIsDown(83)){
    obama = loadImage("assets/shia.png");
  }

  if(keyIsDown(79)){
    obama = loadImage("assets/obama.png");
  }
}

function draw() {
  image(obama, mouseX, mouseY, obama.width * scalar, obama.height * scalar);
  switchCheck();
}

function mouseWheel(event){
  if(event.delta > 0){
    scalar *= 1.1;
  }
  else{
    scalar *= 0.9;
  }
}
