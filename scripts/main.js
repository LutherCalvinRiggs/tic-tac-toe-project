// players needs to be a factory - factoryFunctions return objects
const playerFactory = (name, token) => {
    return { name, token };
}

// GameBoard (displayController) needs to be a module
const GameBoard = (function () {
    // set up the game board array
    const _gameBoardArray = ["","","","","","","","",""];

    // build players
    var _playerOne = playerFactory("Player 1", "X");
    var _playerTwo = playerFactory("Player 2", "O");

    // connect to the #current-player-display HTML div and set the first player to Player 1
    const _currentPlayerDisplay = document.querySelector("#current-player-display");
    let _currentPlayer = _playerOne;

    // set up the player's turn array
    var displayCurrentPlayer = () => {
        $(_currentPlayerDisplay).text(_currentPlayer.name + ", please make your move.");
    };

    var renderGameBoard = () => {
        // link to #game-board HTML
        const gameBoardElement = document.querySelector("#game-board");
        
        // create game tiles, fill with _gameBoardArray values, and attach to gameBoardElement
        for (let i = 0; i < _gameBoardArray.length; i++) {
            // create
            let gameBoardTile = document.createElement("div");
            $(gameBoardTile).addClass("game-board-tile");
            $(gameBoardTile).attr("id", i);
            // fill
            $(gameBoardTile).text(_gameBoardArray[i]);
            // add an eventListener to empty tiles
            if ($(gameBoardTile).text() === "") {
                $(gameBoardTile).on("click", _clickFunction);
            }
            // attach
            $(gameBoardElement).append(gameBoardTile);
        }        
        
        return gameBoardElement;
    };

    // eventListener function that places player token on the board and switches between players
    let _clickFunction = (e) => {
        if (_currentPlayer.name === _playerOne.name) {
            e.target.textContent = _playerOne.token;
            _gameBoardArray[`${e.target.id}`] = _playerOne.token;
            _currentPlayer = _playerTwo;
            $(_currentPlayerDisplay).text(_playerTwo.name + ", please make your move.");
        } else if (_currentPlayer.name === _playerTwo.name) {
            e.target.textContent = _playerTwo.token;
            _gameBoardArray[`${e.target.id}`] = _playerTwo.token;
            _currentPlayer = _playerOne;
            $(_currentPlayerDisplay).text(_playerOne.name + ", please make your move.");
        }

        // remove the eventListener when a play is made
        $(e.target).off("click", _clickFunction);

        if (_checkForEndOfGame() === true) {
            _gameOver();
        };
    };

    function _checkForEndOfGame() {
        return _checkForWinner(0,1,2)   // check the rows
            || _checkForWinner(3,4,5)
            || _checkForWinner(6,7,8)
            || _checkForWinner(0,3,6)   // check the columns
            || _checkForWinner(1,4,7)
            || _checkForWinner(2,5,8)
            || _checkForWinner(0,4,8)   // check the diagonals 
            || _checkForWinner(2,4,6)
            || _checkForStalemate();
    }

    function _checkForWinner(tile1, tile2, tile3) {
        // set the tokens to check and verify they are played by the same player
        var token1 = _gameBoardArray[tile1];
        if (token1 === "") return false;
        var token2 = _gameBoardArray[tile2];
        if (token1 != token2) return false;
        var token3 = _gameBoardArray[tile3];
        if (token1 != token3) return false;

        winner = token1;

        if (winner === "X") {
            $(_currentPlayerDisplay).text(_playerOne.name.toUpperCase() + " IS THE WINNER!");
        };

        if (winner === "O") {
            $(_currentPlayerDisplay).text(_playerTwo.name.toUpperCase() + " IS THE WINNER!");
        };
        return true;
    };

    function _checkForStalemate() {
        for (let i = 0; i < _gameBoardArray.length; i++) {
            if (_gameBoardArray[i] === "") return false;
        }
        
        $(_currentPlayerDisplay).text("It's a stalemate.");
        return true;
    } 

    function _gameOver() {
        // remove all event listeners
        let allTiles = $(".game-board-tile");
        $(allTiles).off("click", _clickFunction);

        // add a button refresh the page
        let refreshButton = document.createElement("button")
        let body = document.querySelector("body")
        $(body).append(refreshButton);
        $(refreshButton).addClass("play-again-button");
        $(refreshButton).text("Play Again");
        $(refreshButton).on("click", () => {
            // refresh the window
            window.location.reload();
        });
    }

    return { displayCurrentPlayer, renderGameBoard };

})();



// GamePlay needs to be a module
const GamePlay = (function () {

    // render the game board to the screen
    var runGame = function() {
        GameBoard.renderGameBoard();
        GameBoard.displayCurrentPlayer();
    };
    
    return { runGame }

})();



// Start the game when the page loads
GamePlay.runGame();