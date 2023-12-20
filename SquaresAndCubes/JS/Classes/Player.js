//Settings:
var Dash_Frames = 10;
var Dash_Cooldown = 60;
var Dash_Boost = 7;

var I_Frames_On_Hit = 60;


class Player  {
  constructor() {
      this.Size = 30;
      this.Step_Size = 5;
      this.Dash_Cooldown = 0;
      this.Dash_Frames = 0;
      this.Last_moving_Direction = 0;
      this.Dash_Vector = null;
      this.I_Frames = 0;
      this.Health = 5;
      this.x = windowWidth/2 - this.Size/2;
      this.y = windowHeight/2 - this.Size/2;
  }

  Constrain() {
    this.x = constrain(this.x, 0, windowWidth - this.Size);
    this.y = constrain(this.y, 0, windowHeight - this.Size);
  }

  Handle_Damage(Amount) {
    // deals damage and adds invincibility to the player
    Hit.play();
    this.I_Frames = I_Frames_On_Hit;
    this.Health -= Amount || 1;
    return;
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
      //use the dash direction instead of walking direction (when dashing, you will dash forward in the direction you dashed, and this value should not chaneg when walking)
      this.x += this.Dash_Vector[0];
      this.y += this.Dash_Vector[1];
      //return here so you can't move (the code below doesn't get runned)
      return ;
    }

    this.x += Move_Array[0];
    this.y += Move_Array[1];
  }
  

  Draw() {
      // Flickering effect when I_Frames is higher than 0
      let Current_Color = color('rgba(30,144,255,1)');
      if (this.I_Frames > 0) {
        Current_Color = color('rgba(30,144,255,0.5)');
      }
      push();
      stroke("black");
      fill(Current_Color);
      rect(this.x, this.y, this.Size, this.Size);
      // Show player's health on top of the player
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(16);
      text(this.Health, this.x + this.Size/2, this.y + this.Size/2);
      pop();
  }

  Check_Hitboxes(Enemy_Array) {
    if (this.I_Frames <= 0) {
      for (let count = 0; count < Enemy_Array.length; count++) {
        let Enemy = Enemy_Array[count];

        if (Enemy.Type == "Rectangle") {
          if (Enemy.Hitbox == true && Enemy.x >= this.x - Enemy.Width && Enemy.x <= this.x + this.Size && Enemy.y > this.y - Enemy.Width && Enemy.y < this.y + this.Size) {
             this.Handle_Damage(1);
            return;
          }
        }

        if (Enemy.Type == "Moving_Rectangle") {
          let EnemyX = lerp(Enemy.StartX, Enemy.EndX, Enemy.Current_Life_Time/Enemy.Life_Time);
          let EnemyY = lerp(Enemy.StartY, Enemy.EndY, Enemy.Current_Life_Time/Enemy.Life_Time);

          if (Enemy.Hitbox == true && EnemyX >= this.x - Enemy.Width && EnemyX <= this.x + this.Size && EnemyY > this.y - Enemy.Width && EnemyY < this.y + this.Size) {
             this.Handle_Damage(1);
            return;
          }
        }

        if (Enemy.Type == "Beam" && Enemy.Hitbox == true) {
          if (Enemy.Vertical == true) {
            //Enemy.Offset <= this.x + this.Size && Enemy.Offset + Enemy.MaxWidth >= this.x
            if (Enemy.Offset <= this.y + this.Size && Enemy.Offset + Enemy.MaxWidth >= this.y) {
              this.Handle_Damage(1);
              return;
            }
          } else {
            if (Enemy.Offset <= this.x + this.Size && Enemy.Offset + Enemy.MaxWidth >= this.x) {
              this.Handle_Damage(1);
              return;
            }
          }
        }

        if (Enemy.Type == "World_Beam") {
          this.Check_Hitboxes(Enemy.Beams);
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
      DeathSound.play();
      return true;
    }

    this.Move();
    this.Constrain();
    this.Draw();
  }
}