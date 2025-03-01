import * as UI from "./ui.js";
import { GameBrain } from "./game.js";

let container = document.createElement("div");
container.classList.add("game-container");
document.body.appendChild(container);

let h1 = document.createElement("h1");
h1.innerHTML = "Tic Tac Two";
container.appendChild(h1);

let game = new GameBrain();

let h2 = document.createElement("h2");
h2.innerHTML = `Current Player: ${game.currentPlayer} | Pieces left: ${getPiecesInfo()}`;
container.appendChild(h2);

let timerElement = document.createElement("h2");
timerElement.id = "timer";
container.appendChild(timerElement);

let timeRemaining = 5 * 60; // 5 minutes in seconds
let timerInterval;

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timerInterval = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! It's a tie. Resetting game.");
            game.resetGame();
            return;
        }
        timeRemaining--;
        updateTimer();
    }, 1000);
}

function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timeRemaining = 5 * 60;
    updateTimer();
    startTimer();
}

function updateTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.innerHTML = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function getPiecesInfo() {
    return game.currentPlayer === "X" ? game.playerXPieces : game.playerOPieces;
}

function renderBoard() {
    let existingBoard = document.querySelector('.board');
    if (!existingBoard) {
        console.error("Board container missing!");
        return;
    }

    existingBoard.innerHTML = "";

    let newBoard = UI.getInitialBoard(game.board, game.cellUpdateFn.bind(game), game.isInGrid.bind(game));
    
    if (!newBoard || newBoard.children.length === 0) {
        console.error("ERROR: Board did not generate correctly!");
        return;
    }

    existingBoard.replaceWith(newBoard);
    boardContainer.appendChild(newBoard);
    console.log("Board rendered with", newBoard.children.length, "rows."); // Debugging
}

function updateCurrentPlayer() {
    h2.innerHTML = `Current Player: ${game.currentPlayer} | Pieces left: ${getPiecesInfo()}`;
}

let boardContainer = document.createElement("div");
boardContainer.classList.add("board-container");
container.appendChild(boardContainer);

let emptyBoard = document.createElement("div");
emptyBoard.classList.add("board");
boardContainer.appendChild(emptyBoard);

renderBoard();

let buttonContainer = document.createElement("div");
buttonContainer.classList.add("button-container");
container.appendChild(buttonContainer);

let moveGridButton = document.createElement("button");
moveGridButton.id = "move-grid-button";
moveGridButton.innerText = "Move Grid";
buttonContainer.appendChild(moveGridButton);

game.moveGridButton = moveGridButton;

moveGridButton.addEventListener("click", () => {
    if (game.playerXPieces > 3 || game.playerOPieces > 3) {
        alert("Each player needs to place at least two pieces before moving the grid.");
        return;
    }
    game.isMovingGrid = !game.isMovingGrid;
    moveGridButton.innerText = game.isMovingGrid ? "Stop Moving Grid" : "Move Grid";
});

game.onGridMove = () => {
    renderBoard();
    updateCurrentPlayer();
};


let movePieceButton = document.createElement("button");
movePieceButton.id = "move-piece-button";
movePieceButton.innerText = "Move Piece";
buttonContainer.appendChild(movePieceButton);

game.movePieceButton = movePieceButton;

movePieceButton.addEventListener("click", () => {
    if (game.playerXPieces > 3 || game.playerOPieces > 3) {
        alert("Each player needs to place at least two pieces before moving a piece.");
        return;
    }
    game.isMovingPiece = !game.isMovingPiece;
    movePieceButton.innerText = game.isMovingPiece ? "Stop Moving Piece" : "Move Piece";
});

game.onPieceMove = () => {
    renderBoard();
    updateCurrentPlayer();
};

game.onMove = updateCurrentPlayer;

let resetButton = document.createElement("button");
resetButton.id = "reset-button";
resetButton.innerText = "Reset";
buttonContainer.appendChild(resetButton);

resetButton.addEventListener("click", () => {
    game.resetGame();
    timeRemaining = 5 * 60; // Reset timer to 5 minutes
    startTimer();
});

let aiMoveButton = document.createElement("button");
aiMoveButton.id = "ai-move-button";
aiMoveButton.innerText = "Make AI Move";
buttonContainer.appendChild(aiMoveButton);

aiMoveButton.addEventListener("click", () => {
    game.makeAiMove();
    renderBoard();
    updateCurrentPlayer();
});

startTimer();
updateTimer();

window.resetTimer = resetTimer;


