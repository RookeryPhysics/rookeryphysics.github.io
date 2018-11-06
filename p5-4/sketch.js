// Memory Tile Game
// Michael McGee
// 29/10/2018
//
// Extra for Experts:
// Really just took this project to "the next level".
//

let state;
let randomArray = [];
let newArray = [];
let division;
let randomness;
let count;
let numberCorrect;
let roundOver;
let secretArray = [];
let otherSecretArray = [];
let dead;
let danger;

function preload(){
  dead = loadImage("assets/dead.jpg");
  danger = loadImage("assets/danger.jpg");
}

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
    otherSecretArray[i] = [];
  }
  secretArray = [[1,1,0,1,1,1],[1,1,0,1,0,0],[0,0,0,0,0,1],[0,0,0,0,1,0],[1,0,1,1,1,1],[1,1,1,1,0,0]];
  otherSecretArray = [[1,0,1,1,0,0],[1,0,0,1,0,0],[1,1,1,1,1,1],[0,1,0,1,0,1],[0,1,1,1,1,1],[0,0,0,0,1,0]];
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
  if(state === 0 && keyCode === 79){
    randomArray = otherSecretArray;
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
      background(0,255,255);
      displayRandomGrid();
    }
    else if(count >= 1){
      state = 2;
    }
  }
  if(state === 2){
    background(0,255,255);
    displayNewArray();
  }
  if(state === 3){
    score();
  }
}

//displays the start screen, options, and explains how to play the game
function startScreen(){
  background(0,255,255);
  textSize(20);
  text("Click anywhere to begin.", 20, 40);
  text("Memorize the grid in the given time.", 20, 70);
  text("Next recreate the original grid.", 20, 100)
  text("Press enter to submit the completed grid.", 20, 130);
  image(dead, 100, 300, width/division, height/division);
  image(danger, 400, 300, width/division, height/division);
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
        image(danger, w*(width/division), e*(height/division), width/division, height/division);
      }
      else{
        image(dead, w*(width/division), e*(height/division), width/division, height/division);
      }
    }
  }
}

function displayNewArray(){
  for(let w = 0; w < division; w++){
    for(let e = 0; e < division; e++){
      if(newArray[w][e] === 1){
        image(danger, w*(width/division), e*(height/division), width/division, height/division);
      }
      else{
        image(dead, w*(width/division), e*(height/division), width/division, height/division);
      }
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
  fill(0,255,0);
  rect(0, 0, 420, 150);
  fill(148,0,211);
  textSize(25);
  text("YOU GOT THE MAXIMUM SCORE!", 20, 20);
  text("PRESS SPACE TO RESTART.", 20, 50);
  roundOver = true;
}

function showScore(numberCorrect){
  fill(0,255,0);
  rect(0, 0, 420, 150);
  fill(148,0,211);
  textSize(25);
  text("YOU FAILED!", 20, 20);
  text("SCORE WAS " + str(numberCorrect) + "/" + str(division*division), 20, 50);
  text("PRESS SPACE TO RESTART.", 20, 80);
  roundOver = true;
}
