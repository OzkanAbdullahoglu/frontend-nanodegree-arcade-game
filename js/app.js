// Enemies our player must avoid
let enemySpeed = 50;
let allEnemies = [];

let level = 1;
let score = 0;
let lives = 3;

let gemLocations = [];
let stoneLocations = [];

window.addEventListener("keydown", function(e) {
  // space and arrow keys
  if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
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
};

class Enemy {

  constructor(x , y) {

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
      console.log('bingo');
      player.reset();
      lives -= 1;
    }
  }
}

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
      console.log(target.col);
      this.col++;
      stoneLocations.forEach(function(e) {
        if (e.col === target.col && e.line === target.line) {
          target.col--;
        }
      });
    } else if (den == 'up' && this.line >= 1) {
      console.log(target.line);
      this.line--;
      stoneLocations.forEach(function(e) {
        if (e.col === target.col && e.line === target.line) {
          target.line++;
        }
      });
    } else if (den == 'down' && this.line < 5) {
      console.log(target.line);
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
      if (level > 2) {
        enemySpeed *= 1.1;
        console.log(enemySpeed);
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

class GemStones {

  constructor() {
    this.sprite = this.choose();
    this.col = -1;
    this.line = -1;
  }

  update() {
    this.x = defaultStart.column[this.col] + 10;
    this.y = defaultStart.line[this.line] + 45;
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
    const collections = ['images/Gem Blue.png', 'images/Gem Orange.png', 'images/Gem Green.png', 'images/Heart.png'];
    let random = Math.floor(Math.random() * 4);
    return collections[random];
  }

  collect() {

    if ((Math.round(this.x) > player.x - 85 && Math.round(this.x) < player.x + 85) && Math.round(this.y) - 45 == player.y) {
      this.hide();
      this.score();
      if (this.sprite === 'images/Heart.png' && lives < 6) {
        console.log('true');
        console.log(this.sprite);
        lives += 1;
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
    this.x = defaultStart.column[this.col];
    this.y = defaultStart.line[this.line] + 15;
    this.blockage();
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

  blockage() {
    if ((Math.round(this.x) > player.x - 85 && Math.round(this.x) < player.x + 85) && Math.round(this.y) - 35 == player.y) {}
  }
}

const addRock = new Block();
const createGemStones = new GemStones();
let enemy1 = new Enemy(-150, defaultStart.line[1]);
let enemy2 = new Enemy(-350, defaultStart.line[2]);
let enemy3 = new Enemy(-550, defaultStart.line[3]);
allEnemies.push(enemy1, enemy2, enemy3);
const player = new Player();

document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});