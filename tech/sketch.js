// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let state;
let leftArrow, rightArrow;
let numberOfStates;
let thing;
let iPhone;
let micro;

function preload(){
  thing = loadImage("thing.jpg");
  leftArrow = loadImage("assets/leftarrow.png");
  rightArrow = loadImage("assets/rightarrow.png");
  iPhone = loadImage("assets/iphone.jpg");
  micro = loadImage("assets/micro.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight-160);
  state = 0;
  numberOfStates = 3;
}

function mousePressed(){
  if(mouseX < 160 && mouseY > 0 && mouseY < windowWidth){
    leftArrowClick();
  }
  else if(mouseX > windowWidth-160 && mouseY > 0 && mouseY < windowWidth){
    rightArrowClick();
  }
}

function draw() {
  stateLord();
  showArrows();
}

function stateLord(){
  if(state === 0){ //selection
    background(0);
    showArrows();
    showTopProduct();
  }
  else if(state === 1){
    background(0);
    showArrows();
    showAppleProduct();
  }
  else if(state === 2){
    background(0);
    showArrows();
    showMicroProduct();
  }
}

function showArrows(){
  fill(255);
  rect(0,0,160,windowHeight);
  rect(windowWidth-160,0,160,windowHeight);
  if(state > 0){
    image(leftArrow,0,windowHeight/6,100,400);
  }
  if(state !== numberOfStates){
    image(rightArrow,windowWidth-100,windowHeight/6,100,400);
  }
}

function leftArrowClick(){
  if(state > 0){
    state--;
  }
}

function rightArrowClick(){
  if(state < numberOfStates){
    state++;
  }
}

function showTopProduct(){
  image(thing,260,100,450,450);
  textSize(40);
  text("High Power Adjustable Green Laser",800,200);
  textSize(20);
  text("This laser is capable of popping balloons and lighting matches. \nThe laser's green color makes it easy to see the beam because green light \nis very visible to the human eye.",800,280);
  textSize(30);
  text("Price:$20CAD",800,400);
}

function showAppleProduct(){
  image(iPhone,260,100);
  textSize(40);
  text("iPhone Charging Cable",1200,200);
  textSize(20);
  text("High quality charging cable for iPhone 5/6/7/8/X/XS",1200,280);
  textSize(30);
  text("Starting at $2.99CAD",1200,400);
}

function showMicroProduct(){
  image(micro,260,100,900,300);
  textSize(40);
  text("Micro USB Charging Cable",1200,200);
  textSize(20);
  text("High quality charging cable for Samsung and other devices.",1200,280);
  textSize(30);
  text("Starting at $5.49CAD",1200,400);
}
