<script setup lang="ts">

import type TicTacTwoBrain from '@/bll/gameBrain';

interface Props {
    game: TicTacTwoBrain;
}

defineProps<Props>();

</script>

<template>
    <button @click="game.initializeBoard">Reset</button>
</template>

<style scoped>
</style>