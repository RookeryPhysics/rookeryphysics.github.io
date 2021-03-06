// Palm Tree Pong
// Michael McGee
// 13/09/2018
//
// Extra for Experts:
// -Made palm tree fronds with p5js shapes, a loop, and ellipses
// -Created a score display on screen
// -Made game run fluidly
// -Made it functional for multiple screen sizes
// -Made the contents of the draw loop contain clean and basic functions
// -Added a back button to return to main project page

//variables
let ballPosX;
let ballPosY;
let dx;
let rectWidth;
let distFromLeft;
let rightPaddlePos;
let leftScore;
let rightScore;
let leftWins;
let rightWins;
let ballWidth;

//setup function
function setup() {
  createCanvas(windowWidth, windowHeight);
  ballPosX = width/2; //starts ball in middle of screen
  dx = 27; //speed of ball
  ballWidth = 50; //size of ball
  distFromLeft = windowWidth - 90;
  rightPaddlePos = 50;
  leftScore=0;
  rightScore=0;
  leftWins=0;
  rightWins=0;
  ballPosY = 100;
  alert("Use mouse to control left palm. \nUse up/down arrow keys to control right palm. \nHit the coconut with the palm fronds. \nScore on the opposing side to get points. \nPress F11 to enter fullscreen. \nFunctional on 1600x900 and 1920x1080.");
}

//displays the score and wins
function scoreDisplay(){
  fill(0,0,0);
  textSize(20);
  text("CHINESE WINDMILL PALM: " + str(leftScore), 200, 100, 400, 200);
  text("CANARY ISLAND DATE PALM: "+ str(rightScore), 1100, 100, 400, 200);
  textSize(30);
  text("WINS: " + str(leftWins), 275, 60, 400, 200);
  text("WINS: " + str(rightWins), 1190, 60, 400, 200);
}

//checks if ball is colliding with paddle and sends ball to random y position if so
function paddleCollisionCheck(){
  let paddleY = mouseY;
  if(abs(paddleY - ballPosY) <= 100 && abs(50 - ballPosX) <= 20){
    paddleCollision();
    ballPosY = random(700);
  }
  if(abs(rightPaddlePos - ballPosY) <= 100 && abs(distFromLeft - ballPosX) <= 20){
    paddleCollision();
    ballPosY = random(700);
  }
}

//changes ball direction on collision
function paddleCollision() {
  dx = dx * -1;
}

//draws the date palm fronds
function drawFrondsRight(xPos, yPos){
  translate(xPos, yPos);
  noStroke();
  for (let i = 0; i < 10; i ++) {
    ellipse(5, 35, 10, 50);
    rotate(PI/5);
  }
}

//checks if colliding with wall and changes ball direction if so
function wallCollisionCheck(){
  if(ballPosX > width - 50|| ballPosX < 0 || ballPosX === mouseX && ballPosX === mouseY) {
    dx = dx * -1;
    if(ballPosX < 100){
      rightScore += 1;
      console.log("Right(Canary Island Date Palm) score is " + rightScore);
      if(rightScore===10){
        rightScore = 0;
        leftScore = 0;
        rightWins += 1;
      }
      background(0,255,0);
    }
    if(ballPosX > 200){
      leftScore +=1;
      console.log("Left(Chinese Windmill Palm) score is" + leftScore);
      if(leftScore===10){
        leftScore = 0;
        rightScore = 0;
        leftWins += 1;
      }
      background(0,0,255);
    }
  }
}

//draws left paddle and palm fronds
function leftPaddle(){
  fill(139,69,19);
  rect(50, mouseY, 20, 150);
  fill(0,255,0);
  triangle(12, mouseY-60, 112, mouseY-60, 62, mouseY+10);
  triangle(70, mouseY+10, 140, mouseY+55, 140, mouseY-30);
  triangle(50, mouseY+10, 0, mouseY+40, 0, mouseY-30);
}

//draws right paddle
function rightPaddle(){
  if(keyIsDown(38)){
    rightPaddlePos = rightPaddlePos - 22;
  }
  if(keyIsDown(40)){
    rightPaddlePos += 22;
  }
  fill(139,69,19);
  rect(distFromLeft, rightPaddlePos, 20, 150);
  fill(0,255,0);
  drawFrondsRight(distFromLeft + 15, rightPaddlePos - 30);
  if(rightPaddlePos < 0){
    rightPaddlePos = 0;
  }
  if(rightPaddlePos > 800){
    rightPaddlePos = 800;
  }
}

//makes the magic happen
function draw() {
  background(0,255,255);
  scoreDisplay();
  paddleCollisionCheck();
  //display coconut ball
  fill(139,69,19);
  ellipse(ballPosX, ballPosY, ballWidth, ballWidth);
  //move ball
  ballPosX += dx;
  wallCollisionCheck();
  leftPaddle();
  rightPaddle();
}
