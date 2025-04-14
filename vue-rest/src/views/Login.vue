<script setup lang="ts">
import { ref } from 'vue'
import { useUserDataStore } from '@/stores/userDataStore'
import { IdentityService } from '@/services/IdentityService'
import { useRouter } from 'vue-router'
import '@/assets/formStyles.css'

const router = useRouter()
const store = useUserDataStore()

const error = ref<string | null>(null);

const email = ref('')
const password = ref('')
const doLogin = async () => {
  const response = await IdentityService.login(email.value, password.value);
  console.log(response);

  if (response.data) {
    store.jwt = response.data.jwt;
    store.refreshToken = response.data.refreshToken;

    router.push({ name: 'Home' });
  } else {
    error.value = response.errors?.[0] || 'Login failed. Please try again.';
  }

  
}

</script>

<template>
  <main role="main" class="pb-3">
    <div class="form-container">

        <h1>Log in</h1>

        <div class="error">
          {{ error }}
        </div>

        <section>
          <form @submit.prevent="doLogin" id="account" method="post">

            <div class="form-group">
              <label class="form-label" for="Input_Email">Email</label>
              <input v-model="email" class="form-control" autocomplete="username" aria-required="true"
                placeholder="name@example.com" type="email">
            </div>

            <div class="form-group">
              <label class="form-label" for="Input_Password">Password</label>
              <input v-model="password" class="form-control" autocomplete="current-password" aria-required="true"
                placeholder="password" type="password">
            </div>

            <div>
              <button id="login-submit" type="submit" class="button">Log in</button>
            </div>

            <div>
              <p>
                <a id="forgot-password" href="">Forgot your password?</a>
              </p>
              <p>
                <router-link to="/register" class="nav-link">Register as a new user</router-link>
              </p>
            </div>
          </form>
        </section>


    </div>

  </main>

</template>