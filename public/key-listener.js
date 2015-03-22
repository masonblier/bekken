var KeyListener = window.KeyListener = {};

KeyListener.listeners = {};
KeyListener.handler = null;

KeyListener.SPACE = 32;
KeyListener.ARROW_LEFT = 37;
KeyListener.ARROW_RIGHT = 39;
KeyListener.NUM_1 = 49;
KeyListener.NUM_2 = 50;
KeyListener.NUM_3 = 51;

KeyListener.start = function(){
  if (KeyListener.handler) return;
  KeyListener.handler = function(e){
    // console.log("which:"+e.which,"keyCode:"+e.keyCode);
    if (KeyListener.listeners[e.which]) {
      KeyListener.listeners[e.which]();
    }
  };
  document.addEventListener('keyup', KeyListener.handler);
};

KeyListener.stop = function(){
  if (!KeyListener.handler) return;
  document.removeEventListener('keyup', KeyListener.handler);
  KeyListener.handler = null;
};

KeyListener.set = function(code, listener){
  if (!KeyListener.handler) {
    KeyListener.start();
  }
  KeyListener.listeners[code] = listener;
};

KeyListener.clear = function(code){
  delete KeyListener.listeners[code];
};

KeyListener.clearAll = function(){
  KeyListener.listeners = {};
  KeyListener.stop();
};
