declare global {
    interface Window {
        resetTimer?: () => void;
    }
}

export class GameBrain {
    #board: (string | undefined)[][] = [[], [], [], [], []];
    gridStartX: number = 1;
    gridStartY: number = 1;

    isMovingGrid: boolean = false;
    onGridMove: (() => void) | null = null;
    moveGridButton: HTMLButtonElement | null = null;

    isMovingPiece: boolean = false;
    onPieceMove: (() => void) | null = null;
    movePieceButton: HTMLButtonElement | null = null;
    selectedPiece: { x: number; y: number } | null = null;

    currentPlayer: "X" | "O" = "X";

    playerXPieces: number = 5;
    playerOPieces: number = 5;

    onMove: (() => void) | null = null;

    getCurrentPlayerPieces(): number {
        return this.currentPlayer === "X" ? this.playerXPieces : this.playerOPieces;
    }

    makeAMove(x: number, y: number): void {
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

    canMoveGrid(x: number, y: number, ai: boolean = false): boolean {
        if (!this.isMoveAdjacent(x, y)) {
            if (!ai) {
                alert("You can only move the grid to an adjacent cell.");
            }
            return false;
        }
        if (this.isSamePosition(x, y)) {
            if (!ai) {
                alert("You cannot move the grid to the same cell.");
            }
            return false;
        }
        if (this.isOutOfBounds(x, y)) {
            if (!ai) {
                alert("You cannot move the grid out of bounds.");
            }
            return false;
        }
        return true;
    }

    isMoveAdjacent(x: number, y: number): boolean {
        return Math.abs(x - this.gridStartX) <= 1 && Math.abs(y - this.gridStartY) <= 1;
    }

    isSamePosition(x: number, y: number): boolean {
        return x === this.gridStartX && y === this.gridStartY;
    }

    isOutOfBounds(x: number, y: number): boolean {
        return x < 0 || y < 0 || x > 2 || y > 2;
    }

    moveGrid(x: number, y: number): void {
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

    isInGrid(x: number, y: number): boolean {
        return x >= this.gridStartX && x < this.gridStartX + 3 && y >= this.gridStartY && y < this.gridStartY + 3;
    }

    movePiece(fromX: number, fromY: number, toX: number, toY: number): void {
        if (
            this.#board[fromX][fromY] &&
            !this.#board[toX][toY] &&
            this.isInGrid(toX, toY) &&
            this.isInGrid(fromX, fromY)
        ) {
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

    cellUpdateFn(x: number, y: number, e: Event): void {
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
        (e.target as HTMLElement).innerHTML = this.board[x][y] || "&nbsp;";
    }

    checkRows(piece: string, condition: number = 3): boolean {
        for (let y = this.gridStartY; y < this.gridStartY + 3; y++) {
            let count = 0;
            for (let x = this.gridStartX; x < this.gridStartX + 3; x++) {
                count = this.#board[x][y] === piece ? count + 1 : 0;
                if (count >= condition) {
                    return true;
                }
            }
        }
        return false;
    }

    checkColumns(piece: string, condition: number = 3): boolean {
        for (let x = this.gridStartX; x < this.gridStartX + 3; x++) {
            let count = 0;
            for ( let y = this.gridStartY; y < this.gridStartY + 3; y++) {
                count = this.#board[x][y] === piece ? count + 1 : 0;
                if (count >= condition) {
                    return true;
                }
            }
        }
        return false;
    }

    checkDiagonals(piece: string, condition: number = 3): boolean {
        for (let y = this.gridStartY; y < this.gridStartY + 3; y++) {
            for (let x = this.gridStartX; x < this.gridStartX + 3; x++) {
                if (
                    this.checkDiagonalFrom(x, y, 1, 1, piece, condition) ||
                    this.checkDiagonalFrom(x, y, 1, -1, piece, condition)
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    checkDiagonalFrom(
        startX: number,
        startY: number,
        dx: number,
        dy: number,
        piece: string,
        condition: number
    ): boolean {
        let count = 0;
        let x = startX;
        let y = startY;

        while (this.isInGrid(x, y)) {
            count = this.#board[x][y] === piece ? count + 1 : 0;
            if (count >= condition) {
                return true;
            }
            x += dx;
            y += dy;
        }

        return false;
    }

    checkWin(piece: string): boolean {
        return this.checkRows(piece) || this.checkColumns(piece) || this.checkDiagonals(piece);
    }

    checkForGameEnd(): boolean {
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

    makeAiMove(): void {
        let validMoves: { x: number; y: number }[] = [];

        for (let x = this.gridStartX; x < this.gridStartX + 3; x++) {
            for (let y = this.gridStartY; y < this.gridStartY + 3; y++) {
                if (this.#board[x][y] === undefined) {
                    validMoves.push({ x, y });
                }
            }
        }
        if (this.getCurrentPlayerPieces() > 0 && validMoves.length > 0) {
            for (let move of validMoves) {
                this.#board[move.x][move.y] = this.currentPlayer === "X" ? "O" : "X";
                if (this.checkWin(this.currentPlayer === "X" ? "O" : "X")) {
                    this.#board[move.x][move.y] = undefined;
                    this.makeAMove(move.x, move.y);
                    return;
                }
                this.#board[move.x][move.y] = undefined;
            }

            for (let move of validMoves) {
                this.#board[move.x][move.y] = this.currentPlayer;
                if (this.checkWin(this.currentPlayer)) {
                    this.#board[move.x][move.y] = undefined;
                    this.makeAMove(move.x, move.y);
                    return;
                }
                this.#board[move.x][move.y] = undefined;
            }

            if (validMoves.length > 0) {
                let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                this.makeAMove(randomMove.x, randomMove.y);
            }
        } else {
            let randomNumber = Math.floor(Math.random() * 2);
            if (randomNumber === 0 && validMoves.length > 0) {
                let playerPieces: { x: number; y: number }[] = [];

                for (let x = this.gridStartX; x < this.gridStartX + 3; x++) {
                    for (let y = this.gridStartY; y < this.gridStartY + 3; y++) {
                        if (this.#board[x][y] === this.currentPlayer) {
                            playerPieces.push({ x, y });
                        }
                    }
                }

                let emptyCells: { x: number; y: number }[] = [];

                for (let x = this.gridStartX; x < this.gridStartX + 3; x++) {
                    for (let y = this.gridStartY; y < this.gridStartY + 3; y++) {
                        if (this.#board[x][y] === undefined) {
                            emptyCells.push({ x, y });
                        }
                    }
                }

                if (playerPieces.length > 0 && emptyCells.length > 0) {
                    let randomPiece = playerPieces[Math.floor(Math.random() * playerPieces.length)];
                    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                    this.movePiece(randomPiece.x, randomPiece.y, randomCell.x, randomCell.y);
                }
            } else {
                let potentialGridMoves: { x: number; y: number }[] = [
                    { x: this.gridStartX - 1, y: this.gridStartY },
                    { x: this.gridStartX + 1, y: this.gridStartY },
                    { x: this.gridStartX, y: this.gridStartY - 1 },
                    { x: this.gridStartX, y: this.gridStartY + 1 },
                    { x: this.gridStartX - 1, y: this.gridStartY - 1 },
                    { x: this.gridStartX - 1, y: this.gridStartY + 1 },
                    { x: this.gridStartX + 1, y: this.gridStartY - 1 },
                    { x: this.gridStartX + 1, y: this.gridStartY + 1 }
                ];

                let validGridMoves: { x: number; y: number }[] = [];

                for (let move of potentialGridMoves) {
                    if (this.canMoveGrid(move.x, move.y, true)) {
                        validGridMoves.push(move);
                    }
                }

                if (validGridMoves.length > 0) {
                    let randomMove = validGridMoves[Math.floor(Math.random() * validGridMoves.length)];
                    this.moveGrid(randomMove.x, randomMove.y);
                }
            }
        }
    }

    resetGame(): void {
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

        if (typeof window !== "undefined" && window.resetTimer) {
            window.resetTimer();
        }
    }

    get board(): (string | undefined)[][] {
        return this.#board;
    }
}