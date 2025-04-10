<script setup lang="ts">
import Login from './Login.vue';

import { useUserDataStore } from '@/stores/userData';

const store = useUserDataStore();
</script>

<template>
    <div v-if="store.userName.length > 0">
        Home<br>
        Logged in as {{ store.userName }}
    </div>

    <div v-else>
        <Login />
    </div>
</template>

<style scoped>
</style>
