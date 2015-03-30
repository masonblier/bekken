function ReviewView(deckId){
  this.deck = new Deck(deckId);
}

ReviewView.prototype.render = function(){
  var $app = document.querySelector("#app");
  $app.innerHTML =
    '<div class="card-viewer">'+
      '<div id="navigation" class="section"></div>'+
      '<div id="card" class="card section"></div>'+
      '<div id="controls" class="section"></div>'+
    '</div>';

  this.deck.load(function(){
    this.reviewCards = this.getReviewCards();
    this.reviewIdx = -1;
    this.nextCard();
  }.bind(this), function(err){
    console.error('deck '+this.deck.id+' failed to load: '+err);
  }.bind(this));
};

ReviewView.prototype.detach = function(){
  KeyListener.clearAll();
};

ReviewView.prototype.getReviewCards = function(){
  if (!this.deck.cards) throw new Error("cannot getReviewCards before deck is loaded");

  var newOrBadCardCount = 0;
  var reviewCards = this.deck.cards.filter(function(card){
    return (card.type==='review');
  }).map(function(card, idx){
    var reviewCard = JSON.parse(JSON.stringify(card));
    reviewCard.cardIdx = idx;
    var cardState = this.deck.states[idx];
    if (!cardState || cardState.state==='bad') {
      newOrBadCardCount += 1;
    }
    return {s:cardState,c:reviewCard};
  }.bind(this)).sort(function(a,b){
    if (!a.s) return -1;
    if (!b.s) return 1;
    if (a.s.state==='bad') {
      if (b.s.state==='ok') return -1;
      if (b.s.state==='good') return -1;
    }
    if (a.s.state==='ok') {
      if (b.s.state==='bad') return 1;
      if (b.s.state==='good') return -1;
    }
    if (a.s.state==='good') {
      if (b.s.state==='bad') return 1;
      if (b.s.state==='ok') return 1;
    }
    if (a.s.lastShown > b.s.lastShown) return 1;
    if (a.s.lastShown < b.s.lastShown) return -1;
    return 0;
  }).map(function(cs){
    return cs.c;
  }).slice(0, Math.max(newOrBadCardCount, 40));

  return reviewCards;
};

ReviewView.prototype.nextCard = function(){
  this.reviewIdx = 1 + this.reviewIdx;
  if (this.reviewIdx < this.reviewCards.length) {
    this.renderCardFront();
  } else {
    this.renderResults();
  }
};

ReviewView.prototype.renderCardFront = function(){
  var card = this.reviewCards[this.reviewIdx];

  document.querySelector("#navigation").innerHTML =
  '<h3>Review '+(1+this.reviewIdx)+' / '+this.reviewCards.length+'</h3>';

    document.querySelector("#card").innerHTML =
      '<p class="card-front">'+card.front+'</p>'+
      '<p>&nbsp;</p>';

  this.renderFrontButtons();
};

ReviewView.prototype.renderCardAnswer = function(){
  var card = this.reviewCards[this.reviewIdx];

  document.querySelector("#navigation").innerHTML =
  '<h3>Review '+(1+this.reviewIdx)+' / '+this.reviewCards.length+'</h3>';

    document.querySelector("#card").innerHTML =
      '<p class="card-front">'+card.front+'</p>'+
      '<p>'+card.back+'</p>';

  this.renderAnswerButtons();
};

ReviewView.prototype.renderFrontButtons = function(){
  var nextFn = function(e){
    console.log('next')
    this.renderCardAnswer();
  }.bind(this);

  var $controls = document.querySelector("#controls");
  $controls.innerHTML = '';
  var $nextBtn = document.createElement("button");
  $nextBtn.innerHTML = 'Next';

  $nextBtn.addEventListener('click', nextFn, false);
  $controls.appendChild($nextBtn);
  $nextBtn.focus();

  KeyListener.clear(KeyListener.NUM_1);
  KeyListener.clear(KeyListener.NUM_2);
  KeyListener.clear(KeyListener.NUM_3);
  KeyListener.set(KeyListener.SPACE, nextFn);
};

ReviewView.prototype.renderAnswerButtons = function(){
  var makeStateFn = function(state){
    return function(e){
      console.log(state)
      var cardIdx = this.reviewCards[this.reviewIdx].cardIdx;
      this.deck.states[cardIdx] = {
        state: state,
        lastShown: Date.now()
      };
      this.deck.save(function(){
        this.nextCard();
      }.bind(this));
    }.bind(this);
  }.bind(this);

  var badFn = makeStateFn('bad');
  var okFn = makeStateFn('ok');
  var goodFn = makeStateFn('good');

  var $controls = document.querySelector("#controls");
  $controls.innerHTML = '';
  var $badBtn = document.createElement("button");
  $badBtn.innerHTML = 'Bad';
  var $okBtn = document.createElement("button");
  $okBtn.innerHTML = 'Next';
  var $goodBtn = document.createElement("button");
  $goodBtn.innerHTML = 'Good';

  $badBtn.addEventListener('click', badFn, false);
  $okBtn.addEventListener('click', okFn, false);
  $goodBtn.addEventListener('click', goodFn, false);

  var stopSpaceProp = function(e){ if (e.which===KeyListener.SPACE) e.stopPropagation(); };
  $badBtn.addEventListener('keyup', stopSpaceProp);
  $okBtn.addEventListener('keyup', stopSpaceProp);
  $goodBtn.addEventListener('keyup', stopSpaceProp);

  $controls.appendChild($badBtn);
  $controls.appendChild($okBtn);
  $controls.appendChild($goodBtn);
  $okBtn.focus();

  KeyListener.set(KeyListener.NUM_1, badFn);
  KeyListener.set(KeyListener.NUM_2, okFn);
  KeyListener.set(KeyListener.NUM_3, goodFn);
  KeyListener.set(KeyListener.SPACE, goodFn);
};

ReviewView.prototype.renderResults = function(){
  var goodCount = this.reviewCards.reduce(function(total, reviewCard){
    var state = this.deck.states[reviewCard.cardIdx].state;
    return total+(state==='good' ? 1 : 0);
  }.bind(this), 0);
  var okCount = this.reviewCards.reduce(function(total, reviewCard){
    var state = this.deck.states[reviewCard.cardIdx].state;
    return total+(state==='ok' ? 1 : 0);
  }.bind(this), 0);
  var badCount = this.reviewCards.reduce(function(total, reviewCard){
    var state = this.deck.states[reviewCard.cardIdx].state;
    return total+(state==='bad' ? 1 : 0);
  }.bind(this), 0);

  document.querySelector("#navigation").innerHTML = '<h3>Results</h3>';
  document.querySelector("#card").innerHTML =
    '<div class="deck-results">'+
      '<p>'+goodCount+' good</p>'+
      '<p>'+okCount+' ok</p>'+
      '<p>'+badCount+' bad</p>'+
    '</div>';
  document.querySelector("#controls").innerHTML = '';

  var $doneLink = Util.createButtonLink('Done', function(){
    App.showMenuView();
  });
  document.querySelector("#card").children[0].appendChild($doneLink);
};
