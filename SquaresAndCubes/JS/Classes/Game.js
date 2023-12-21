//EDITED spacing for easier readability (for me)
var Difficulty_Array =          ["Easy",  "Normal", "Hard", "Impossible"];
var Difficulty_Scaling_Array =  [0.5,     1,        2,      5];
var Level_Start =               [0,       1,        2,      3];
var Points_Scaling =            [0.3333,  1,        2,      5]; // easy is too easy to gain points so it must become lower

//its a loottable
var Level_Enemy_Add = { // add 1 to the index and you will get the level required when that enemy starts appearing
  0: {Type: "Moving_Rectangle", Weight: 20},
  1: {Type: "Beam", Weight: 10},
  2: {Type: "World_Beam", Weight: 3},
}

var Level_Time = 10; // time it takes for the next level

//custom true or false generator
function Generate_True_Or_False() {
  var Number = Math.random()
  return Number < 0.5 // 49.99% true en 50.01% false (ongeveer)
}


class Game {
  constructor(Player, Game_Mode) {
    this.Difficulty_Step = 0.0001;
    this.Game_Mode = Game_Mode;
    this.level = 0;
    this.Score = 0;
    this.Time_Survived = 0;
    this.Modifier = 1; // make everything this times harder
    this.Scaling = null;
    this.Score_Modifier = null;
    this.Player = Player;
    this.Enemies = [];

    //made a quick loottable system
    this.EnemyLootTable = [
      { Type: "Rectangle", Weight: 70 },
    ];

    this.TotalWeight = 0;
    for (let index = 0; index < Difficulty_Array.length; index++) {
      if (Difficulty_Array[index] === Game_Mode) {
        this.Scaling = Difficulty_Scaling_Array[index];
        this.Score_Modifier = Points_Scaling[index];
        this.level = Level_Start[index];
        for (let Level_Count = 0; Level_Count < index; Level_Count++) {
          this.EnemyLootTable.push(Level_Enemy_Add[Level_Count]);
        }
        this.Update_Total_Weight();
        return;
      }
    }

    console.log("No difficulty selected", Game_Mode)
  }

  Update_Total_Weight() {
    this.TotalWeight = 0;//reset the total weight
    for (let index = 0; index < this.EnemyLootTable.length; index++) {
      // only continue if this.EnemyLootTable[index] is defined
      if (this.EnemyLootTable[index]) {
        this.TotalWeight += this.EnemyLootTable[index].Weight;
      }
    }
  }

  Handle_Frame() {
    this.Time_Survived++;
    this.Score += Math.sqrt(this.Score_Modifier * this.Time_Survived/60);
    this.Modifier += this.Difficulty_Step * this.Scaling

    //level up
    if (Math.floor(this.Time_Survived) % (Level_Time * 60) === 0) {
      if (Level_Enemy_Add[this.level]) {
        this.EnemyLootTable.push(Level_Enemy_Add[this.level]);
        this.Update_Total_Weight();
        Level_Up.play();
        console.log("E");
      }
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

  }

  Spawn_Random_Enemy() {

    let Random_Value = Math.random();
    let Current_Weight = 0;
    let Selected_Type;
    // super simple loottable
    for (let Index = 0; Index < this.EnemyLootTable.length; Index++) {
      Current_Weight += this.EnemyLootTable[Index].Weight;
      if (Random_Value <= Current_Weight/this.TotalWeight) {
        Selected_Type = this.EnemyLootTable[Index].Type;
        break;
      }
    }

    if (Selected_Type == "Rectangle") {
      this.Enemies.push(new Enemy(Selected_Type, Math.random() * windowWidth, Math.random() * windowHeight, Math.random() * 50 + 50 * this.Modifier));
    }

    if (Selected_Type == "Beam") {
      this.Enemies.push(new Enemy(Selected_Type, Math.random() * windowHeight, null, 30 * this.Modifier, null));
    }

    if (Selected_Type == "World_Beam") {
      let Width = 30 * this.Modifier
      let Alter = Generate_True_Or_False();
      if (Generate_True_Or_False()) {
        this.Enemies.push(new Enemy(Selected_Type, true, Math.round(windowHeight/Width), Width, 10, Alter))
      } else {
        this.Enemies.push(new Enemy(Selected_Type, false, Math.round(windowWidth/Width), Width, 10, Alter))
      }
    }
    
    if (Selected_Type == "Moving_Rectangle") {
      let Width =  Math.random() * 20 + 40 * this.Modifier;
      this.Enemies.push(new Enemy(Selected_Type, Math.random()*windowWidth,Math.random()*windowHeight,Math.random()*windowWidth,Math.random()*windowHeight,Width,1));
    }
  }
}
