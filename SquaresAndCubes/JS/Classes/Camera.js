//camera

var Difficulty_Array = ["Easy","Normal","Hard","Impossible"]; //name and difficulty
var Color_Array = ["green","darkgrey","red","white"]; //color when your mouse is not on the button
var Darker_Color_Array = ["darkgreen","grey","darkred", "gold"]; // somehow darkgrey looks less dark then grey

var Main_Menu_Button_Array = ["Play", "Statistics", "Help"]; // the text on the button
var Main_Menu_Camera_Array = ["Dificulty_Select", "Statistics", "Help_Screen"]; // which camera to go when clickingon the button

var ESC_Button_Array = ["Restart", "Continue",  "Back to menu"];
var ESC_Camera_Array = ["New_Game?", "Play_Ground", "Main_Menu"];

var Lost_Screen_Button_Array = ["Restart",  "Back to menu"];
var Lost_Screen_Camera_Array = ["New_Game?", "Main_Menu"];



//Button Settings
var Button_Cooldown = 30
var Global_Size_Duration = 30;
var Button_Width = 200;
var Button_Height = 50;
var Padding_Left = 100;
var Normal_Color = "White"
var Hover_Color = "Grey"


// https://easings.net/#easeOutQuint
function easeOutQuint(x) {
    return 1 - Math.pow(1 - x, 5);
}


class Sample_Statistics {
    constructor() {
        this.Max_Score = 0;
        this.Max_Time_Survived = 0;
        this.Max_Level = 0;
    }
}

function CreateCloseButton(Self, newCamera) {
    var newCamera = newCamera || "Main_Menu"
    var Close_Button_Width = 50;
    var Close_Button_Height = 50;
    var Close_ButtonX = Close_Button_Width / 2;
    var Close_ButtonY = Close_Button_Height / 2;
    fill("darkred");
    if (mouseX > Close_ButtonX && mouseX < Close_ButtonX + Close_Button_Width && mouseY > Close_ButtonY && mouseY < Close_ButtonY + Close_Button_Height) {
        fill("red");
        if (mouseIsPressed === true) {
            Self.Set_Camera(newCamera)
            UIClick.play();
            return true;
        }
    }

                
    rect(Close_ButtonX, Close_ButtonY, Close_Button_Width, Close_Button_Height);

    textAlign(CENTER, CENTER);
    textSize(40);
    fill(0);

    text("X", Close_ButtonX + Close_Button_Width / 2, Close_ButtonY + Close_Button_Height / 2);
}

function CreateButton(ButtonX, ButtonY, Button_Width, Button_Height, Delta, Button_Text, Color, HoverColor, Size_Duration) {
    let Enlarged_Button_Width = Button_Width * 1.1;
    let Enlarged_Button_Height = Button_Height * 1.1;

   Delta = easeOutQuint(Delta)

    fill(Color);

    if (mouseX > ButtonX && mouseX < ButtonX + Button_Width && mouseY > ButtonY && mouseY < ButtonY + Button_Height) {
        fill(HoverColor);
        let lerpedWidth = lerp(Button_Width, Enlarged_Button_Width, Delta);
        let lerpedHeight = lerp(Button_Height, Enlarged_Button_Height, Delta);
        let DeltaX = (lerpedWidth - Button_Width) / 2;
        let DeltaY = (lerpedHeight - Button_Height) / 2;
        let lerpedX = lerp(ButtonX - DeltaX, ButtonX + DeltaX, 1 / Size_Duration);
        let lerpedY = lerp(ButtonY - DeltaY, ButtonY + DeltaY, 1 / Size_Duration);

        rect(lerpedX, lerpedY, lerpedWidth, lerpedHeight);
        fill(0);
        text(Button_Text, lerpedX + lerpedWidth / 2, lerpedY + lerpedHeight / 2);
        return true;

    } else {
        rect(ButtonX, ButtonY, Button_Width, Button_Height);
        fill(0);
        text(Button_Text, ButtonX + Button_Width / 2, ButtonY + Button_Height / 2);
    }
}

class Camera {
    constructor() {
        this.Statistics = {
            Easy: new Sample_Statistics(),
            Normal: new Sample_Statistics(),
            Hard: new Sample_Statistics(),
            Impossible: new Sample_Statistics(),
        }
        this.Button_Press_Cooldown = Button_Cooldown;
        this.Current_Camera = "Main_Menu";
        this.Selected_Game_Mode = null;

        this.Dificulty_Button_Array = [];
        this.Main_Menu_Button_Array = [];
        this.ESC_Button_Array = [];
        this.Lost_Screen_Button_Array = [];

        for (let Index = 0; Index < Difficulty_Array.length; Index++) {
            this.Dificulty_Button_Array.push(0); // make 1 new value for each button which is going to be the frames your mouse is on
        }

        for (let Index = 0; Index < Main_Menu_Button_Array.length; Index++) {
            this.Main_Menu_Button_Array.push(0); // make 1 new value for each button which is going to be the frames your mouse is on
        }

        for (let Index = 0; Index < Difficulty_Array.length; Index++) {
            this.ESC_Button_Array.push(0); // make 1 new value for each button which is going to be the frames your mouse is on
        }
        for (let Index = 0; Index < Lost_Screen_Button_Array.length; Index++) {
            this.Lost_Screen_Button_Array.push(0); // make 1 new value for each button which is going to be the frames your mouse is on
        }
    }

    Destroy_Game() {
        let Mode = this.Selected_Game_Mode
        this.Statistics[Mode].Max_Score = Math.max(Math.round(this.New_Game.Score), this.Statistics[Mode].Max_Score);
        this.Statistics[Mode].Max_Time_Survived = Math.max(Math.round(this.New_Game.Time_Survived/60*100)/100,  this.Statistics[Mode].Max_Time_Survived);
        this.Statistics[Mode].Max_Level = Math.max(Math.round(this.New_Game.level), this.Statistics[Mode].Max_Level);

        this.New_Game = null;
        this.New_Player = null;
        if (Play_Music.isPlaying()) {
            Play_Music.stop();
        }
        if (!Menu.isPlaying()) {
            Menu.loop();
        }
        return;
    }

    Create_Game() {
        this.New_Player = new Player();
        this.New_Game = new Game(this.New_Player, this.Selected_Game_Mode);
        this.Set_Camera("Play_Ground");
        if (!Play_Music.isPlaying()) {
            Menu.stop();
            Play_Music.loop();
        }
        return;
    }

    Set_Camera(New_Camera) {
        //set the currentcamera to the new camera
        this.Current_Camera = New_Camera


        if (this.Current_Camera == "Main_Menu") {
            if (Game_Over.isPlaying()) {
                Game_Over.stop();
            }
            return;
        }
    

        if (this.Current_Camera == "Play_Ground") {
            if (Game_Over.isPlaying()) {
                Game_Over.stop();
            }
            noCursor();
            return;
        }

        if (this.Current_Camera == "Lost_Screen") {
            if (Play_Music.isPlaying()) {
                Play_Music.stop();
            }
            Game_Over.loop();
            cursor(ARROW);
            return;
        }

        if (this.Current_Camera == "Pause_Mode") {
            cursor(ARROW);
            return;
        }
        if (this.Current_Camera == "Help_Screen") {

            return;
        }

        if (this.Current_Camera == "ESC_Screen") {
            cursor(ARROW);
            return;
        }
    }

    Handle_Frame() {
        this.Button_Press_Cooldown--;
        if (this.Current_Camera == "Dificulty_Select") {
            if (keyIsPressed && keyCode === 27) {
                this.Set_Camera("Main_Menu");
                return;
            }
            CreateCloseButton(this);


            for (let index = 0; index < Difficulty_Array.length; index++) {
                let Game_Mode = Difficulty_Array[index];
                let Normal_Color = Color_Array[index];
                let Dark_Color = Darker_Color_Array[index];
                let ButtonX = index * windowWidth / 4 + Padding_Left;
                let ButtonY = windowHeight / 2 - 50;
            
                if (CreateButton(ButtonX, ButtonY, Button_Width, Button_Height, this.Dificulty_Button_Array[index]/Global_Size_Duration, Game_Mode, Normal_Color, Dark_Color, Global_Size_Duration)) {
                    if (this.Dificulty_Button_Array[index] <= Global_Size_Duration) {
                        this.Dificulty_Button_Array[index]++;
                    }
                    if (mouseIsPressed === true && this.Button_Press_Cooldown < 0) {
                        UIClick.play()
                        Start.play();
                        this.Button_Press_Cooldown = Button_Cooldown; // do button cooldwon
                        this.Selected_Game_Mode = Game_Mode;
                        this.Create_Game();
                        return;
                    }
                } else {
                    this.Dificulty_Button_Array[index] = 0;
                }

            }
        }

        if (this.Current_Camera == "Statistics") {
            if (keyIsPressed && keyCode === 27) {
                this.Set_Camera("Main_Menu");
                return;
            }
            fill(255);

            textAlign(LEFT);
            textSize(20);

            let Padding_Left = 50

            for (var index = 0; index < Difficulty_Array.length; index++) {
                push();
                let Statistics = this.Statistics[Difficulty_Array[index]]
                text("Current Score: " + Statistics.Max_Score, index * windowWidth/4 + Padding_Left, windowHeight / 2 - 50);
                text("Highest Time: " + Statistics.Max_Time_Survived, index * windowWidth/4 + Padding_Left, windowHeight / 2);
                text("Highest Level: " + Statistics.Max_Level, index * windowWidth/4 + Padding_Left, windowHeight / 2 + 50);
                fill(Color_Array[index]);
                text(Difficulty_Array[index], index * windowWidth/4 + Padding_Left, windowHeight / 2 - 100);
                pop();
            }

            CreateCloseButton(this);
        }

        if (this.Current_Camera == "Main_Menu") {
            fill(255);
            textSize(50);
            textAlign(CENTER, CENTER);
            text("Squares And Cubes!", windowWidth/2 , 100);

            textAlign(CENTER, CENTER);
            textSize(18);

            for (let index = 0; index < Main_Menu_Button_Array.length; index++) {

                let Text = Main_Menu_Button_Array[index]
                let New_Camera_State = Main_Menu_Camera_Array[index]
                let Button_Width = 100;
                let Button_Height = 50;
                let ButtonX = windowWidth / 2 - Button_Width / 2;
                let ButtonY = windowHeight / 2 + 100 * index - 50 * Main_Menu_Button_Array.length;

                if (CreateButton(ButtonX,ButtonY,Button_Width,Button_Height, this.Main_Menu_Button_Array[index]/Global_Size_Duration, Text, Normal_Color, Hover_Color, Global_Size_Duration)) {
                    if (this.Main_Menu_Button_Array[index] <= Global_Size_Duration) {
                        this.Main_Menu_Button_Array[index]++;
                    }
                    if (mouseIsPressed === true && this.Button_Press_Cooldown < 0) {
                        this.Button_Press_Cooldown = Button_Cooldown;
                        UIClick.play()
                        this.Set_Camera(New_Camera_State);
                        return;
                    }
                } else {
                    this.Main_Menu_Button_Array[index] = 0;
                }
            }
        }

        if (this.Current_Camera == "Help_Screen") {
            if (keyIsPressed && keyCode === 27) {
                this.Set_Camera("Main_Menu");
                return;
            }
            CreateCloseButton(this);

            let instructions =
                "In this game, you need to try to evade any enemy. They are colored red. \n Your objective: survive as long as possible!\n\n" +
                "Controls:\n" +
                "ARROWS: Move your character.\n" +
                "SPACE: Dash when moving, will give you short invincibility.\n" +
                "ESC: Pause Menu. (only when in-game)";

            fill(255)
            textSize(25);
            text(instructions, width / 2, height / 2);
            return;
        }

        if (this.Current_Camera == "Lost_Screen") {
            if ((keyIsPressed && keyCode === 27) || CreateCloseButton(this)) {
                this.Destroy_Game();
                this.Set_Camera("Main_Menu");
                return;
            }

            fill(255);
            textSize(50);
            textAlign(CENTER, CENTER);
            text("You died!", windowWidth/2 , 100);


            let Statistics = this.New_Game
            textSize(25);
            text(this.Selected_Game_Mode, width / 2, height / 2 - 300);
            text("Current Score: " + Math.round(Statistics.Score), windowWidth/2, windowHeight / 2 - 50);
            text("Current Time: " + Math.round(Statistics.Time_Survived/60*100)/100, windowWidth/2, windowHeight / 2);
            text("Current Level: " + Math.round(Statistics.level), windowWidth/2, windowHeight / 2 + 50);

            for (let index = 0; index < Lost_Screen_Camera_Array.length; index++) {

                let Text = Lost_Screen_Button_Array[index]
                let New_Camera_State = Lost_Screen_Camera_Array[index]

                let ButtonX = windowWidth / 2 - Button_Width / 2 + (index-0.5) * Button_Width * 1.3;
                let ButtonY = windowHeight / 2 + 300;

                if (CreateButton(ButtonX,ButtonY,Button_Width,Button_Height, this.Lost_Screen_Button_Array[index]/Global_Size_Duration, Text, Normal_Color, Hover_Color, Global_Size_Duration)) {
                    if (this.Lost_Screen_Button_Array[index] <= Global_Size_Duration) {
                        this.Lost_Screen_Button_Array[index]++;
                    }
                    if (mouseIsPressed === true && this.Button_Press_Cooldown < 0) {
                        this.Button_Press_Cooldown = Button_Cooldown;
                        UIClick.play()
                        if (New_Camera_State == "Main_Menu") {
                            this.Destroy_Game();
                            this.Set_Camera(New_Camera_State);
                            return;
                        }
                        if (New_Camera_State == "New_Game?") {
                            this.Create_Game();
                            Start.play();
                            return;
                        }
                        this.Set_Camera(New_Camera_State);
                        return;
                    }
                } else {
                    this.Lost_Screen_Button_Array[index] = 0;
                }
            }
        }

        if (this.Current_Camera == "ESC_Screen") {
            for (let index = 0; index < ESC_Button_Array.length; index++) {

                let Text = ESC_Button_Array[index]
                let New_Camera_State = ESC_Camera_Array[index]
                let ButtonX = windowWidth / 2 - Button_Width / 2 + index * Button_Width * 1.3 - ESC_Button_Array.length * Button_Width/2.4;
                let ButtonY = windowHeight / 2 + 300;

                if (CreateButton(ButtonX,ButtonY,Button_Width,Button_Height, this.ESC_Button_Array[index]/Global_Size_Duration, Text, Normal_Color, Hover_Color, Global_Size_Duration)) {
                    if (this.ESC_Button_Array[index] <= Global_Size_Duration) {
                        this.ESC_Button_Array[index]++;
                    }
                    if (mouseIsPressed === true && this.Button_Press_Cooldown < 0) {
                        UIClick.play()
                        this.Button_Press_Cooldown = Button_Cooldown;
                        if (New_Camera_State == "Main_Menu") {
                            this.Destroy_Game();
                            this.Set_Camera(New_Camera_State);
                            return;
                        }
                        if (New_Camera_State == "New_Game?") {
                            this.Create_Game();
                            Start.play();
                            return;
                        }
                        this.Set_Camera(New_Camera_State);
                        return;
                    }
                } else {
                    this.ESC_Button_Array[index] = 0;
                }
            }

            let Statistics = this.New_Game

            fill(255)
            textSize(25);
            text(this.Selected_Game_Mode, width / 2, height / 2 - 300);
            text("Current Score: " + Math.round(Statistics.Score), windowWidth/2, windowHeight / 2 - 50);
            text("Current Time: " + Math.round(Statistics.Time_Survived/60*100)/100, windowWidth/2, windowHeight / 2);
            text("Current Level: " + Math.round(Statistics.level), windowWidth/2, windowHeight / 2 + 50);
            return;
        }

        if (this.Current_Camera == "Play_Ground") {
            if (keyIsPressed && keyCode === 27) {
                this.Set_Camera("ESC_Screen")
            }
            this.New_Game.Handle_Frame();
            var Died = this.New_Player.Handle_Frame(this.New_Game.Enemies);
            if (Died) {
                this.Set_Camera("Lost_Screen");
            }
        }
    }
}