/* Move making button event listeners */
document.getElementById('reset').addEventListener('click', function(){
  socket.emit('reset');
});
/* Select player event listeners */
function addPlayerListeners() {
  document.querySelector('.player-select').addEventListener('change', function(e) {
    player_pointer = this.options[this.selectedIndex].value;
    drawGame();
  });
}
/* Add draggable events to HTML elements */
function addDraggableEvents() {
  [].forEach.call(
    document.querySelectorAll('.card'),
    function(card) {      
      card.addEventListener('dragstart',handleDragStart,false);
      card.addEventListener('dragend',handleDragEnd,false);
      card.addEventListener('dragleave',handleCardDragLeave,false);
    }
  );
  [].forEach.call(
    document.querySelectorAll('.card-holder'),
    function(holder) {
      holder.addEventListener('dragover',handleDragOver,false);
      holder.addEventListener('dragleave',handleDragLeave,false);
      holder.addEventListener('dragenter',handleDragEnter,false);
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
