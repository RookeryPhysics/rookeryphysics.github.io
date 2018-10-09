// Alleged Image
// Michael "Danger" McGee
// Today
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let snake;
let graySnake;

function preload() {
  snake = loadImage("assets/snake.jpeg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  image(snake, 0, 0);
  graySnake = darken(snake);
  image(graySnake, 0, 0);
}

function draw() {

}

function darken(sourceImage) {
  let img = createImage(sourceImage.width, sourceImage.height);

  img.loadPixels();
  sourceImage.loadPixels();

  for (let x = 0; x < sourceImage.width; x++) {
    for (let y = 0; y < sourceImage.height; y++) {
      let p = sourceImage.get(x, y);

      let r = red(p);
      let g = green(p);
      let b = blue(p);

      let newPixel = color((r+g+b)/3, (r+g+b)/3, (r+g+b)/3);

      img.set(x, y, newPixel);
    }
  }

  img.updatePixels();
  return img;
}
