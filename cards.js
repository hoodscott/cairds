function handleDragStart(e){
  this.style.opacity = 0.2;

  dragged_card = this;
  dragged_holder = this.parentNode;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('source', this);
}

function handleDragEnd(e){
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
  if (dragged_holder !== this){
    this.appendChild(dragged_card);
  }
  return false;
}

const cards = document.querySelectorAll('.card');
const holders = document.querySelectorAll('.card-holder');
let dragged_card;
let dragged_holder;

[].forEach.call(cards, function(card){
  card.addEventListener('dragstart',handleDragStart,false);
  card.addEventListener('dragend',handleDragEnd,false);
});

[].forEach.call(holders, function(holder){
  holder.addEventListener('dragover',handleDragOver,false);
  holder.addEventListener('dragenter',handleDragEnter,false);
  holder.addEventListener('dragleave',handleDragLeave,false);
  holder.addEventListener('drop',handleDrop,false);
});