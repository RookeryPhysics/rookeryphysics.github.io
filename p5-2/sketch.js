// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let ball;
let secondBall;
let thirdBall;
let fourthBall;
let fifthBall;
let g;

function setup() {
  createCanvas(windowWidth, windowHeight);
  g = 0.1;
  ball = {
    x: width / 2,
    y: height / 2,
    radius: 25,
    dx: random(-5, 5),
    dy: random(-5, 5)
  };
  secondBall = {
    x: width / 2 + 100,
    y: height / 2,
    radius: 25,
    dx: random(-5, 5),
    dy: random(-5, 5)
  };
  thirdBall = {
    x: width / 2 - 150,
    y: height / 2,
    radius: 25,
    dx: random(-5, 5),
    dy: random(-5, 5)
  };
  fourthBall = {
    x: width / 2 + 250,
    y: height / 2 + 100,
    radius: 25,
    dx: random(-5, 5),
    dy: random(-5, 5)
  };
  fifthBall = {
    x: width / 2 + 100,
    y: height / 2 - 150,
    radius: 25,
    dx: random(-5, 5),
    dy: random(-5, 5)
  };
}

function draw() {
  background(0,255,255);
  showBall(ball);
  showBall(secondBall);
  showBall(thirdBall);
  showBall(fourthBall);
  showBall(fifthBall);
  moveBall(ball);
  moveBall(secondBall);
  moveBall(thirdBall);
  moveBall(fourthBall);
  moveBall(fifthBall);
  gravity(ball);
  gravity(secondBall);
  gravity(thirdBall);
  gravity(fourthBall);
  gravity(fifthBall);
  textSize(50);
  fill(0,0,255);
  text("YOU CAN DO IT(Get a ball to the divine platform)", windowWidth / 7, windowHeight - 60);
  showPlatform();
}

function gravity(someBall){
  someBall.dy += g;
}

function showBall(someBall){
  fill(0);
  ellipse(someBall.x, someBall.y, someBall.radius*2, someBall.radius*2);
}

function moveBall(someBall){
  someBall.x += someBall.dx;
  someBall.y += someBall.dy;
  if (someBall.y > height - someBall.radius || someBall.y < 0 + someBall.radius){
    someBall.dy *= -1;
  }
  if (someBall.x > width - someBall.radius || someBall.x < 0 + someBall.radius){
    someBall.dx *= -1;
  }
}

function mousePressed(){
  ball.dx = random(-5, 5);
  ball.dy = random(-5, 5);
  secondBall.dx = random(-5, 5);
  secondBall.dy = random(-5, 5);
  thirdBall.dx = random(-5, 5);
  thirdBall.dy = random(-5, 5);
  fourthBall.dx = random(-5, 5);
  fourthBall.dy = random(-5, 5);
  fifthBall.dx = random(-5, 5);
  fifthBall.dy = random(-5, 5);
}

function showPlatform(){
  fill(255);
  noStroke();
  rect(windowWidth / 2 - 150, 100, 200, 30);
}
