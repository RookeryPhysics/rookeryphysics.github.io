// Memory Tile Game
// Michael McGee
// 7/11/2018
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
let illegalArray = [];
let illegalArrayTwo = [];
let illegalArrayThree = [];
let illegalArrayFour = [];
let illegalArrayFive = [];
let illegalArraySix = [];
let illegalArraySeven = [];
let illegalArrayEight = [];
let illegalArrayNine = [];
let dead;
let danger;

function preload() {
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
  for (let i = 0; i < division; i++) {
    randomArray[i] = [];
    newArray[i] = [];
    secretArray[i] = [];
    otherSecretArray[i] = [];
    illegalArray[i] = [];
    illegalArrayTwo[i] = [];
    illegalArrayThree[i] = [];
    illegalArrayFour[i] = [];
    illegalArrayFive[i] = [];
    illegalArraySix[i] = [];
    illegalArraySeven[i] = [];
    illegalArrayEight[i] = [];
    illegalArrayNine[i] = [];
  }
  secretArray = [
    [1, 1, 0, 1, 1, 1],
    [1, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 0],
    [1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 0]
  ];
  otherSecretArray = [
    [1, 0, 1, 1, 0, 0],
    [1, 0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1],
    [0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 0]
  ];

  //used for innapropriate shape detection
  illegalArray = [
    [0, 1, 0, 1, 1, 1],
    [0, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0, 1],
    [0, 1, 1, 1, 0, 1],
    [0, 0, 0, 0, 0, 0]
  ];
  illegalArrayTwo = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0]
  ];
  illegalArrayThree = [
    [0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 1],
    [0, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0, 1],
    [0, 1, 1, 1, 0, 1]
  ];
  illegalArrayFour = [
    [0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 1, 0],
    [1, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0],
    [0, 0, 1, 0, 1, 0],
    [1, 1, 1, 0, 1, 0]
  ];
  illegalArrayFive = [
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 1, 0],
    [0, 0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0, 0],
    [1, 0, 1, 1, 1, 0]
  ];
  illegalArraySix = [
    [0, 1, 1, 1, 0, 1],
    [0, 0, 0, 1, 0, 1],
    [0, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 0],
    [0, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0]
  ];
  illegalArraySeven = [
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1],
    [0, 0, 0, 1, 0, 1],
    [0, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 0],
    [0, 1, 0, 1, 1, 1]
  ];
  illegalArrayEight = [
    [1, 0, 1, 1, 1, 0],
    [1, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0],
    [0, 0, 1, 0, 1, 0],
    [1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0]
  ];
  illegalArrayNine = [
    [1, 1, 1, 0, 1, 0],
    [0, 0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0, 0],
    [1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0]
  ];

  createBlankArray();
  generate();
}

//called when a key is typed
function keyTyped() {
  if (state === 2 && keyCode === 13 && count > 1.3) {
    state = 3;
  }
  if (state === 0 && keyCode === 13) {
    state = 1;
  }
  if (state === 0 && keyCode === 79) {
    randomArray = otherSecretArray;
  }
  if (state === 0 && keyCode === 32) {
    randomArray = secretArray;
  }
  if (state === 3 && keyCode === 32) {
    //refreshes page to restart game
    location = self.location;
  }
}

function draw() {
  loadState();
  count += 0.001; //counts the time
}

//called when the mouse is pressed
function mousePressed() {
  if (state === 0) {
    state = 1;
    count = 0; //resets the time to prevent state skipping
  }
  if (state === 2) {
    let x = floor(mouseX / (width / division));
    let y = floor(mouseY / (height / division));
    if (newArray[x][y] === 1) {
      newArray[x][y] = 0;
    }
    else if (newArray[x][y] === 0) {
      newArray[x][y] = 1;
    }
  }
}

//creates a blank array for player to draw on
function createBlankArray() {
  for (let x = 0; x < division; x++) {
    for (let y = 0; y < division; y++) {
      newArray[x][y] = 0;
    }
  }
}

//calls the functions required to operate each state
function loadState() {
  if (state === 0) {
    startScreen();
  }
  if (state === 1) {
    if (count < 0.5) {
      background(0, 255, 255);
      displayRandomGrid();
    }
    else if (count >= 1) {
      state = 2;
    }
  }
  if (state === 2) {
    background(0, 255, 255);
    displayNewArray();
    stopNazis();
  }
  if (state === 3) {
    score();
  }
  if (state === 4) {
    kickPlayer();
  }
}

//displays the start screen, options, and explains how to play the game
function startScreen() {
  background(0, 255, 255);
  textSize(20);
  fill(0);
  text("Click anywhere to begin.", 20, 40);
  text("Memorize the grid in the given time.", 20, 70);
  text("Next recreate the original grid.", 20, 100);
  text("Press enter to submit the completed grid.", 20, 130);
  fill(255,0,0);
  text("NOW WITH STATE OF THE ART SWASTIKA DETECTION!", 20, 500);
  image(dead, 100, 300, width / division, height / division);
  image(danger, 400, 300, width / division, height / division);
}

//generates a random grid
function generate() {
  for (let x = 0; x < division; x++) {
    for (let y = 0; y < division; y++) {
      randomArray[x][y] = random(0, 1);
      if (randomArray[x][y] < randomness) {
        randomArray[x][y] = 0;
      }
      else if (randomArray[x][y] >= randomness) {
        randomArray[x][y] = 1;
      }
    }
  }
}

//displays the randomly generated grid
function displayRandomGrid() {
  for (let w = 0; w < division; w++) {
    for (let e = 0; e < division; e++) {
      if (randomArray[w][e] === 1) {
        image(danger, w * (width / division), e * (height / division), width / division, height / division);
      }
      else {
        image(dead, w * (width / division), e * (height / division), width / division, height / division);
      }
    }
  }
}

//displays the newArray which the player is able to edit
function displayNewArray() {
  for (let w = 0; w < division; w++) {
    for (let e = 0; e < division; e++) {
      if (newArray[w][e] === 1) {
        image(danger, w * (width / division), e * (height / division), width / division, height / division);
      }
      else {
        image(dead, w * (width / division), e * (height / division), width / division, height / division);
      }
    }
  }
}

//determines what is displayed at end of game, checks if player has even tried
function score() {
  let zeros = 0;
  for (let w = 0; w < division; w++) {
    for (let e = 0; e < division; e++) {
      if (newArray[w][e] === 0) {
        zeros++;
      }
      if (newArray[w][e] === randomArray[w][e]) {
        numberCorrect++;
      }
    }
  }
  if (numberCorrect === division * division && !roundOver) {
    maxScore();
  }
  else if (zeros === division * division && !roundOver) {
    youSuck();
  }
  else if (numberCorrect < division * division && !roundOver) {
    showScore(numberCorrect);
  }
}

//informs player that they have gotten the maximum score
function maxScore() {
  fill(0, 255, 0);
  rect(0, 0, 420, 150);
  fill(148, 0, 211);
  textSize(25);
  text("YOU GOT THE MAXIMUM SCORE!", 20, 20);
  text("PRESS SPACE TO RESTART.", 20, 50);
  roundOver = true;
}

//shows player their score if they failed
function showScore(numberCorrect) {
  fill(0, 255, 0);
  rect(0, 0, 420, 150);
  fill(148, 0, 211);
  textSize(25);
  text("YOU FAILED!", 20, 20);
  text("SCORE WAS " + str(numberCorrect) + "/" + str(division * division), 20, 50);
  text("PRESS SPACE TO RESTART.", 20, 80);
  roundOver = true;
}

//tells player that they suck if they don't try
function youSuck() {
  fill(0, 255, 0);
  rect(0, 0, 420, 150);
  fill(148, 0, 211);
  textSize(25);
  text("WOW YOU REALLY SUCK!", 20, 20);
  text("PRESS SPACE TO RESTART.", 20, 50);
  roundOver = true;
}

//informs player they have been kicked out of game
function kickPlayer() {
  fill(0, 255, 0);
  rect(0, 0, 420, 150);
  fill(148, 0, 211);
  textSize(25);
  text("GO AWAY NAZI!", 20, 20);
  text("YOU ARE BANNED.", 20, 50);
  text("WE DON'T WANT YOU HERE.", 20, 80);
}

//detects if player has drawn a swastika or other illegal shapes
function stopNazis() {
  let badThingsDone = 0;
  let badThingsTwo = 0;
  let badThingsThree = 0;
  let badThingsFour = 0;
  let badThingsFive = 0;
  let badThingsSix = 0;
  let badThingsSeven = 0;
  let badThingsEight = 0;
  let badThingsNine = 0;
  for (let i = 0; i < division; i++) {
    for (let t = 0; t < division; t++) {
      if (newArray[i][t] === illegalArray[i][t]) {
        badThingsDone++;
      }
      if(newArray[i][t] === illegalArrayTwo[i][t]){
        badThingsTwo++;
      }
      if(newArray[i][t] === illegalArrayThree[i][t]){
        badThingsThree++;
      }
      if(newArray[i][t] === illegalArrayFour[i][t]){
        badThingsFour++;
      }
      if(newArray[i][t] === illegalArrayFive[i][t]){
        badThingsFive++;
      }
      if(newArray[i][t] === illegalArraySix[i][t]){
        badThingsSix++;
      }
      if(newArray[i][t] === illegalArraySeven[i][t]){
        badThingsSeven++;
      }
      if(newArray[i][t] === illegalArrayEight[i][t]){
        badThingsEight++;
      }
      if(newArray[i][t] === illegalArrayNine[i][t]){
        badThingsNine++;
      }
    }
  }
  let tiles = division * division;
  if (badThingsDone === tiles || badThingsTwo === tiles || badThingsThree === tiles || badThingsFour === tiles || badThingsFive === tiles || badThingsSix === tiles || badThingsSeven === tiles || badThingsEight === tiles || badThingsNine === tiles) {
    state = 4; //runs kickPlayer function
  }
}
