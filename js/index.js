var App = window.App = {};

App.currentView = null;

App.start = function(){
  App.showMenuView();
};

App.showMenuView = function(){
  App.show(new MenuView());
};

App.showLearnView = function(deckId){
  App.show(new LearnView(deckId));
};

App.showReviewView = function(deckId){
  App.show(new ReviewView(deckId));
};

App.showBrowseView = function(deckId){
  App.show(new BrowseView(deckId));
};

App.show = function(view){
  if (App.currentView) {
    if ('function'===typeof App.currentView.detach) {
      App.currentView.detach();
    }
  }
  App.currentView = view;
  view.render();
};
