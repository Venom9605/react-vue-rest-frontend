<script setup lang="ts">

import { useGameStateStore } from '@/stores/gameState';

const gameState = useGameStateStore();

</script>

<template>
    <button @click="gameState.switchMoveGridMode">{{ gameState.isMovingGrid ? 'Stop Moving Grid' : 'Move Grid' }}</button>
</template>

<style scoped>
</style>