//camera

var Difficulty_Array = ["Easy","Normal","Hard","Impossible"]; //name and difficulty
var Color_Array = ["green","darkgrey","red","white"]; //color when your mouse is not on the button
var Darker_Color_Array = ["darkgreen","grey","darkred", "gold"]; // somehow darkgrey looks less dark then grey

var Main_Menu_Button_Array = ["Play", "Statistics", "Help"]; // the text on the button
var Main_Menu_Camera_Array = ["Dificulty_Select", "Statistics", "Help_Screen"]; // which camera to go when clickingon the button

var ESC_Button_Array = ["Restart", "Continue",  "Back to menu"];
var ESC_Camera_Array = ["Stop_Game", "Play_Ground", "Main_Menu"];

var Button_Cooldown = 30
// make main menu button cooldown, so if the player presses ESC and has their mouse on top of a button and presses it,
//it will each frame draw both of those cameras, meaning you can see the main menu and the difficulty camera, for instance.

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
        this.Current_Stats = null;

        this.Dificulty_Button_Array = [];
        this.Main_Menu_Button_Array = [];
        this.ESC_Button_Array = [];

        for (let Index = 0; Index < Difficulty_Array.length; Index++) {
            this.Dificulty_Button_Array.push(0); // make 1 new value for each button which is going to be the frames your mouse is on
        }

        for (let Index = 0; Index < Main_Menu_Button_Array.length; Index++) {
            this.Main_Menu_Button_Array.push(0); // make 1 new value for each button which is going to be the frames your mouse is on
        }

        for (let Index = 0; Index < Difficulty_Array.length; Index++) {
            this.ESC_Button_Array.push(0); // make 1 new value for each button which is going to be the frames your mouse is on
        }
    }

    Set_Camera(New_Camera) {
        //set the currentcamera to the new camera
        this.Current_Camera = New_Camera


        if (this.Current_Camera == "Main_Menu") {

            return;
        }
        
        if (this.Current_Camera == "Stop_Game") {
            let Mode = this.Selected_Game_Mode
            this.Statistics[Mode].Max_Score = Math.max(Math.round(this.New_Game.Score), this.Statistics[Mode].Max_Score);
            this.Statistics[Mode].Max_Time_Survived = Math.max(Math.round(this.New_Game.Time_Survived/60),  this.Statistics[Mode].Max_Time_Survived);
            this.Statistics[Mode].Max_Level = Math.max(Math.round(this.New_Game.level), this.Statistics[Mode].Max_Level);

            this.New_Game = null;
            this.New_Player = null;
            return;
        }


        if (this.Current_Camera == "New_Game") {
            this.New_Player = new Player();
            this.New_Game = new Game(this.New_Player, this.Selected_Game_Mode);
            this.Set_Camera("Play_Ground");
            return;
        }

        if (this.Current_Camera == "Play_Ground") {
            noCursor();
            return;
        }

        if (this.Current_Camera == "Lost_Screen") {
            cursor(ARROW);

            this.New_Game = null;
            this.New_Player = null;
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

            let Padding_Left = 100;
            let Size_Duration = 10;

            for (let index = 0; index < Difficulty_Array.length; index++) {
                let Game_Mode = Difficulty_Array[index];
                let Color = Color_Array[index];
                let Dark_Color = Darker_Color_Array[index];
                let Button_Width = 200;
                let Button_Height = 50;
                let ButtonX = index * windowWidth / 4 + Padding_Left;
                let ButtonY = windowHeight / 2 - 50;
            

                if (CreateButton(ButtonX, ButtonY, Button_Width, Button_Height, this.Dificulty_Button_Array[index]/Size_Duration, Game_Mode, Color, Dark_Color, Size_Duration)) {
                    if (this.Dificulty_Button_Array[index] <= Size_Duration) {
                        this.Dificulty_Button_Array[index]++;
                    }
                    if (mouseIsPressed === true && this.Button_Press_Cooldown < 0) {
                        this.Button_Press_Cooldown = Button_Cooldown; // do button cooldwon
                        this.Selected_Game_Mode = Game_Mode;
                        this.Set_Camera("New_Game");
                        return;
                    }
                } else {
                    this.Dificulty_Button_Array[index] = 0;
                }

                fill(Color);
            }
        }

        if (this.Current_Camera == "Statistics") {
            if (keyIsPressed && keyCode === 27) {
                this.Set_Camera("Main_Menu");
                return;
            }
            fill(255);

            textAlign(LEFT); // left zodat het mooi naast elkaar zit.
            textSize(20);

            let Padding_Left = 50

            for (var index = 0; index < Difficulty_Array.length; index++) {
                push();
                let Statistics = this.Statistics[Difficulty_Array[index]]
                text("Current Score: " + Statistics.Max_Score, index * windowWidth/4 + Padding_Left, windowHeight / 2 - 50);
                text("Highest Time: " + Statistics.Max_Time_Survived, index * windowWidth/4 + Padding_Left, windowHeight / 2);
                text("Highest Level: " + Statistics.Max_Level, index * windowWidth/4 + Padding_Left, windowHeight / 2 + 50);
                let Color = Color_Array[index]
                fill(Color)
                text(Difficulty_Array[index], index * windowWidth/4 + Padding_Left, windowHeight / 2 - 100)
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

            let Size_Duration = 10;
            let Color = "White"
            let Dark_Color = "Grey"

            for (let index = 0; index < Main_Menu_Button_Array.length; index++) {

                let Text = Main_Menu_Button_Array[index]
                let New_Camera_State = Main_Menu_Camera_Array[index]
                let Button_Width = 100;
                let Button_Height = 50;
                let ButtonX = windowWidth / 2 - Button_Width / 2;
                let ButtonY = windowHeight / 2 + 100 * index - 50 * Main_Menu_Button_Array.length;

                if (CreateButton(ButtonX,ButtonY,Button_Width,Button_Height, this.Main_Menu_Button_Array[index]/Size_Duration, Text, Color, Dark_Color, Size_Duration)) {
                    if (this.Main_Menu_Button_Array[index] <= Size_Duration) {
                        this.Main_Menu_Button_Array[index]++;
                    }
                    if (mouseIsPressed === true && this.Button_Press_Cooldown < 0) {
                        this.Button_Press_Cooldown = Button_Cooldown;
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
                "In this game, you need to try to evade any enemy. They are colored red. Your objective: survive as long as possible!\n\n" +
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
            if (keyIsPressed && keyCode === 27) {
                this.Set_Camera("Main_Menu");
                return;
            }
            CreateCloseButton(this);

            fill(255);
            textSize(50);
            textAlign(CENTER, CENTER);
            text("You died!", windowWidth/2 , 100);

            let Statistics = this.Statistics[this.Selected_Game_Mode];
            textSize(25);
            text("Current Score: " + Statistics.Max_Score, windowWidth/2, windowHeight / 2 - 50);
            text("Current Time: " + Statistics.Max_Time_Survived, windowWidth/2, windowHeight / 2);
            text("Current Level: " + Statistics.Max_Level, windowWidth/2, windowHeight / 2 + 50);


        }

        if (this.Current_Camera == "ESC_Screen") {
            let Size_Duration = 10;
            let Color = "White"
            let Dark_Color = "Grey"

            for (let index = 0; index < ESC_Button_Array.length; index++) {

                let Text = ESC_Button_Array[index]
                let New_Camera_State = ESC_Camera_Array[index]
                let Button_Width = 300;
                let Button_Height = 50;
                let ButtonX = windowWidth / 2 - Button_Width / 2 + index * Button_Width * 1.3 - ESC_Button_Array.length * Button_Width/2.4;
                let ButtonY = windowHeight / 2 + 300;

                if (CreateButton(ButtonX,ButtonY,Button_Width,Button_Height, this.ESC_Button_Array[index]/Size_Duration, Text, Color, Dark_Color, Size_Duration)) {
                    if (this.ESC_Button_Array[index] <= Size_Duration) {
                        this.ESC_Button_Array[index]++;
                    }
                    if (mouseIsPressed === true && this.Button_Press_Cooldown < 0) {
                        this.Button_Press_Cooldown = Button_Cooldown;
                        if (New_Camera_State == "Main_Menu") {
                            this.Set_Camera("Stop_Game") 
                        }
                        this.Set_Camera(New_Camera_State);
                        if (New_Camera_State == "Stop_Game") {
                            this.Set_Camera("New_Game")
                        }
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
            text("Current Time: " + Math.round(Statistics.Time_Survived/60), windowWidth/2, windowHeight / 2);
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
                // no clue why i use this.setcamera as a function and not as a camera
                this.Set_Camera("Stop_Game");
                this.Set_Camera("Lost_Screen");
            }
        }
    }
}