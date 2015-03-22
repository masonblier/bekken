function MenuView(deckId){
  this.decks = [
    {id:'hiragana-1', name: "Hiragana"},
    {id:'hiragana-2', name: "Compound Hiragana"},
  ];
}

MenuView.prototype.render = function(){
  var $app = document.querySelector("#app");
  $app.innerHTML =
    '<div id="menu" class="section">'+
      '<table class="menu-table">'+
        '<thead>'+
          '<tr><th>Deck</th><th>Actions</th></tr>'+
        '</thead>'+
        '<tbody></tbody>'+
      '</table>'+
    '</div>';

  var $tbody = document.querySelector("#menu>.menu-table>tbody");
  this.decks.forEach(function(deck){
    var $row = document.createElement('tr');

    var $titleCell = document.createElement('td');
    var $titleLink = Util.createButtonLink(deck.name, function(){
      App.showLearnView(deck.id);
    });
    $titleCell.appendChild($titleLink);
    $row.appendChild($titleCell);

    var $actionsCell = document.createElement('td');
    $actionsCell.setAttribute('class', 'menu-deck-actions');
    var $learnLink = Util.createButtonLink('L', {
      'class':'learn-action',
      'title':'Learn'
    }, function(){
      App.showLearnView(deck.id);
    });
    $actionsCell.appendChild($learnLink);
    var $reviewLink = Util.createButtonLink('R', {
      'class':'review-action',
      'title':'Review'
    }, function(){
      App.showReviewView(deck.id);
    });
    $actionsCell.appendChild($reviewLink);
    var $browseLink = Util.createButtonLink('B', {
      'class':'browse-action',
      'title':'Browse'
    }, function(){
      App.showBrowseView(deck.id);
    });
    $actionsCell.appendChild($browseLink);
    $row.appendChild($actionsCell);

    $tbody.appendChild($row);
  });
};
