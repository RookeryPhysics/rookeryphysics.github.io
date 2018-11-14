// Gold Dust
// Mike McGee
// Today
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.dx = random(-10, 10);
    this.dy = random(-10, 10);
    this.transparency = 255;
    let which;
    if(which === 0){
      this.color = color(212, 175, 55, this.transparency);
    }
    else if(which === 1){
      this.color = color(255, 215, 0, this.transparency);
    }
    else if(which === 2){
      this.color = color(240, 230, 140, this.transparency);
    }
    else{
      this.color = color(218, 165, 32, this.transparency);
    }
  }
  display(){
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  }
  update(){
    this.transparency -= 5;
    this.color.setAlpha(this.transparency);
    this.x += this.dx;
    this.y += this.dy;
  }
}

let someParticle;
let fireworks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  someParticle = new Particle(width/2, height/2);

}

function mousePressed() {
  for (let i=0; i<100; i++){
    let which = random(0,3);
    let someParticle = new Particle(mouseX, mouseY);
    fireworks.push(someParticle);
  }
}

function draw() {
  background(0);
  for (let i=0; i<fireworks.length; i++){
    fireworks[i].update();
    fireworks[i].display();
  }
  fireworks.update();
  fireworks.display();
}
