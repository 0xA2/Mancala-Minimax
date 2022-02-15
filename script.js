
// Variables for Settings (defaults: AI difficulty -> 3; pieces per pit -> 4)

let difficulty = 3;
let piecesPerPit = 4;
let maxPieces = piecesPerPit*12;


// Variables used to make sure player can't move out of order
let ignoreClick = false;
var t1, t2;

// --- Main Menu Buttons--- //

// Button to initiate a player vs AI game;

const playerVsComputerButton = document.getElementById("playerVsComputerButton");
playerVsComputerButton.addEventListener('click', startPlayerVsComputer );

function startPlayerVsComputer(e){
	document.getElementById("mainMenuAuth").style.display = "none";
}

// Button to initiate an AI vs player game;
const computerVsPlayerButton = document.getElementById("computerVsPlayerButton");
computerVsPlayerButton.addEventListener('click', startComputerVsPlayer );

function startComputerVsPlayer(e){
	document.getElementById("mainMenuAuth").style.display = "none";

	// Opponents Move
	ignoreClick = true;
	document.getElementById("message").textContent = "Waiting for opponent...";
	t1 = setTimeout(function(){
		document.getElementById("message").textContent = "Your turn to play!";
		let otherMove = opponentMove();
		if(otherMove === "endGame"){ updateBoard(); updateScore(); updateRatio(); return; }
		if(otherMove === "passTurn"){ updateBoard(); ignoreClick = false; return; }
		if(otherMove === "playAgain"){
			updateBoard();
			document.getElementById("message").textContent = "Opponent can play again!";
			t2 = setTimeout(function(){
				while(otherMove === "playAgain"){
					otherMove = opponentMove();
					if(otherMove === "endGame"){ updateBoard(); updateScore(); updateRatio(); return; }
					updateBoard();
				}
				ignoreClick = false;
				document.getElementById("message").textContent = "Your turn to play!";
			},2000);
		}
	},2000);
}

// Button to display game rules
const rulesButton = document.getElementById("rulesButton");
rulesButton.addEventListener('click', displayRules );

function displayRules(e){
	document.getElementById("mainMenuAuth").style.display = "none";
	document.getElementById("rules").style.display = "flex";
}

// Button to go back to the main menu from the rules page
const rulesGoBackButton = document.getElementById("rulesGoBack");
rulesGoBackButton.addEventListener('click', rulesGoBack );

function rulesGoBack(e){
	document.getElementById("rules").style.display = "none";
	document.getElementById("mainMenuAuth").style.display = "flex";
}

// Button to display game settings
const settingsButton = document.getElementById("settingsButton");
settingsButton.addEventListener('click', displaySettings );

function displaySettings(e){
	document.getElementById("mainMenuAuth").style.display = "none";
	document.getElementById("settings").style.display = "flex";
}

// Button to go back to the main menu from the settings page
const settingsGoBackButton = document.getElementById("settingsGoBack");
settingsGoBackButton.addEventListener('click', settingsGoBack );

function settingsGoBack(e){
	document.getElementById("settings").style.display = "none";
	document.getElementById("mainMenuAuth").style.display = "flex";
}



// Buttons for AI dificulty settings

const AIsettings = document.querySelectorAll('[AIsettings]');
AIsettings.forEach( settingsAIButton => { settingsAIButton.addEventListener('click', handleAIsettingsClick) } );

function handleAIsettingsClick(e){
	let eventID = e.target.id;
	switch(eventID){
		case "settingsAIButton1":
			difficulty = 1;
			document.getElementById("settingsAI").textContent = "AI Level: 1"
			break;
		case "settingsAIButton2":
			difficulty = 3;
			document.getElementById("settingsAI").textContent = "AI Level: 2"
			break;
		case "settingsAIButton3":
			difficulty = 5;
			document.getElementById("settingsAI").textContent = "AI Level: 3"
			break;
		case "settingsAIButton4":
			difficulty = 7;
			document.getElementById("settingsAI").textContent = "AI Level: 4"
			break;
		case "settingsAIButton5":
			difficulty = 9;
			document.getElementById("settingsAI").textContent = "AI Level: 5"
			break;
		default:
			difficulty = 3;
			document.getElementById("settingsAI").textContent = "AI Level: 3"
	}
}


// Buttons for number of pieces per pit settings

const pitSettings = document.querySelectorAll('[pitSettings]');
pitSettings.forEach( settingsPitButton => { settingsPitButton.addEventListener('click', handlePitsettingsClick) } );

function handlePitsettingsClick(e){
	let eventID = e.target.id;
	switch(eventID){
		case "settingsPitButton1":
			piecesPerPit = 3;
			maxPieces = piecesPerPit*12;
			resetBoard();
			document.getElementById("settingsPit").textContent = "Pieces per Pit: 3"
			break;
		case "settingsPitButton2":
			piecesPerPit = 4;
			maxPieces = piecesPerPit*12;
			resetBoard();
			document.getElementById("settingsPit").textContent = "Pieces per Pit: 4"
			break;
		case "settingsPitButton3":
			piecesPerPit = 5;
			maxPieces = piecesPerPit*12;
			resetBoard();
			document.getElementById("settingsPit").textContent = "Pieces per Pit: 5"
			break;
		case "settingsPitButton4":
			piecesPerPit = 6;
			maxPieces = piecesPerPit*12;
			resetBoard();
			document.getElementById("settingsPit").textContent = "Pieces per Pit: 6"
			break;
		case "settingsPitButton5":
			piecesPerPit = 7;
			maxPieces = piecesPerPit*12;
			resetBoard();
			document.getElementById("settingsPit").textContent = "Pieces per Pit: 7"
			break;
		default:
			piecesPerPit = 4;
			maxPieces = piecesPerPit*12;
			resetBoard();
			document.getElementById("settingsPit").textContent = "Pieces per Pit: 4"
	}
}


// --- Logic for board and gameplay --- //

let boardState = [piecesPerPit,piecesPerPit,piecesPerPit,piecesPerPit,piecesPerPit,piecesPerPit,0,piecesPerPit,piecesPerPit,piecesPerPit,piecesPerPit,piecesPerPit,piecesPerPit,0];
let mirrorBoard = {0:12, 1:11, 2:10, 3:9, 4:8, 5:7, 6:13, 12:0, 11:1, 10:2, 9:3, 8:4, 7:5, 13:6}


const playerPits = document.querySelectorAll('[PlayerOnePit]');

playerPits.forEach(pit1 => { pit1.addEventListener('click', handleMoveClick) } );


// -> Player functions


// Move pieces for the given player

function playerMove(toMove, pieces, player, board, realMove){

	let myStorage = -999;
	let otherStorage = -999;
	if(player === "self"){ myStorage = 6; otherStorage = 13; }
	else if(player === "other"){ myStorage = 13; otherStorage = 6; }
	else{
		alert("Error: bad player identifier");
		window.location.reload(true);
	}

	// Stop player from selecting a square with no pieces
	if(pieces === "0"){ return "invalidMove"; }

	board[Number(toMove)] = 0;
	let i = 1; let curPit = Number(toMove);
	while(i<=pieces){
      	curPit = (Number(toMove) + i)%14
        if( curPit !== otherStorage){
			board[curPit] += 1;
		}
		else{ pieces++; }
		i++;
	}

	// Check if there's a capture
	let upperBound = (player === "self") ? 6 : 13;
	let lowerBound = (upperBound === 6) ? 0 : 7;
	if(lowerBound <= curPit && curPit < upperBound && board[curPit] === 1 && board[mirrorBoard[curPit]] !== 0){
		const toCapture = board[mirrorBoard[curPit]];
		board[mirrorBoard[curPit]] = 0;
		board[curPit] = 0;
		board[myStorage] += toCapture + 1;
	}

	// Check if game ends
	let endGameThisSide = true;
	let endGameOtherSide = true;

	for(let i = 1; i<=6; i++){
		if(board[myStorage - i] !== 0){ endGameThisSide = false; }
		if(board[otherStorage - i] !== 0){ endGameOtherSide = false; }
	}

	if( (endGameThisSide || endGameOtherSide ) && realMove){
		let addToThisStorage = 0;
		let addToOtherStorage = 0;
		for(let i = 1; i<=6; i++){
			let curThis = board[myStorage - i];
			let curOther = board[otherStorage - i];
			board[myStorage - i ] = 0;
			board[otherStorage - i ] = 0;
			addToThisStorage += curThis;
			addToOtherStorage += curOther;
		}
		board[myStorage] += addToThisStorage;
		board[otherStorage] += addToOtherStorage;
		if( (board[myStorage] > board[otherStorage] && player === "self") || (board[myStorage] < board[otherStorage] && player === "other")){
			document.getElementById("message").textContent = "You win!";
			if(user !== "" && session !== ""){ sendUpdatedScores(); }
			return "endGame";
		}
		else if( (board[myStorage] < board[otherStorage] && player === "self") || (board[myStorage] > board[otherStorage] && player === "other")){
			document.getElementById("message").textContent = "You lose";
			return "endGame";
		}
		else{ document.getElementById("message").textContent = "Draw!"; return "endGame"; }
	}


	// Check if the player should play again
	if((curPit === myStorage) && !realMove){ return "playAgain"; }
	if((curPit === myStorage) && realMove){
		if(player === "self"){document.getElementById("message").textContent = "Your can play again!";}
		return "playAgain";
	}
	return "passTurn";
}

function updateBoard(){
	for(let i = 0; i<14; i++){
		document.getElementById(i).textContent = boardState[i];
	}
}

function updateScore(){
	if(bestScore < boardState[6]){  document.getElementById("scoreBoard").textContent = "Best Score: " + boardState[6]; }
}

function updateRatio(){
	if(board[6] === parseInt(maxPieces/2)){ return; }
	totalGames += 1;
	if(boardState[6] > boardState[13]){ totalWins += 1;}
	document.getElementById("ratio").textContent = "Win ratio: " + parseInt( (totalWins/totalGames)*100 ) + "%";
}

function resetBoard(){
	initialState = [piecesPerPit,piecesPerPit,piecesPerPit,piecesPerPit,piecesPerPit,piecesPerPit,0,piecesPerPit,piecesPerPit,piecesPerPit,piecesPerPit,piecesPerPit,piecesPerPit,0];;
	for(let i = 0; i<14; i++){
		boardState[i] = initialState[i];
	}
	updateBoard();
}

function swapGameButtons(){
	document.getElementById("quitButton").style.display = "none";
	document.getElementById("gameGoBackButton").style.display = "flex";
}


// Eval function for AI minimax algorithm

function evalFunction(board){
	let playerScore = (board[0] + board[1] + board[2] + board[3] + board[4] + board[5])*0.5 + board[6]*3.5;
	let AIscore = (board[7] + board[8] + board[9] + board[10] + board[11] + board[12])*0.5 + board[13]*3.5;
	let retScore = AIscore - playerScore;
	for(let i = 0; i < 6; i++){
		let curPosition = (i+board[i]);
		if( curPosition < 6 && board[curPosition] === 0){ retScore += (board[mirrorBoard[curPosition]])*-1; }
	}
	for(let i = 7; i < 13; i++){
		let curPosition = (i+board[i]);
		if( 6 < curPosition && curPosition < 13 && board[curPosition] === 0){ retScore += (board[mirrorBoard[curPosition]]); }
	}
	return retScore;
}


// Minimax algorithm for AI move selection

function moveAIminimax(board, depth, alpha, beta, maximizingPlayer, playAgain){
	if(  depth === 0 || ( (board[6] + board[13]) === maxPieces ) || ( ((board[6] + board[13]) === maxPieces) && playAgain ) ){
		return [evalFunction(board), -999];
	}

	if(maximizingPlayer){
		let maxEval = -Infinity;
		let retMove = -999;
		for(let i = 7; i < 13; i++){
			let curBoard = [].concat(board);
			let curPieces = Number(document.getElementById(i).textContent);
			if(curPieces !== 0){
				let curMove = playerMove(i, curPieces, "other", curBoard, false);
				let eval;
				if(curMove === "playAgain"){
					eval = moveAIminimax(curBoard, depth-1, alpha, beta, true);
				}
				else{
					eval = moveAIminimax(curBoard, depth-1, alpha, beta, false);
				}
				if( eval[0] > maxEval ){ maxEval = eval[0]; retMove = i; }
				alpha = Math.max(alpha, eval[0]);
				if(beta <= alpha){ break; }
			}
		}
		return [maxEval, retMove];
	}

	else{
		let minEval = Infinity;
		let retMove = -999;
		for(let i = 0; i < 6; i++){
			let curBoard = [].concat(board);
			let curPieces = Number(document.getElementById(i).textContent);
			if(curPieces !== 0){
				let curMove = playerMove(i, curPieces, "self", curBoard, false);
				let eval;
				if(curMove === "playAgain"){
					eval = moveAIminimax(curBoard, depth-1, alpha, beta, false);
				}
				else{
					eval = moveAIminimax(curBoard, depth-1, alpha, beta, true);
				}
				if( eval[0] < minEval ){ minEval = eval[0]; retMove = i;}
				beta = Math.min(beta, eval[0]);
				if(beta <= alpha){ break; }
			}
		}
		return [minEval, retMove];
	}
}

// Handle opponents move
function opponentMove(){

	// Get move for opponent
	let move = -999;
	let curBoard = [].concat(boardState);
	let resultAI = moveAIminimax(curBoard, difficulty, -Infinity, Infinity, true, false);
	move = resultAI[1];


	let pieceCount = Number(document.getElementById(move).textContent);

	// Opponents play
	return playerMove(move, pieceCount, "other", boardState, true);

}



function handleMoveClick(e){

	if(ignoreClick){ return; }

	ignoreClick = true;

	const clickedPit = e.target.id;
	const pieces = document.getElementById(clickedPit).textContent;

	let moveResult = playerMove(clickedPit, pieces, "self", boardState, true);

	if(moveResult === "invalidMove"){
		ignoreClick = false;
		return;
	}
	else if(moveResult === "endGame"){
		updateBoard();
		updateScore();
		updateRatio();
		swapGameButtons();
		return;
	}
	else if(moveResult === "playAgain"){
		updateBoard();
		ignoreClick = false;
		return;
	}
	updateBoard();


	// Opponents Move
	document.getElementById("message").textContent = "Waiting for opponent...";
	t1 = setTimeout(function(){
		document.getElementById("message").textContent = "Your turn to play!";
		let otherMove = opponentMove();
		if(otherMove === "endGame"){ updateBoard(); updateScore(); updateRatio(); swapGameButtons(); return; }
		if(otherMove === "passTurn"){ updateBoard(); ignoreClick = false; return; }
		if(otherMove === "playAgain"){
			updateBoard();
			document.getElementById("message").textContent = "Opponent can play again!";
			t2 = setTimeout(function(){
				while(otherMove === "playAgain"){
					otherMove = opponentMove();
					if(otherMove === "endGame"){ updateBoard(); updateScore(); updateRatio(); swapGameButtons(); return; }
					updateBoard();
				}
				ignoreClick = false;
				document.getElementById("message").textContent = "Your turn to play!";
			},2000);
		}
	},2000);
}


// --- Quit Button and Back to Main Menu Buttons --- //

const quitButton = document.getElementById("quitButton");
quitButton.addEventListener('click', quitGame );

function quitGame(){
	clearTimeout(t1);
	clearTimeout(t2);
	ignoreClick = true;
	resetBoard();
	document.getElementById("message").textContent = "You lose";
	document.getElementById("quitButton").style.display = "none";
	document.getElementById("gameGoBackButton").style.display = "flex";
}

const gameGoBackButton = document.getElementById("gameGoBackButton");
gameGoBackButton.addEventListener('click', goBackButton);

function goBackButton(e){
	resetBoard();
	document.getElementById("message").textContent = "Your turn to play!";
	document.getElementById("gameGoBackButton").style.display = "none";
	document.getElementById("quitButton").style.display = "flex";
	document.getElementById("mainMenuAuth").style.display = "flex";
	ignoreClick = false;
}

