<script setup lang="ts">
import { useUserDataStore } from '@/stores/userDataStore';
import { useRouter } from 'vue-router';
import { IdentityService } from '@/services/IdentityService';

const router = useRouter();
const store = useUserDataStore();

const doLogout = async () => {
  const response = await IdentityService.logout(
    store.jwt,
    store.refreshToken
  );
        
  console.log(response);

  if (response.data) {
    store.jwt = "";
    store.refreshToken = "";

    router.push({ name: 'Login' });
  } else {
    console.log(response.errors?.[0] || 'Logout failed. Please try again.')
  }

};

</script>

<template>
    <header class="navbar">
      <div class="header-container">
        <ul>
          <li>
            <router-link to="/" class="nav-link home">Home</router-link>
          </li>
          <li v-if="store.jwt.length <= 0">
            <router-link to="/login" class="nav-link">Log in</router-link>
          </li>
          <li v-if="store.jwt.length <= 0">
            <router-link to="/register" class="nav-link">Register</router-link>
          </li>
          <li v-if="store.jwt.length > 0">
            <router-link @click="doLogout()" to="/" class="nav-link">Log out</router-link>
          </li>
          <li v-if="store.jwt.length > 0">
            <router-link to="/tracks" class="nav-link">Tracks</router-link>
          </li>
        </ul>

      </div>
    </header>
</template>
  
<style scoped>

.navbar {
  background-color: #ffffff;
  width: 100%;
  height: 60px;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px 20px;
}

ul {
  list-style: none;
  display: flex;
  gap: 20px;
  padding: 0;
  margin: 0;
  align-items: center;
  height: 100%;
}

li {
  display: inline;
}

.nav-link {
  display: inline-block;
  vertical-align: baseline;
  text-decoration: none;
  color: #000000;
  font-size: 18px;
}

.nav-link.home {
  font-size: 30px;
  margin-right: 1rem;
  vertical-align: baseline;
}

.nav-link:hover {
  text-decoration: underline;
}
</style>