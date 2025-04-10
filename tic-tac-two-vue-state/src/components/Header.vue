<script setup lang="ts">
import { useUserDataStore } from '@/stores/userData'; 
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter()

const store = useUserDataStore();

</script>

<template>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
  <div class="container">
    <a class="navbar-brand" href="#">Tic Tac Two</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarCollapse">
      <ul class="navbar-nav me-auto mb-2 mb-md-0">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/">Home</RouterLink>
        </li>
        <li class="nav-item" v-if="store.userName.length > 0">
          <RouterLink class="nav-link" :to="{name: 'Game', params: {username: store.userName}}">Tic Tac Two</RouterLink>
        </li>
        <li v-if="store.userName.length > 0" class="nav-item">
          <a @click="() => {store.userName = ''; router.push('/');}" class="nav-link">Logout {{ store.userName }}</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<style scoped>
</style>