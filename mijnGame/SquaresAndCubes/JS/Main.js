//https://vigilant-space-memory-rqvvrx9wvqvh59rv-5504.app.github.dev/mijnGame/SquaresAndCubes/index.html
function preload() {

}

// doe bronvermelding naar splice & let

// make  frame fullscreen
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    // canvas
    canvas = createCanvas(windowWidth, windowHeight);

    //framerate
    frameRate(60);

    //New camera
    New_Camera = new Camera();
}

function draw() {
    background("black");
    New_Camera.Handle_Frame();
}
