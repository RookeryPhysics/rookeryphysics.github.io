// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Ball {
  constructor(x, y, infector){
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.dx = random(-10, 10);
    this.dy = random(-10, 10);
    this.color = color(0,255,0,255);
    this.isCollide = false;
    this.infector = infector;
    this.hits = 0;
  }

  display(){
    noStroke();
    if(this.isCollide){
      fill(255,0,0,255);
    }
    else{
      if(this.infector == true){
        fill(255,0,0,255);
      }
      else{
        fill(this.color);
      }
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

  wallCollide(){
    if(this.y>50){
      if(this.x >= windowWidth/2-this.radius && this.x < windowWidth/2){
        this.dx *= -1;
      }
      if(this.x <= windowWidth/2+this.radius && this.x > windowWidth/2){
        this.dx *= -1;
      }
    }
  }

  wallCollideTwo(){//0,windowHeight/2-10,windowWidth,10
    if(this.y >= windowHeight/2-10-this.radius && this.y < windowHeight/2-10){
      this.dy *= -1;
    }
    if(this.y <= windowHeight/2-10+this.radius && this.y > windowHeight/2-10){
      this.dy *= -1;
    }
  }

  check(){
    if(this.infector == true){
      return 1;
    }
    else{
      return 0;
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
      if(otherBall.infector == true && otherBall.hits<5){
        this.infector = true;
        otherBall.hits++;
      }
    }
  }
}

let ballArray = [];
let time;
let state;
let infected;
let notInfected;
let total;

function setup() {
  createCanvas(windowWidth, windowHeight);
  state = 0;
  infected = 0;
  notInfected = 0;
  total = 0;
}

function mousePressed(){
  let someBall = new Ball(mouseX, mouseY, false);
  ballArray.push(someBall);
}

function keyPressed(){
  let someBall = new Ball(mouseX, mouseY, true);
  ballArray.push(someBall);
}

function draw() {
  stateLord();
}

function stateLord() {
  if(state == 0){
    systemOne();
  }
  else if(state == 1){
    systemTwo();
  }
  else if(state == 2){
    systemThree();
  }
}

function systemOne(){
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

function systemTwo(){
  background(0);
  displayWall();
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
    ballArray[i].wallCollide();
    ballArray[i].display();
  }
}

function systemThree(){
  background(0);
  displayWall();
  displayWallTwo();
  time = time + 0.01;
  for (let i=ballArray.length-1; i >= 0; i--){
    ballArray[i].isCollide = false;
    for (let j=ballArray.length-1; j >= 0; j--){
      if(i !== j){
        ballArray[i].collision(ballArray[j], 0);
      }
    }
    ballArray[i].update();
    ballArray[i].wallCollide();
    ballArray[i].wallCollideTwo();
    ballArray[i].display();
  }
}

function displayWall(){
  fill(100);
  rect(windowWidth/2-10,50,10,windowHeight);
}

function displayWallTwo(){
  fill(100);
  rect(0,windowHeight/2-15,windowWidth,10);
}

function sweep(){
  infected = 0;
  total = 0;
  notInfected = 0;
  for(let i=0;i<ballArray.length;i++){
    if(ballArray[i].check() == 1){
      infected++;
      total++;
    }
    else if(ballArray[i].check() == 0){
      notInfected++;
      total++;
    }
  }
}
