var Difficulty_Array = ["Easy","Normal","Hard","Impossible"];
var Difficulty_Scaling_Array = [0.5, 1, 2, 5];

class Game {
  constructor(Player, Game_Mode) {
    this.Difficulty_Step = 0.0001;
    this.Game_Mode = Game_Mode;
    this.level = 0;
    this.Score = 0;
    this.Time_Survived = 0;
    this.Modifier = 1; // make everything this times harder
    this.Scaling = null;
    this.Player = Player;
    this.Enemies = [];
    this.EnemyLootTable = [
      { type: "Rectangle", Weight: 0 },
      { type: "Beam", Weight: 1 },
      // Add more enemy types and difficulties as needed
    ];
    this.TotalWeight = 0;
    for (let index = 0; index < this.EnemyLootTable.length; index++) {
      this.TotalWeight += this.EnemyLootTable[index].Weight
    }

    for (let index = 0; index < Difficulty_Array.length; index++) {
      if (Difficulty_Array[index] === Game_Mode) {
        this.Scaling = Difficulty_Scaling_Array[index];
        console.log(this.Scaling);
        return;
      }
    }
    console.log("No difficulty selected", Game_Mode)
  }

  Handle_Frame() {
    this.Time_Survived++;
    this.Score += Math.sqrt(this.Scaling * this.Time_Survived/60);
    this.Modifier += this.Difficulty_Step * this.Scaling

    if (Math.floor(this.Time_Survived) % (30 * 60) === 0) {
      this.level++;
    }

    // Randomly spawn enemies based on the loot table
    if (Math.random() < (0.1 * this.Modifier)) {
      this.Spawn_Random_Enemy();
    }

    // Remove and handle enemies
    let remove_indexes = [];
    for (let index = 0; index < this.Enemies.length; index++) {
      let Var_Enemy = this.Enemies[index];
      let Remove = Var_Enemy.Handle_Frame();

      if (Remove) {
        remove_indexes.push(index);
      }
    }

    for (let Index = remove_indexes.length - 1; Index >= 0; Index--) {
      this.Enemies.splice(remove_indexes[Index], 1);
    }

    // draw score
    textSize(20);
    textAlign(CENTER, CENTER);
    fill(255); // white
    text("Score: " + Math.floor(this.Score), windowWidth / 2 - 150, 30);
    text("Time: " + Math.floor(this.Time_Survived/60), windowWidth / 2, 30)
    text("Level: " + this.level, windowWidth / 2 + 150, 30);
  }

  Spawn_Random_Enemy() {

    let Random_Value = Math.random();
    let Current_Weight = 0;
    let Selected_Type;
    // super simple loottable
    for (let Index = 0; Index < this.EnemyLootTable.length; Index++) {
      Current_Weight += this.EnemyLootTable[Index].Weight;
      if (Random_Value <= Current_Weight/this.TotalWeight) {
        Selected_Type = this.EnemyLootTable[Index].type;
        break;
      }
    }

    if (Selected_Type == "Rectangle") {
      console.log("RECTANGLE")
      this.Enemies.push(new Enemy(Selected_Type, Math.random() * windowWidth, Math.random() * windowHeight, Math.random() * 50 + 50 * this.Modifier));
    }

    if (Selected_Type == "Beam") {
      console.log("beam")
      this.Enemies.push(new Enemy(Selected_Type, Math.random() * windowHeight, null, 30 * this.Modifier, null));
    }

    if (Selected_Type == "world_Beam") {

    }
    
  }
}
