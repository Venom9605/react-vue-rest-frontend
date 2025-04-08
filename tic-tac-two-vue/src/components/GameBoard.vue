<script setup lang="ts">
import type TicTacTwoBrain from '@/bll/gameBrain';

interface Props {
    game: TicTacTwoBrain;
}

const props = defineProps<Props>();

</script>


<template>
    <div class="game-container">
        
        <div class="game-info">
            <h1>Tic Tac Two</h1>
            <h2>Player: {{ game.currentPlayer }}</h2>
            <h2>Pieces left: {{ game.getCurrentPlayerPieces() }}</h2>
            <h3> {{ game.message }}</h3>
        </div>


        <table class="game-board">
            <tr v-for="(row, indexRow) in props.game.board" :key="indexRow">
                <td 
                    v-for="(cell, indexCol) in row" 
                    :key="indexCol" 
                    @click="$emit('cellClick', indexRow, indexCol)"
                    :class="['cell', { 'in-grid': game.isInGrid(indexRow, indexCol) }]"
                >
                
                    {{ cell }}
                </td>
            </tr>
        </table>

    </div>

    




</template>



<style scoped>

.game-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: start;
    gap: 20px;
    margin: 20px;
    height: 100vh;
}

.game-info {
    grid-column: 1;
    max-width: 200px;
}

.game-board {
    grid-column: 2;
    justify-self: center;
    border-collapse: collapse;
    margin: 0 auto;
    table-layout: fixed;
    width: 300px;
    height: 300px;
}

.cell {
    border: 1px solid black;
    text-align: center;
    vertical-align: middle;
    font-size: 20px;
    width: 100px;
    height: 100px;
}

.in-grid {
    background-color: lightblue;
}
</style>