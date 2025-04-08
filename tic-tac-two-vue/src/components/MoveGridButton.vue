<script setup lang="ts">

import type TicTacTwoBrain from '@/bll/gameBrain';

interface Props {
    game: TicTacTwoBrain;
}

defineProps<Props>();

</script>

<template>
    <button @click="game.switchMovePieceMode">{{ game.isMovingPiece ? 'Stop Moving Piece' : 'Move Piece' }}</button>
</template>

<style scoped>
</style>