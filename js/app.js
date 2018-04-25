// Enemies our player must avoid
let enemySpeed = 100;
let allEnemies = [];
let succeed = false;
console.log(succeed);
//let deneme = [];

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
    }
  }
}



/*let createGemStone1 = new GemStones(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 3) + 1);
let createGemStone2 = new GemStones(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 3) + 1);
let createGemStone3 = new GemStones(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 3) + 1);
deneme.push(createGemStone1,createGemStone2,createGemStone3);*/



// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// You should multiply any movement by the dt parameter
// which will ensure the game runs at the same speed for
// all computers.
// Draw the enemy on the screen, required method for game



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
    if (den == 'left' && this.col > 1) {
      this.col--;
    } else if (den == 'right' && this.col < 5) {
      this.col++;
    } else if (den == 'up' && this.line >= 1) {
      this.line--;
    } else if (den == 'down' && this.line < 5) {
      this.line++;
    }
    if(this.line === 0) {
        let succeed = true;
        console.log(succeed);
        player.reset();

        //createGemStones();
        //createGemStones.update();
        //console.log(createGemStones.update());
        
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
        this.sprite = 'images/Gem Blue.png';
        this.col = Math.floor(Math.random() * 5) + 1;
        this.line = Math.floor(Math.random() * 3) + 1;
    }
    update() {
        console.log(succeed);
        if (succeed = true) {
    this.x = defaultStart.column[this.col];
    this.y = defaultStart.line[this.line];
}
   
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //console.log(this.x);
    //console.log(this.y);
  }
  /*collision() {
    //console.log(player.x);
    //console.log(Math.round(this.x));
    if ((Math.round(this.x) > player.x - 85 && Math.round(this.x) < player.x + 85) && Math.round(this.y) == player.y) {
      console.log('bingo2');
      player.reset();
    }*/
}
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