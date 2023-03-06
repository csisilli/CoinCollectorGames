/*
NAME:-
      KeyPressListener
DESCRIPTION:
        KeyPressListener, beginning style of what will be written inside the App(), there will be seperate part for different areas.

RESULTS:
    1. Read the players and coins in the game

*/
class KeyPressListener {
  constructor(keyCode, callback) {
    let keySafe = true;
    this.keydownFunction = function(event) {
      if (event.code === keyCode) {
         if (keySafe) {
            keySafe = false;
            callback();
         }  
      }
   };
   this.keyupFunction = function(event) {
      if (event.code === keyCode) {
         keySafe = true;
      }         
   };
   document.addEventListener("keydown", this.keydownFunction);
   document.addEventListener("keyup", this.keyupFunction);
  }

  unbind() { 
    document.removeEventListener("keydown", this.keydownFunction);
    document.removeEventListener("keyup", this.keyupFunction);
  }


}