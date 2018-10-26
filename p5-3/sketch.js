// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let anArray = [];
let division;
let difficulty;
let next = [];

function setup() {
  createCanvas(750,750);
  division = 32;
  difficulty = 0.9;//between 0 and 1(easy and impossible)
  for(let t = 0; t < division; t++){
    anArray[t] = [];
  }
  for(let e = 0; e < division; e++){
    next[e] = [];
  }
  generate();
}

function mousePressed(){
  let x = floor(mouseX / (width / division));
  let y = floor(mouseY / (height / division));
  if (anArray[x][y] === 1){
    anArray[x][y] = 0;
  }
  else if (anArray[x][y] === 0){
    anArray[x][y] = 1;
  }
}

function keyTyped(){
  if(key === "r"){
    generate();
  }
  if(key === " "){
    nextGen();
  }
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
  let next = [];
  for (let g = 0; g < division; g++){
    next[g] = [];
  }

  //loop through grid
  for(let y = 0; y < division; y++){
    for(let x = 0; x < division; x++){

      let friends = 0;

      for (let p = -1; p <= 1; p++) {
        for (let o = -1; o <= 1; o++){
          if(x+p >= 0 && x+p < division && y+o >= 0 && y+o < division){
            friends += anArray[y + o][x + p];
          }
        }
      }

      friends -= anArray[y][x];

      //apply rules
      if(anArray[y][x] === 1){ //alive
        if(friends === 2 || friends === 3){
          next[y][x] = 1;
        }
        else {
          next[y][x] = 0;
        }
      }
      if(anArray[y][x] === 0){//dead
        if(friends === 3 || friends === 5 || friends === 6){
          next[y][x] = 1;
        }
        else {
          next[y][x] = 0;
        }
      }
    }
  }
  anArray = next;
}

function draw() {
  for(let i = 0; i < division; i++){
    for(let j = 0; j < division ; j++){
      noStroke();
      if(anArray[i][j] === 1){
        fill(0,255,0);
      }
      else{
        fill(37,14,3);
      }
      rect(i*(width/division),j*(height/division),width/division,height/division);
    }
  }
}
