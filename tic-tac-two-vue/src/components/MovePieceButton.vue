<script setup lang="ts">

import type TicTacTwoBrain from '@/bll/gameBrain';

interface Props {
    game: TicTacTwoBrain;
}

defineProps<Props>();

</script>

<template>
    <button @click="game.switchMoveGridMode">{{ game.isMovingGrid ? 'Stop Moving Grid' : 'Move Grid' }}</button>
</template>

<style scoped>
</style>