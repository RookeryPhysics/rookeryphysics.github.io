// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let anArray = [];
let division;
let difficulty;

function mousePressed(){
  generate();
}

function setup() {
  createCanvas(700, 700);
  division = 60;
  difficulty = 0.2;//between 0 and 1(easy and impossible)
  for(let t = 0; t < division; t++){
    anArray[t] = [];
  }
  generate();
}

function generate(){
  for(let i = 0; i < division; i++){
    for(let j = 0; j < division; j++){
      anArray[i][j] = random(0,1);
      if(anArray[i][j] < difficulty){
        anArray[i][j] = 0;
      }
      else if(anArray[i][j] >= difficulty){
        anArray[i][j] = 1;
      }
    }
  }
}

function draw() {
  for(let i = 0; i < division; i++){
    for(let j = 0; j < division ; j++){
      noStroke();
      fill(anArray[i][j] * 255);
      rect(i*(width/division),j*(height/division),width/division,height/division);
    }
  }
}
