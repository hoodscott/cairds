/* Make passed in move on board, and refresh the GUI */
function makeMove(move) {
  game.moveCard(move.type_from, move.stack_from, move.row_from,
                move.col_from, move.pos_from,
                move.type_to, move.stack_to, move.row_to,
                move.col_to, move.pos_to);
  /* Draw game */
  drawGame();
  document.querySelector(
    '[data-type="' + move.type_from + '"][data-row="' + move.row_from + '"][data-col="' + move.col_from + '"]')
    .classList.add('player-from-' + move.player);
  document.querySelector(
    '[data-type="' + move.type_to + '"][data-row="' + move.row_to + '"][data-col="' + move.col_to + '"]')
    .classList.add('player-' + move.player);
}
/* Reset board */
function resetGame() {
    /* Clear piles */
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 13; j++) {
        game.setPile(i,j,[]);
      }
    }
    /* Clear hands */
    for (let i = 0; i < 4; i++) {
      game.setHand(i,0,[]);
    }
  /* Create deck */
  game.setPile(0,0,createFullDeck());
  /* Draw game */
  drawGame();
  /* Draw borders around last move */
  clearControlBorders();
}
/* Sort specifed cards */
function sortCards(move) {
  if (move.type === 'pile') {
    game.sortPile(move.row, move.col)
  }
  else if (move.type === 'player') {
    game.sortHand(move.row, move.col)
  }
  /* Draw game */
  drawGame();
  /* Draw borders around last move */
  document.querySelector(
    '[data-type="' + move.type + '"][data-row="' + move.row + '"][data-col="' + move.col + '"]')
    .classList.add('player-' + move.player);
  clearControlBorders();
  document.querySelector(
    '[data-type="sort"]')
    .classList.add('player-' + move.player);
}
/* Set cards to piles */
function setCards(move) {
  if (move.type === 'pile') {
    game.setPile(move.row, move.col, move.cards)
  }
  else if (move.type === 'player') {
    game.setHand(move.row, move.col, move.cards)
  }
  /* Draw game */
  drawGame();
  /* Draw borders around last move */
  document.querySelector(
    '[data-type="' + move.type + '"][data-row="' + move.row + '"][data-col="' + move.col + '"]')
    .classList.add('player-' + move.player);
  clearControlBorders();
  document.querySelector(
    '[data-type="shuffle"]')
    .classList.add('player-' + move.player);
}
/* Flip deck */
function flipCards(move) {
  if (move.type === 'pile') {
    game.flipPile(move.row, move.col);
  }
  else if (move.type === 'player') {
    game.flipHand(move.row, move.col);
  }
  /* Draw game */
  drawGame();
  /* Draw borders around last move */
  document.querySelector(
    '[data-type="' + move.type + '"][data-row="' + move.row + '"][data-col="' + move.col + '"]')
    .classList.add('player-' + move.player);
  clearControlBorders();
  document.querySelector(
    '[data-type="flip"]')
    .classList.add('player-' + move.player);
}

function clearControlBorders() {
  let types = ['shuffle','sort','flip'];
  types.forEach(function(e) {
    document.querySelector('[data-type="' + e + '"]').className = 
    document.querySelector('[data-type="' + e + '"]').className.replace(/player\-*[0-9]*/, '')
  });
  

}