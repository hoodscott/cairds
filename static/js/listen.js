/* Move making button event listeners */
document.getElementById('reset').addEventListener('click', function(){
  socket.emit('reset');
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
