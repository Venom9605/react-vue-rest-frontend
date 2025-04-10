<script setup lang="ts">

import { useGameStateStore } from '@/stores/gameState';

const gameState = useGameStateStore();

</script>

<template>
    <label>
        <input type="checkbox" @click="gameState.toggleAiVsAi" :checked="gameState.aiVsAi" />
        Enable AI Vs AI
    </label>
</template>

<style scoped>
</style>