// Cancerous Pong
// Michael
// Today
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let ballPosX;
let ballPosY;
let dx;
let rectWidth;


function setup() {
  createCanvas(windowWidth, windowHeight);
  ballPosX = width/2;
  dx = 10;
  rectWidth = 50;
}

function draw() {
  background(255,0,0);
	let paddleX = mouseX;
	let paddleY = mouseY;
	let ballPosY = 400;
	//check if hitting left paddle
	if(abs(paddleY - ballPosY) <= 100 && abs(50 - ballPosX) <= 20){
		paddleCollision()
	}
  //move rectangle
  ballPosX += dx;

  //check if hitting wall
  if(ballPosX > width - 50|| ballPosX < 0 || ballPosX === mouseX && ballPosX === mouseY) {
    dx = dx * -1;
		console.log("SPASM")
  }
	function paddleCollision() {
		dx = dx * -1;
		console.log("RAM")
	}


  //display rectangle
  fill(0,255,0);
  rect(ballPosX, ballPosY, rectWidth, rectWidth);

  //display and control left
  rect(50, mouseY, 20, 150);
}
