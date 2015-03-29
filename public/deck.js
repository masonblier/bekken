function Deck(id){
  this.id = id;
}

Deck.prototype.load = function(success, fail){
  try {
    var storageKey = 'deck::'+this.id;
    if (window.localStorage[storageKey]) {
      var data = JSON.parse(window.localStorage[storageKey])
      this.cards = data.cards;
      this.states = data.states;
      console.log(this)
      success();
    } else {
      ajax.loadText('./decks/'+this.id+'.deck', function(raw){
        this.cards = DeckParser.parse(raw);
        this.states = [];
        success();
      }.bind(this), fail);
    }
  } catch (err) {
    fail(err);
  }
};

Deck.prototype.save = function(success, fail){
  try {
    var storageKey = 'deck::'+this.id;
    window.localStorage[storageKey] = JSON.stringify({
      id: this.id,
      cards: this.cards,
      states: this.states
    });
    if (success) success();
  } catch (err) {
    if (fail) fail(err);
    else throw err;
  }
};

Deck.getState = function(deckId){
  var storageKey = 'deck-state::'+deckId;
  return window.localStorage[storageKey]||"new";
};
Deck.setState = function(deckId, state){
  var storageKey = 'deck-state::'+deckId;
  window.localStorage[storageKey] = state;
};
