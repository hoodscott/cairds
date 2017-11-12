class Card {
  constructor(suit, value) {
    /* S - Spades, C - Clubs, D - Diamonds, H - Hearts */
    this.suit = suit;
    /* A - Ace, J - Jack, Q - Queen, K - King, 2-10 - 2 through 10 */
    this.value = value;
  }
  toString() {
    return value_names[values.indexOf(this.value)] + ' of ' + suit_names[suits.indexOf(this.suit)];
  }
  toShortString() {
    return this.value + this.suit;
  }
  toHTML(position) {
    let card = document.createElement('div');
    let el_val =  document.createElement('p');
    el_val.innerHTML = this.value;
    let el_suit = document.createElement('p');
    el_suit.innerHTML = suit_symbols[suits.indexOf(this.suit)];
    card.appendChild(el_val);
    card.appendChild(el_suit);
    card.draggable = "true";
    card.classList.add('card');
    card.classList.add(suit_names[suits.indexOf(this.suit)]);
    card.classList.add(this.value);
    card.dataset.suit = suit_names[suits.indexOf(this.suit)];
    card.dataset.value = this.value;
    card.dataset.position = position;
    return card;
  }
}
