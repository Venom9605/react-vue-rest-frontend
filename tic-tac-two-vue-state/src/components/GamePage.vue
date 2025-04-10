<script setup lang="ts">
import FullGame from './FullGame.vue';
defineProps({
    username: String
})

</script>

<template>
    
Game - {{ username }}
<FullGame />

</template>

<style scoped>
</style>