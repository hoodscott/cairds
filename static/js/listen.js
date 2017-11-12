/* Move making button event listeners */
document.getElementById('reset').addEventListener('click', function(){
  socket.emit('reset');
})
document.getElementById('shuffle').addEventListener('click', function(){
  /* Get cards from this pile */
  let cards = game.copyCardsfromPile(0,0);
  /* Shuffle */
  cards.fy_shuffle();
  /* Create move object */
  let move = new Object();
  move.type = 'pile';
  move.row = 0;
  move.col = 0;
  move.cards = cards;
  /* Emit move */
  socket.emit('set', move);
})
document.getElementById('flip1').addEventListener('click', function(){
  /* Create move object */
  let move = new Object();
  move.type = 'pile';
  move.row = 1;
  move.col = 3;
  move.faceup = true;
  /* Emit move */
  socket.emit('flip', move);
})
document.getElementById('flip2').addEventListener('click', function(){
  /* Create move object */
  let move = new Object();
  move.type = 'pile';
  move.row = 1;
  move.col = 4;
  move.faceup = true;
  /* Emit move */
  socket.emit('flip', move);
})

/* Select player event listeners */
document.getElementById('blue-select').addEventListener('click', function(){
  player_pointer = '0';
  drawGame();
})
document.getElementById('red-select').addEventListener('click', function(){
  player_pointer = '1';
  drawGame();
})
document.getElementById('green-select').addEventListener('click', function(){
  player_pointer = '2';
  drawGame();
})
document.getElementById('yellow-select').addEventListener('click', function(){
  player_pointer = '3';
  drawGame();
});

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
          return false;
        }
      },false);
  });
}
