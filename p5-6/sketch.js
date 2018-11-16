// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Ball{
  constructor(x,y,dx,dy){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = 5;
  }
  show(){
    ellipse(this.x, this.y, this.radius, this.radius);
  }
  update(){
    this.x += this.dx;
    this.y += this.dy;
  }
}

let state;

function setup() {
  createCanvas(700, 700);
  state = 0;
}

//state relationships
//0,1,2,4,
//0,1,3,5,

function mousePressed(){
  if(state === 0){
    state = 1;
  }
  else if(state === 1 && mouseX < width/2){
    state = 2;
  }
  else if(state === 1 && mouseX > width/2){
    state = 3;
  }
  else if(state === 2){
    state = 4;
  }
  else if(state === 3){
    state = 5;
  }
  else if(state === 5){
    let someBall = new Ball(mouseX, mouseY);
  }
}

function draw() {
  stateLord();
}

function stateLord(){
  if(state === 0){
    //startScreen
    startScreen();
  }
  else if(state === 1){
    //pick gamemode
    pickMode();
  }
  else if(state === 2){
    //topview instructions
    instructions();
  }
  else if(state === 3){
    //terrain view instructions
    otherInstructions();
  }
  else if(state === 4){
    //topview start
    topView();
  }
  else if(state === 5){
    //terrain start
    terrain();
  }
}

function startScreen(){
  background(107,142,35);
}

//display to pick gamemode
function pickMode(){
  background(255,255,255);
  fill(0,0,255);
  rect(100,100,200,200);
  fill(255,0,0);
  rect(400,100,200,200);
}

//instructions for topview mode
function instructions(){
  background(255,255,255);
}

//instructions for terrain mode
function otherInstructions(){
  background(0,255,0);
}

function topView(){
  background(100,100,100);
  //
}

function terrain(){
  background(200,200,200);
  //
}
