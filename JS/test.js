var piraat = {
  x: 225,
  y: 225,
  stapGrootte: 3,
  beweeg() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.stapGrootte;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.stapGrootte;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.stapGrootte;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.stapGrootte;
    }
  },
  teken() {
    fill("yellow")
    ellipse(this.x,this.y, 50);
  },
}



function setup() {
  canvas = createCanvas(450,450);
  canvas.parent('processing');
}

function draw() {
  background(200);
  piraat.beweeg();
  piraat.teken();
}