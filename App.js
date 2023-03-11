/*
NAME:
       mapData
DESCRIPTION:
         mapData-> To make specfic places off limit.        
RESULTS:
    Returns by the user on the map cant go over to certain parts of the map
*/
const mapData = {
  minX:1,
  maxX: 14,
  minY: 4,
  maxY: 12,
  //blocking the spaces on the map.
  blockedSpaces:{
    "7x4": true,
    "1x11": true,
    "12x10": true,
    "4x7": true,
    "5x7": true,
    "6x7": true,
    "8x6": true,
    "9x6": true,
    "10x6": true,
    "7x9": true,
    "8x9": true,
    "9x9": true,
  },
};

/*import './index.css';
import './index.html';
//Initalzing and Importing Firebase App 
const { initializeApp } = require('firebase-admin/app');
import { initializeApp } from 'firebase-admin/app';
*/
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
      isSolid(x,y)
DESCRIPTION:
       isSolid(x,y) changes everything to be true
        x -> x axis on the map
        y -> y axis on the map
RESULTS:
    1. Returns anything true depending on the location where the character is going to move

*/
function isSolid(x,y){
  return true;
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
  //player id who login in firebase
  let playerId;
  // Intract with the database
  let playerRef;
  //Local list of where the character is and etc
  let players ={};
  //list of elements
  let playerElements = {};

  const gameContainer =document.querySelector(".game-container");
/*
NAME:-
      handleArrowPress()
DESCRIPTION:
        handleArrowPress(), a function of x and y coordinates of the character
        xChange -> x postion of the character
        yChange -> y position of the character
RESULTS:
    1. Find the current position of the character of x and y with updating firebase.

*/
  function handleArrowPress(xChange=0,yChange=0) {
    const newX = players[playerId].x +xChange;
    const newY = players[playerId].y +yChange;
    if(isSolid(newX,newY)){
      //move to the next part
      players[playerId].x  =newX  
      players[playerId].y  =newY
      //new position and direction
      if(xChange ===1){
        players[playerId].direction ="right";
      }
      if(xChange ===-1){
        players[playerId].direction ="left";
      }
      // let firebase know 
      playerRef.set(players[playerId]);
  }
}

/*
NAME:-
      initGame()
DESCRIPTION:
        initGame(), a function within the game running will have other players join as a player card in firebase. 
RESULTS:
    1. Read the players and coins in the game

*/
  function initGame(){

    new KeyPressListener("ArrowUp", () => handleArrowPress(0,-1))
    new KeyPressListener("ArrowDown", () => handleArrowPress(0,1))
    new KeyPressListener("ArrowLeft", () => handleArrowPress(-1,0))
    new KeyPressListener("ArrowRight", () => handleArrowPress(1,0))

    // playerref is for all players in the game
      const allPlayerRef =firebase.database().ref('players');
      const allCoinRef=firebase.database().ref('coins');
  
      allPlayerRef.on("value",(snapshot)=>{
        //Fires when a change does occur

        //sync our players in firebase
        players = snapshot.val() || {};
        //keys for each player
        Object.keys(players).forEach((key) =>{
          const characterState = players[key];
          let el = playerElements[key];
          // Use to update
          el.querySelector(".Character_name").innerText=characterState.name;
          el.querySelector(".Character_coins").innerText=characterState.coins;
          el.setAttribute("data-color",characterState.color);
          el.setAttribute("data-direction", characterState.direction);
          const left= 16* characterState.X +"px";
          const top = 16* characterState.y -4 + "px";
          el.style.transform = `translat3d(${left}, ${top},0)`;
        })
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
      //removing the character from the game when exit
      allPlayerRef.on("child_removed", (snapshot) =>{
        const removedKey =snapshot.val().id;
        gameContainer.removeChild(playerElements[removedKey]);
        delete playerElements[removedKey];
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