// World Star Golf
// Ethan Church and Mike McGee
// 5/12/2018
//
//Ethan did all of the graphics, compiled the music and assets, positioned graphics and buttons, made buttons highlighted when hovered over, game layout, indicators, and everything that looks aesthetic(with much input from Michael).
//Michael did all of the collision detection and physics, some surprisingly forgiving mathematics(averages of the elements of arrays, rounding, basic addition, ect...), created the state system, wrote a variety of functions(with much input from Ethan).
//
// Extra for Experts:
// -created a massive collection of amazing graphics
// -used multiple classes which influence eachother
// -created a basic shop/inventory system
// -collision detection
// -included an element of randomness in the gameplay


class Ball {
  constructor(x,y,power,aim,holeX,holeY){
    this.x = x;
    this.y = y;
    this.aim = aim;
    this.dx = aim;
    this.dy = power;
    this.radius = 7;
    this.color = getColor();
    this.done = false;
    this.utterCompletion = false;
    this.holeX = holeX;
    this.holeY = holeY;
  }
  //displays golf ball
  show(){
    if(this.utterCompletion === true){
      noStroke();
    }
    else{
      strokeWeight(1);
      stroke(0);
    }
    fill(this.color);
    ellipse(this.x, this.y, this.radius*2, this.radius*2);
  }

  //updates position of golf ball according to speed and friction
  update(){
    if(!this.done){
      this.x += this.dx;
      this.y += this.dy;
      if(this.aim > 0){
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
      if(this.aim === 0){
        if(this.dy < 0 && !this.done){
          this.dy = this.dy + 0.03;
        }
        if(this.dy > 0){
          this.dy = 0;
          this.done = true;
        }
      }
      if(this.aim < 0){
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

  //check if golfball is in the hole, add score, alert function call
  checkHole(){
    if(this.done === false && this.utterCompletion === false && this.x > this.holeX - 22 && this.x < this.holeX + 22 && this.y > this.holeY - 22 && this.y < this.holeY + 22){
      this.dx = 0;
      this.dy = 0;
      this.done = true;
      score++;
      return true;
    }
  }

  vanish(){
    this.utterCompletion = true;
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
let gameMusic;
let ballLogo;
let homeScreen;
let startButton, startButtonDown;
let altitudeMode;
let godMode;
let modeSwitcher;
let inSound;
let soundState;
let started;
let gameStarted;
let shopButton;
let shop;
let ballType;
let holeType;
let ballCount;
let ballCountArray = [];

//just for topview
let ballArray = [];
let timeArray = [];
let golfBall;
let aim;
let power;
let allegedValueChanger, allegedValueDeranger;
let score;
let golfBackground;
let instructionsScreen;
let turnRight,turnLeft,speedUp,slowDown;
let slightRandomizer, slightRandomizerY;
let howRandom;
let xPos;
let yPos;
let aimIndicator;

const maxAim = 4;

//just for terrain
let x;
let time;
let rects = [];
let rectNumber;
let rectWidth;
let toBeMade;

function preload(){
  inSound = loadSound("assets/fallsinhole.mp3");
  startMusic = loadSound("assets/startscreen.mp3");
  gameMusic = loadSound("assets/golfBackgroundMusic.mp3");
  homeScreen = loadImage("assets/golfhomescreen.png");
  instructionsScreen = loadImage("assets/instructionsScreen.png");
  startButton = loadImage("assets/golfballlogo.png");
  startButtonDown = loadImage("assets/golfballlogodown.png");
  altitudeMode = loadImage("assets/altitudeButton.png");
  godMode = loadImage("assets/godModeClicked.png");
  modeSwitcher = loadImage("assets/modeSwitcher.png");
  golfBackground = loadImage("assets/golfBackground.png");
  toBeMade = loadImage("assets/tobecontinued.png");
  turnRight = loadImage("assets/turnRight.png");
  turnLeft = loadImage("assets/turnLeft.png");
  speedUp = loadImage("assets/speedUp.png");
  slowDown = loadImage("assets/slowDown.png");
  shopButton = loadImage("assets/shopButton.png");
  shop = loadImage("assets/shop.png");
  aimIndicator = loadImage("assets/protractor.png");
}

function setup() {
  createCanvas(700, 700);
  time = 0;
  rectNumber = 50;
  rectWidth = 700 / rectNumber + 5;
  generateRectangles();
  state = 0;
  soundState = 0;
  started = false;
  gameStarted = false;
  aim = 0;
  power = -4;
  ballType = 0;
  holeType = 0;
  howRandom = 0.5;
  ballCount = 0;
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

//runs when mouse is pressed
function mousePressed(){
  if(state === 0 && mouseX > 250 && mouseX < 500 && mouseY < 650 && mouseY > 300){
    state = 1;
    inSound.play();
    soundState = 1;
  }
  else if(state === 1 && mouseX >= 50 && mouseY >= 100 && mouseX <= 650 && mouseY <= 350){
    state = 2;
    inSound.play();
  }
  else if(state === 1 && mouseX >= 50 && mouseY >= 450 && mouseX <= 650 && mouseY <= 650){
    state = 3;
    inSound.play();
  }
  else if(state === 2){
    state = 4;
  }
  else if(state === 3){
    state = 5;
  }
  else if(state === 4 && mouseX > 300 && mouseX < 400 && mouseY > 300 && mouseY < 400){
    shootBall();
  }
  else if(state === 4 && mouseX >= 0 && mouseY >= 270 && mouseX <= 25 && mouseY <= 430 && aim > -maxAim){
    aim = aim - 0.25;
  }
  else if(state === 4 && mouseX >= 674 && mouseY >= 270 && mouseX <= 700 && mouseY <= 430 && aim < maxAim){
    aim = aim + 0.25;
  }
  else if(state === 4 && mouseX >= 270 && mouseY >= 0 && mouseX <= 430 && mouseY <= 25 && power > -6){
    power = power - 0.2;
  }
  else if(state === 4 && mouseX >= 270 && mouseY >= 675 && mouseX <= 430 && mouseY <= 700 && power < -0.5){
    power = power + 0.2;
  }
  else if(state === 4 && mouseX >= 453 && mouseY >= 0 && mouseX <= 613 && mouseY <= 25){
    state = 6;
  }
  else if(state === 5){
    generateRectangles();
  }
  else if(state === 6 && mouseX < 120 && mouseY < 120){
    state = 4;
  }
  //first row of shop
  else if(state === 6 && mouseX > 120 && mouseX < 217 && mouseY > 260 && mouseY < 355){
    ballType = 0;
  }
  else if(state === 6 && mouseX > 241 && mouseX < 338 && mouseY > 260 && mouseY < 355){
    ballType = 1;
  }
  else if(state === 6 && mouseX > 362 && mouseX < 459 && mouseY > 260 && mouseY < 355){
    ballType = 2;
  }
  else if(state === 6 && mouseX > 483 && mouseX < 580 && mouseY > 260 && mouseY < 355){
    ballType = 3;
  }
  //second row
  else if(state === 6 && mouseX > 120 && mouseX < 217 && mouseY > 375 && mouseY < 470){
    holeType = 0;
  }
  else if(state === 6 && mouseX > 241 && mouseX < 338 && mouseY > 375 && mouseY < 470){
    holeType = 1;
  }
  else if(state === 6 && mouseX > 362 && mouseX < 459 && mouseY > 375 && mouseY < 470){
    holeType = 2;
  }
  else if(state === 6 && mouseX > 483 && mouseX < 580 && mouseY > 375 && mouseY < 470){
    holeType = 3;
  }
}

//runs when key is pressed
function keyPressed(){
  if(state === 4 && keyCode === 32){
    shootBall();
  }
  //allows for alternative control option utilizing the arrow keys
  else if(state === 4 && keyCode === 37 && aim > -maxAim){
    aim = aim - 0.25;
  }
  else if(state === 4 && keyCode === 39 && aim < maxAim){
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
  musicalStateLord();
}

//controls what music to play
function musicalStateLord(){
  if(soundState === 0){
    if(!started){
      startMusic.play();
    }
    started = true;
  }
  else if(soundState === 1){
    if(!gameStarted){
      startMusic.stop();
      gameMusic.play();
    }
    gameStarted = true;
  }
}

//determines ball color based on ballType variable
function getColor(){
  if(ballType === 0){
    let x = color(255,255,255,255);
    return x;
  }
  else if(ballType === 1){
    let x = color(0,255,255,255);
    return x;
  }
  else if(ballType === 2){
    let x = color(255,0,0);
    return x;
  }
  else if(ballType === 3){
    let x = color(0);
    return x;
  }
}

//divides game into different states
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
    incomplete();
  }
  else if(state === 4){
    //topview start
    topView();
    displayPowerBar();
    displayAimIndicator();
    destroyerOfBalls();
    displayScore();
  }
  else if(state === 5){
    //terrain start
    terrain();
  }
  else if(state === 6){
    //shop
    showShop();
  }
}

//displays start screen and button
function startScreen(){
  image(homeScreen, 0, 0, 700, 700);
  if (state === 0 && mouseX > 250 && mouseX < 500 && mouseY < 650 && mouseY > 300){
    //changes look of button when hovered over
    image(startButtonDown, 250, 360, 200, 210);
  }
  else {
    //displays default button
    image(startButton, 250, 360, 200, 210);
  }
}

//display to pick gamemode/gamemode preview
function pickMode(){
  image(modeSwitcher, 0, 0, 700, 700);
  if (state === 1 && mouseX >= 50 && mouseY >= 450 && mouseX <= 650 && mouseY <= 650){
    image(altitudeMode, 45, 445, 612, 211);
  }
  else  if (state === 1 && mouseX >= 50 && mouseY >= 100 && mouseX <= 650 && mouseY <= 350){
    image(godMode, 45, 150, 612, 211);
  }
}

//runs godmode gamemode
function topView(){
  image(golfBackground, 0, 0, 700, 700);
  highlightButtons();
  let tee = new Ball(350, 650, 0, 0,xPos,yPos);
  tee.show();
  for (let i=ballArray.length-1; i >= 0; i--){
    ballArray[i].update();
    ballArray[i].show();
    if(ballArray[i].checkHole() === true){
      inSound.play();
      changeHolePosition();
      ballCountArray.push(ballCount);
      ballCount = 0;
      aim = 0;
      power = -4;
    }
    if(timeArray[i].isDone() === true){
      ballArray[i].vanish();
    }
  }
}

//shows shop button and highlights buttons when hovered over
function highlightButtons(){
  if(state === 4){
    image(shopButton,450,0,162.5,28.5);
  }
  if (state === 4 && mouseX >= 0 && mouseY >= 270 && mouseX <= 25 && mouseY <= 430){
    image(turnLeft, 0, 267.5, 28.5 ,162.5);
  }
  else if (state === 4 && mouseX >= 674 && mouseY >= 270 && mouseX <= 700 && mouseY <= 430){
    image(turnRight, 671, 269, 28.5 ,162.5);
  }
  else if (state === 4 && mouseX >= 270 && mouseY >= 0 && mouseX <= 430 && mouseY <= 25){
    image(speedUp, 267, 0,  162.5, 28.5);
  }
  else if (state === 4 && mouseX >= 270 && mouseY >= 675 && mouseX <= 430 && mouseY <= 700){
    image(slowDown, 267, 671, 162.5, 28.5);
  }
}

//shoots golf ball
function shootBall(){
  aim = aim + slightRandomizer;
  power = power + slightRandomizerY;
  let someBall = new Ball(350,650,power,aim,xPos,yPos);
  ballArray.push(someBall);
  ballCount++;
  let someTimer = new Timer(4000);
  timeArray.push(someTimer);
  aim = aim - slightRandomizer;
  power = power - slightRandomizerY;
  slightRandomizer = random(-howRandom,howRandom);
  slightRandomizerY = random(-howRandom,howRandom);
}

//colors and displays snowy terrain
function terrain(){
  background(0,255,255);
  fill(255);
  noStroke();
  showTerrain();
}

//displays terrain
function showTerrain() {
  for(let i=0; i<rects.length; i++){
    rect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
  }
}

//generates a terrain
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

//displays power bar indicator
function displayPowerBar(){
  noFill();
  stroke(0);
  strokeWeight(5);
  rect(30, 420, 20, 250);
  strokeWeight(1);
  if(power > -1){
    //lowest power bar setting
    //empty
  }
  else if(power > -1.7){
    fill(0,255,255);
    rect(30,645,20,25);
  }
  else if(power > -2.4){
    fill(0,255,255);
    rect(30,620,20,50);
  }
  else if(power > -3.1){
    fill(255,255,0);
    rect(30,595,20,75);
  }
  else if(power > -3.8){
    fill(255,255,0);
    rect(30,570,20,100);
  }
  else if(power > -4.5){
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

//displays aim indicator
function displayAimIndicator(){
  image(aimIndicator,475,575,200,100);
  //middle aim
  if(aim === 0 || aim < 0.5 && aim > -0.5){
    strokeWeight(5);
    stroke(255,0,0);
    line(575,675,575,575);
  }
  //right aim
  else if(aim > 0 && aim < 1){
    strokeWeight(5);
    stroke(255,0,0);
    line(575,675,600,580);
  }
  else if(aim >= 1 && aim < 2){
    strokeWeight(5);
    stroke(255,0,0);
    line(575,675,625,590);
  }
  else if(aim >= 2 && aim < 3){
    strokeWeight(5);
    stroke(255,0,0);
    line(575,675,650,610);
  }
  else if(aim >= 3 && aim < 4){
    strokeWeight(5);
    stroke(255,0,0);
    line(575,675,665,635);
  }
  else if(aim >= 4){
    strokeWeight(5);
    stroke(255,0,0);
    line(575,675,670,650);
  }
  //left aim
  else if(aim < 0 && aim > -1){
    strokeWeight(5);
    stroke(255,0,0);
    line(575,675,550,580);
  }
  else if(aim <= -1 && aim > -2){
    strokeWeight(5);
    stroke(255,0,0);
    line(575,675,525,590);
  }
  else if(aim <= -2 && aim > -3){
    strokeWeight(5);
    stroke(255,0,0);
    line(575,675,500,610);
  }
  else if(aim <= -3 && aim > -4){
    strokeWeight(5);
    stroke(255,0,0);
    line(575,675,485,635);
  }
  else if(aim <= -4){
    strokeWeight(5);
    stroke(255,0,0);
    line(575,675,480,650);
  }
}

//displays hole
function destroyerOfBalls(golfballs){
  stroke(0);
  let c;
  if(holeType === 0){
    c = color(0);
  }
  else if(holeType === 1){
    c = color(255,255,255,255);
  }
  else if(holeType === 2){
    c = color(0,255,255,255);
  }
  else if(holeType === 3){
    c = color(150,0,150,255);
  }
  fill(c);
  ellipse(xPos,yPos,45,45);
}

//displays score
function displayScore(){
  //displays number of ball in hole
  noStroke();
  textSize(40);
  text(str(score),20,40);
  textSize(20);
  text("Score",65,40);
  //displays number of balls
  textSize(40);
  text(str(ballCount),20,90);
  textSize(20);
  text("Strokes",65,90);
  //displays average strokes to hole
  if(ballCountArray.length > 0){
    textSize(40);
    text(str(Math.round(ballCountAverage())),20,140);
    textSize(20);
    text("AVG Strokes",65,140);
  }
}

//calculates and returns an average for all elements in the ballCountArray
function ballCountAverage(){
  let average = 0;
  for(let c = 0; c < ballCountArray.length; c++){
    average = average + ballCountArray[c];
  }
  average = average / ballCountArray.length;
  return average;
}

//changes the hole position
function changeHolePosition(){
  allegedValueChanger = random(-200,200);
  allegedValueDeranger = random(-50, 70);
  xPos = 335 + allegedValueChanger;
  yPos = 100 + allegedValueDeranger;
}

//displays shop and shop options
function showShop(){
  image(shop,0,0,700,700);
  fill(255);
  ellipse(170,310,15,15);
  fill(0,255,255);
  ellipse(291,310,15,15);
  fill(255,0,0);
  ellipse(412,310,15,15);
  fill(0);
  ellipse(533,310,15,15);
  ellipse(170,428,40,40);
  fill(255);
  ellipse(291,428,40,40);
  fill(0,255,255);
  ellipse(412,428,40,40);
  fill(150,0,150);
  ellipse(533,428,40,40);
}

//displays instruction screen
function instructions(){
  image(instructionsScreen,0,0,700,700);
}

//displays incomplete screen
function incomplete(){
  image(toBeMade,0,0,700,700);
}
