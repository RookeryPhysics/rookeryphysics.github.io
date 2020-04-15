function preload(){
  // put preload code here
}

let array = [];
let divArray = [];
let yetValued;

function setup() {
  // put setup code here
  array = [];
  yetValued = true;
}

function draw() {
  while(yetValued){
    valueCompany();
    yetValued = false;
  }
}

function valueCompany(){
  let i = 0.08;
  let g = 0.1;
  let y = 60;
  let d = 1.7416;
  let value = 0;

  for (let n = 1; n <= y+1; n++) {
    let bottom = (1+i);
    let part = d/(bottom^n);
    divArray.push(d);
    array.push(part);
    d = d*(1+g);
  }

  console.log(array);

  for (let c = y; c > 0; c--){
    value = value + array[c];
  }

  console.log(value);
  console.log(divArray);
  alert(value);
}
