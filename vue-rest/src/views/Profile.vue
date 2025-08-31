<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { IArtist } from '@/domain/IArtist';
import { useUserDataStore } from '@/stores/userDataStore';
import { ArtistService } from '@/services/ArtistService';
import { BASE_URL } from '@/config';

const store = useUserDataStore();
const artist = ref<IArtist | null>(null);
const error = ref<string | null>(null);

const fetchArtist = async () => {
  const result = await ArtistService.getUserInfo(store.jwt);
  if (result.data) {
    artist.value = result.data;
  } else {
    error.value = result.errors?.[0] || "Failed to load artist info.";
  }
};

onMounted(fetchArtist);
</script>

<template>
  <div class="profile-container">
    <h1>Your Profile</h1>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-else-if="artist">
      <img
        v-if="artist.profilePicture"
        :src="`${BASE_URL}${artist.profilePicture}`"
        alt="Profile"
        class="profile-picture"
      />

      <p><strong>Display Name:</strong> {{ artist.displayName }}</p>
      <p><strong>Bio:</strong> {{ artist.bio }}</p>
      <p><strong>Joined:</strong> {{ new Date(artist.joinDate).toLocaleDateString() }}</p>

        <button class="edit-btn" @click="$router.push('/profile/edit')">Edit Profile</button>
    </div>

    <div v-else>
      <p>Loading profile...</p>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 700px;
  margin: 0 auto;
  padding-inline: 1rem;
  color: #e0e0e0;
}

h1 {
  font-size: 2.2rem;
  color: #ffffff;
  border-bottom: 2px solid #4c00ff;
  padding-bottom: 0.3rem;
  margin-bottom: 1.5rem;
}

.profile-picture {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 3px solid #4c00ff66;
  box-shadow: 0 0 12px rgba(76, 0, 255, 0.3);
}

p {
  margin: 0.3rem 0;
  line-height: 1.5;
}

.error {
  color: #ff4d4d;
  margin-bottom: 1rem;
}

.edit-btn {
  margin-top: 1.2rem;
  padding: 0.6rem 1.2rem;
  background-color: #4c00ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.edit-btn:hover {
  background-color: #6d3bff;
}

</style>
