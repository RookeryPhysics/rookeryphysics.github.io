// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Ball{
  constructor(x,y,power,aim){
    this.x = x;
    this.y = y;
    this.dx = aim;
    this.dy = power;
    this.radius = 7;
    this.color = color(255,255,255,255);
    this.done = false;
  }
  show(){
    fill(this.color);
    ellipse(this.x, this.y, this.radius*2, this.radius*2);
  }
  update(){
    if(!this.done){
      this.x += this.dx;
      this.y += this.dy;
      //decrease speed KEEP WORKING ON THIS
      if(aim > 0){
        if(this.dx < 0){
          this.dx = this.dx + 0.03;
        }
        else if(this.dx < 0){
          this.dx = this.dx - 0.03;
        }
        if(this.dy < 0 && !this.done){
          this.dy = this.dy + 0.03;
        }
        if(this.dy > 0){
          this.dy = 0;
          this.done = true;
        }
      }
      if(aim === 0){
        if(this.dy < 0 && !this.done){
          this.dy = this.dy + 0.03;
        }
        if(this.dy > 0){
          this.dy = 0;
          this.done = true;
        }
      }
      if(aim < 0){
        if(this.dx > 0){
          this.dx = this.dx + 0.03;
        }
        if(this.dy < 0 && !this.done){
          this.dy = this.dy + 0.03;
        }
        if(this.dy > 0){
          this.dy = 0;
          this.done = true;
        }
      }
    }
  }
}

//variables
let state;
let startMusic;
let ballLogo;
let homeScreen;
let startButton;
let startButtonDown;

//just for topview
let ballArray = [];
let golfBall;
let aim = -1;
let power = -5;

//just for terrain

function preload(){
  //startMusic = loadSound(assets/nameofsonghere);
  homeScreen = loadImage("assets/golfhomescreen.png");
  startButton = loadImage("assets/golfballlogo.png");
  startButtonDown = loadImage("assets/golfballlogodown.png");
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
  else if(state === 4 && mouseY > 600 && mouseX > 250 && mouseX < 450){
    //
    let someBall = new Ball(350,650,power,aim);
    ballArray.push(someBall);
  }
  else if(state === 4 && mouseX < 100 && aim > -5){
    aim = aim - 0.25;
  }
  else if(state === 4 && mouseX > 600 && aim < 5){
    aim = aim + 0.25;
  }
  else if(state === 5){
    //
  }
}

function keyPressed(){
  if(state === 4 && keyCode === 32){
    let someBall = new Ball(350,650,power,aim);
    ballArray.push(someBall);
  }
  else if(state === 4 && keyCode === 37 && aim > -5){
    aim = aim - 0.25;
  }
  else if(state === 4 && keyCode === 39 && aim < 5){
    aim = aim + 0.25;
  }
  else if(state === 4 && keyCode === 38 && power > -7){
    power = power - 0.2;
  }
  else if(state === 4 && keyCode === 40 && power < -0.5){
    power = power + 0.2;
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
  image(homeScreen, 0, 0, 700, 700);
  if (state === 0 && mouseX > 250 && mouseX < 500 && mouseY < 650 && mouseY > 300){
    image(startButtonDown, 250, 360, 200, 210);
  }
  else {
    image(startButton, 250, 360, 200, 210);
  }
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
  let tee = new Ball(350, 650, 0, 0);
  tee.show();
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
