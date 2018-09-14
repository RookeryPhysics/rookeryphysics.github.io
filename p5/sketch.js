// Palm Tree Palm
// Michael McGee
// 13/09/2018
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let ballPosX;
let ballPosY;
let dx;
let rectWidth;
let distFromLeft;
let leftPaddlePos;
let leftScore;
let rightScore;


function setup() {
  createCanvas(windowWidth, windowHeight);
  ballPosX = width/2;
  dx = 10;
  rectWidth = 50;
  distFromLeft = windowWidth - 90;
  leftPaddlePos = 50;
  leftScore=0;
  rightScore=0;
  ballPosY = 400;
}

function draw() {
  background(255,0,0);
	let paddleX = mouseX;
	let paddleY = mouseY;
	//check if hitting left or right paddle
	if(abs(paddleY - ballPosY) <= 100 && abs(50 - ballPosX) <= 20){
		paddleCollision()
    ballPosY = random(800);
	}
  if(abs(leftPaddlePos - ballPosY) <= 100 && abs(distFromLeft - ballPosX) <= 20){
    paddleCollision()
    ballPosY = random(800);
  }
  //move rectangle
  ballPosX += dx;

  //check if hitting wall
  if(ballPosX > width - 50|| ballPosX < 0 || ballPosX === mouseX && ballPosX === mouseY) {
    dx = dx * -1;
		if(ballPosX < 100){
      rightScore += 1;
      console.log("Right score is " + rightScore);
    }
    if(ballPosX > 200){
      leftScore +=1;
      console.log("Left score is" + leftScore);
    }
  }
	function paddleCollision() {
		dx = dx * -1;
	}

  //display rectangle
  rect(ballPosX, ballPosY, rectWidth, rectWidth);

  //display and control left paddle
  rect(50, mouseY, 20, 150);

  //display and control right paddle
  if(keyIsDown(38)){
    leftPaddlePos = leftPaddlePos - 20;
  }
  if(keyIsDown(40)){
    leftPaddlePos += 20;
  }
  rect(distFromLeft, leftPaddlePos, 20, 150)
}
