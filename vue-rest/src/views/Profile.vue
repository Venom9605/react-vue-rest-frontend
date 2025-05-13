<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { IArtist } from '@/domain/IArtist';
import { useUserDataStore } from '@/stores/userDataStore';
import { ArtistService } from '@/services/ArtistService';

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
        :src="`http://localhost:5081/${artist.profilePicture}`"
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
  max-width: 600px;
  margin: 0 auto;
  padding-top: 70px;
}

.profile-picture {
  max-width: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.error {
  color: red;
  margin-bottom: 1rem;
}

.edit-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #0055aa;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>