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

/* Create 4 player game */
let ss = new Session(4);

document.getElementById('out').innerHTML = JSON.stringify(ss);