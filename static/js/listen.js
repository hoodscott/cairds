/* Move making button event listeners */
document.getElementById('reset').addEventListener('click', function(){
  socket.emit('reset');
});
/* Select player event listeners */
function addPlayerListeners() {
  [].forEach.call(
    document.querySelectorAll('.player-select'),
    function(e) {
      e.addEventListener('click', function() {
        player_pointer = e.dataset.player;
        drawGame();
      });
    }
  );
}
/* Add draggable events to HTML elements */
function addDraggableEvents() {
  [].forEach.call(
    document.querySelectorAll('.card'),
    function(card) {      
      card.addEventListener('dragstart',handleDragStart,false);
      card.addEventListener('dragend',handleDragEnd,false);
    }
  );
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
    }
  );
}
