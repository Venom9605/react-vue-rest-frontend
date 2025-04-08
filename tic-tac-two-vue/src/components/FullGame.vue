<script setup lang="ts">
import { reactive } from 'vue';
import TicTacTwoBrain from '../bll/gameBrain';
import GameBoard from './GameBoard.vue';
import ResetButton from './ResetButton.vue';
import MoveGridButton from './MoveGridButton.vue';
import MovePieceButton from './MovePieceButton.vue';
import ToggleAiOpponentButton from './ToggleAiOpponentButton.vue';
import ToggleAiVsAiButton from './ToggleAiVsAiButton.vue';

const game = reactive(new TicTacTwoBrain());

</script>

<template>
    <ResetButton :game="game" />

    <MoveGridButton :game="game" />
    <MovePieceButton :game="game" />

    <ToggleAiOpponentButton :game="game" />
    <ToggleAiVsAiButton :game="game" />

    <GameBoard :game=game @cell-click="(x, y) => {
        game.makeMove(x, y);
        console.log('Clicked: ', x, ' ', y)
    }"
    />
</template>

<style scoped>
</style>
