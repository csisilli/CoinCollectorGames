/*
NAME:
       mapData
DESCRIPTION:
         mapData-> To make specfic places off limit.        
RESULTS:
    Returns by the user on the map cant go over to certain parts of the map
*/

const mapData = {
    minX: 1,
    maxX: 14,
    minY: 4,
    maxY: 12,

    //blocking the spaces on the map.
    blockedSpaces: {
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
  
    //Options for Player Colors that are appear to these colors
  const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];

  /*
  NAME:
         randomFromArray(array)
  DESCRIPTION:
           randomFromArray -> To make coins show up in random places.
           array-> array use to make a large amount or random object to appear
  RESULTS:
      Returns a random memeber of the array
  
  */
  
  function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
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

  function keyString(x, y) {
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

  function createName() {

    //part of a random array for the user can pick their name.
    const prefix = randomFromArray([
      "COOL",
      "SUPER",
      "HIP",
      "SMUG",
      "COOL",
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
    const animal = randomFromArray([
      "BEAR",
      "DOG",
      "CAT",
      "FOX",
      "LAMB",
      "LION",
      "BOAR",
      "GOAT",
      "VOLE",
      "SEAL",
      "PUMA",
      "MULE",
      "BULL",
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
      1. Returns anything true depending on the location where the character is able to move to.
  
  */

  function isSolid(x,y) {

    // makes an x and y cordinate that looks like in blockedSpaces.
    const blockedNextSpace = mapData.blockedSpaces[keyString(x, y)];

    // this is determinding if the space is okay step on.
    return (
      blockedNextSpace ||
      x >= mapData.maxX ||
      x < mapData.minX ||
      y >= mapData.maxY ||
      y < mapData.minY
    )
  }

    /*
  NAME:-
        randomSafeSpot()
  DESCRIPTION:
          randomSafeSpot(), returns randomFromArray for the character.
          
  
  RESULTS:
      1. Once opening the app, the character will spawm in randomly picked spots
  
  */

  function randomSafeSpot() {

    // this is for the character to randomly spawn in these specfici spots.
    return randomFromArray([

      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 1, y: 5 },
      { x: 2, y: 6 },
      { x: 2, y: 8 },
      { x: 2, y: 9 },
      { x: 4, y: 8 },
      { x: 5, y: 5 },
      { x: 5, y: 8 },
      { x: 5, y: 10 },
      { x: 5, y: 11 },
      { x: 11, y: 7 },
      { x: 12, y: 7 },
      { x: 13, y: 7 },
      { x: 13, y: 6 },
      { x: 13, y: 8 },
      { x: 7, y: 6 },
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 8, y: 8 },
      { x: 10, y: 8 },
      { x: 8, y: 8 },
      { x: 11, y: 4 },
      
    ]);
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
    let players = {};

    //list of elements
    let playerElements = {};

    //coin array and element array
    let coins = {};
    let coinElements = {};
  
     // These's are saved elements
    const gameContainer = document.querySelector(".game-container");

    // this is name input that matches with the div in index.html
    const playerNameInput = document.querySelector("#player-name");

     // this is button input that matches with the div in index.html
    const playerColorButton = document.querySelector("#player-color");
  
/*
  NAME:-
        placeCoin()
  DESCRIPTION:
          placeCoin() places coins in a random safe spot
  RESULTS:
      1. randomly place coins in a safe area where it not blocked 
  
*/  

    function placeCoin() {
      const { x, y } = randomSafeSpot();
      const coinRef = firebase.database().ref(`coins/${keyString(x, y)}`);
      coinRef.set({
        x,
        y,
      })
  
      const coinTimeouts = [2000, 3000, 4000, 5000];
      setTimeout(() => {
        placeCoin();
      }, randomFromArray(coinTimeouts));
    }

/*
  NAME:-
        attemptGrabCoin(x, y)
  DESCRIPTION:
          attemptGrabCoin(x, y), a function of x and y coordinates of the coin
          x -> x postion of the coin
          y -> y position of the coin
  RESULTS:
      1. it attemps the user to grab the coin
  
*/ 

    function attemptGrabCoin(x, y) {
      const key = keyString(x, y);
      if (coins[key]) {
        
        // Remove the coins, then coin count
        firebase.database().ref(`coins/${key}`).remove();
        playerRef.update({
          coins: players[playerId].coins + 1,
        })
      }
    }
  
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

    function handleArrowPress(xChange=0, yChange=0) {
      const newX = players[playerId].x + xChange;
      const newY = players[playerId].y + yChange;
      if (!isSolid(newX, newY)) {

        //move to the next space
        players[playerId].x = newX;
        players[playerId].y = newY;

        //new position and direction
        if (xChange === 1) {
          players[playerId].direction = "right";
        }
        if (xChange === -1) {
          players[playerId].direction = "left";
        }

        //Let firebase know
        playerRef.set(players[playerId]);
        attemptGrabCoin(newX, newY);
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

    function initGame() {
  
      new KeyPressListener("ArrowUp", () => handleArrowPress(0, -1))
      new KeyPressListener("ArrowDown", () => handleArrowPress(0, 1))
      new KeyPressListener("ArrowLeft", () => handleArrowPress(-1, 0))
      new KeyPressListener("ArrowRight", () => handleArrowPress(1, 0))
        
      // Playerref is for all players in the game
      const allPlayersRef = firebase.database().ref(`players`);
      const allCoinsRef = firebase.database().ref(`coins`);

        //Fires when a change does occur
      allPlayersRef.on("value", (snapshot) => {

        //sync our players in firebase
        players = snapshot.val() || {};

        //keys for each player
        Object.keys(players).forEach((key) => {
          const characterState = players[key];
          let el = playerElements[key];

          // Use to update
          el.querySelector(".Character_name").innerText = characterState.name;
          el.querySelector(".Character_coins").innerText = characterState.coins;
          el.setAttribute("data-color", characterState.color);
          el.setAttribute("data-direction", characterState.direction);

          const left = 16 * characterState.x + "px";
          const top = 16 * characterState.y - 4 + "px";
          el.style.transform = `translate3d(${left}, ${top}, 0)`;
        })
      })
      allPlayersRef.on("child_added", (snapshot) => {

        //Fires when a node is added to the tree
        const addedPlayer = snapshot.val();
        const characterElement = document.createElement("div");
        characterElement.classList.add("Character", "grid-cell");

        //If it the creator aka Caitlin it should show in green it me
        if (addedPlayer.id === playerId) {
          characterElement.classList.add("you");
        }

        characterElement.innerHTML = (`
          <div class="Character_shadow grid-cell"></div>
          <div class="Character_sprite grid-cell"></div>
          <div class="Character_name-container">
            <span class="Character_name"></span>
            <span class="Character_coins">0</span>
          </div>
          <div class="Character_you-arrow"></div>
        `);

        playerElements[addedPlayer.id] = characterElement;
  
        //Fill like the name, coin count and etc.
        characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
        characterElement.querySelector(".Character_coins").innerText = addedPlayer.coins;
        characterElement.setAttribute("data-color", addedPlayer.color);
        characterElement.setAttribute("data-direction", addedPlayer.direction);

        const left = 16 * addedPlayer.x + "px";
        const top = 16 * addedPlayer.y - 4 + "px";
        characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
        gameContainer.appendChild(characterElement);
      })
  
  
      //Removing the character from the game when exit
      allPlayersRef.on("child_removed", (snapshot) => {
        const removedKey = snapshot.val().id;

        gameContainer.removeChild(playerElements[removedKey]);
        delete playerElements[removedKey];
      })
  
  
      
      // Remove coins from the map and update firebase
      allCoinsRef.on("value", (snapshot) => {
        coins = snapshot.val() || {};
      });
      
      //Updating where the coins will be added.
      allCoinsRef.on("child_added", (snapshot) => {
        const coin = snapshot.val();
        const key = keyString(coin.x, coin.y);
        coins[key] = true;
  
        // Creating an element for the coins
        const coinElement = document.createElement("div");
        coinElement.classList.add("Coin", "grid-cell");

        coinElement.innerHTML = `
          <div class="Coin_shadow grid-cell"></div>
          <div class="Coin_sprite grid-cell"></div>
        `;
  
        // Postions of the elements
        const left = 16 * coin.x + "px";
        const top = 16 * coin.y - 4 + "px";
        coinElement.style.transform = `translate3d(${left}, ${top}, 0)`;
  
        //reference for removing later
        coinElements[key] = coinElement;
        gameContainer.appendChild(coinElement);
      })

      //Removing coins
      allCoinsRef.on("child_removed", (snapshot) => {
        const {x,y} = snapshot.val();
        const keyToRemove = keyString(x,y);
        gameContainer.removeChild( coinElements[keyToRemove] );
        delete coinElements[keyToRemove];
      })
  
  
      //Update characters name with the text input
      playerNameInput.addEventListener("change", (e) => {
        const newName = e.target.value || createName();
        playerNameInput.value = newName;

        //a thing in firebase where it updates the characters name
        playerRef.update({
          name: newName
        })
      })
  
      //Updates the players color with the button
      playerColorButton.addEventListener("click", () => {
        const colorIndex = playerColors.indexOf(players[playerId].color);
        const nextColor = playerColors[colorIndex + 1] || playerColors[0];

        playerRef.update({
          color: nextColor
        })
      })
  
      //Place my first coin
      placeCoin();
  
    }

/*
  NAME:-
        firebase.auth().onAuthStateChnaged
  DESCRIPTION:
          firebase.auth().onAuthStateChnaged, a function make sure the user logged in and has a player id
  RESULTS:
      1. Read the players and gives an id to them.
  
  */ 

    firebase.auth().onAuthStateChanged((user) => {
      console.log(user)
      if (user) {
        //You are logged in~ Have Fun!
        playerId = user.uid;
        playerRef = firebase.database().ref(`players/${playerId}`);

        // calling the function
        const name = createName();

        // edits the text box and syncs with firebase.
        playerNameInput.value = name;
  
        const {x, y} = randomSafeSpot();
  
        playerRef.set({
          id: playerId,
          name,
          direction: "right",
          color: randomFromArray(playerColors),
          x,
          y,
          coins: 0,
        })
  
        //Remove player from Firebase once a user disconnects
        playerRef.onDisconnect().remove();
  
        //Begin the game when user signs in
        initGame();
      } else {
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
