function preload(){
  // put preload code here
}

let state;
let tint;

function setup() {
  // put setup code here
  createCanvas(windowWidth,windowHeight);
  state = 0;
  tint = [255,255,255,255];
}

function draw() {
  // put drawing code here
  stateLord();
}

function stateLord(){
  if(state == 0){
    selection();
  }
  else if(state == 1){
    dcf();
  }
  else if(state == 2){
    graham();
  }
  else if(state == 3){
    css();
  }
  else if(state == 4){
    sop();
  }
}

function checkMouse(){
  if(mouseX<windowWidth/4){
    tint[0] = 200;
    tint[1] = 255;
    tint[2] = 255;
    tint[3] = 255;
  }
  if(mouseX>windowWidth/4&&mouseX<windowWidth/2){
    tint[0] = 255;
    tint[1] = 200;
    tint[2] = 255;
    tint[3] = 255;
  }
  if(mouseX>windowWidth/2&&mouseX<windowWidth/2+windowWidth/4){
    tint[0] = 255;
    tint[1] = 255;
    tint[2] = 200;
    tint[3] = 255;
  }
  if(mouseX>windowWidth/2+windowWidth/4){
    tint[0] = 255;
    tint[1] = 255;
    tint[2] = 255;
    tint[3] = 200;
  }
}

function mousePressed(){
  if(state == 0){
    if(mouseX<windowWidth/4){
      state = 1;
    }
    if(mouseX>windowWidth/4&&mouseX<windowWidth/2){
      state = 2;
    }
    if(mouseX>windowWidth/2&&mouseX<windowWidth/2+windowWidth/4){
      state = 3;
    }
    if(mouseX>windowWidth/2+windowWidth/4){
      state = 4;
    }
  }
}

function selection(){
  checkMouse();
  strokeWeight(30);
  fill(tint[0],0,0);
  rect(0,0,windowWidth/4,windowHeight);
  fill(0,tint[1],0);
  rect(windowWidth/4,0,windowWidth/4,windowHeight);
  fill(0,0,tint[2]);
  rect(windowWidth/2,0,windowWidth/4,windowHeight);
  fill(tint[3]-55,tint[3]-55,0);
  rect(windowWidth/2+windowWidth/4,0,windowWidth/4,windowHeight);
  textSize(90);
  fill(0);
  text("DCF",windowWidth/4-350,windowHeight/2-45);
  text("G",windowWidth/2-300,windowHeight/2-45);
  text("CSS",windowWidth/2+windowWidth/4-350,windowHeight/2-45);
  text("SoP",windowWidth-350,windowHeight/2-45);
}

function dcf(){
  //
  fill(0);
  rect(0,0,windowWidth,windowHeight);
}

function graham(){
  //
}

function css(){
  //
}

function sop(){
  //
}
