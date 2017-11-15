/* Holds the game and state */
class Game {
  constructor(player_names, hand_params = [], pile_params = [[]]) {
    /* Array of players */
    let player_arr = [];
    player_names.forEach(function(p,i) {
      player_arr.push(new Player(p,i,...hand_params));
    });
    this.players = player_arr;  

    /* 4x13 Array of card piles */
    this.piles = [];
    for (let i = 0;i < 4; i++) {
      let row = [];
      for (let j = 0; j < 13; j++) {
        row.push(new Pile(...pile_params[i][j]));
      }
      this.piles.push(row);
    }
  }
  /* Get card from a pile  */
  getCardFromPile(row,col,i) {
    return this.piles[row][col].cards.splice(i,1)[0];
  }
  getCardFromHand(player,hand,i) {
    return this.players[player].hands[hand].cards.splice(i,1)[0];
  }
  getTopCardFromPile(row,col) {
    return this.piles[row][col].cards.shift();
  }
  getTopCardfromHand(player,hand) {
    return this.players[player].hands[hand].cards.shift();
  }
  getCardsfromPile(row,col) {
    return this.piles[row][col].cards.splice(0);
  }
  getCardsfromHand(player,hand) {
    return this.players[player].hands[hand].cards.splice(0);
  }
  copyCardsfromPile(row,col) {
    return this.piles[row][col].cards.slice(0);
  }
  copyCardsfromHand(player,hand) {
    return this.players[player].hands[hand].cards.slice(0);
  }
  /* Deal one card to group of cards */
  addToPile(row,col,i,card) {
    this.piles[row][col].cards.splice(i,0,card);
  }
  addToHand(player,hand,i,card) {
    this.players[player].hands[hand].cards.splice(i,0,card);
  }
  addtoPileTop(row,col,card) {
    this.piles[row][col].cards.unshift(card);
  }
  addtoHandTop(player,hand,card) {
    this.players[player].hands[hand].cards.unshift(card);
  }
  addToPileBottom(row,col,card) {
    this.piles[row][col].cards.push(card);
  }
  addToHandBottom(player,hand,card) {
    this.players[player].hands[hand].cards.push(card);
  }
  /* Overwrite value with specified cards */
  setPile(row,col,cards = []) {
    this.piles[row][col].cards = cards;
  }
  setHand(player,hand,cards = []) {
    this.players[player].hands[hand].cards = cards;
  }
  /* Set properties */
  setPileFaceUp(row,col,faceup) {
    this.piles[row][col].faceup = faceup;
  }
  setHandFaceUp(player,hand,faceup) {
    this.players[player].hands[hand].faceup = faceup;
  }
  flipPile(row,col) {
    this.piles[row][col].faceup = !this.piles[row][col].faceup;
  }
  flipHand(player,hand) {
    this.players[player].hands[hand].faceup = !this.players[player].hands[hand].faceup;
  }
  /* Shuffle specified cards */
  shufflePile(row,col) {
    this.piles[row][col].cards.fy_shuffle();
  }
  shuffleHand(player,hand) {
    this.players[player].hands[hand].cards.fy_shuffle();
  }
  /* Sort specified cards */
  sortPile(row,col) {
    this.piles[row][col].cards.sort(cardSort);
  }
  sortHand(player,hand) {
    this.players[player].hands[hand].cards.sort(cardSort);
  }
  /* Move card from one pile/hand to another */
  moveCard(type_from,stack_from,row_from,col_from,pos_from,
            type_to,stack_to,row_to,col_to,pos_to) {
    let card;
    /* Get the card we are moving */
    if (type_from === 'pile') {
      /* Get top card from stack */
      if (stack_from) { card = this.getTopCardFromPile(row_from,col_from);}
      /* Get specific card from pile */
      else { card = this.getCardFromPile(row_from,col_from,pos_from);}
    }
    else {
      /* Get top card from hand */
      if (stack_from) { card = this.getTopCardFromHand(row_from,col_from);}
      /* Get specific card from hand */
      else { card = this.getCardFromHand(row_from,col_from,pos_from);}
    }
    /* Put card in it's place */
    if (type_to === 'pile') {
      /* Put on bottom of pile stack */
      if (stack_to) { this.addToPileBottom(row_to,col_to,card);}
      /* Put on bottom of pile stack */
      else { this.addToPileBottom(row_to,col_to,card);}
    }
    else {
      /* Put on bottom of hand stack */
      if (stack_to) { this.addToHandBottom(row_to,col_to,card);}
      /* Put on bottom of hand stack */
      else { this.addToHandBottom(row_to,col_to,card);}
    }
  }
  /* Return string representation */
  toString() {
    let splayer = '';
    this.players.forEach(function(player) {
      splayer += '\n' + player.toString();
    })
    let spile = '';
    this.piles.forEach(function(row, i) {
      row.forEach(function(pile, j) {
        if (pile.enabled) {
          spile += '\nPile ' + i + ',' + j + ': (' + pile.toString() + ')';
        }
      })
    })
    return splayer.slice(1) + '\nTable\n' + spile.slice(1);
  }
  toHTML(el, play_order='') {
    /* Clear element */
    while (el.lastChild) {
      el.removeChild(el.lastChild);
    }
    /* Set pile elements into rows */
    let pile_holder = document.createElement('div');
    pile_holder.id = 'pile-holder';
    this.piles.forEach(function(row, i) {
      let pile_row = document.createElement('div');
      row.forEach(function(pile, j) {
        if (pile.enabled) {
          pile_row.appendChild(pile.toHTML(true, 'pile', i, j));
        }
      })
      pile_holder.appendChild(pile_row);
    })
    /* Set player elements into a row */
    let player_holder = document.createElement('div');
    player_holder.id = 'player-holder';
    this.players.forEach(function(player) {
      player_holder.appendChild(player.toHTML(play_order));
    })
    /* Add the nodes to the passed in element */
    el.appendChild(pile_holder);
    el.appendChild(player_holder);
  }
}
