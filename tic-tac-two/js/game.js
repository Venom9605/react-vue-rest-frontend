export class GameBrain{
    #board = [[], [], [], [], []];
    gridStartX = 1;
    gridStartY = 1;

    isMovingGrid = false;
    onGridMove = null;
    moveGridButton = null;

    isMovingPiece = false;
    onPieceMove = null;
    movePieceButton = null;
    selectedPiece = null;

    currentPlayer = "X";

    playerXPieces = 5;
    playerOPieces = 5;

    onMove = null;

    getCurrentPlayerPieces() {
        return this.currentPlayer === "X" ? this.playerXPieces : this.playerOPieces;
    }

    makeAMove(x, y) {
        if (this.getCurrentPlayerPieces() <= 0) {
            alert("You have no more pieces left to place.");
            return;
        }

        if (this.#board[x][y] === undefined) {
            this.#board[x][y] = this.currentPlayer;
            if (this.currentPlayer === "X") {
                this.playerXPieces--;
            } else {
                this.playerOPieces--;
            }

            setTimeout(() => {
                if (this.checkForGameEnd()) {
                    return;
                }
                this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
                if (this.onMove) {
                    this.onMove();
                }
            }, 1);
        } else {
            alert("This cell already has a piece in it.");
        }
    }

    canMoveGrid(x, y) {
        if (!this.isMoveAdjacent(x, y)) {
            alert("You can only move the grid to an adjacent cell.");
            return false;
        }
        if (this.isSamePosition(x, y)) {
            alert("You cannot move the grid to the same cell.");
            return false;
        }
        if (this.isOutOfBounds(x, y)) {
            alert("You cannot move the grid out of bounds.");
            return false;
        }
        return true;
    }

    isMoveAdjacent(x, y) {
        return Math.abs(x - this.gridStartX) <= 1 && Math.abs(y - this.gridStartY) <= 1;
    }

    isSamePosition(x, y) {
        return x === this.gridStartX && y === this.gridStartY;
    }

    isOutOfBounds(x, y) {
        return x > 2 || y > 2;
    }

    moveGrid(x, y) {
        if (!this.canMoveGrid(x, y)) {
            return;
        }

        this.gridStartX = x;
        this.gridStartY = y;
        this.isMovingGrid = false;

        if (this.moveGridButton) {
            this.moveGridButton.innerText = "Move Grid";
        }
        if (this.onGridMove) {
            this.onGridMove();
        }
        setTimeout(() => {
            if (this.checkForGameEnd()) {
                return;
            }
            this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
            if (this.onMove) {
                this.onMove();
            }
        }, 1);
    }

    isInGrid(x, y) {
        if (x >= this.gridStartX && x < this.gridStartX + 3) {
            if (y >= this.gridStartY && y < this.gridStartY + 3) {
                return true;
            }
        }
        return false;
    }

    movePiece(fromX, fromY, toX, toY) {
        if (this.#board[fromX][fromY] && !this.#board[toX][toY] && this.isInGrid(toX, toY) && this.isInGrid(fromX, fromY)) {
            this.#board[toX][toY] = this.#board[fromX][fromY];
            this.#board[fromX][fromY] = undefined;
            this.isMovingPiece = false;
            this.selectedPiece = null;
            if (this.movePieceButton) {
                this.movePieceButton.innerText = "Move Piece";
            }
            if (this.onPieceMove) {
                this.onPieceMove();
            }
            setTimeout(() => {
                if (this.checkForGameEnd()) {
                    return;
                }
                this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
                if (this.onMove) {
                    this.onMove();
                }
            }, 1);
        } else {
            alert("Can't move here!");
        }
    }

    cellUpdateFn(x, y, e) {

        if (this.isMovingGrid) {
            this.moveGrid(x, y);
            return;
        }

        if (this.isMovingPiece) {
            if (this.selectedPiece) {
                this.movePiece(this.selectedPiece.x, this.selectedPiece.y, x, y);
            } else if (this.#board[x][y] === this.currentPlayer) {
                this.selectedPiece = { x, y };
            } else {
                alert("You can only move your own pieces.");
            }
            return;
        }

        if (!this.isInGrid(x, y)) {
            alert("You can only place pieces in the grid.");
            return;
        }
        this.makeAMove(x, y);
        e.target.innerHTML = this.board[x][y] || "&nbsp;";
    }

    checkRows(piece) {
        for (let y = this.gridStartY; y < this.gridStartY + 3; y++) {
            let count = 0;
            for (let x = this.gridStartX; x < this.gridStartX + 3; x++) {
                count = this.#board[x][y] === piece ? count + 1 : 0;
                if (count >= 3) {
                    return true;
                }
            }
        }
        return false;
    }

    checkColumns(piece) {
        for (let x = this.gridStartX; x < this.gridStartX + 3; x++) {
            let count = 0;
            for (let y = this.gridStartY; y < this.gridStartY + 3; y++) {
                count = this.#board[x][y] === piece ? count + 1 : 0;
                if (count >= 3) {
                    return true;
                }
            }
        }
        return false;
    }

    checkDiagonals(piece) {
        for (let y = this.gridStartY; y < this.gridStartY + 3; y++) {
            for (let x = this.gridStartX; x < this.gridStartX + 3; x++) {
                if (this.checkDiagonalFrom(x, y, 1, 1, piece) || 
                    this.checkDiagonalFrom(x, y, 1, -1, piece)) {
                    return true;
                }
            }
        }
        return false;    
    }

    checkDiagonalFrom(startX, startY, dx, dy, piece) {
        let count = 0;
        let x = startX;
        let y = startY;

        while (this.isInGrid(x, y)) {
            count = this.#board[x][y] === piece ? count + 1 : 0;
            if (count >= 3) {
                return true;
            }
            x += dx;
            y += dy;
        }

        return false;
    }

    checkWin(piece) {
        return this.checkRows(piece) || this.checkColumns(piece) || this.checkDiagonals(piece);
    }

    checkForGameEnd() {
        let xWins = this.checkWin("X");
        let oWins = this.checkWin("O");

        if (xWins && oWins) {
            alert("It's a tie!");
            this.resetGame();
            return true;
        } else if (xWins) {
            alert("X wins!");
            this.resetGame();
            return true;
        } else if (oWins) {
            alert("O wins!");
            this.resetGame();
            return true;
        }
        return false;

    }

    resetGame() {
        this.#board = [[], [], [], [], []];
        this.gridStartX = 1;
        this.gridStartY = 1;
        this.isMovingGrid = false;
        this.isMovingPiece = false;
        this.selectedPiece = null;
        this.currentPlayer = "X";
        this.playerXPieces = 5;
        this.playerOPieces = 5;
        if (this.onMove) {
            this.onMove();
        }
        if (this.onGridMove) {
            this.onGridMove();
        }
        if (this.onPieceMove) {
            this.onPieceMove();
        }
    }

    get board() {
        return this.#board;
    }

}