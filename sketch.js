let mic;
let r1 = 225;
let r2 = 225;
let m1 = 10;
let m2 = 10;
let a1 = 0;
let a2 = 0;
let a1_v = 0;
let a2_v = 0;
let g = 0.1;
let px2 = -1;
let py2 = -1;
let cx, cy;

let buffer;

let points;
let current;
let percent = 0.5;
let previous;
// function preload() {
//   img = loadImage('earth.png');
// }


function setup() {
  createCanvas(windowWidth, windowHeight);

  //earth
  // pixelDensity(1);
  explodeSetup();

  pendulumSetup();

  mic = new p5.AudioIn();
  mic.start();

}

function pendulumSetup() {
  a1 = PI / 2;
  a2 = PI / 2;
  cx = width / 2;
  cy = 50;
  buffer = createGraphics(width, height);
  buffer.translate(cx, cy);
}

function explodeSetup() {
  points = [];
  const n = 50;

  for (let i = 0; i < n; i++) {
    let angle = (i * TWO_PI) / n;
    let v = p5.Vector.fromAngle(angle);
    v.mult(width / 2);
    v.add(width * 0, height * 0);
    points.push(v);
  }

  reset();
}

function draw() {

  pendulum();
  explode();

  // text('hi', 150, 150)
  // image(img, 0, 0, 100, 100);
}

// function mousePressed() {
//   resetCanvas();
// }

function reset() {
  current = createVector(random(width), random(height));
  background(0);
  stroke(255);
  strokeWeight(0.1);
  for (let p of points) {
    point(p.x, p.y);
  }
}



function pendulum() {
  imageMode(CORNER);
  image(buffer, 0, 0, width, height);
  let vol = mic.getLevel();
  let h = map(vol, 0, 0.001, 0, 1, true);
  console.log("mic level is: " + mic.getLevel());
  console.log(h);
  let num1 = -(g + h) * (2 * m1 + m2) * sin(a1);
  let num2 = -m2 * (g + h) * sin(a1 - 2 * a2);
  let num3 = -2 * sin(a1 - a2) * m2;
  let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * cos(a1 - a2);
  let den = r1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
  let a1_a = (num1 + num2 + num3 * num4) / den;

  num1 = 2 * sin(a1 - a2);
  num2 = a1_v * a1_v * r1 * (m1 + m2);
  num3 = (g + h) * (m1 + m2) * cos(a1);
  num4 = a2_v * a2_v * r2 * m2 * cos(a1 - a2);
  den = r2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
  let a2_a = (num1 * (num2 + num3 + num4)) / den;

  translate(cx, cy);
  stroke(0);
  strokeWeight(2);

  let x1 = r1 * sin(a1);
  let y1 = r1 * cos(a1);

  let x2 = x1 + r2 * sin(a2);
  let y2 = y1 + r2 * cos(a2);

  line(0, 0, x1, y1);
  fill(70, 120, 80);
  ellipse(x1, y1, m1, m1);

  line(x1, y1, x2, y2);
  fill(0,0,103);
  ellipse(x2, y2, m2, m2);

  a1_v += a1_a;
  a2_v += a2_a;
  a1 += a1_v;
  a2 += a2_v;

  // a1_v *= 0.999;
  // a2_v *= 0.999;


  buffer.stroke(179,230,255);
  // console.log(frameCount);
  if (frameCount > 1) {
    buffer.line(px2, py2, x2, y2);
  }
  px2 = x2;
  py2 = y2;

}

function explode() {
  if (frameCount % 400 == 0) {
    reset();
  }

  for (let i = 0; i < 1000; i++) {
    strokeWeight(0.5);
    stroke(155);
    let next = random(points);
    if (next !== previous) {
      current.x = lerp(current.x, next.x, percent);
      current.y = lerp(current.y, next.y, percent);
      point(current.x, current.y);
    }
    previous = next;
  }

}
