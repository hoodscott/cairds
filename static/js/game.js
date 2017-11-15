/* Initialise basic texas holdem game */
function initialiseGame( 
  player_names = ['Alice','Bob','Charlie','Dave'],
  hand_params = [true,true,false,false,true],
  pile_params = [[[true,false,true,false,false,52],[],[],[],[],[],[],[],[],[],[],[],[]],
                       [[true,true,true,false],[true,true,true,false],[true,true,true,false],[true,false,true,false],[true,false,true,false],[],[],[],[],[],[],[],[]],
                       [[],[],[],[],[],[],[],[],[],[],[],[],[]],
                       [[],[],[],[],[],[],[],[],[],[],[],[],[]]]) {
  if (validatePlayerParams(hand_params)
    && validatePileParams(pile_params)) {
      return new Game(player_names,[hand_params],pile_params);
  }
}
/* Draw game as HTML */
function drawGame() {
  game.toHTML(document.getElementById('game-holder'), player_pointer);
  addDraggableEvents();
}

/* Global variables for the suit and values */
const suits = ['S','H','D','C'];
const suit_symbols = ['\u{2660}','\u{2665}','\u{2666}','\u{2663}'];
const suit_names = ['Spades','Hearts','Diamonds','Clubs'];
const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const value_names = ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King'];
/* Draggable globals */
let dragged_card;
let dragged_holder;
let dragged_counter = 0;
let dragged_ignorenext = false;
/* Game globals */
let game;
let player_pointer = -1;
const socket = io();
/* Join room depending on url */
socket.on('connect', function() {
  socket.emit('room', 'room'); //todo - get and store end of url
});
/* Listen for moves over the socket */
socket.on('init', function(session) {
  /* Initialise */
  game = initialiseGame(session.params[0][0],
                        session.params[0][1],
                        session.params[1]);
  /* Draw game */
  addPlayerListeners();
  drawGame();
  /* Complete any moves on server */
  session.moves.forEach(function(move) {
    switch(move[0]) {
      case 'reset':
        resetGame();
        break;
      case 'move':
        makeMove(move[1]);
        break;
      case 'set':
        setCards(move[1]);
        break;
      case 'sort':
        sortCards(move[1]);
        break;
      case 'flip':
        flipCards(move[1]);
        break;
    }
  });
});
socket.on('reset', function() {
  resetGame();
});
socket.on('move', function(move) {
  makeMove(move);
});
socket.on('set', function(move) {
  setCards(move);
});
socket.on('sort', function(move) {
  sortCards(move);
});
socket.on('flip', function(move) {
  flipCards(move);
});
