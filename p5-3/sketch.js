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
  let x = floor(mouseX / (600 / division));
  let y = floor(mouseY / (600 / division));
  if (anArray[x][y] === 1){
    anArray[x][y] = 0;
  }
  else if (anArray[x][y] === 0){
    anArray[x][y] = 1;
  }
}

function setup() {
  createCanvas(600,600);
  division = 10;
  difficulty = 0.1;//between 0 and 1(easy and impossible)
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

function nextGen(){
  for(let i = 1; i < division + 1; i++){
    for(let j = 1; j < division + 1; j++){
      let friends = 0;
      let life;
      if(anArray[i][j] === anArray[i + 1][j] && anArray[i][j] === 1){
        friends++;
      }
      if(anArray[i][j] === anArray[i + 1][j + 1] && anArray[i][j] === 1){
        friends++;
      }
      if(anArray[i][j] === anArray[i+1][j-1] && anArray[i][j] === 1){
        friends++;
      }
      if(anArray[i][j] === anArray[i][j+1] && anArray[i][j] === 1){
        friends++;
      }
      if(anArray[i][j] === anArray[i][j-1] && anArray[i][j] === 1){
        friends++;
      }
      if(anArray[i][j] === anArray[i - 1][j + 1] && anArray[i][j] === 1){
        friends++;
      }
      if(anArray[i][j] === anArray[i-1][j] && anArray[i][j] === 1){
        friends++;
      }
      if(anArray[i][j] === anArray[i-1][j-1] && anArray[i][j] === 1){
        friends++;
      }
      if(friends < 2){
        anArray[i][j] = 0;
      }
      else if(friends > 1 && friends < 4){
        anArray[i][j] = 1;
      }
      else if(friends > 3){
        anArray[i][j] = 0;
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
