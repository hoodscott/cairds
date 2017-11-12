class Pile {
  constructor(enable = false, faceup = false, stack = false, secret=false) {
    /* Should this pile be displayed */
    this.enabled = enable;
    /* Minimum - Maximum number of cards allowed in this pile */
    this.size = "0-52";
    /* Can everyone see the cards in this pile */
    this.faceup = faceup;
    /* Can only the first card be interacted with / viewed */
    this.stack = stack;
    /* Can only the holder see this */
    this.secret = secret;
    /* Should the cards be overlaid vertically or horizontally 
     * When stack is true, this is overridden */
    this.vertical = false;
    /* Can players take cards from this pile */
    this.draw = true;
    /* Can players place cards in this pile */
    this.place = true;
    /* Array of cards in this pile */
    this.cards = [];
  }
  dealCard(card) {
    this.cards.push(card);
  }
  toString() {
    let s = '';
    if (!this.faceup) {
      this.cards.forEach(function(card) {
        s += ',Back of Card';
      })
    }
    else {
      const stacked = this.stack;
      this.cards.forEach(function(card, i, arr) {
        /* Only show top card if stacked */
        if (stacked && (i + 1 !== arr.length)) {
          s += ',Back of Card';
        }
        else {
          s += ',' + card.toString();
        }
      })
    }
    return s.substring(1);
  }
  toHTML(owner = false, type = '', row = '', col = '') {
    let card_holder = document.createElement('div');
    card_holder.classList.add("card-holder");
    if (type !== '') {
      card_holder.dataset.type = type;
    }
    if (row !== '') {
      card_holder.dataset.row = row;
    }
    if (col !== '') {
      card_holder.dataset.col = col;
    }
    if (this.stack) {
      card_holder.classList.add('stack');
      if (this.faceup){
        if (this.cards.length !== 0) {
          if (this.secret && !owner){ card_holder.appendChild(createCardBack(0));}
          else { card_holder.appendChild(this.cards[0].toHTML(0));}
        }
      }
      else {
        if (this.cards.length !== 0) { card_holder.appendChild(createCardBack(0));}
      }
    }
    else {
      if (this.vertical) {
        card_holder.classList.add("vertical");
      }
      else {
        card_holder.classList.add("horizontal");
      }
      const faceup = this.faceup;
      const secret = this.secret;
      this.cards.forEach(function(card, i) {
        if (faceup) {
          if (secret && !owner){ card_holder.appendChild(createCardBack(i));}
          else { card_holder.appendChild(card.toHTML(i));}
        }
        else { card_holder.appendChild(createCardBack(i));}
      })
    }
    return card_holder;
  }
}
