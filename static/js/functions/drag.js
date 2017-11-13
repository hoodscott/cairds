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
  /* Ignore next leave if moving into child element */
  dragged_ignorenext = e.target !== this;
  /* Add effect if over a different holder */
  if (dragged_holder !== this) {
    this.classList.add('over');
  }
}
function handleDragLeave(e) {
  /* If moving to new holder, remove effect from this */
  if (dragged_ignorenext) {
    dragged_ignorenext = false;
  }
  else {
    this.classList.remove('over');
  }
}
function handleCardDragEnter(e) {
  e.stopPropagation();
}
function handleCardDragLeave(e) {
  e.stopPropagation();
}
function handleDrop(e) {
  /* Create move object on drop */
  let move = new Object();
  let from = dragged_holder.dataset.type;
  let to = this.dataset.type;
  /* Emit move */
  if ((from === 'pile' || from === 'player')
    && (to === 'pile' || to === 'player')) {
      /* Check there is space to move the card to */
      if (parseInt(this.dataset.spaces) !== 0) {
        /* Create move object */
        move.player = player_pointer;
        move.type_from = from;
        move.stack_from = dragged_holder.classList.contains('stack');
        move.row_from = parseInt(dragged_holder.dataset.row);
        move.col_from = parseInt(dragged_holder.dataset.col);
        move.pos_from = parseInt(dragged_card.dataset.position);
        move.type_to = to;
        move.stack_to = this.classList.contains('stack');
        move.row_to = parseInt(this.dataset.row);
        move.col_to = parseInt(this.dataset.col);
        move.pos_to = 0;
        /* Send over socket */
        socket.emit('move',move);
      }
  }
  /* Emit shuffle */
  else if ((from === 'pile' || from === 'player')
    && to === 'shuffle') {
      /* Check there is space to move the card to */
      if (parseInt(this.dataset.spaces) !== 0) {
        /* Create move object */
        let move = new Object();
        let cards = [];
        move.player = player_pointer;
        move.type = from;
        move.row = parseInt(dragged_holder.dataset.row);
        move.col= parseInt(dragged_holder.dataset.col);
        if (move.type === 'pile') {
          /* Get cards from this pile */
          cards = game.copyCardsfromPile(move.row,move.col);
        }
        else {
          /* Get cards from this hand */
          cards = game.copyCardsfromHand(move.row,move.col);
        }
        /* Shuffle */
        cards.fy_shuffle();
        move.cards = cards;
        /* Send over socket */
        socket.emit('set', move);
      }
  }
  /* Emit shuffle */
  else if ((from === 'pile' || from === 'player')
    && to === 'sort') {
      /* Create move object */
      let move = new Object();
      move.player = player_pointer;
      move.type = from;
      move.row = parseInt(dragged_holder.dataset.row);
      move.col= parseInt(dragged_holder.dataset.col);
      /* Send over socket */
      socket.emit('sort', move);
  }
  /* Emit flip */
  else if ((from === 'pile' || from === 'player')
    && to === 'flip') {
      /* Create move object */
      let move = new Object();
      move.player = player_pointer;
      move.type = from;
      move.row = parseInt(dragged_holder.dataset.row);
      move.col = parseInt(dragged_holder.dataset.col);
      /* Emit move */
      socket.emit('flip', move);
  }
  /* Reset pointers */
  dragged_card = null;
  dragged_holder = null;
  dragged_counter = 0;
  /* Stop bubbles */
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  return false;
}
