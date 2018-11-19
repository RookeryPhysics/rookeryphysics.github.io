// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Ball{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.dx = -5;
    this.dy = -5;
    this.radius = 15;
    this.color = color(255,255,255,255);
  }
  show(){
    fill(this.color);
    ellipse(this.x, this.y, this.radius, this.radius);
  }
  update(){
    this.x += this.dx;
    this.y += this.dy;
    //decrease speed
  }
}

//variables
let state;
let startMusic;

//just for topview
let ballArray = [];
let golfBall;
let aim;
let power;

//just for terrain

function preload(){
  //startMusic = loadSound(assets/nameofsonghere);
}

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
  else if(state === 4){
    //
    let someBall = new Ball(mouseX,mouseY);
    ballArray.push(someBall);
  }
  else if(state === 5){
    //
  }
}

function draw() {
  stateLord();
}

function stateLord(){
  if(state === 0){
    //startScreen
    startScreen();
    playStartMusic();
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
  fill(0,255,0);
  textSize(25);
  text("TOPVIEW", 100, 70);
  fill(255,0,0);
  rect(400,100,200,200);
  fill(0,255,0);
  textSize(25);
  text("TERRAIN", 400, 70);
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
  background(50,205,50);
  for (let i=ballArray.length-1; i >= 0; i--){
    ballArray[i].update();
    ballArray[i].show();
  }
}

function terrain(){
  background(200,200,200);
  //
}

function playStartMusic(){
  //plays the music at the beginning of the game
}