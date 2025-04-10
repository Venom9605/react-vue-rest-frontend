import { reactive } from 'vue'
import { defineStore } from 'pinia'
import TicTacTwoBrain from '@/bll/gameBrain'
import { computed } from 'vue'

export const useGameStateStore = defineStore('gameState', () => {
    const game = reactive(new TicTacTwoBrain())

    const board = computed(() => game.board);
    const currentPlayer = computed(() => game.currentPlayer);
    const playerXPieces = computed(() => game.playerXPieces);
    const playerOPieces = computed(() => game.playerOPieces);
    const gridStartX = computed(() => game.gridStartX);
    const gridStartY = computed(() => game.gridStartY);
    const message = computed(() => game.message);
    const isMovingGrid = computed(() => game.isMovingGrid);
    const isMovingPiece = computed(() => game.isMovingPiece);
    const selectedPiece = computed(() => game.selectedPiece);
    const gameOver = computed(() => game.gameOver);
    const playerVsAi = computed(() => game.playerVsAi);
    const aiVsAi = computed(() => game.aiVsAi);
    const waitingForAi = computed(() => game.waitingForAi);
  
    return {
      board,
      currentPlayer,
      playerXPieces,
      playerOPieces,
      gridStartX,
      gridStartY,
      message,
      isMovingGrid,
      isMovingPiece,
      selectedPiece,
      gameOver,
      playerVsAi,
      aiVsAi,
      waitingForAi,

      makeMove: game.makeMove.bind(game),
      checkWin: game.checkWin.bind(game),
      checkForGameEnd: game.checkForGameEnd.bind(game),
      checkRows: game.checkRows.bind(game),
      checkColumns: game.checkColumns.bind(game),
      checkDiagonals: game.checkDiagonals.bind(game),
      checkDiagonalFrom: game.checkDiagonalFrom.bind(game),
      currentPlayerHasPieces: game.currentPlayerHasPieces.bind(game),
      getCurrentPlayerPieces: game.getCurrentPlayerPieces.bind(game),
      placePiece: game.placePiece.bind(game),
      moveGrid: game.moveGrid.bind(game),
      selectPiece: game.selectPiece.bind(game),
      movePiece: game.movePiece.bind(game),
      isInGrid: game.isInGrid.bind(game),
      switchMoveGridMode: game.switchMoveGridMode.bind(game),
      switchMovePieceMode: game.switchMovePieceMode.bind(game),
      canMoveGrid: game.canMoveGrid.bind(game),
      isMoveAdjacent: game.isMoveAdjacent.bind(game),
      isSamePosition: game.isSamePosition.bind(game),
      isOutOfBounds: game.isOutOfBounds.bind(game),
      makeAiMove: game.makeAiMove.bind(game),
      toggleAiOpponent: game.toggleAiOpponent.bind(game),
      toggleAiVsAi: game.toggleAiVsAi.bind(game),
      startAiVsAiLoop: game.startAiVsAiLoop.bind(game),
      initializeBoard: game.initializeBoard.bind(game),
  };
  })