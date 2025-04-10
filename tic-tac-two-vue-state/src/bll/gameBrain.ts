export default class TicTacTwoBrain {
    board: (string[])[] = [];

    currentPlayer: string = 'X';
    playerXPieces: number = 5;
    playerOPieces: number = 5;

    gridStartX: number = 1;
    gridStartY: number = 1;

    message: string = '';

    isMovingGrid: boolean = false;
    isMovingPiece: boolean = false;

    selectedPiece: { x: number; y: number } | null = null;

    gameOver: boolean = false;

    playerVsAi: boolean = false;
    aiVsAi: boolean = false;
    waitingForAi: boolean = false;

    constructor() {
        this.initializeBoard();
    }

    makeMove(row: number, col: number) {
        if (this.gameOver) {
            return;
        }

        if (this.waitingForAi) {
            this.message = 'Please wait for the AI to make its move!';
            return;
        }


        if (this.isMovingGrid) {

            if (!this.moveGrid(row, col)) {
                this.message = 'Cannot move grid there!';
                return;
            }
        } else if (this.isMovingPiece) {

            if (this.selectedPiece === null) {
                if (!this.selectPiece(row, col)) {
                    this.message = 'You can only select your own piece!';
                    return;
                }

                console.log('Selected piece:', this.selectedPiece);
                this.message = "Piece selected. Click on the target cell to move it.";
                return;

            } else if (this.selectedPiece) {
                if (!this.movePiece(this.selectedPiece.x, this.selectedPiece.y, row, col)) {
                    this.message = 'Invalid move!';
                    return;
                }
            }
        } else {
            if (!this.currentPlayerHasPieces()) {
                this.message = 'You have no pieces left!';
                return;
            }

            if (!this.placePiece(row, col)) {
                
                this.message = 'Invalid move!';
                return;
            }
        }

        if (this.checkForGameEnd()) {
            this.gameOver = true;
            return;
        }

        this.message = 'Move made successfully!';

        if (this.playerVsAi && this.currentPlayer === 'O') {
            this.waitingForAi = true;

            setTimeout(() => {
                console.log('AI is making a move...');
                this.makeAiMove();
                this.waitingForAi = false;

                if (this.checkForGameEnd()) {
                    this.gameOver = true;
                    return;
                }
            }, 1000);
        }
    }

    checkWin(piece: string): boolean {
        return this.checkRows(piece) || this.checkColumns(piece) || this.checkDiagonals(piece);
    }

    checkForGameEnd(): boolean {
        let xWins = this.checkWin("X");
        let oWins = this.checkWin("O");

        if (xWins && oWins) {
            this.message = "It's a tie!";
            return true;
        } else if (xWins) {
            this.message = "X wins!";
            return true;
        } else if (oWins) {
            this.message = "O wins!";
            return true;
        }
        return false;
    }

    checkRows(piece: string, condition: number = 3): boolean {
        for (let y = this.gridStartY; y < this.gridStartY + 3; y++) {
            let count = 0;
            for (let x = this.gridStartX; x < this.gridStartX + 3; x++) {
                count = this.board[x][y] === piece ? count + 1 : 0;
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
                count = this.board[x][y] === piece ? count + 1 : 0;
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
            count = this.board[x][y] === piece ? count + 1 : 0;
            if (count >= condition) {
                return true;
            }
            x += dx;
            y += dy;
        }

        return false;
    }

    currentPlayerHasPieces(): boolean {
        if (this.getCurrentPlayerPieces() <= 0) {
            return false;
        }
        return true;
    }

    getCurrentPlayerPieces(): number {
        return this.currentPlayer === 'X' ? this.playerXPieces : this.playerOPieces;
    }

    placePiece(row: number, col: number): boolean {
        if (!this.currentPlayerHasPieces()){
            return false;
        }

        if (this.isInGrid(row, col) && this.board[row][col] === '') {

            this.board[row][col] = this.currentPlayer;
            this.currentPlayer === 'X' ? this.playerXPieces-- : this.playerOPieces--;

            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

            return true;
        }
        return false;
    }

    moveGrid(row: number, col: number): boolean {
        if (this.getCurrentPlayerPieces() > 3) {
            return false;
        }

        if (this.isMovingGrid && this.canMoveGrid(row, col)) {
            this.gridStartX = row;
            this.gridStartY = col;

            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.isMovingGrid = false;

            return true
        }
        return false;
    }

    selectPiece(row: number, col: number): boolean {
        if (this.isMovingPiece && this.board[row][col] === this.currentPlayer) {
            this.selectedPiece = { x: row, y: col };
            return true;
        } else {
            this.selectedPiece = null;
            return false;
        }
    }

    movePiece(rowFrom: number, colFrom: number, rowTo: number, colTo: number): boolean {
        if (this.getCurrentPlayerPieces() > 3) {
            return false;
        }
        if (this.isMovingPiece && this.board[rowTo][colTo] === '' && this.isInGrid(rowTo, colTo)) {
            this.board[rowTo][colTo] = this.currentPlayer;
            this.board[rowFrom][colFrom] = '';

            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.selectedPiece = null;
            this.isMovingPiece = false;

            return true;
        }

        return false;

    }


    isInGrid(x: number, y: number): boolean {
        return x >= this.gridStartX && x < this.gridStartX + 3 && y >= this.gridStartY && y < this.gridStartY + 3;
    }

    switchMoveGridMode() {
        if (this.gameOver) {
            return;
        }

        if (this.getCurrentPlayerPieces() > 3) {
            this.message = 'You must place at least 2 pieces before moving the grid!';
            return;
        }

        this.isMovingGrid = !this.isMovingGrid;

        if (this.isMovingGrid) {
            this.message = "Click a cell to move the top left corner of the grid.";
        } else {
            this.message = "";
        }

        this.isMovingPiece = false;
    }

    switchMovePieceMode() {
        if (this.gameOver) {
            return;
        }

        if (this.getCurrentPlayerPieces() > 3) {
            this.message = 'You must place at least 2 pieces before moving a piece!';
            return;
        }

        this.isMovingPiece= !this.isMovingPiece;

        if (this.isMovingPiece) {
            this.message = "Select a piece to move.";
        } else {
            this.message = "";
        }

        this.isMovingGrid = false;
    }

    canMoveGrid(x: number, y: number): boolean {
        if (!this.isMoveAdjacent(x, y)) {
            return false;
        }
        if (this.isSamePosition(x, y)) {
            return false;
        }
        if (this.isOutOfBounds(x, y)) {
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

    makeAiMove(): void {
        let validMoves: { x: number; y: number }[] = [];

        for (let x = this.gridStartX; x < this.gridStartX + 3; x++) {
            for (let y = this.gridStartY; y < this.gridStartY + 3; y++) {
                if (this.board[x][y] === '') {
                    validMoves.push({ x, y });
                }
            }
        }
        if (this.currentPlayerHasPieces() && validMoves.length > 0) {
            for (let move of validMoves) {
                this.board[move.x][move.y] = this.currentPlayer === "X" ? "O" : "X";
                if (this.checkWin(this.currentPlayer === "X" ? "O" : "X")) {
                    this.board[move.x][move.y] = '';
                    this.placePiece(move.x, move.y);
                    return;
                }
                this.board[move.x][move.y] = '';
            }

            for (let move of validMoves) {
                this.board[move.x][move.y] = this.currentPlayer;
                if (this.checkWin(this.currentPlayer)) {
                    this.board[move.x][move.y] = '';
                    this.placePiece(move.x, move.y);
                    return;
                }
                this.board[move.x][move.y] = '';
            }

            if (validMoves.length > 0) {
                let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                this.placePiece(randomMove.x, randomMove.y);
            }
        } else {
            let randomNumber = Math.floor(Math.random() * 2);
            if (randomNumber === 0 && validMoves.length > 0) {
                let playerPieces: { x: number; y: number }[] = [];

                for (let x = this.gridStartX; x < this.gridStartX + 3; x++) {
                    for (let y = this.gridStartY; y < this.gridStartY + 3; y++) {
                        if (this.board[x][y] === this.currentPlayer) {
                            playerPieces.push({ x, y });
                        }
                    }
                }

                let emptyCells: { x: number; y: number }[] = [];

                for (let x = this.gridStartX; x < this.gridStartX + 3; x++) {
                    for (let y = this.gridStartY; y < this.gridStartY + 3; y++) {
                        if (this.board[x][y] === '') {
                            emptyCells.push({ x, y });
                        }
                    }
                }

                if (playerPieces.length > 0 && emptyCells.length > 0) {
                    let randomPiece = playerPieces[Math.floor(Math.random() * playerPieces.length)];
                    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                    this.isMovingPiece = true;
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
                    if (this.canMoveGrid(move.x, move.y)) {
                        validGridMoves.push(move);
                    }
                }

                if (validGridMoves.length > 0) {
                    let randomMove = validGridMoves[Math.floor(Math.random() * validGridMoves.length)];
                    this.isMovingGrid = true;
                    this.moveGrid(randomMove.x, randomMove.y);
                }
            }
        }
    }

    toggleAiOpponent() {
        this.playerVsAi = !this.playerVsAi;
        this.aiVsAi = false;
        if (this.playerVsAi) {
            this.message = 'AI opponent enabled!';
        } else {
            this.message = 'AI opponent disabled!';
        }
    }
    
    toggleAiVsAi() {
        this.aiVsAi = !this.aiVsAi;
        this.playerVsAi = false;
        
        if (this.aiVsAi) {
            this.message = 'AI vs AI mode enabled!';
            this.startAiVsAiLoop();
        } else {
            this.message = 'AI vs AI mode disabled!';
        }
    }

    startAiVsAiLoop() {
        if (!this.aiVsAi || this.gameOver) {
            this.waitingForAi = false;
            return;
        }
        
        this.waitingForAi = true;

        setTimeout(() => {
            this.makeAiMove();
    
            if (this.checkForGameEnd()) {
                this.gameOver = true;
                return;
            }
    
            this.startAiVsAiLoop();
        }, 1000);
    }

    initializeBoard() {
        this.board = Array.from({ length: 5 }, () => Array(5).fill(''));
        this.currentPlayer = 'X';
        this.playerXPieces = 5;
        this.playerOPieces = 5;

        this.gridStartX = 1;
        this.gridStartY = 1;
    
        this.message = 'Game initialized!';
    
        this.isMovingGrid = false;
        this.isMovingPiece = false;

        this.gameOver = false;
        this.selectedPiece = null;
    }
}

