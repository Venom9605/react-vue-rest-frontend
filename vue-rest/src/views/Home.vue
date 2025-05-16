<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ArtistService } from '@/services/ArtistService';
import type { IArtist } from '@/domain/IArtist';
import { useUserDataStore } from '@/stores/userDataStore';
import { BASE_URL } from '@/config';

const artistOfMonth = ref<IArtist | null>(null);

const store = useUserDataStore()
const error = ref<string | null>(null);

const loadArtistOfMonth = async () => {
  const result = await ArtistService.getMostPopular(store.jwt);
  if (result.data) {
    artistOfMonth.value = result.data;
  } else {
    error.value = result.errors?.[0] || 'Failed to load artist of the month.';
  }
};

onMounted(loadArtistOfMonth);
</script>

<template>
  <div class="home-page">
    <h1>Welcome!</h1>

    <div class="artist-highlight" v-if="artistOfMonth">
      <h2>🎉 Artist of the Month 🎉</h2>

      <img
        v-if="artistOfMonth.profilePicture"
        :src="`${BASE_URL}${artistOfMonth.profilePicture}`"
        alt="Artist"
        class="artist-image"
      />

      <h3>
        <router-link :to="`/profile/${artistOfMonth.id}`" class="artist-link">
          {{ artistOfMonth.displayName }}
        </router-link>
      </h3>

      <p>{{ artistOfMonth.bio }}</p>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<style scoped>
.home-page {
  padding-top: 70px;
  text-align: center;
}

.artist-highlight {
  background: #f0f8ff;
  padding: 2rem;
  margin-top: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}

.artist-image {
  width: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}

.artist-link {
  color: #0055aa;
  text-decoration: none;
  font-weight: bold;
}
.artist-link:hover {
  text-decoration: underline;
}
</style>
