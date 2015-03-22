function LearnView(deckId){
  this.deck = new Deck(deckId);
  this.cardIdx = -1;
  this.cardStates = [];
}

LearnView.prototype.render = function(){
  var $app = document.querySelector("#app");
  $app.innerHTML =
    '<div id="navigation" class="section"></div>'+
    '<div id="card" class="card section"></div>'+
    '<div id="controls" class="section"></div>';

  this.deck.load(function(){
    this.cardIdx = -1;
    this.nextCard();
  }.bind(this), function(err){
    console.error('deck '+this.deck.id+' failed to load: '+err);
  }.bind(this));
};

LearnView.prototype.detach = function(){
  KeyListener.clearAll();
};

LearnView.prototype.nextCard = function(){
  this.cardIdx = 1 + this.cardIdx;
  if (this.cardIdx < this.deck.cards.length) {
    this.renderCard();
  } else {
    this.renderResults();
  }
};

LearnView.prototype.renderCard = function(){
  var card = this.deck.cards[this.cardIdx];

  document.querySelector("#navigation").innerHTML =
  '<h3>Learn '+(1+this.cardIdx)+' / '+this.deck.cards.length+'</h3>';

  if (card.type==="lesson") {
    document.querySelector("#card").innerHTML =
      '<div class="card-lesson">'+card.body+'</div>';
  } else if (card.type==="review") {
    document.querySelector("#card").innerHTML =
      '<p class="card-front">'+card.front+'</p>'+
      '<p>'+card.back+'</p>';
  } else {
    throw new Error("unknown card type: "+card.type);
  }
    this.renderButtons();
};

LearnView.prototype.renderButtons = function(){
  var $controls = document.querySelector("#controls");
  $controls.innerHTML = '';
  var $nextBtn = document.createElement("button");
  $nextBtn.innerText = 'Next';
  $nextBtn.addEventListener('click', function(e){
    this.nextCard();
  }.bind(this), false);
  $controls.appendChild($nextBtn);
  $nextBtn.focus();

  KeyListener.set(KeyListener.SPACE, function(){
    this.nextCard();
  }.bind(this));
};

LearnView.prototype.renderResults = function(){
  var goodCount = this.cardStates.reduce(function(total, state){
    return total+(state==='good' ? 1 : 0);
  }, 0);
  var badCount = this.cardStates.reduce(function(total, state){
    return total+(state==='bad' ? 1 : 0);
  }, 0);

  document.querySelector("#navigation").innerHTML = '<h3>Results</h3>';
  document.querySelector("#card").innerHTML =
    '<div class="deck-results">'+
      '<p>'+goodCount+' good</p>'+
      '<p>'+badCount+' bad</p>'+
    '</div>';
  document.querySelector("#controls").innerHTML = '';

  var $doneLink = Util.createButtonLink('Done', function(){
    App.showMenuView();
  });
  document.querySelector("#card").children[0].appendChild($doneLink);
};
