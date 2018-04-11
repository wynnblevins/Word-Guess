var puzzles = require('./puzzle-library.js');
var NumGenerator = require('./random-number-generator.js');
var inquirer = require('inquirer');

var target;
var guessThreshold = 5; // number of incorrect guesses allowed
var guessedLetters = [];
var guesses = 0;
var maxGuesses;
var strikes = 0;
var gameBoard = [];

function allLettersRevealed() {
    for (var i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '_ ') {
            return false;
        }
    }

    return true;
}

function noMoreGuesses() {
    console.log(guessThreshold);
    if (strikes > guessThreshold) {
        return true;
    }
    return false;
}

function getMatchIndices(targetWord, guessLetter) {
    var ndxs = [];
    var targetWord = targetWord.toUpperCase();
    for (var i = 0; i < targetWord.length; i++) {
        if (targetWord[i] === guessLetter) {
            ndxs.push(i);
        }
    }

    return ndxs;
}

function checkForMatches(guessedLetter) {
    var uppercaseChar = guessedLetter.toUpperCase();
    var ndxs = getMatchIndices(target.text, uppercaseChar);
    return ndxs;
}

function replaceMatches(ndxs, guess) {
    var SPACE = ' ';        
    var uppercaseChar = guess.toUpperCase();

    // loop through all indexes in list of matching indexs
    for (var i = 0; i < ndxs.length; i++) {
        for (var j = 0; j < target.text.length; j++) {           
            if (target.text[j] === uppercaseChar) {
                gameBoard[j] = uppercaseChar + SPACE;
            }
        }
    }    
}

function getNumberOfUniqueLetters(puzzleString) {
    var encounteredLetters = [];
    
    for (var i = 0; i < puzzleString.length; i++) {
        var currLetter = puzzleString[i];
        if (encounteredLetter.indexOf(currLetter) === -1) {
            encounteredLetters.push(currLetter);
        }
    }
    
    return encounteredLetters.length;
}

function initGame() {
    // Represents however many files are in project's media library
    var numOfPuzzles = puzzles.length;

    // pick a random number
    var ndx = new NumGenerator().generate(numOfPuzzles);

    // use random number to pick a file
    target = puzzles[ndx];
    maxGuesses = getNumberOfUniqueLetters + guessThreshold;

    // initialize strikes and guessed letter to be empty
    guessedLetters = [];
    
    // create game board
    for (var i = 0; i < target.text.length; i++) {
        if (target.text[i] !== ' ') {
            // create an underscore followed by a space for each character in the puzzle
            gameBoard.push('_ ');            
        } else { // character is a space
            // put two spaces (two verses one for readability purposes)
            gameBoard.push('  ');
        }
    }

    // this method is recursively called until the game is beat
    runEachGuess(gameBoard);
}

function runEachGuess(gameBoard) {
    displayGameBoard(gameBoard).then(function (guessObj) {
        var input = guessObj.userInput;
        var matchNdxs = getMatchIndices(target.text, input);
        
        if (matchNdxs.length !== 0) {
            // we have a match, so replace it whereever it occurs
            replaceMatches(matchNdxs, input);  
        } else {
            strikes++;
            
        }
        
        if (userBeatPuzzle()) {
            console.log('U win!! Yayyy!');
            return;           
        }
        else if (noMoreGuesses()) {
            console.error('U ran out of guesses!');
            return;
        } 
        else if (!allLettersRevealed()) {
            return runEachGuess(gameBoard);
        } 
    });
}

function displayGameBoard(gameBoard) {
    var gameBoardMessage = gameBoard.join('') + 
        '\nGuessed Letters: ' + guessedLetters +
        '\nStrikes: ' + strikes + 
        '\n>';
    
    return inquirer.prompt([{
        type: "input",
        name: "userInput",
        message: gameBoardMessage 
    }]);
}

function userBeatPuzzle() {
    for (var i = 0; i < gameBoard.length; ++i) {
        if (gameBoard[i] === '_ ') {
            return false;
        }
    }

    return true;
}

function guessIsMatch(guess) {
    var ndxs = getMatchIndices(target.text, guess);
    if (ndxs.length !== 0) {
        return true;
    }
    else {
        return false;
    }
}     

initGame();