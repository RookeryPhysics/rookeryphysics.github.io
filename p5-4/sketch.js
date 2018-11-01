// Memory Tile Game
// Michael McGee
// 29/10/2018
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// do this ^^^

let state;
let randomArray = [];
let newArray = [];
let division;
let randomness;
let count;
let numberCorrect;
let roundOver;
let secretArray = [];

function setup() {
  createCanvas(600, 600);
  division = 6;
  randomness = 0.5;
  state = 0;
  roundOver = false;
  numberCorrect = 0;
  count = 0;
  for(let i = 0; i < division; i++){
    randomArray[i] = [];
    newArray[i] = [];
    secretArray[i] = [];
  }
  secretArray = [[1,1,0,1,1,1],[1,1,0,1,0,0],[0,0,0,0,0,1],[0,0,0,0,1,0],[1,0,1,1,1,1],[1,1,1,1,0,0]];
  createBlankArray();
  generate();
}

function keyTyped(){
  if(state === 2 && keyCode === 13 && count > 1.3){
    state = 3;
  }
  if(state === 0 && keyCode === 13){
    state = 1;
  }
  if(state === 0 && keyCode === 32){
    randomArray = secretArray;
  }
  if(state === 3 && keyCode === 32){
    location = self.location;
  }
}

function draw() {
  loadState();
  count += 0.001;
}

function mousePressed(){
  if(state === 0){
    state = 1;
  }
  if(state === 2){
    let x = floor(mouseX / (width / division));
    let y = floor(mouseY / (height / division));
    if (newArray[x][y] === 1){
      newArray[x][y] = 0;
    }
    else if (newArray[x][y] === 0){
      newArray[x][y] = 1;
    }
  }
}

function createBlankArray(){
  for(let x = 0; x < division; x++){
    for(let y = 0; y < division; y++){
      newArray[x][y] = 0;
    }
  }
}

function loadState(){
  if(state === 0){
    startScreen();
  }
  if(state === 1){
    if(count < 0.5){
      displayRandomGrid();
    }
    else if(count >= 1){
      state = 2;
    }
  }
  if(state === 2){
    displayNewArray();
  }
  if(state === 3){
    //SCORE THE PLAYER IN THIS STATE
    score();
  }
}

//displays the start screen, options, and explains how to play the game
function startScreen(){
  background(0,255,255);
  textSize(20);
  text("Click to begin", 20, 40);
  text("Memorize the grid then recreate it.", 20, 70);
  text("Press enter to submit grid.", 20, 100);
}

function generate(){
  for(let x = 0; x < division; x++){
    for (let y = 0; y < division; y++){
      randomArray[x][y] = random(0,1);
      if(randomArray[x][y] < randomness){
        randomArray[x][y] = 0;
      }
      else if(randomArray[x][y] >= randomness){
        randomArray[x][y] = 1;
      }
    }
  }
}

function displayRandomGrid(){
  for(let w = 0; w < division; w++){
    for(let e = 0; e < division; e++){
      if(randomArray[w][e] === 1){
        fill(0,255,0);
      }
      else{
        fill(37,14,3);
      }
      rect(w*(width/division),e*(height/division),width/division,height/division);
    }
  }
}

function displayNewArray(){
  for(let w = 0; w < division; w++){
    for(let e = 0; e < division; e++){
      if(newArray[w][e] === 1){
        fill(0,255,0);
      }
      else{
        fill(37,14,3);
      }
      rect(w*(width/division), e*(height/division), width/division, height/division);
    }
  }
}

function score(){
  for(let w = 0; w < division; w++){
    for(let e = 0; e < division; e++){
      if(newArray[w][e] === randomArray[w][e]){
        numberCorrect++;
      }
    }
  }
  if(numberCorrect === division*division && !roundOver){
    maxScore();
  }
  else if(numberCorrect < division*division && !roundOver){
    showScore(numberCorrect);
  }
}

function maxScore(){
  fill(255,0,0);
  text("YOU GOT THE MAXIMUM SCORE!", 20, 20);
  text("PRESS SPACE TO RESTART.", 20, 50);
  roundOver = true;
}

function showScore(numberCorrect){
  fill(255,0,0);
  text("YOU FAILED!", 20, 20);
  text("SCORE WAS " + str(numberCorrect) + "/" + str(division*division), 20, 50);
  text("PRESS SPACE TO RESTART.", 20, 80);
  roundOver = true;
}
