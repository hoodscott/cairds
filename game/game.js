/* Global variables for the suit and values */
const suits = ['S','C','D','H'];
const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

/* Holds the game and state */
class Session {
  constructor(num_players){
    /* Game Description object */
    this.game = new Game();

    /* Array of players */
    this.players = [];
    for (let i = 0; i < num_players; i++){
      let player = new Player(i);
      this.players.push(player);
    }

    /* 4x13 Array of card piles */
    this.piles = [];
    for (let i = 0;i < 4; i++){
      let row = [];
      for (let j = 0;j < 13; j++) {
        let pile = new Pile();
        row.push(pile);
      }
      this.piles.push(row);
    }
  }
}

class Game {
  constructor(){
    this.name = "game name";
    this.rules = new Rules();
  }
}

class Rules {
  constructor(){
    this.field1 = '1';
    this.field2 = '2';
  }
}

class Player {
  constructor(order){
    this.name = "PlayerName";
    /* Turn order for this player - player one = 0 */
    this.order = order;
    /* Array of hands of cards this player owns */
    this.hands = [];
    this.hands.push(new Hand());
  }
}

class Hand {
  constructor(){
    /* Can the owner view these cards */
    this.faceup = true;
    /* Can other players view when faceup */
    this.private = true;
    /* Can only the first card be interacted with / viewed */
    this.stack = false;
    /* Minimum - Maximum number of cards allowed in this hand */
    this.size = "0-5";
    /* Array of cards in this hand */
    this.cards = [];
    this.cards.push(new Card('D','Q'))
  }
}

class Pile {
  constructor(){
    /* SHould this pile be displayed */
    this.disabled = false;
    /* Minimum - Maximum number of cards allowed in this pile */
    this.size = "0-52";
    /* Can everyone see the cards in this pile */
    this.faceup = true;
    /* Can only the first card be interacted with / viewed */
    this.stack = false;
    /* Should the cards be overlaid vertically or horizontally 
     * When stack is true, this is overridden */
    this.vertical = false;
    /* Can players take cards from this pile */
    this.draw = true;
    /* Can players place cards in this pile */
    this.place = true;
    /* Array of cards in this pile */
    this.cards = [];
    this.cards.push(new Card('D','Q'));
  }
}

class Card {
  constructor(suit,value){
    /* S - Spades, C - Clubs, D - Diamonds, H - Hearts */
    this.suit = suit;
    /* A - Ace, J - Jack, Q - Queen, K - King, 2-10 - 2 through 10 */
    this.value = value;
  }
}

/* Creates an array of 52 cards */
function createFullDeck(){
  const deck = [];
  for (let i = 0; i < 52; i++){
    /* Use bitshifting to perform integer division and find the suit */
    const suit = suits[i/13 >> 0]
    /* Converting the index to a value or face card letter */
    const value = values[i % 13]
    const card = new Card(suit,value);
    deck.push(card);
  }
  return deck;
}

/* Adding Fisher-Yates shuffle to array objects for efficient shuffling */
Array.prototype.fy_shuffle = function() {
  let end = this.length, temp, i;
  /* While elements have still to be shuffled */
  while (end) {
    /* Select random element from front of array */
    i = Math.floor(Math.random() * end);
    end--;
    /* Swap it with element at end pointer */
    temp = this[end];
    this[end] =this[i];
    this[i] = temp;
  }
  return this;
}

/* Function to define how the cards are to be sorted */
function sortCards(a,b){
  if (a.suit === b.suit) {
    return values.indexOf(a.value) - values.indexOf(b.value);
  }
  else {
    return suits.indexOf(a.suit) - suits.indexOf(b.suit);
  }
}

/* Create 4 player game */
const ss = new Session(4);
document.getElementById('session').innerHTML = JSON.stringify(ss);

/* Create and shuffle and sort a new deck of cards */
const deck = createFullDeck();
deck.fy_shuffle();
deck.sort(sortCards);
document.getElementById('deck').innerHTML = JSON.stringify(deck);
