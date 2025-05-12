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
            <router-link to="/discover" class="nav-link">Discover</router-link>
          </li>

          <li v-if="store.jwt.length > 0" class="profile-menu">
            <span class="nav-link">Profile ▾</span>
            <ul class="dropdown">
              <li><router-link to="/profile">Profile</router-link></li>
              <li><router-link to="/profile/tracks">Your Tracks</router-link></li>
              <li><router-link to="/profile/saved">Saved Tracks</router-link></li>
              <li><a href="#" @click.prevent="doLogout">Log out</a></li>
            </ul>
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
  align-items: center;
  gap: 20px;
  padding: 0;
  margin: 0;
}

li {
  display: block;
  position: relative;
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


.profile-menu {
  position: relative;
}

.profile-menu:hover .dropdown {
  display: block;
}

.dropdown {
  display: none;
  position: absolute;
  background-color: #fff;
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
  background-color: #f0f0f0;
}

.dropdown a {
  color: #000;
  text-decoration: none;
  display: block;
  width: 100%;
}
</style>