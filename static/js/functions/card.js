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
function cardSort(a,b) {
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
