//Settings:
var Dash_Frames = 10;
var Dash_Cooldown = 60;
var Dash_Boost = 7;

var I_Frames_On_Hit = 60;

class Player  {
  constructor() {
      this.x = windowWidth/2;
      this.y = windowHeight/2;
      this.Size = 30;
      this.Step_Size = 5;
      this.Dash_Cooldown = 0;
      this.Dash_Frames = 0;
      this.Last_moving_Direction = 0;
      this.Dash_Vector = null;
      this.I_Frames = 0;
      this.Health = 5;
  }

  Constrain() {
    this.x = constrain(this.x, 0, windowWidth - this.Size);
    this.y = constrain(this.y, 0, windowHeight - this.Size);
  }

  Move() {
    var Move_Array = [0,0]

    if (keyIsDown(LEFT_ARROW)) {
      Move_Array[0] -= this.Step_Size;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      Move_Array[0] += this.Step_Size;
    }
    if (keyIsDown(UP_ARROW)) {
      Move_Array[1] -= this.Step_Size;
    }
    if (keyIsDown(DOWN_ARROW)) {
      Move_Array[1] += this.Step_Size;
    }

    if (keyIsDown(32) && this.Dash_Cooldown <= 0) {
      //-- make it so it remembers wherer the player "Looks" and then it should dash there instead of where it is curently going
      if (this.I_Frames < Dash_Frames) {
          this.I_Frames = Dash_Frames;
      }
      this.Dash_Frames = Dash_Frames;
      this.Dash_Cooldown = Dash_Cooldown;
      this.Dash_Vector = Move_Array;
      // make speed 2x because the player is dashing
      for (let count = 0;  count < this.Dash_Vector.length ;count++) {
        this.Dash_Vector[count] *= Dash_Boost;
      }
    }

    if (this.Dash_Frames > 0) {
      //use the dash direction instead of walking direction
      this.x += this.Dash_Vector[0];
      this.y += this.Dash_Vector[1];
      //return here so you can't move, so the code below doesn't get runned
      return ;
    }

    this.x += Move_Array[0];
    this.y += Move_Array[1];
  }
  

  Draw() {
      // Flickering effect when I_Frames is higher than 0
      let Current_Color = color('rgba(30,144,255,1)');
      if (this.I_Frames > 0) {
        Current_Color.setAlpha(0.5);
      }

      fill(Current_Color);
      rect(this.x - 2 / this.Size, this.y - 2 / this.Size, this.Size, this.Size);
      // Show player's health on top of the player
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(16);
      text(this.Health, this.x + this.Size/2, this.y + this.Size/2);
  }

  Check_Hitboxes(Enemy_Array) {
    if (this.I_Frames <= 0) {
      for (let count = 0; count < Enemy_Array.length; count++) {
        let Enemy = Enemy_Array[count];

        if (Enemy.Type == "Rectangle") {
          if (Enemy.Hitbox == true && Enemy.x >= this.x - Enemy.Width && Enemy.x <= this.x + this.Size && Enemy.y > this.y - Enemy.Width && Enemy.y < this.y + this.Size) {
            this.I_Frames = I_Frames_On_Hit;
            this.Health -= 1;
            return;
          }
        }

        if (Enemy.Type == "Beam" && Enemy.Hitbox == true) {
          //fix this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          if (Enemy.Vertical == true) {
            if (Enemy.Offset >= this.x - Enemy.MaxWidth && Enemy.Offset <= this.x + this.Size) {
              this.I_Frames = I_Frames_On_Hit;
              this.Health -= 1;
              return;
            }
          } else {
            if (Enemy.Offset >= this.y - Enemy.MaxWidth && Enemy.Offset <= this.y + this.Size) {
              console.log("HIT BY BEAM")
              this.I_Frames = I_Frames_On_Hit;
              this.Health -= 1;
              return;
            }
          }
        }
      }
    }
  }

  Handle_Frame(Enemy_Array) {
    this.I_Frames -= 1;
    this.Dash_Frames -= 1;
    this.Dash_Cooldown -= 1;
    this.Check_Hitboxes(Enemy_Array)

    if (this.Health <= 0) {
      return true;
    }

    this.Move();
    this.Constrain();
    this.Draw();
  }
}