// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Ball {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.radius = 25;
    this.dx = random(-10, 10);
    this.dy = random(-10, 10);
    this.color = color(random(255), random(255), random(255), 120);
    this.isCollide = false;
  }

  display(){
    noStroke();
    if(this.isCollide){
      fill(255,0,0,255);
    }
    else{
      fill(this.color);
    }
    ellipse(this.x, this.y, this.radius*2, this.radius*2);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.y <= 0 + this.radius || this.y >= height - this.radius) {
      this.dy *= -1;
    }
    if (this.x <= 0 + this.radius || this.x >= width - this.radius) {
      this.dx *= -1;
    }
  }

  collision(otherBall, time){
    if (dist(this.x,this.y,otherBall.x,otherBall.y) <= this.radius + otherBall.radius){
      this.isCollide = true;
      otherBall.isCollide = true;
      let tempDx = this.dx;
      let tempDy = this.dy;
      this.dx = otherBall.dx;
      this.dy = otherBall.dy;
      otherBall.dx = tempDx;
      otherBall.dy = tempDy;
    }
  }
}

let ballArray = [];
let time;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  let someBall = new Ball(mouseX, mouseY);
  ballArray.push(someBall);
}

function draw() {
  background(0);
  time = time + 0.01;
  for (let i=ballArray.length-1; i >= 0; i--){
    ballArray[i].isCollide = false;
    for (let j=ballArray.length-1; j >= 0; j--){
      if(i !== j){
        //dont check collision against itself
        ballArray[i].collision(ballArray[j], 0);
      }
    }
    ballArray[i].update();
    ballArray[i].display();
  }
}
