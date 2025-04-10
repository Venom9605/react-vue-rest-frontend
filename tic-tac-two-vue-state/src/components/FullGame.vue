<script setup lang="ts">
import GameBoard from './GameBoard.vue';
import { useGameStateStore } from '@/stores/gameState';

const gameState = useGameStateStore();

</script>

<template>
    <GameBoard @cell-click="(x, y) => {
        gameState.makeMove(x, y);
        console.log('Clicked: ', x, ' ', y)
    }"
    />
</template>

<style scoped>
</style>
