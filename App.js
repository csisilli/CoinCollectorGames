
import './index.css';
import './index.html';
const { initializeApp } = require('firebase-admin/app');
import { initializeApp } from 'firebase-admin/app';
/*
NAME:
       MathrandomArray(array)
DESCRIPTION:
         MathrandomArray(array) -> To make coins show up in random places.
         array-> array use to make a large amount or random object to appear
RESULTS:
    Returns a random memeber of the array

*/
function MathrandomArray(array){
  return array[Math.floor(Math.random() * array.length)]
}
/*
NAME:
       keyString(x,y)
DESCRIPTION:
         keyString(x,y) To make string coordinates.
         x,y-> like making a board game
RESULTS:
    Returns a string to be used to make a map of a game. 

*/
function keyString(x,y){
  return `${x}x${y}`;
}
/*
NAME:-
      ()
DESCRIPTION:
        (), beginning style of what will be written inside the App(), there will be seperate part for different areas.

RESULTS:
    1. Once opening the app, the title on the tab screen will say: 

*/
(function () {

  let playerId;
  let playerRef;
  firebase.auth().onAuthStateChnaged((user)=>{
    console.log(user)
    if(user){
      //You are logged in~ Have Fun!
      playerId =user.uid;
      playerRef = firebase.datanase().ref(`player/${[playerId]}`)
      // calling the function
      const name = createName()

      playerRef.set({
        id:playerId,
        name: "Cait",
        color: "blue",
        x:3,
        y:3,
        coins: 0,
      })
    }else {
      //You are logged out~ Goodbye!
    }
  })
  //Catches an error if anything wrong occurs
  firebase.auth().signInAnonymously().catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    console.log(errorCode, errorMessage);
  });

})();

