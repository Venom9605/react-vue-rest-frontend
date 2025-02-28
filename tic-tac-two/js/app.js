import * as UI from "./ui.js";
import { GameBrain } from "./game.js";



// FIX: not using hard refresh breaks the game?? maybe

let h1 = document.createElement("h1");
h1.innerHTML = "Tic Tac Two";
document.body.appendChild(h1);

let game = new GameBrain();

let h2 = document.createElement("h2");
h2.innerHTML = `Current Player: ${game.currentPlayer} | Pieces left: ${getPiecesInfo()}`;
document.body.appendChild(h2);

function getPiecesInfo() {
    return game.currentPlayer === "X" ? game.playerXPieces : game.playerOPieces;
}

function renderBoard() {
    let existingBoard = document.querySelector('.board');
    if (existingBoard) {
        existingBoard.remove();
    }

    let board = UI.getInitialBoard(game.board, game.cellUpdateFn.bind(game), game.isInGrid.bind(game));
    document.body.appendChild(board);
}

function updateCurrentPlayer() {
    h2.innerHTML = `Current Player: ${game.currentPlayer} | Pieces left: ${getPiecesInfo()}`;
}

renderBoard()

let moveGridButton = document.createElement("button");
moveGridButton.id = "move-grid-button";
moveGridButton.innerText = "Move Grid";
document.body.appendChild(moveGridButton);

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
document.body.appendChild(movePieceButton);

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
document.body.appendChild(resetButton);

resetButton.addEventListener("click", () => {
    game.resetGame();
});