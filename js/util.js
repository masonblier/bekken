var Util = window.Util = {};

Util.createButtonLink = function(text, options, eventListener){
  if ('function'===typeof options) {
    eventListener = options;
  }
  if ('object'!==typeof options) {
    options = {};
  }

  var $link = document.createElement("a");
  $link.setAttribute('href', '#');
  $link.innerHTML = text;
  $link.addEventListener('click', function(e){
    e.preventDefault();
    if ('function'===typeof eventListener) {
      eventListener(e);
    }
  }, false);
  if (options['class']) $link.setAttribute('class', options['class']);
  if (options['title']) $link.setAttribute('title', options['title']);
  return $link;
};
