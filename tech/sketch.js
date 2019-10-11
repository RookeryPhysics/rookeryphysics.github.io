// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let state;
let leftArrow, rightArrow;
let numberOfStates;
let iPhone;
let temp;
let micro;

function preload(){
  leftArrow = loadImage("assets/leftarrow.png");
  rightArrow = loadImage("assets/rightarrow.png");
  //products
  grinder1 = loadImage("https://images-na.ssl-images-amazon.com/images/I/71Ejxc0a2HL._AC_SL1280_.jpg");
  grinder2 = loadImage("https://images-na.ssl-images-amazon.com/images/I/61q-jM0rPlL._AC_SL1000_.jpg");
  grinder3 = loadImage("https://images-na.ssl-images-amazon.com/images/I/71HJa1IVsIL._AC_SL1500_.jpg");
  pipe1 = loadImage("https://images-na.ssl-images-amazon.com/images/I/51WpfuJL15L._AC_SL1001_.jpg");
  pipe2 = loadImage("https://images-na.ssl-images-amazon.com/images/I/61obC0eXh-L._AC_SL1440_.jpg");
  pipe3 = loadImage("https://images-na.ssl-images-amazon.com/images/I/51zsfhHE-AL._AC_SL1004_.jpg");
  glassPipe = loadImage("https://images-na.ssl-images-amazon.com/images/I/51akIRDHXTL._AC_SL1000_.jpg");
  glassBlunt = loadImage("https://images-na.ssl-images-amazon.com/images/I/61hEvkvkmZL._AC_SL1001_.jpg");
  bubbler = loadImage("https://images-na.ssl-images-amazon.com/images/I/61Fktj58lzL._AC_SL1000_.jpg");
  tenFilters = loadImage("https://images-na.ssl-images-amazon.com/images/I/81jiz-6UPhL._AC_SL1500_.jpg");
  papers = loadImage("https://images-na.ssl-images-amazon.com/images/I/51aO7mMLxTL._AC_.jpg");
  roller = loadImage("https://images-na.ssl-images-amazon.com/images/I/61RZMZZUH%2BL._AC_SL1500_.jpg");
  rollKit = loadImage("https://images-na.ssl-images-amazon.com/images/I/714L7veXUHL._AC_SL1435_.jpg");
  wraps = loadImage("https://images-na.ssl-images-amazon.com/images/I/81GRhHXkwRL._AC_SL1200_.jpg");
  tray = loadImage("https://images-na.ssl-images-amazon.com/images/I/612gS8GsNpL._AC_SL1001_.jpg");
  silBong = loadImage("https://images-na.ssl-images-amazon.com/images/I/51zNV7kkrqL._AC_SL1041_.jpg");
  grinder4 = loadImage("https://images-na.ssl-images-amazon.com/images/I/51C3xI2-NBL._AC_.jpg");
  grinder5 = loadImage("https://images-na.ssl-images-amazon.com/images/I/61TL3MDcmwL._AC_SL1500_.jpg");
  grinder6 = loadImage("https://images-na.ssl-images-amazon.com/images/I/616veXDWeaL._AC_SL1001_.jpg");
  airSeal = loadImage("https://images-na.ssl-images-amazon.com/images/I/51-2bjYoHLL._AC_SL1000_.jpg");
  safe = loadImage("https://images-na.ssl-images-amazon.com/images/I/71gGJlAdjhL._AC_SL1500_.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight-160);
  state = 0;
  numberOfStates = 21 + 1;
}

function mousePressed(){
  if(mouseX < 160 && mouseY > 0 && mouseY < windowWidth){
    leftArrowClick();
  }
  else if(mouseX > windowWidth-160 && mouseY > 0 && mouseY < windowWidth){
    rightArrowClick();
  }
  else if(mouseX > 160 && mouseX < windowWidth-160 && mouseY > 0 && mouseY < windowWidth){
    if(state !== "contact"){
      temp = state;
      state = "contact";
    }
    else{
      state = temp;
    }
  }
}

function keyPressed(){
  if(keyCode === 37){
    leftArrowClick();
  }
  else if(keyCode === 39){
    rightArrowClick();
  }
}

function draw() {
  stateLord();
  showArrows();
}

function stateLord(){
  if(state === "contact"){
    background(0);
    text("Call (306)250-4250");
  }
  if(state === 0){ //selection
    //
    background(0);
    showArrows();
    showProduct(grinder1,"Grinder","A herb grinder.","$25.00");
  }
  else if(state === 1){
    //
    background(0);
    showArrows();
    showProduct(grinder2,"Grinder","A herb grinder.","$20.00");
  }
  else if(state === 2){
    //
    background(0);
    showArrows();
    showProduct(grinder3,"Grinder","A herb grinder.","$20.00");
  }
  else if(state === 3){
    //
    background(0);
    showArrows();
    showProduct(pipe1,"Pipe","A silicon pipe.","$25.00");

  }
  else if(state === 4){
    //
    background(0);
    showArrows();
    showProduct(pipe2,"Pipe","A silicon pipe.","$20.00");
  }
  else if(state === 5){
    //
    background(0);
    showArrows();
    showProduct(pipe3,"Pipe","A unique silicon pipe.","$30.00");
  }
  else if(state === 6){
    //
    background(0);
    showArrows();
    showProduct(glassPipe,"Pipe","A glass pipe.","$25.00");
  }
  else if(state === 7){
    //
    background(0);
    showArrows();
    showProduct(glassBlunt,"Glass Blunt","A glass blunt kit.","$25.00");
  }
  else if(state === 8){
    //
    background(0);
    showArrows();
    showProduct(bubbler,"Bubbler Pipe","Glass bubbler pipe.","$30.00");
  }
  else if(state === 9){
    //
    background(0);
    showArrows();
    showProduct(tenFilters,"500 RAW Filters","10x50pack of filters.","$15.00");
  }
  else if(state === 10){
    //
    background(0);
    showArrows();
    showProduct(papers,"Rolling Papers","6 packs of rolling papers.","$15.00");
  }
  else if(state === 12){
    //
    background(0);
    showArrows();
    showProduct(roller,"Joint Roller","Joint rolling machine.","$15.00");
  }
  else if(state === 13){
    //
    background(0);
    showArrows();
    showProduct(rollKit,"Rolling Kit","Multi-item rolling kit.","$35.00");
  }
  else if(state === 14){
    //
    background(0);
    showArrows();
    showProduct(wraps,"50 Wraps","50 strawberry hemp wraps.","$40.00");
  }
  else if(state === 15){
    //
    background(0);
    showArrows();
    showProduct(tray,"Tray","Rolling tray.","$20");
  }
  else if(state === 16){
    //
    background(0);
    showArrows();
    showProduct(silBong,"Silicon Water Pipe","Silicon water pipe + accesories","$40");
  }
  else if(state === 17){
    //
    background(0);
    showArrows();
    showProduct(grinder4,"Grinder","A herb grinder.","$35");
  }
  else if(state === 18){
    //
    background(0);
    showArrows();
    showProduct(grinder5,"Grinder","A herb grinder.","$35");
  }
  else if(state === 19){
    //
    background(0);
    showArrows();
    showProduct(grinder6,"Grinder","A herb grinder.","$25");
  }
  else if(state === 20){
    //
    background(0);
    showArrows();
    showProduct(airSeal,"Air Seal","Smell proof container.","$25");
  }
  else if(state === 21){
    //
    background(0);
    showArrows();
    showProduct(safe,"Smellproof Safe","Smellproof container safe.","$60");
  }
  else if(state === "contact"){
    contact();
  }
}

function showArrows(){
  fill(255);
  rect(0,0,160,windowHeight);
  rect(windowWidth-160,0,160,windowHeight);
  if(state > 0){
    image(leftArrow,0,windowHeight/6,100,400);
  }
  if(state !== numberOfStates-1){
    image(rightArrow,windowWidth-100,windowHeight/6,100,400);
  }
}

function leftArrowClick(){
  if(state > 0){
    state--;
  }
}

function rightArrowClick(){
  if(state < numberOfStates-1){
    state++;
  }
}

function showProduct(product,name,desc,price){
  image(product,260,100,1200,900);
  textSize(40);
  text(name,1500,200);
  textSize(20);
  text(desc,1500,280);
  textSize(30);
  text(price,1500,400);
  fill(0,225,0);
  textSize(35);
  text("BUY",1500,500);
  fill(0);
}

function contact(){
  fill(0,225,0);
  textSize(40);
  text("Call (306)250-4250",800,500);
  text("Product designation is " + str(temp),800,600);
  fill(0);
}
