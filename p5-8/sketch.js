// Project Title
// Michael McGee
// Date
//

let state;
let money;
let bet;
let rand;
let input, button, greeting;

function setup() {
  createCanvas(windowWidth, windowHeight);
  state = 0;
  money = 150;
  bet = 0;
}

function draw() {
  stateBuddha();
}

function mousePressed(){
  if(state === 0){
    state = 1;
  }
  else if(state === 1){
    roll();
  }
}

//balances the pure and eternal flow of states
function stateBuddha(){
  if(state === 0){
    homeScreen();
  }
  else if(state === 1){
    demoGame();
  }
  else if(state === 2){
    simpleDiceGame();
  }
}

//main screen - game selection
function homeScreen(){
  background(50,235,50,255);
  displayMoney();
}

//run demo game
function demoGame(){
  background(255);
  displayMoney();
}

function simpleDiceGame(){
  //input bet
  //rollDice
  //
}

//shows funds
function displayMoney(){
  strokeWeight(5);
  rect(windowWidth / 2 - 200, 2, 400, 60);
  textSize(40);
  text("$" + str(money), windowWidth / 2 - 20, 45, 100);
}

function roll(){
  money = money - 10;
  bet = bet + 10;
  rand = random(0,1);
  if(rand <= 0.5){
    bet = bet * 2;
    alert("You profited 10");
  }
  else if(rand > 0.5){
    bet = 0;
    alert("You lost 10");
  }
  console.log(str(rand));
  money = money + bet;
  bet = 0;
}
