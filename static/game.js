/* Global variables for the suit and values */
const suits = ['S','H','D','C'];
const suit_symbols = ['\u{2660}','\u{2665}','\u{2666}','\u{2663}'];
const suit_names = ['Spades','Hearts','Diamonds','Clubs'];
const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const value_names = ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King'];

/* Holds the game and state */
class Session {
  constructor(player_names, hand_params = [], pile_params = [[]]) {
    /* Array of players */
    let player_arr = [];
    player_names.forEach(function(p,i) {
      player_arr.push(new Player(p,i,hand_params));
    })
    this.players = player_arr;  

    /* 4x13 Array of card piles */
    this.piles = [];
    for (let i = 0;i < 4; i++) {
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
  /* Set properties */
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
  toHTML(el, play_order='') {
    /* Clear element */
    while (el.lastChild) {
      el.removeChild(el.lastChild);
    }
    /* Set pile elements into rows */
    let pile_holder = document.createElement('div');
    pile_holder.id = 'pile-holder';
    this.piles.forEach(function(row, i) {
      let pile_row = document.createElement('div');
      pile_row.id = "pile_row_" + i;
      row.forEach(function(pile, j) {
        if (pile.enabled) {
          pile_row.appendChild(pile.toHTML());
        }
      })
      pile_holder.appendChild(pile_row);
    })
    /* Set player elements into a row */
    let player_holder = document.createElement('div');
    player_holder.id = 'player-holder';
    this.players.forEach(function(player) {
      player_holder.appendChild(player.toHTML(play_order));
    })
    /* Add the nodes to the passed in element */
    el.appendChild(pile_holder);
    el.appendChild(player_holder);
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
  toHTML(play_order='') {
    let holder = false;
    if (this.order == play_order){
      holder = true;
    }
    return this.hands[0].toHTML(holder);
  }
}

class Pile {
  constructor(enable = false, faceup = false, stack = false, secret=false) {
    /* Should this pile be displayed */
    this.enabled = enable;
    /* Minimum - Maximum number of cards allowed in this pile */
    this.size = "0-52";
    /* Can everyone see the cards in this pile */
    this.faceup = faceup;
    /* Can only the first card be interacted with / viewed */
    this.stack = stack;
    /* Can only the holder see this */
    this.secret = secret;
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
  dealCard(card) {
    this.cards.push(card);
  }
  toString() {
    let s = '';
    if (!this.faceup) {
      this.cards.forEach(function(card) {
        s += ',Back of Card';
      })
    }
    else {
      const stacked = this.stack;
      this.cards.forEach(function(card, i, arr) {
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
  toHTML(owner = false) {
    let card_holder = document.createElement('div');
    card_holder.classList.add("card-holder");
    if (this.stack) {
      card_holder.classList.add('stack');
      if (this.faceup){
        if (this.cards.length !== 0) {
          if (this.secret && !owner){
            let card = document.createElement('div');
            card.draggable = "true";
            card.classList.add('card');
            card.classList.add('back');
            card_holder.appendChild(card);
          }
          else {
            card_holder.appendChild(this.cards[0].toHTML());
          }
        }
      }
      else {
        if (this.cards.length !== 0) {
          let card = document.createElement('div');
          card.draggable = "true";
          card.classList.add('card');
          card.classList.add('back');
          card_holder.appendChild(card);
        }
      }
    }
    else {
      if (this.vertical) {
        card_holder.classList.add("vertical");
      }
      else {
        card_holder.classList.add("horizontal");
      }
      const faceup = this.faceup;
      const secret = this.secret;
      this.cards.forEach(function(card, i) {
        if (faceup) {
          if (secret && !owner){
            let back_card = document.createElement('div');
            back_card.draggable = "true";
            back_card.classList.add('card');
            back_card.classList.add('back');
            card_holder.appendChild(back_card);
          }
          else {
            card_holder.appendChild(card.toHTML());
          }
        }
        else {
          let card = document.createElement('div');
          card.draggable = "true";
          card.classList.add('card');
          card.classList.add('back');
          card_holder.appendChild(card);
        }
      })
    }
    return card_holder;
  }
}

class Card {
  constructor(suit,value) {
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
  toHTML() {
    let card = document.createElement('div');
    let el_val =  document.createElement('p');
    el_val.innerHTML = this.value;
    let el_suit = document.createElement('p');
    el_suit.innerHTML = suit_symbols[suits.indexOf(this.suit)];
    card.appendChild(el_val);
    card.appendChild(el_suit);
    card.draggable = "true";
    card.classList.add('card');
    card.classList.add(suit_names[suits.indexOf(this.suit)]);
    card.classList.add(this.value);
    return card;
  }
}

/* Creates an array of 52 cards */
function createFullDeck() {
  const deck = [];
  for (let i = 0; i < 52; i++) {
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
function sortCards(a,b) {
  if (a.suit === b.suit) {
    return values.indexOf(a.value) - values.indexOf(b.value);
  }
  else {
    return suits.indexOf(a.suit) - suits.indexOf(b.suit);
  }
}

/* Draggable functions */
const cards = document.querySelectorAll('.card');
const holders = document.querySelectorAll('.card-holder');
let dragged_card;
let dragged_holder;
function handleDragStart(e) {
  this.style.opacity = 0.2;
  dragged_card = this;
  dragged_holder = this.parentNode;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('source', this);
}
function handleDragEnd(e) {
  this.style.opacity = 1;
  [].forEach.call(holders, function(holder){
    holder.classList.remove('over');
  })
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); 
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}
function handleDragEnter(e) {
  this.classList.add('over');
}
function handleDragLeave(e) {
  this.classList.remove('over');  
}
function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (dragged_holder !== this) {
    this.appendChild(dragged_card);
  }
  return false;
}

/* Basic texas holdem game */
function th0() {
  const player_names = ['Alice','Bob','Charlie','Dave'];
  const hand_params = [[true,true,false,true]];
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
  for (let i = 0; i < 5; i++) {
    g.setPile(1,i,[]);
    if (i > 2) {
      g.setPileFaceUp(1,i,false);
    }
  }
  /* Clear hands */
  for (let i = 0; i < 4; i++) {
    g.setHand(i,0,[]);
  }
  g.toHTML(document.getElementById('game-holder'), player);
  document.getElementById('step1').disabled = true;
  document.getElementById('step2').disabled = false;
}
function th2(g) {
  /* Deal 2 cards to each player */
  for (let i = 0; i < 4; i++) {
    g.addtoHand(i,0,g.getTopCardfromPile(0,0));
  }
  for (let i = 0; i < 4; i++) {
    g.addtoHand(i,0,g.getTopCardfromPile(0,0));
  }
  /* Deal 5 cards to table */
  for (let i = 0; i < 5; i++) {
    g.addtoPile(1,i,g.getTopCardfromPile(0,0));
  }
  g.toHTML(document.getElementById('game-holder'), player);
  document.getElementById('step2').disabled = true;
  document.getElementById('step3').disabled = false;
}
function th3(g) {
  /* Flip river */
  g.setPileFaceUp(1,3,true);
  g.toHTML(document.getElementById('game-holder'), player);
  document.getElementById('step3').disabled = true;
  document.getElementById('step4').disabled = false;
}
function th4(g) {
  /* Flip turn */
  g.setPileFaceUp(1,4,true);
  g.toHTML(document.getElementById('game-holder'), player);
  document.getElementById('step4').disabled = true;
  document.getElementById('step1').disabled = false;
}

/* Create and run game */
let game = th0();
let player = '-1';
document.getElementById('step1').addEventListener('click', function(){
  th1(game);
  addDraggableEvents();
  socket.emit('move','1');
})
document.getElementById('step2').addEventListener('click', function(){
  th2(game);
  addDraggableEvents();
  socket.emit('move','2');
  document.getElementById('step3').disabled = false;
})
document.getElementById('step3').addEventListener('click', function(){
  th3(game);
  addDraggableEvents();
  socket.emit('move','3');
  document.getElementById('step4').disabled = false;
})
document.getElementById('step4').addEventListener('click', function(){
  th4(game);
  addDraggableEvents();
  socket.emit('move','4');
  document.getElementById('step1').disabled = false;
})
document.getElementById('blue-select').addEventListener('click', function(){
  player = '0';
  disablePlayerSelect();
})
document.getElementById('red-select').addEventListener('click', function(){
  player = '1';
  disablePlayerSelect();
})
document.getElementById('green-select').addEventListener('click', function(){
  player = '2';
  disablePlayerSelect();
})
document.getElementById('yellow-select').addEventListener('click', function(){
  player = '3';
  disablePlayerSelect();
});

function disablePlayerSelect() {
  [].forEach.call(
    document.getElementsByClassName('player-select'),
    function(e){
      e.disabled = true;
    }
  )
}

/* Add draggable events to HTML elements */
function addDraggableEvents() {
  const cards = document.querySelectorAll('.card');
  const holders = document.querySelectorAll('.card-holder');
  [].forEach.call(
    cards,
    function(card) {      
      card.addEventListener('dragstart',handleDragStart,false);
      card.addEventListener('dragend',handleDragEnd,false);
  });
  [].forEach.call(
    holders,
    function(holder) {
      holder.addEventListener('dragover',handleDragOver,false);
      holder.addEventListener('dragenter',handleDragEnter,false);
      holder.addEventListener('dragleave',handleDragLeave,false);
      holder.addEventListener('drop',handleDrop,false);
  });
}

/* Listen for moves over the socket */
const socket = io();

socket.on('move', function(g) {
  /* Move */
  switch(g){
    case '1':
      th1(game);
      break;
    case '2':
      th2(game);
      break;
    case '3':
      th3(game);
      break;
    case '4':
      th4(game);
      break;
  }
});

