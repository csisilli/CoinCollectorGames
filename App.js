
import './index.css';
import './index.html';
//Initalzing and Importing Firebase App 
const { initializeApp } = require('firebase-admin/app');
import { initializeApp } from 'firebase-admin/app';

//Options for Player Colors that are appear to these colors
const playerColors =["blue","red","orange","yellow","green","purple"];

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
      createName()
DESCRIPTION:
        Creates different arrays like prefixs,animals, and etc.
RESULTS:
    1. Once opening the app, the user can create a name to join in the server. 

*/
function createName(){
  //part of a random array for the user can pick their name.
const prefix =MathrandomArray([
  "COOL",
  "SUPER",
  "HIP",
  "SMUG",
  "SILKY",
  "GOOD",
  "SAFE",
  "DEAR",
  "DAMP",
  "WARM",
  "RICH",
  "LONG",
  "DARK",
  "SOFT",
  "BUFF",
  "DOPE",
]);
//part of a random array for the user can pick their name as well.
const animal = MathrandomArray([
  "DOG",
  "CAT",
  "FOX",
  "DUCK",
  "LAMB",
  "GOOD",
  "MULE",
  "DEER",
  "GOAT",
  "PUMA",
  "SEAL",
  "LAMB",
  "BEAR",
  "WOLF",
  "BIRD",
  "BUG",
]);
return `${prefix} ${animal}`;
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
  //player id
  let playerId;
  let playerRef;
  let playerElements = {};

  const gameContainer =document.querySelector(".game-container");
  /*
NAME:-
      initGame()
DESCRIPTION:
        initGame(), a function within the game running will have other players join as a player card in firebase. 
RESULTS:
    1. Read the players and coins in the game

*/
  function initGame(){
    // playerref is for all players in the game
      const allPlayerRef =firebase.database().ref('players');
      const allCoinRef=firebase.database().ref('coins');
  
      allPlayerRef.on("value",(snapshot)=>{
        //Fires when a change does occur
  
      })
      allPlayerRef.on("child_added",(snapshot)=>{
        //Fires when a node is added to the tree
        const addedPlayer= snapshot.val();
        const characterElement = document.createElement("div");
        characterElement.classList.add("Character", "grid-cell");
        //if it the creator aka Caitlin it should show in green it me
        if(addedPlayer.id === playerId){
          characterElement.classList.add("you");
        }
          characterElement.innerHTML =(`
          <div class ="Character_shadow grid-cell"></div>
          <div class ="Character_sprite grid-cell"></div>
          <div class ="Character_name-container">
            <span class="Character_name"></span>
            span class="Character_coins">0</span>
          </div>
          <div class ="Character_you-arrow"></div> 
          `);
          playerElements[addedPlayer.id] =characterElement;
          //Fill like the name, coin count and etc.
          characterElement.querySelector(".Character_name").innerText=addedPlayer.name;
          characterElement.querySelector(".Character_coins").innerText=addedPlayer.coins;
          characterElement.setAttribute("data-color", addedPlayer.color);
          characterElement.setAttribute("data-direction", addedPlayer.direction);
          const left= 16* addedPlayer.X +"px";
          const top = 16* addedPlayer.y -4 + "px";
          characterElement.style.transform = `translat3d(${left}, ${top},0)`;
          gameContainer.appendChild(characterElement);
      })
  }
/*
NAME:-
      firebase.auth().onAuthStateChnaged
DESCRIPTION:
        firebase.auth().onAuthStateChnaged, a function make sure the user logged in and has a player id
RESULTS:
    1. Read the players and gives an id to them.

*/
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
        name,
        color: MathrandomArray(playerColors),
        x:3,
        y:3,
        coins: 0,
      })

      //Remove player from Firebase once a user disconnects
      playerRef.onDisconnect().remove();

      //Begins game when user signs in
      initGame();

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