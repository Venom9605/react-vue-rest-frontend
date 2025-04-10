<script setup lang="ts">
import { useGameStateStore } from '@/stores/gameState';
import ToggleAiOpponentButton from './ToggleAiOpponentButton.vue';
import ToggleAiVsAiButton from './ToggleAiVsAiButton.vue';
import ResetButton from './ResetButton.vue';
import MoveGridButton from './MoveGridButton.vue';
import MovePieceButton from './MovePieceButton.vue';

const gameState = useGameStateStore();

</script>


<template>
    <div class="game-container">
      <div class="left-sidebar">
        <div class="game-info">
          <h1>Tic Tac Two</h1>
          <h2>Player: {{ gameState.currentPlayer }}</h2>
          <h2>Pieces left: {{ gameState.getCurrentPlayerPieces() }}</h2>
          <h3>{{ gameState.message }}</h3>
        </div>
  
        <div class="buttons">
          <ToggleAiOpponentButton class="checkbox" />
          <ToggleAiVsAiButton class="checkbox" />

          <ResetButton />
          <MoveGridButton />
          <MovePieceButton />
        </div>
      </div>
  
      <div class="board-wrapper">
        <table class="game-board">
          <tr v-for="(row, indexRow) in gameState.board" :key="indexRow">
            <td
              v-for="(cell, indexCol) in row"
              :key="indexCol"
              @click="$emit('cellClick', indexRow, indexCol)"
              :class="['cell', { 'in-grid': gameState.isInGrid(indexRow, indexCol) }]"
            >
              {{ cell }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </template>



<style scoped>

.game-container {
  display: flex;
  height: calc(100vh - 120px);
  align-items: center;
  padding: 20px;
}

.left-sidebar {
    display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 250px;
  margin-right: 60px;
}

.board-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.game-board {
  border-collapse: collapse;
  table-layout: fixed;
  width: 300px;
  height: 300px;
}

.cell {
  border: 1px solid black;
  text-align: center;
  vertical-align: middle;
  font-size: 20px;
  width: 100px;
  height: 100px;
}

.in-grid {
  background-color: lightblue;
}

.game-info h3 {
  min-height: 3em;
  display: flex;
  align-items: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

</style>