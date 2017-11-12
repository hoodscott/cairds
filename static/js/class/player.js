class Player {
  constructor(playername, order, player_params) {
    this.name = playername;
    /* Turn order for this player - player one = 0 */
    this.order = order;
    /* Array of hands of cards this player owns */
    const h = [];
    player_params.forEach(function(params,i) {
      h.push(new Pile(...params));
    });
    this.hands = h;
  }
  dealCard(card,handIndex) {
    this[handIndex].cards.push(card);
  }
  toString() {
    let s = '';
    this.hands.forEach(function(hand, i) {
      s += '\nHand ' + i + ': ' + hand.toString();
    });
    return this.name + '\n' + s.slice(1);
  }
  toHTML(play_order='') {
    let owner = false;
    if (this.order == play_order){
      owner = true;
    }
    return this.hands[0].toHTML(owner, 'player', this.order, 0);
  }
}
