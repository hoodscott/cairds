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
    return this.piles[row][col].cards.splice(i,1)[0];
  }
  getCardFromHand(player,hand,i) {
    return this.players[player].hands[hand].cards.splice(i,1)[0];
  }
  getTopCardFromPile(row,col) {
    return this.piles[row][col].cards.pop();
  }
  getTopCardfromHand(player,hand) {
    return this.players[player].hands[hand].cards.pop();
  }
  getCardsfromPile(row,col) {
    return this.piles[row][col].cards.splice(0);
  }
  getCardsfromHand(player,hand) {
    return this.players[player].hands[hand].cards.splice(0);
  }
  /* Deal one card to group of cards */
  addToPile(row,col,i,card) {
    this.piles[row][col].cards.splice(i,0,card);
  }
  addToHand(player,hand,i,card) {
    this.players[player].hands[hand].cards.splice(i,0,card);
  }
  addtoPileTop(row,col,card) {
    this.piles[row][col].cards.unshift(card);
  }
  addtoHandTop(player,hand,card) {
    this.players[player].hands[hand].cards.unshift(card);
  }
  addToPileBottom(row,col,card) {
    this.piles[row][col].cards.push(card);
  }
  addToHandBottom(player,hand,card) {
    this.players[player].hands[hand].cards.push(card);
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
  /* Move card from one pile/hand to another */
  moveCard(type_from,stack_from,row_from,col_from,pos_from,
            type_to,stack_to,row_to,col_to,pos_to) {
    let card;
    /* Get the card we are moving */
    if (type_from === 'pile') {
      /* Get top card from stack */
      if (stack_from) { card = this.getTopCardFromPile(row_from,col_from);}
      /* Get specific card from pile */
      else { card = this.getCardFromPile(row_from,col_from,pos_from);}
    }
    else {
      /* Get top card from hand */
      if (stack_from) { card = this.getTopCardFromHand(row_from,col_from);}
      /* Get specific card from hand */
      else { card = this.getCardFromHand(row_from,col_from,pos_from);}
    }
    /* Put card in it's place */
    if (type_to === 'pile') {
      /* Put on bottom of pile stack */
      if (stack_to) { this.addToPileBottom(row_to,col_to,card);}
      /* Put in specific position in pile */
      else { this.addToPile(row_to,col_to,pos_to,card);}
    }
    else {
      /* Put on bottom of hand stack */
      if (stack_to) { this.addToHandBottom(row_to,col_to,card);}
      /* Put in specific position in hand */
      else { this.addToHand(row_to,col_to,pos_to,card);}
    }
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
      row.forEach(function(pile, j) {
        if (pile.enabled) {
          pile_row.appendChild(pile.toHTML(true, 'pile', i, j));
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
    let owner = false;
    if (this.order == play_order){
      owner = true;
    }
    return this.hands[0].toHTML(owner, 'player', this.order, 0);
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
  toHTML(owner = false, type = '', row = '', col = '') {
    let card_holder = document.createElement('div');
    card_holder.classList.add("card-holder");
    if (type !== '') {
      card_holder.dataset.type = type;
    }
    if (row !== '') {
      card_holder.dataset.row = row;
    }
    if (col !== '') {
      card_holder.dataset.col = col;
    }
    if (this.stack) {
      card_holder.classList.add('stack');
      if (this.faceup){
        if (this.cards.length !== 0) {
          if (this.secret && !owner){ card_holder.appendChild(createCardBack(0));}
          else { card_holder.appendChild(this.cards[0].toHTML(0));}
        }
      }
      else {
        if (this.cards.length !== 0) { card_holder.appendChild(createCardBack(0));}
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
          if (secret && !owner){ card_holder.appendChild(createCardBack(i));}
          else { card_holder.appendChild(card.toHTML(i));}
        }
        else { card_holder.appendChild(createCardBack(i));}
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
  toHTML(position) {
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
    card.dataset.suit = suit_names[suits.indexOf(this.suit)];
    card.dataset.value = this.value;
    card.dataset.position = position;
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

/* Create a card that only shows the back */
function createCardBack(position) {
  let card = document.createElement('div');
  card.draggable = "true";
  card.classList.add('card');
  card.classList.add('back');
  card.dataset.suit = 'back';
  card.dataset.value = 'back';
  card.dataset.position = position;
  return card;
}

/* Draggable functions */
function handleDragStart(e) {
  this.style.opacity = 0.2;
  dragged_card = this;
  dragged_holder = this.parentNode;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('source', this);
  e.dataTransfer.setDragImage(this,25,35);
}
function handleDragEnd(e) {
  this.style.opacity = 1;
  let holders = document.querySelectorAll('.card-holder');
  [].forEach.call(holders, function(holder) {
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
  /* Create move object on drop */
  let move = new Object();
  move.type_from = dragged_holder.dataset.type;
  move.stack_from = dragged_holder.classList.contains('stack');
  move.row_from = parseInt(dragged_holder.dataset.row);
  move.col_from = parseInt(dragged_holder.dataset.col);
  move.pos_from = parseInt(dragged_card.dataset.position);
  move.type_to = this.dataset.type;
  move.stack_to = this.classList.contains('stack');
  move.row_to = parseInt(this.dataset.row);
  move.col_to = parseInt(this.dataset.col);
  move.pos_to = 0;
  console.log(move);
  /* Emit move */
  socket.emit('move',move);
  /* Reset pointers */
  dragged_card = null;
  dragged_holder = null;
  /* Stop bubbles */
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  return false;
}

/* Make passed in move on board, and refresh the GUI */
function makeMove(move) {
  game.moveCard(move.type_from, move.stack_from, move.row_from,
                move.col_from, move.pos_from,
                move.type_to, move.stack_to, move.row_to,
                move.col_to, move.pos_to);
  game.toHTML(document.getElementById('game-holder'), player_pointer);
  addDraggableEvents();
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
  g.toHTML(document.getElementById('game-holder'), player_pointer);
  document.getElementById('step1').disabled = true;
  document.getElementById('step2').disabled = false;

  /* Deal 2 cards to each player */
  for (let i = 0; i < 4; i++) {
    g.addtoHandTop(i,0,g.getTopCardFromPile(0,0));
  }
  for (let i = 0; i < 4; i++) {
    g.addtoHandTop(i,0,g.getTopCardFromPile(0,0));
  }
  /* Deal 5 cards to table */
  for (let i = 0; i < 5; i++) {
    g.addtoPileTop(1,i,g.getTopCardFromPile(0,0));
  }
  g.toHTML(document.getElementById('game-holder'), player_pointer);
  document.getElementById('step2').disabled = true;
  document.getElementById('step3').disabled = false;
  
  /* Flip river */
  g.setPileFaceUp(1,3,true);
  g.toHTML(document.getElementById('game-holder'), player_pointer);
  document.getElementById('step3').disabled = true;
  document.getElementById('step4').disabled = false;

  /* Flip turn */
  g.setPileFaceUp(1,4,true);
  g.toHTML(document.getElementById('game-holder'), player_pointer);
  document.getElementById('step4').disabled = true;
  document.getElementById('step1').disabled = false;
}

/* Create and run game */
document.getElementById('step1').addEventListener('click', function(){
  th1(game);
  addDraggableEvents();
})
document.getElementById('blue-select').addEventListener('click', function(){
  player_pointer = '0';
  disablePlayerSelect();
})
document.getElementById('red-select').addEventListener('click', function(){
  player_pointer = '1';
  disablePlayerSelect();
})
document.getElementById('green-select').addEventListener('click', function(){
  player_pointer = '2';
  disablePlayerSelect();
})
document.getElementById('yellow-select').addEventListener('click', function(){
  player_pointer = '3';
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
  [].forEach.call(
    document.querySelectorAll('.card'),
    function(card) {      
      card.addEventListener('dragstart',handleDragStart,false);
      card.addEventListener('dragend',handleDragEnd,false);
  });
  [].forEach.call(
    document.querySelectorAll('.card-holder'),
    function(holder) {
      holder.addEventListener('dragover',handleDragOver,false);
      holder.addEventListener('dragenter',handleDragEnter,false);
      holder.addEventListener('dragleave',handleDragLeave,false);
      holder.addEventListener('drop',handleDrop,false);
      holder.addEventListener('dragstart',function(e) {
        if (e.target === this) {
          e.preventDefault();
          return false}
      },false);
  });
}

/* Globals */
let game = th0();
let player_pointer = '-1';
const socket = io();
let dragged_card;
let dragged_holder;

/* Listen for moves over the socket */
socket.on('move', function(move) {
  /* Move */
  makeMove(move);
});

