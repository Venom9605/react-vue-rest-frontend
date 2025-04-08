<script setup lang="ts">

import type TicTacTwoBrain from '@/bll/gameBrain';

interface Props {
    game: TicTacTwoBrain;
}

defineProps<Props>();

</script>

<template>
    <label>
        <input type="checkbox" @click="game.toggleAiOpponent" :checked="game.playerVsAi" />
        Enable AI Opponent
    </label>
</template>

<style scoped>
</style>