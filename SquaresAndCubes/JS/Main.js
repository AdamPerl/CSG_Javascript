//https://vigilant-space-memory-rqvvrx9wvqvh59rv-8080.app.github.dev/SquaresAndCubes/index.html

var First_user_Gesture = false

function preload() {
    UIClick = loadSound("Sounds/MenuSelectionClick.mp3");
    Play_Music = loadSound("Sounds/Action.mp3");
    Menu = loadSound("Sounds/Loop-Menu.wav");
    Level_Up = loadSound("Sounds/Coin01.mp3");
    DeathSound = loadSound("Sounds/deathsound.ogg");
    Game_Over = loadSound("Sounds/Sad_Theme.mp3");
    Hit = loadSound("Sounds/Hit.mp3");
    Start = loadSound("Sounds/Start.mp3");

    Play_Music.setVolume(0.3);
}


/*
Bronvermelding:
    p5:
        https://p5js.org/reference/#/p5/let
        https://p5js.org/reference/#/p5/splice
        https://p5js.org/reference/#/p5/line
        https://p5js.org/reference/#/p5/dist
        https://p5js.org/reference/#/p5/lerp (Lerp kende ik al eerder, maar bron voor zekerheid)

    sfx:
        https://opengameart.org/
            https://opengameart.org/content/action
            https://opengameart.org/content/menu-selection-click
            https://opengameart.org/content/menu-loop
            https://opengameart.org/content/level-up-power-up-coin-get-13-sounds
            https://opengameart.org/content/8bit-death-whirl
            https://opengameart.org/content/sad-theme
            https://opengameart.org/content/gui-sound-effects-8
        
        https://pixabay.com/sound-effects/hurt-c-08-102842/

    EasingStyles:
        https://easings.net

    toFixed();
        https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
*/


// make canvas fullscreen
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

function mousePressed() {
    if (!First_user_Gesture) {
        First_user_Gesture = true;
        Menu.loop();
    }

}