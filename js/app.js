// Enemyspeed as a start 
let enemySpeed = 50;
// an empty array to collect enemies
let allEnemies = [];
// variables for player stats
let level = 1;
let score = 0;
let lives = 3;
// an empty array to collect gem locations
let gemLocations = [];
// an empty array to collect stone locations
let stoneLocations = [];
// an event listener which disallows space and arrow keys for a better user experience
window.addEventListener("keydown", function(e) {
  if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);
// default parameters for line and columns in canvas
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
};

/**
 * @description Defining enemy actions 
 * @constructor Loading enemy image
 * @update defining enemy speed
 * @render rendering enemy 
 * @collision defining what to do in case of intersection of enemy and player
 */
class Enemy {
  constructor(x, y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    let speed = Math.floor(Math.random() * 2) * enemySpeed;
    this.speed = speed === 0 ? enemySpeed : speed;
  }
  update(dt) {
    if (this.speed === 0) {
      this.speed = enemySpeed;
    }
    this.x += dt * this.speed;
    if (this.x > 550) {
      this.x = -20;
      this.speed = Math.floor(Math.random() * 2) * enemySpeed;
    }
    this.collision();
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  collision() {
    if ((Math.round(this.x) > player.x - 85 && Math.round(this.x) < player.x + 85) && Math.round(this.y) == player.y) {
      player.reset();
      lives -= 1;
    }
  }
}

/**
 * @description Defining player actions 
 * @constructor Loading player image
 * @update defining player location
 * @render rendering player 
 * @handleinput let the user handle player character by arrow keys
 * @handleinput block player charecter moves in case intersection of stone
 * @handleinput in case of winning a round incrementing player stats, enemyspeed, placing gem stones, reseting player position
 * @handleinput in case of reaching higher levels (over level 10) placing stone as a complexity factor
 */
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
    if (den == 'left' && this.col > 1) {
      this.col--;
      stoneLocations.forEach(function(e) {
        if (e.col === target.col && e.line === target.line) {
          target.col++;
        }
      });
    } else if (den == 'right' && this.col < 5) {
      this.col++;
      stoneLocations.forEach(function(e) {
        if (e.col === target.col && e.line === target.line) {
          target.col--;
        }
      });
    } else if (den == 'up' && this.line >= 1) {
      this.line--;
      stoneLocations.forEach(function(e) {
        if (e.col === target.col && e.line === target.line) {
          target.line++;
        }
      });
    } else if (den == 'down' && this.line < 5) {
      this.line++;
      stoneLocations.forEach(function(e) {
        if (e.col === target.col && e.line === target.line) {
          target.line--;
        }
      });
    }
    if (this.line === 0) {
      score += 100;
      level += 1;
      player.reset();
      createGemStones.show();
      if (level > 5) {
        enemySpeed *= 1.1;
        stoneLocations = [];
        addRock.place();
      }
    }
  }
  reset() {
    this.col = 3;
    this.line = 5;
  }
}

/**
 * @description Defining Gemstones actions 
 * @constructor Loading Gemstone image
 * @update defining Gemstone location and callback collect function
 * @render rendering Gemstone 
 * @show collecting Gemstone locations into an array which is created before
 * @score incrementing score in case of collecting Gemstones by user
 * @hide hiding Gemstone by manipulating Its location out of the canvas
 * @choose randomly choosing one of Gemstone or Heart
 * @collect Defining actions which let user to collect Gemstones or Heart
 * @collect In case of collection Heart incrementing lives which is also limited max 6
 */
class GemStones {
  constructor() {
    this.sprite = this.choose();
    this.col = -1;
    this.line = -1;
  }
  update() {
    this.x = defaultStart.column[this.col] + 10;
    this.y = defaultStart.line[this.line] + 35;
    this.collect();
  }
  show() {
    this.sprite = this.choose();
    this.col = Math.floor(Math.random() * 5) + 1;
    this.line = Math.floor(Math.random() * 3) + 1;
    gemLocations.push({ line: this.line, col: this.col });
  }
  score() {
    score += 50;
  }
  hide() {
    this.col = -1;
    this.line = -1;
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  choose() {
    const collections = ['images/Gem Blue.png', 'images/Gem Orange.png', 'images/Gem Green.png', 'images/Heart.png', 'images/Star.png'];
    let random = Math.floor(Math.random() * 5);
    return collections[random];
  }
  collect() {
    if ((Math.round(this.x) > player.x - 85 && Math.round(this.x) < player.x + 85) && Math.round(this.y) - 35 == player.y) {
      this.hide();
      this.score();
      if (this.sprite === 'images/Heart.png' && lives < 6) {
        lives += 1;
      }
      if (this.sprite === 'images/Star.png' && ((level > 10 && level <= 15) || (level > 20 && level <= 25) || (level > 30 && level <= 35))) {
        enemySpeed = 50;
      }
    }
  }
}

/**
 * @description Defining Block actions 
 * @constructor Loading Rock image
 * @update defining stone location 
 * @render rendering stone 
 * @place placing stone randomly to the canvas and preventing any coincedence of Gemstone location
 * @place collecting stone locations into an array which is created before
 */
class Block {
  constructor() {
    this.sprite = 'images/Rock.png';
    this.col = -1;
    this.line = -1;
  }
  update() {
    this.x = defaultStart.column[this.col];
    this.y = defaultStart.line[this.line] + 15;
  }
  place() {
    let randomLine = Math.floor(Math.random() * 3) + 1;
    let randomColumn = Math.floor(Math.random() * 5) + 1;
    this.sprite = 'images/Rock.png';
    if (randomLine !== gemLocations[gemLocations.length - 1].line && randomColumn !== gemLocations[gemLocations.length - 1].col) {
      this.col = randomColumn;
      this.line = randomLine;
    } else if (gemLocations[gemLocations.length - 1].col === 5) {
      this.col = gemLocations[gemLocations.length - 1].col - 1;
      this.line = gemLocations[gemLocations.length - 1].line;
    } else {
      this.col = gemLocations[gemLocations.length - 1].col + 1;
      this.line = gemLocations[gemLocations.length - 1].line;
    }
    stoneLocations.push({ line: this.line, col: this.col });
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}
// creating objects for Block,Gemstones and Player 
const addRock = new Block();
const createGemStones = new GemStones();
const player = new Player();
// creating objects for enemies with starting location on the lines
let enemy1 = new Enemy(-150, defaultStart.line[1]);
let enemy2 = new Enemy(-350, defaultStart.line[2]);
let enemy3 = new Enemy(-550, defaultStart.line[3]);
// collectings enemies into an array which is created before
allEnemies.push(enemy1, enemy2, enemy3);
// This listens for key presses and sends the keys to Player.handleInput() method.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});