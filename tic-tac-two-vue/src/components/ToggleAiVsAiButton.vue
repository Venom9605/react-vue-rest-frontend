<script setup lang="ts">

import type TicTacTwoBrain from '@/bll/gameBrain';

interface Props {
    game: TicTacTwoBrain;
}

defineProps<Props>();

</script>

<template>
    <label>
        <input type="checkbox" @click="game.toggleAiVsAi" :checked="game.aiVsAi" />
        Enable AI Vs AI
    </label>
</template>

<style scoped>
</style>