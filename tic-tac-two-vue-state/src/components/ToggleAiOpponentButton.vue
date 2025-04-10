<script setup lang="ts">

import { useGameStateStore } from '@/stores/gameState';

const gameState = useGameStateStore();

</script>

<template>
    <label>
        <input type="checkbox" @click="gameState.toggleAiOpponent" :checked="gameState.playerVsAi" />
        Enable AI Opponent
    </label>
</template>

<style scoped>
</style>