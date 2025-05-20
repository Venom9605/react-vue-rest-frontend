<script setup lang="ts">
import { useUserDataStore } from '@/stores/userDataStore';
import { useRouter } from 'vue-router';
import { IdentityService } from '@/services/IdentityService';
import { ref } from 'vue';

const router = useRouter();
const store = useUserDataStore();
const searchQuery = ref('');

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

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'SearchResults',
      query: { q: searchQuery.value.trim() } });
  }
};

</script>

<template>
    <header class="navbar">
      <div class="header-container">


        <ul class="nav-left">
          <li>
            <router-link to="/" class="nav-link home">fairplay.</router-link>
          </li>

          <li>
            <router-link to="/discover" class="nav-link">Discover</router-link>
          </li>

          <li v-if="store.jwt.length <= 0">
            <router-link to="/login" class="nav-link">Log in</router-link>
          </li>

          <li v-if="store.jwt.length <= 0">
            <router-link to="/register" class="nav-link">Register</router-link>
          </li>

          <li v-if="store.jwt.length > 0" class="search-bar">
            <input
              type="text"
              v-model="searchQuery"
              @keydown.enter="performSearch"
              placeholder="Search artists or tracks..."
            />
          </li>
        </ul>

        <div v-if="store.jwt.length > 0" class="profile-menu">
          <span class="nav-link">Profile ▾</span>
          <ul class="dropdown">
            <li><router-link to="/profile">Profile</router-link></li>
            <li><router-link to="/profile/tracks">Your Tracks</router-link></li>
            <li><router-link to="/profile/saved">Saved Tracks</router-link></li>
            <li><a href="#" @click.prevent="doLogout">Log out</a></li>
          </ul>
        </div>

      </div>
    </header>
</template>

<style scoped>

.navbar {
  background: #121212;
  width: 100%;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(76, 0, 255, 0.3);
}

.header-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}

ul {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0;
  margin: 0;
}

li {
  position: relative;
}

.nav-link {
  color: #e0e0e0;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #4c00ff;
  text-decoration: none;
}

.nav-link.home {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -1px;
}

.search-bar input {
  padding: 6px 10px;
  font-size: 14px;
  border-radius: 20px;
  border: none;
  outline: none;
  background: #1e1e1e;
  color: #fff;
  transition: background 0.3s ease;
}

.search-bar input::placeholder {
  color: #aaa;
}

.search-bar input:focus {
  background: #2c2c2c;
}

.search-bar button {
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  font-size: 18px;
}

.profile-menu {
  position: relative;
}

.profile-menu:hover .dropdown {
  display: block;
}

.dropdown {
  display: none;
  position: absolute;
  background-color: #17171790;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  list-style: none;
  padding: 0;
  margin: 0;
  top: 100%;
  left: 0; /* change from right: 0 to left: 0 */
  min-width: 160px;
  border-radius: 4px;
  z-index: 1001;
}

.dropdown li {
  padding: 10px 16px;
  white-space: nowrap;
}

.dropdown li:hover {
  background-color: #757575;
}

.dropdown a {
  color: #cfcfcf;
  text-decoration: none;
  display: block;
  width: 100%;
}

</style>
