var DeckParser = window.DeckParser = {};

DeckParser.parse = function(raw){
  var cards = [];

  var card = {};
  table = null;
  raw.split(/\r?\n/).forEach(function(line){
    if (line==="--") {
      if (table) {
        if (card.type==="lesson") {
          card.body += table;
        }
        table = null;
      }
      cards.push(card);
      card = {};
    } else {
      if (card.type==="lesson") {
        if (line.startsWith("|")) {
          var large = false;
          if (line.charAt(1)==="!") {
            large = true;
            line = line.substr(1);
          }
          if (!table) {
            table = '<table>';
          }
          table += '<tr'+(large ? ' class="large"': '')+'><td>'+
            line.substr(1).split(/\|/)
              .map(Function.call, String.prototype.trim)
              .join('</td><td>')+
            '</td></tr>';
        } else {
          if (table) {
            card.body += table;
            table = null;
          }
          card.body += '<p>'+line+'</p>';
        }
      } else if (card.type==="review") {
        if (line.startsWith("back:")) {
          card.back = line.substr(6);
        }
      } else { // new card
        if (line.startsWith("front:")) {
          card.type = "review";
          card.front = line.substr(7);
        } else {
          card.type = "lesson";
          card.body = '<p>'+line+'</p>';
        }
      }
    }
  });
  if (table) {
    if (card.type==="lesson") {
      card.body += table;
    }
    table = null;
  }
  cards.push(card);

  return cards;
};
