function MenuView(deckId){
  this.sections = [
    {
      name: "Kana, the Japanese phonetic alphabets",
      decks: [
        {id:'1-hiragana', name: "Hiragana"},
        {id:'2-hiragana', name: "Compound Hiragana"},
        {id:'3-katakana', name: "Katakana"}
      ]
    },
    {
      name: "Introduction to Kanji",
      decks: [
        {id:'4-numbers', name: "Numbers in Japanese"},
        {id:'5-days-of-the-week', name: "Days of the week"},
        {id:'6-me-you-pronouns', name: "First and Second person pronouns"},
        {id:'7-other-people', name: "Referring to other people"},
        {id:'8-periods-of-time', name: "Periods of time"},
        {id:'9-expressing-dates', name: "Expressing specific dates"}
      ]
    },
    {
      name: "Verb forms",
      decks: [
        {id:'10-common-verbs', name: "Common Verbs"},
        {id:'11-verb-past-negative', name: "Past and negative conjugations"},
        {id:'12-verbs-te-teiru-forms', name: "The te and te-iru forms"}
      ]
    }
  ];
}

MenuView.prototype.render = function(){
  var $app = document.querySelector("#app");
  $app.innerHTML =
    '<div id="menu" class="section">'+
      '<table class="menu-table" cellspacing="0">'+
        '<thead>'+
          '<tr><th>Deck</th><th>Actions</th></tr>'+
        '</thead>'+
        '<tbody></tbody>'+
      '</table>'+
    '</div>';

  var $tbody = document.querySelector("#menu>.menu-table>tbody");
  this.sections.forEach(function(section){
    var $row = document.createElement('tr');
    $row.innerHTML = '<td class="menu-section" colspan="2">'+section.name+'</td>';
    $tbody.appendChild($row);

    section.decks.forEach(function(deck){
      var deckState = Deck.getState(deck.id);

      var $row = document.createElement('tr');

      var $titleCell = document.createElement('td');
      var $titleLink = Util.createButtonLink(deck.name, function(){
        if (deckState==="learned") {
          App.showReviewView(deck.id);
        } else {
          App.showLearnView(deck.id);
        }
      });
      $titleCell.appendChild($titleLink);
      $row.appendChild($titleCell);

      var $actionsCell = document.createElement('td');
      $actionsCell.setAttribute('class', 'menu-deck-actions');
      var $learnLink = Util.createButtonLink('L', {
        'class':(deckState==="learned" ? 'completed-action' : 'learn-action'),
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
  });
};
