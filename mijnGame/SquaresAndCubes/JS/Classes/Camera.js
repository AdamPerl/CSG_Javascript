//camera

var Difficulty_Array = ["Easy","Normal","Hard","Impossible"];
var Color_Array = ["green","darkgrey","red","white"];
var Darker_Color_Array = ["darkgreen","grey","darkred", "gold"]; // somehow darkgrey looks less dark then grey

var Main_Menu_Button_Array = ["Play", "Statistics"];
var Main_Menu_Camera_Array = ["Dificulty_Select", "Statistics"];

function CreateCloseButton(Self) {
    var Close_Button_Width = 50;
    var Close_Button_Height = 50;
    var Close_ButtonX = Close_Button_Width / 2;
    var Close_ButtonY = Close_Button_Height / 2;
    fill("darkred");
    if (mouseX > Close_ButtonX && mouseX < Close_ButtonX + Close_Button_Width && mouseY > Close_ButtonY && mouseY < Close_ButtonY + Close_Button_Height) {
        fill("red");
        if (mouseIsPressed === true) {
            Self.Set_Camera("Main_Menu")
            return;
        }
    }

                
    rect(Close_ButtonX, Close_ButtonY, Close_Button_Width, Close_Button_Height);

    textAlign(CENTER, CENTER);
    textSize(40);
    fill(0);

    text("X", Close_ButtonX + Close_Button_Width / 2, Close_ButtonY + Close_Button_Height / 2);
}

function CreateButton(ButtonX,ButtonY,Button_Width,Button_Height,Delta, Button_Text, Color, HoverColor, Size_Duration) {
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
            Easy: {
                Max_Score: 0,
                Max_Time_Survived: 0,
                Max_Level: 0,
            },
            Normal: {
                Max_Score: 0,
                Max_Time_Survived: 0,
                Max_Level: 0,
            },
            Hard: {
                Max_Score: 0,
                Max_Time_Survived: 0,
                Max_Level: 0,
            },
            Impossible: {
                Max_Score: 0,
                Max_Time_Survived: 0,
                Max_Level: 0,
            },
        }
        this.Current_Camera = "Main_Menu";
        this.Selected_Game_Mode = null;
        this.Button_Hover_Frames = [];

        for (let Button_Hover = 0; Button_Hover < Difficulty_Array.length; Button_Hover++) {
            this.Button_Hover_Frames.push(0); // make 1 new value for each button which is going to be the frames your mouse is on
        }
    }

    Set_Camera(New_Camera) {
        //set the currentcamera to the new camera
        this.Current_Camera = New_Camera


        if (this.Current_Camera == "Main_Menu") {

            return;
        }
        
        if (this.Current_Camera == "Stop_Game") {
            this.Statistics[this.Selected_Game_Mode].Max_Score = Math.round(this.New_Game.Score);
            this.Statistics[this.Selected_Game_Mode].Max_Time_Survived = Math.round(this.New_Game.Time_Survived/60);
            this.Statistics[this.Selected_Game_Mode].Max_Level = Math.round(this.New_Game.level);

            this.New_Game = null;
            this.New_Player = null;
            return;
        }


        if (this.Current_Camera == "New_Game") {
            this.New_Player = new Player();
            this.New_Game = new Game(this.New_Player, this.Selected_Game_Mode);
            // redirect
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
    }

    Handle_Frame() {
        if (this.Current_Camera == "Dificulty_Select") {

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
            

                if (CreateButton(ButtonX,ButtonY,Button_Width,Button_Height, this.Button_Hover_Frames[index]/Size_Duration, Game_Mode, Color, Dark_Color, Size_Duration)) {
                    if (this.Button_Hover_Frames[index] <= Size_Duration) {
                        this.Button_Hover_Frames[index]++;
                    }
                    if (mouseIsPressed === true) {
                        this.Selected_Game_Mode = Game_Mode;
                        this.Set_Camera("New_Game");
                        return;
                    }
                } else {
                    this.Button_Hover_Frames[index] = 0;
                }

                fill(Color);
            }
        }

        if (this.Current_Camera == "Statistics") {
            fill(255);

            textAlign(LEFT); // left zodat het mooi naast elkaar zit.
            textSize(20);

            let Padding_Left = 50

            for (var index = 0; index < Difficulty_Array.length; index++) {
                push();
                let Statistics = this.Statistics[Difficulty_Array[index]]
                text("Highest Score: " + Statistics.Max_Score, index * windowWidth/4 + Padding_Left, windowHeight / 2 - 50);
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

            for (var index = 0; index < Main_Menu_Button_Array.length; index++) {

                let Text = Main_Menu_Button_Array[index]
                let New_Camera_State = Main_Menu_Camera_Array[index]
                var Button_Width = 100;
                var Button_Height = 50;
                var ButtonX = windowWidth / 2 - Button_Width / 2;
                var ButtonY = windowHeight / 2 - Button_Height / 2 + 100 * index + 50 * Main_Menu_Button_Array.length;

                push();
                fill(255);

                if (mouseX > ButtonX && mouseX < ButtonX + Button_Width && mouseY > ButtonY && mouseY < ButtonY + Button_Height) {
                    fill("yellow");
                    if (mouseIsPressed === true) {
                        this.Set_Camera(New_Camera_State)
                        return;
                    }
                }

                rect(ButtonX, ButtonY, Button_Width, Button_Height);

                fill(0);
                text(Text, ButtonX + Button_Width / 2, ButtonY + Button_Height / 2);

                pop();
            }
        }

        if (this.Current_Camera == "Lost_Screen") {
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


        if (this.Current_Camera == "Play_Ground") {
            this.New_Game.Handle_Frame();
            var Died = this.New_Player.Handle_Frame(this.New_Game.Enemies);
            if (Died) {
                // no clue why i use this.setcamera as a function
                this.Set_Camera("Stop_Game");
                this.Set_Camera("Lost_Screen");
            }
        }
    }
}