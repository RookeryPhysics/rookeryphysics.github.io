// Interactive Scene
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

function setup() {
    createCanvas(400, 400);
    background(0);
}
function draw(){
  if(mouseIsPressed){
	   if(keyIsDown(82) && mouseIsPressed && mouseButton === LEFT){
    	  rect(mouseX, mouseY, 120, 40);
     }
  	   if(mouseIsPressed && mouseButton === LEFT && keyIsDown(69)){
    	    ellipse(mouseX, mouseY, 50, 100);
       }
  	     if(keyIsDown(87)){
           background(255);
         }
  	     if(keyIsDown(66)){
            background(0);
         }
       }
}
