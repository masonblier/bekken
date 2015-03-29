function BrowseView(deckId){
  this.deck = new Deck(deckId);
}

BrowseView.prototype.render = function(){
  this.deck.load(function(){
    var $app = document.querySelector("#app");
    $app.innerHTML =
      '<div id="browse" class="section">'+
        '<table class="browse-table">'+
          '<thead>'+
            '<tr><th>Front</th><th>Back</th><th>State</th></tr>'+
          '</thead>'+
          '<tbody>'+
            this.deck.cards.filter(function(card){
              return (card.type==='review');
            }).map(function(card,idx){
              var state = this.deck.states[idx]||{state:'new'};
              return '<tr>'+
                '<td>'+card.front+'</td>'+
                '<td>'+card.back+'</td>'+
                '<td class="browse-state-'+state.state+'">'+state.state+'</td>'
              '</tr>';
            }.bind(this)).join('')+
          '</tbody>'+
        '</table>'+
      '</div>';
  }.bind(this), function(err){
    console.error('deck '+this.deck.id+' failed to load: '+err);
  }.bind(this));
};
