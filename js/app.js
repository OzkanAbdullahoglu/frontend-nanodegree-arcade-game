// Enemies our player must avoid
let enemySpeed = 0;
let allEnemies = [];
let succeed = false;
let level = 1;
let score = 0;
let lives = 3;
let readyCanvas = false;
let gemLocations = [];
let stoneLocations = [];

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

const defaultStart = {

  line: {
    1: 51,
    2: 122,
    3: 203,
    4: 303,
    5: 405
  },
  column: {
    1: 0,
    2: 101,
    3: 202,
    4: 303,
    5: 404
  }
}

class Enemy {
  constructor(x = 0, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    let speed = Math.floor(Math.random() * 3) * enemySpeed;
    this.speed = speed === 0 ? enemySpeed : speed;
  };

  update(dt) {

    if (this.speed === 0) {
      this.speed = enemySpeed;
    }
    this.x += dt * this.speed;
    if (this.x > 550) {
      this.x = -20;
      this.speed = Math.floor(Math.random() * 3) * enemySpeed;
    }
    this.collision();
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  collision() {
    //console.log(player.x);
    //console.log(Math.round(this.x));
    if ((Math.round(this.x) > player.x - 85 && Math.round(this.x) < player.x + 85) && Math.round(this.y) == player.y) {
      console.log('bingo');
      player.reset();
      lives-=1;
    }
  }
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// You should multiply any movement by the dt parameter
// which will ensure the game runs at the same speed for
// all computers.
// Draw the enemy on the screen, required method for game

console.log(succeed);

class Player {
  constructor() {
    this.sprite = 'images/char-boy.png';
    this.col = 3;
    this.line = 5;
  }

  update() {
    this.x = defaultStart.column[this.col];
    this.y = defaultStart.line[this.line];
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  handleInput(den) {
    let target = this;  

    if (den == 'left' && this.col > 1 ) {
      this.col--;
      stoneLocations.forEach(function(e){
        if(e.col === target.col && e.line === target.line){
target.col++;
        }
      }); 
      
    } else if (den == 'right' && this.col < 5) {
      console.log(target.col);
      this.col++;
      stoneLocations.forEach(function(e){
        if(e.col === target.col && e.line === target.line){
target.col--;
        }
      });
    } else if (den == 'up' && this.line >= 1 ) {
      console.log(target.line);
      this.line--;
      stoneLocations.forEach(function(e){
        if(e.col === target.col && e.line === target.line){
target.line++;
        }
      });
    } else if (den == 'down' && this.line < 5 ) {
      console.log(target.line);
      this.line++;
      stoneLocations.forEach(function(e){
        if(e.col === target.col && e.line === target.line){
target.line--;
        }
      });
    }
    if (this.line === 0) {
      let succeed = true;
      console.log(succeed);
      score+=100;
      level+=1;
      player.reset();
      createGemStones.show();
      if (level > 2 ){
        enemySpeed *=1.25;
        console.log(enemySpeed);
        stoneLocations = [];
        addRock.place();
      
      }
    }
  }

  reset() {
    this.col = 3;
    this.line = 5;
    let succeed = false;
  }
}


class GemStones {
    
  constructor() {
    this.sprite = this.choose();
        this.col = -1;
    this.line = -1;
  }

  update() {
    this.x = defaultStart.column[this.col]+10;
    this.y = defaultStart.line[this.line]+35;
        this.collect();
  }

  show() {
    this.sprite = this.choose();
    
    this.col = Math.floor(Math.random() * 5) + 1;
    this.line = Math.floor(Math.random() * 3) + 1;
    gemLocations.push({line: this.line, col: this.col});
    console.log(gemLocations);
    console.log(gemLocations.length);
    console.log(gemLocations[gemLocations.length-1].col);

  }

  score() {
    score+= 50;
    console.log(score);
  }

  hide() {
    
    this.col = -1;
    this.line = -1;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  choose() {
    const collections = ['images/Gem Blue.png','images/Gem Orange.png','images/Gem Green.png','images/Heart.png'];
let random = Math.floor(Math.random() * 4);
return collections[random];
  }

  collect() {
   
    if ((Math.round(this.x) > player.x - 85 && Math.round(this.x) < player.x + 85) && Math.round(this.y) -35 == player.y) {

      console.log('bingo2');
      
      this.hide();
      this.score();
      if(this.sprite ==='images/Heart.png' && lives<6 ) {
        console.log('true');
        console.log(this.sprite);
       lives+=1;
      }
    }
  }
}

class Block {

  constructor() {
    this.sprite = 'images/Rock.png';
        this.col = -1;
    this.line = -1;
  }

  update() {
    this.x = defaultStart.column[this.col]+10;
    this.y = defaultStart.line[this.line]+35;
       this.blockage();
  }

  place() {
    let randomLine = Math.floor(Math.random() * 3) + 1;
    let randomColumn = Math.floor(Math.random() * 5) + 1;
    this.sprite = 'images/Rock.png';
        if (randomLine !== gemLocations[gemLocations.length-1].line && randomColumn !== gemLocations[gemLocations.length-1].col) {
      console.log('truestone');
      this.col = randomColumn;  
      this.line = randomLine;
    } else  if(gemLocations[gemLocations.length-1].col === 5) {
      
      this.col = gemLocations[gemLocations.length-1].col -1;
      this.line = gemLocations[gemLocations.length-1].line ;
      console.log('truestone1');
    } else {
      this.col = gemLocations[gemLocations.length-1].col +1;
      this.line = gemLocations[gemLocations.length-1].line ;
console.log('truestone2');
    }
    stoneLocations.push({line: this.line, col: this.col});
    console.log(stoneLocations[stoneLocations.length-1].col);
     console.log(stoneLocations[stoneLocations.length-1].line);
    console.log(stoneLocations);
    console.log(this.line);
    console.log(this.col);
    }
    
  

 render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  blockage() {
     if ((Math.round(this.x) > player.x - 85 && Math.round(this.x) < player.x + 85) && Math.round(this.y) -35 == player.y) {

      console.log('bingo3');    
  }
}
}

const addRock = new Block();
const createGemStones = new GemStones();
let enemy1 = new Enemy(-150, defaultStart.line[1]);
let enemy2 = new Enemy(-250, defaultStart.line[2]);
let enemy3 = new Enemy(-350, defaultStart.line[3]);
allEnemies.push(enemy1, enemy2, enemy3);
const player = new Player();
console.log(player);




// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});