// Palm Tree Palm
// Michael McGee
// 13/09/2018
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

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
let lastHitter;
let ballWidth;

//setup function
function setup() {
  createCanvas(1600, 900);
  ballPosX = width/2;
  dx = 27;
  ballWidth = 50;
  distFromLeft = windowWidth - 90;
  rightPaddlePos = 50;
  leftScore=0;
  rightScore=0;
  leftWins=0;
  rightWins=0;
  ballPosY = 100;
  lastHitter = 0;
  alert("Use mouse to control left palm and up/down arrow keys to control right palm. Hit the coconut with the palm fronds. Score on the opposing palm to get points.");
}

function draw() {
  background(0,255,255); //prevents screen from being layered in shapes
	let paddleY = mouseY;
  fill(0,0,0);
  textSize(20);
  text("CHINESE WINDMILL PALM: " + str(leftScore), 200, 100, 400, 200);
  text("CANARY ISLAND DATE PALM: "+ str(rightScore), 1100, 100, 400, 200);
  textSize(30);
  text("WINS: " + str(leftWins), 275, 60, 400, 200);
  text("WINS: " + str(rightWins), 1190, 60, 400, 200);
	//check if hitting left or right paddle
	if(abs(paddleY - ballPosY) <= 100 && abs(50 - ballPosX) <= 20){
		paddleCollision()
    ballPosY = random(700);
    lastHitter = 1;
	}
  if(abs(rightPaddlePos - ballPosY) <= 100 && abs(distFromLeft - ballPosX) <= 20){
    paddleCollision()
    ballPosY = random(700);
    lastHitter = 2;
  }
  //move rectangle
  ballPosX += dx;

  //check if hitting wall
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
	function paddleCollision() {
		dx = dx * -1;
	}

  function drawFrondsRight(xPos, yPos){
    translate(xPos, yPos);
    noStroke();
    for (var i = 0; i < 10; i ++) {
      ellipse(5, 35, 10, 50);
      rotate(PI/5);
    }
  }
  //display coconut ball
  fill(139,69,19);
  ellipse(ballPosX, ballPosY, ballWidth, ballWidth);

  //display and control left paddle
  fill(139,69,19);
  rect(50, mouseY, 20, 150);
  fill(0,255,0);
  triangle(12, mouseY-60, 112, mouseY-60, 62, mouseY+10);
  triangle(70, mouseY+10, 140, mouseY+55, 140, mouseY-30);
  triangle(50, mouseY+10, 0, mouseY+40, 0, mouseY-30);


  //display and control right paddle
  if(keyIsDown(38)){
    rightPaddlePos = rightPaddlePos - 22;
  }
  if(keyIsDown(40)){
    rightPaddlePos += 22;
  }
  fill(139,69,19);
  rect(distFromLeft, rightPaddlePos, 20, 150);
  fill(0,255,0);
  //rect(distFromLeft - 15, rightPaddlePos - 60, 55, 55);
  drawFrondsRight(distFromLeft + 15, rightPaddlePos - 30);
  if(rightPaddlePos < 0){
    rightPaddlePos = 0;
  }
  if(rightPaddlePos > 700){
    rightPaddlePos = 700;
  }
}
