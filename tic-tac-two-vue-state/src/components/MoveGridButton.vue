<script setup lang="ts">

import { useGameStateStore } from '@/stores/gameState';

const gameState = useGameStateStore();

</script>

<template>
    <button @click="gameState.switchMovePieceMode">{{ gameState.isMovingPiece ? 'Stop Moving Piece' : 'Move Piece' }}</button>
</template>

<style scoped>
</style>