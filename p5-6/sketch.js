// World Star Golf
// Ethan Church and Mike McGee
// Date
//
// Extra for Experts:
// -used multiple classes

class Ball{
  constructor(x,y,power,aim,holeX,holeY){
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
  checkHole(){
    if(this.x > holeX - 22 && this.x < holeX + 22 && this.y > holeY - 22 && this.y < holeY + 22){
      //THIS SHOULD MAKE BALL OG INTO HOLE AND GIVE SCORE
    }
  }
  vanish(){
    this.color = color(255,255,255,0);
  }
}

class Timer {
  constructor(waitTime) {
    this.beginTime = millis();
    this.length = waitTime;
  }

  isDone() {
    if (millis() >= this.beginTime + this.length) {
      return true;
    }
    else {
      return false;
    }
  }

  reset(waitTime) {
    this.beginTime = millis();
    this.length = waitTime;
  }
}

//variables
let state;
let startMusic;
let ballLogo;
let homeScreen;
let startButton;
let startButtonDown;
let altitudeMode;
let godMode;
let modeSwitcher;

//just for topview
let ballArray = [];
let timeArray = [];
let golfBall;
let aim;
let power;
let leftB, rightB, topB, botB;
let atHole;
let allegedValueChanger;
let allegedValueDeranger;
let score;
let golfBackground;
let turnRight,turnLeft,speedUp,slowDown;
let slightRandomizer, slightRandomizerY;
let howRandom;
let xPos;
let yPos;

//just for terrain

function preload(){
  //startMusic = loadSound(assets/nameofsonghere);
  homeScreen = loadImage("assets/golfhomescreen.png");
  startButton = loadImage("assets/golfballlogo.png");
  startButtonDown = loadImage("assets/golfballlogodown.png");
  altitudeMode = loadImage("assets/altitudeButton.png");
  godMode = loadImage("assets/godModeClicked.png");
  modeSwitcher = loadImage("assets/modeSwitcher.png");
  golfBackground = loadImage("assets/golfBackground.png");
  turnRight = loadImage("assets/turnRight.png");
  turnLeft = loadImage("assets/turnLeft.png");
  speedUp = loadImage("assets/speedUp.png");
  slowDown = loadImage("assets/slowDown.png");
}

function setup() {
  createCanvas(700, 700);
  state = 0;
  aim = -1;
  power = -5;
  howRandom = 0.5;
  allegedValueChanger = random(-200,200);
  allegedValueDeranger = random(-50, 70);
  slightRandomizer = random(-howRandom,howRandom);
  slightRandomizerY = random(-howRandom,howRandom);
  score = 0;
  xPos = 335 + allegedValueChanger;
  yPos = 100 + allegedValueDeranger;
}

//state relationships
//0,1,2,4,
//0,1,3,5,

function mousePressed(){
  if(state === 0 && mouseX > 250 && mouseX < 500 && mouseY < 650 && mouseY > 300){
    state = 1;
  }
  else if(state === 1 && mouseX >= 50 && mouseY >= 100 && mouseX <= 650 && mouseY <= 350){
    state = 2;
  }
  else if(state === 1 && mouseX >= 50 && mouseY >= 450 && mouseX <= 650 && mouseY <= 650){
    state = 3;
  }
  else if(state === 2){
    state = 4;
  }
  else if(state === 3){
    state = 5;
  }
  else if(state === 4 && mouseX >= 0 && mouseY >= 270 && mouseX <= 25 && mouseY <= 430){
    aim = aim - 0.25;
  }
  else if(state === 4 && mouseX >= 674 && mouseY >= 270 && mouseX <= 700 && mouseY <= 430){
    aim = aim + 0.25;
  }
  else if(state === 4 && mouseX >= 270 && mouseY >= 0 && mouseX <= 430 && mouseY <= 25){
    power = power - 0.2;
  }
  else if(state === 4 && mouseX >= 270 && mouseY >= 675 && mouseX <= 430 && mouseY <= 700){
    power = power + 0.2;
  }
  else if(state === 5){
    //
  }
}

function keyPressed(){
  if(state === 4 && keyCode === 32){
    aim = aim + slightRandomizer;
    power = power + slightRandomizerY;
    let someBall = new Ball(350,650,power,aim,xPos,yPos);
    ballArray.push(someBall);
    let someTimer = new Timer(4000);
    timeArray.push(someTimer);
    aim = aim - slightRandomizer;
    power = power - slightRandomizerY;
    slightRandomizer = random(-howRandom,howRandom);
    slightRandomizerY = random(-howRandom,howRandom);
  }
  else if(state === 4 && keyCode === 37 && aim > -5){
    aim = aim - 0.25;
  }
  else if(state === 4 && keyCode === 39 && aim < 5){
    aim = aim + 0.25;
  }
  else if(state === 4 && keyCode === 38 && power > -6){
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
    displayPowerBar();
    destroyerOfBalls();
    //displayGUI();
  }
  else if(state === 5){
    //terrain start
    terrain();
    //displayGUI();
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
  image(modeSwitcher, 0, 0, 700, 700);
  if (state === 1 && mouseX >= 50 && mouseY >= 450 && mouseX <= 650 && mouseY <= 650){
    image(altitudeMode, 45, 445, 612, 211);
  }
  else  if (state === 1 && mouseX >= 50 && mouseY >= 100 && mouseX <= 650 && mouseY <= 350){
    image(godMode, 45, 150, 612, 211);
  }
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
  image(golfBackground, 0, 0, 700, 700);
  highlightButtons();
  let tee = new Ball(350, 650, 0, 0,xPos,yPos);
  tee.show();
  for (let i=ballArray.length-1; i >= 0; i--){
    ballArray[i].update();
    ballArray[i].show();
    if(timeArray[i].isDone() === true){
      ballArray[i].vanish();
    }
  }
}

function highlightButtons(){
  if (state === 4 && mouseX >= 0 && mouseY >= 270 && mouseX <= 25 && mouseY <= 430){
    image(turnLeft, 0, 267.5, 28.5 ,162.5);
  }
  else if (state === 4 && mouseX >= 674 && mouseY >= 270 && mouseX <= 700 && mouseY <= 430){
    image(turnRight, 671, 269, 29 ,162.5);
  }
  else if (state === 4 && mouseX >= 270 && mouseY >= 0 && mouseX <= 430 && mouseY <= 25){
    image(speedUp, 267, 0,  162.5, 28.5);
  }
  else if (state === 4 && mouseX >= 270 && mouseY >= 675 && mouseX <= 430 && mouseY <= 700){
    image(slowDown, 267, 671, 162.5, 28.5);
  }
}

function terrain(){
  background(200,200,200);
  //
}

function playStartMusic(){
  //plays the music at the beginning of the game
}

function displayPowerBar(){
  noFill();
  strokeWeight(5);
  rect(30, 420, 20, 250);
  strokeWeight(1);
  if(power > -1){
    //lowest power bar setting
    //empty
  }
  else if(power > -1.7){
    //second powerbar setting
    fill(0,255,255);
    rect(30,645,20,25);
  }
  else if(power > -2.4){
    //third powerbar setting
    fill(0,255,255);
    rect(30,620,20,50);
  }
  else if(power > -3.1){
    //fourth power bar setting
    fill(255,255,0);
    rect(30,595,20,75);
  }
  else if(power > -3.8){
    //fifth
    fill(255,255,0);
    rect(30,570,20,100);
  }
  else if(power > -4.5){
    //sixth
    fill(255,255,0);
    rect(30,545,20,125);
  }
  else if(power > -5.2){
    fill(255, 165, 0);
    rect(30,520,20,150);
  }
  else if(power > -5.9){
    fill(255, 165, 0);
    rect(30,470,20,200);
  }
  else if(power > -7.5){
    fill(255,0,0);
    rect(30,420,20,250);
  }
}

function destroyerOfBalls(golfballs){
  fill(0,0,0);
  ellipse(xPos,yPos,45,45);
}
