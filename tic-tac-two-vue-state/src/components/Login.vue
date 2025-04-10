<script setup lang="ts">
import { ref } from 'vue';
import { useUserDataStore } from '@/stores/userData';

const store = useUserDataStore();

const userName = ref('');
const password = ref('');

const doLogin = () => {
    store.userName = userName.value;
    store.password = password.value;
};

</script>

<template>
<form @submit.prevent="doLogin()">
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input v-model="userName" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
    <div id="emailHelp" class="form-text">We will sell all of your data to scammers.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input v-model="password" type="password" class="form-control" id="exampleInputPassword1">
  </div>
  <button type="submit" class="btn btn-primary">Login</button>
</form>
</template>

<style scoped>
</style>