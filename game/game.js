/* Global variables for the suit and values */
const suits = ['S','H','D','C'];
const suit_symbols = ['\u{2660}','\u{2661}','\u{2662}','\u{2663}'];
const suit_names = ['Spades','Hearts','Diamonds','Clubs'];
const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const value_names = ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King'];

/* Holds the game and state */
class Session {
  constructor(player_names, hand_params = [], pile_params = [[]]){
    /* Array of players */
    let player_arr = [];
    player_names.forEach(function(p,i) {
      player_arr.push(new Player(p,i,hand_params));
    })
    this.players = player_arr;  

    /* 4x13 Array of card piles */
    this.piles = [];
    for (let i = 0;i < 4; i++){
      let row = [];
      for (let j = 0;j < 13; j++) {
        row.push(new Pile(...pile_params[i][j]));
      }
      this.piles.push(row);
    }
  }
  /* Get card from a pile  */
  getCardfromPile(row,col,i) {
    const i = this.piles[row][col].cards.indexOf(card);
    return this.piles[row][col].cards.splice(i,1);
  }
  getCardFromHand(player,hand,card) {
    const i = this.players[player].hands[hand].cards.indexOf(card);
    return this.players[player].hands[hand].cards.splice(i,1);
  }
  getTopCardfromPile(row,col) {
    return this.piles[row][col].cards.pop();
  }
  getTopCardfromHand(player,card) {
    return this.players[player].hands[hand].cards.pop();
  }
  getCardsfromPile(row,col) {
    return this.piles[row][col].cards.splice(0);
  }
  getCardsfromHand(player,hand) {
    return this.players[player].hands[hand].cards.splice(0);
  }
   /* Deal one card to group of cards */
   addtoPile(row,col,card) {
    this.piles[row][col].cards.push(card);
  }
  addtoHand(player,hand,card) {
    this.players[player].hands[hand].cards.push(card);
  }
  addtoPileBottom(row,col,card) {
    this.piles[row][col].cards.unshift(card);
  }
  addtoHandBottom(player,hand,card) {
    this.players[player].hands[hand].cards.unshift(card);
  }
  /* Overwrite value with specified cards */
  setPile(row,col,cards = []) {
    this.piles[row][col].cards = cards;
  }
  setHand(player,hand,cards = []) {
    this.players[player].hands[hand].cards = cards;
  }
  /* Set pile properties */
  setPileFaceUp(row,col,faceup) {
    this.piles[row][col].faceup = faceup;
  }
  setHandFaceUp(player,hand,faceup) {
    this.players[player].hands[hand].faceup = faceup;
  }
  /* Shuffle specified cards */
  shufflePile(row,col) {
    this.piles[row][col].cards.fy_shuffle();
  }
  shuffleHand(player,hand) {
    this.players[player].hands[hand].cards.fy_shuffle();
  }
  /* Sort specified cards */
  sortPile(row,col) {
    this.piles[row][col].cards.sort(sortCards);
  }
  sortHand(player,hand) {
    this.players[player].hands[hand].cards.sort(sortCards);
  }
 
  /* Return string representation */
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

class Player {
  constructor(playername, order, player_params) {
    this.name = playername;
    /* Turn order for this player - player one = 0 */
    this.order = order;
    /* Array of hands of cards this player owns */
    const h = [];
    player_params.forEach(function(params,i) {
      h.push(new Pile(...params));
    });
    this.hands = h;
  }
  dealCard(card,handIndex) {
    this[handIndex].cards.push(card);
  }
  toString() {
    let s = '';
    this.hands.forEach(function(hand, i) {
      s += '\nHand ' + i + ': ' + hand.toString();
    });
    return this.name + '\n' + s.slice(1);
  }
}

class Pile {
  constructor(enable = false,faceup = false,stack = false){
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
function th0() {
  const player_names = ['Alice','Bob','Charlie','Dave'];
  const hand_params = [[true,true,false]];
  const pile_params = [[[true,false,true],[],[],[],[],[],[],[],[],[],[],[],[]],
                       [[true,true,true],[true,true,true],[true,true,true],[true,false,true],[true,false,true],[],[],[],[],[],[],[],[]],
                       [[],[],[],[],[],[],[],[],[],[],[],[],[]],
                       [[],[],[],[],[],[],[],[],[],[],[],[],[]]]
  return new Session(player_names,hand_params,pile_params);
}
function th1(g) {
  /* Create and shuffle deck */
  g.setPile(0,0,createFullDeck());
  g.shufflePile(0,0);
  /* Clear piles */
  for (let i = 0; i < 5; i++){
    g.setPile(1,i,[]);
    if (i > 2) {
      g.setPileFaceUp(1,i,false);
    }
  }
  /* Clear hands */
  for (let i = 0; i < 4; i++){
    g.setHand(i,0,[]);
  }
  console.log(g.toString());
}
function th2(g) {
  /* Deal 2 cards to each player */
  for (let i = 0; i < 4; i++){
    g.addtoHand(i,0,g.getTopCardfromPile(0,0));
  }
  for (let i = 0; i < 4; i++){
    g.addtoHand(i,0,g.getTopCardfromPile(0,0));
  }
  /* Deal 5 cards to table */
  for (let i = 0; i < 5; i++){
    g.addtoPile(1,i,g.getTopCardfromPile(0,0));
  }
  console.log(g.toString());
}
function th3(g) {
  /* Flip river */
  g.setPileFaceUp(1,3,true);
  console.log(g.toString());
}
function th4(g) {
  /* Flip turn */
  g.setPileFaceUp(1,4,true);
  console.log(g.toString());
}

/* Create and run game */
const game = th0();
th1(game);
th2(game);
th3(game);
th4(game);
