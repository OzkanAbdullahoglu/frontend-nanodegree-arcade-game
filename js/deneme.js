/**
 * @description Choosing functions which has to be called first .
 */
window.onload = function() {
  cardShuffle();
  begin();
};
// an array to hold the cards
let cards = [];
// an array to hold clicked cards
let listArray = [];
// selecting star icons to manipulate
let starElement = document.querySelectorAll('.fa-star');
// selecting span to implement moves (mouse clicks)
let moves = document.querySelector('.moves');
// selecting whole deck to collect cards
let deck = document.querySelector('.deck');
// selecting cards all children and declaring this with a variable
let deckCards = deck.children;
// selecting span to implement game timer
let timeCounter = document.querySelector('.timer');
// selecting cards to manipulate
let clickedCard = document.querySelectorAll('.card');
// selecting restart icon to manipulate
const restart = document.querySelector('.restart');
// selecting button in modal to manipulate
const replay = document.querySelector('.btn-primary');
// listening click event to call reset function
restart.addEventListener('click', reset);
replay.addEventListener('click', reset);
// listening click event to call timer function
deck.addEventListener('click', timer); 
// declaring variables for game timer
let second = 0,
  minute = 0,
  hour = 0;
let timeStop;
// counting variable for clicks
let count = 0;
// declaring variable which is counting remaining star icons
let bagdeCount = 0;
// declaring variable which will be used in for loops
let i;
/**
 * @description Shuffling cards and creating an array which holds the cards
 * @param {array} cards
 */
function cardShuffle() {
  for (i = 0; i < deckCards.length; i++) {
    let pushCards = deckCards[i].children[0].className;
    cards.push(pushCards);
  }
  let shuffled = shuffle(cards);
  for (i = 0; i < shuffled.length; i++) {
    deckCards[i].children[0].className = shuffled[i];
  }
}

/**
 * @description Shuffling an array 
 * @param {array} array
 * Shuffle function from http://stackoverflow.com/a/2450976
 */
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/**
 * @description counting clicks on to the cards
 */
function clickCounter() {
  count += 1;
  if (count > 1) {
    moves.innerHTML = count + ' Moves';
  } else {
    moves.innerHTML = count + ' Move';
  }
}

/**
 * @description decreasing star rating up to the click counts
 */
function badge() {
  if (count > 31 && count <= 64) {
    starElement[2].className = 'fa fa-star-o';
    bagdeCount = 2;
  } else if (count > 64) {
    starElement[1].className = 'fa fa-star-o';
    bagdeCount = 1;
  } else {
    bagdeCount = 3;
  }
}

/**
 * @description listening click event with a loop in whole cards
 * Displaying clicked cards by calling the function displayCard
 * Count the clicks by calling the function clickCounter
 * Decreasing star rating by calling the function badge
 * Comparing two displayed cards, If they match freeze them as displayed by calling the function locked
 * If they do not match close the cards by calling the function hide
 * Checking If the game is completed and calling the modal to slide down the page
 * Implementing the game results into the modal 
 */
function begin() {
  for (let i = 0; i < clickedCard.length; i++) {
      clickedCard[i].addEventListener('click', function(e) {
      collectClickedCards(clickedCard[i]);
      displayCard(clickedCard[i]);
      badge();
      if (listArray.length % 2 === 0) {
        disabled();
        clickCounter();
        if (listArray[(listArray.length - 1)] === listArray[(listArray.length - 2)]) {
          setTimeout(function() { locked(listArray[(listArray.length - 1)]); }, 1000);
          setTimeout(function() { enabled(); }, 1000);
        } else {
          setTimeout(function() { hide(listArray[(listArray.length - 1)]); }, 1000);
          setTimeout(function() { hide(listArray[(listArray.length - 1)]); }, 1000);
        }
      }
      if (listArray.length === 16) {
        clearInterval(timeStop);
        setTimeout(function() { $('#modalCenter').modal('show'); }, 1000);
        let modalSelector = document.querySelector('.modal-body');
        let outputOne = document.createElement('p');
        let outputTwo = document.createElement('p');
        modalSelector.innerHTML = '<p> Your rating is : ' + bagdeCount + ' Star(s)</p>';
        modalSelector.appendChild(outputOne);
        modalSelector.appendChild(outputTwo);
        outputOne.innerHTML = ' Your total move is : ' + count;
        if (hour > 0) {
          outputTwo.innerHTML = 'You cleared the deck in ' + hour + ' hour(s) ' + minute + ' mins ' + second + ' secs';
        } else {
          outputTwo.innerHTML = 'You cleared the deck in ' + minute + ' min(s) ' + second + ' secs';
        }
      }
    });
  }
}

/**
 * @description to disable pointer events
 */
function disabled() {
  let freeze = document.querySelectorAll('[class= card]');
  for (i = 0; i < freeze.length; i++) {
    freeze[i].className = 'card disabled';
  }
}

/**
 * @description to enable pointer events
 */
function enabled() {
  let reactive = document.querySelectorAll('[class=' + CSS.escape('card disabled') + ']');
  for (i = 0; i < reactive.length; i++) {
    reactive[i].className = 'card';
  }
}

/**
 * @description open the cards which is clicked
 * @param {string[]} open
 */
function displayCard(open) {
  open.className = 'card open show ';
}

/**
 * @description collecting cards which is clicked into an array 
 * @param {string[]} list
 */
function collectClickedCards(list) {
  let cardName = list.children[0].className;
  listArray.push(cardName);
}

/**
 * @description to freeze the cards which are matched
 * @param {string[]} equal
 */
function locked(equal) {
  let matchedCards = document.querySelectorAll('[class=' + CSS.escape(equal) + ']');
  for (let i = 0; i < matchedCards.length; i++) {
    matchedCards[i].parentElement.className = 'card match';
  }
}

/**
 * @description close the cards which are not matched
 * @param {string[]} notEqual
 * To enable pointer events in whole closed cards
 */
function hide(notEqual) {
  let unMatchedCards = document.querySelectorAll('[class=' + CSS.escape(notEqual) + ']');
  for (let i = 0; i < unMatchedCards.length; i++) {
    unMatchedCards[i].parentElement.className = 'card';
  }
  listArray.pop();
  enabled();
}

/**
 * @description setting up a timer
 */
function timer() {
blockDeckClicks();
  timeStop = setInterval(function() {
    if (hour > 0) {
      timeCounter.innerHTML = 'Timer: ' + hour + ' hrs ' + minute + ' mins ' + second + ' secs';
    } else {
      timeCounter.innerHTML = 'Timer: ' + minute + ' min(s) ' + second + ' secs';
    }
    second++;
    if (second == 60) {
      minute++;
      second = 0;
    }
    if (minute == 60) {
      hour++;
      minute = 0;
    }
  }, 1000);
}

/**
* @description removing event listener from the deck 
*/
function  blockDeckClicks () {
 deck.removeEventListener('click',timer);
}
    
/**
 * @description reloading the page to restart the application
 */
function reset() {
  location.reload();
}