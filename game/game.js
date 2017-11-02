/* Global variables for the suit and values */
const suits = ['\u{2660}','\u{2661}','\u{2662}','\u{2663}'];
const suit_names = ['Spades','Hearts','Diamonds','Clubs'];
const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const value_names = ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King'];

/* Holds the game and state */
class Session {
  constructor(player_names){
    /* Game Description object */
    this.game = new Game();

    /* Array of players */
    let player_arr = [];
    player_names.forEach(function(p,i) {
      player_arr.push(new Player(p,i));
    })
    this.players = player_arr;    

    /* 4x13 Array of card piles */
    this.piles = [];
    for (let i = 0;i < 4; i++){
      let row = [];
      for (let j = 0;j < 13; j++) {
        row.push(new Pile(false,false,true));
      }
      this.piles.push(row);
    }
  }
  toString() {
    let splayer = '';
    this.players.forEach(function(player) {
      splayer += '\n' + player.toString();
    })
    let spile = '';
    this.piles.forEach(function(row, i) {
      row.forEach(function(pile, j) {
        if (pile.enabled) {
          spile += '\nPile ' + i + ',' + j + ': (' + pile.toString() + ')';
        }
      })
    })
    return splayer.slice(1) + '\nTable\n' + spile.slice(1);
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
  constructor(playername, order) {
    this.name = playername;
    /* Turn order for this player - player one = 0 */
    this.order = order;
    /* Array of hands of cards this player owns */
    this.hands = [];
    this.hands.push(new Pile(true,true,false));
  }
  dealCard(card,handIndex) {
    this[handIndex].cards.push(card);
  }
  toString() {
    let s = '';
    this.hands.forEach(function(hand, i) {
      s += '\nHand ' + i + ': ' + hand.toString();
    })
    return this.name + '\n' + s.slice(1);
  }
}

class Pile {
  constructor(enable,faceup,stack){
    /* Should this pile be displayed */
    this.enabled = enable;
    /* Minimum - Maximum number of cards allowed in this pile */
    this.size = "0-52";
    /* Can everyone see the cards in this pile */
    this.faceup = faceup;
    /* Can only the first card be interacted with / viewed */
    this.stack = stack;
    /* Should the cards be overlaid vertically or horizontally 
     * When stack is true, this is overridden */
    this.vertical = false;
    /* Can players take cards from this pile */
    this.draw = true;
    /* Can players place cards in this pile */
    this.place = true;
    /* Array of cards in this pile */
    this.cards = [];
  }
  dealCard(card){
    this.cards.push(card);
  }
  toString() {
    let s = '';
    if (!this.faceup) {
      this.cards.forEach(function(card){
        s += ',Back of Card';
      })
    }
    else {
      const stacked = this.stack;
      this.cards.forEach(function(card, i, arr){
        /* Only show top card if stacked */
        if (stacked && (i + 1 !== arr.length)) {
          s += ',Back of Card';
        }
        else {
          s += ',' + card.toString();
        }
      })
    }
    return s.substring(1);
  }
}

class Card {
  constructor(suit,value){
    /* S - Spades, C - Clubs, D - Diamonds, H - Hearts */
    this.suit = suit;
    /* A - Ace, J - Jack, Q - Queen, K - King, 2-10 - 2 through 10 */
    this.value = value;
  }
  toString() {
    return value_names[values.indexOf(this.value)] + ' of ' + suit_names[suits.indexOf(this.suit)];
  }
  toShortString() {
    return this.value + this.suit;
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

/* Basic texas holdem game */
function texasHoldem(g) {
  /* Clear hands */
  g.players.forEach(function(player) {
    player.hands[0].cards = [];
  })
  /* Clear table */
  for (let i = 0; i < 5; i++){
    g.piles[1][i].cards = [];
  }
  /* Set enabled piles on table */
  g.piles[0][0].enabled = true;
  for (let i = 0; i < 5; i++){
    g.piles[1][i].enabled = true;
  }
  /* Create and shuffle deck */
  let deck = createFullDeck();
  deck.fy_shuffle();
  /* Deal 2 cards to each player */
  g.players.forEach(function(player) {
    player.hands[0].dealCard(deck.pop());
  })
  g.players.forEach(function(player) {
    player.hands[0].dealCard(deck.pop());
  })
  /* Deal three faceup cards to the table */
  for (let i = 0; i < 3; i++){
    let pile = g.piles[1][i];
    pile.faceup = true;
    pile.dealCard(deck.pop())
  }
  /* Deal two facedown cards to the table */
  for (let i = 3; i < 5; i++){
    g.piles[1][i].dealCard(deck.pop())
  }
  /* Put deck on table */
  console.log(g.piles[0][0].cards.toString());
  g.piles[0][0].cards = deck;
  
  console.log(g.toString());

  /* Turn over each card */
  for (let i = 3; i < 5; i++){
    g.piles[1][i].faceup = true;
    console.log(g.toString());
  }
}

/* Create and run game */
const player_names = ['Alice','Bob','Charlie','Dave'];
const game = new Session(player_names);
texasHoldem(game);
