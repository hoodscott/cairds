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
