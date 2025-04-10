<script setup lang="ts">

import { useGameStateStore } from '@/stores/gameState';

const gameState = useGameStateStore();

</script>

<template>
    <button @click="gameState.initializeBoard">Reset</button>
</template>

<style scoped>
</style>