<script setup lang="ts">
import { RouterView } from 'vue-router';
import Header from './components/Header.vue';

</script>

<template>

  <Header />

  <div class="page-container">
    <RouterView />
  </div>

</template>

<style scoped>

.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
  padding-top: 60px;
}

</style>
