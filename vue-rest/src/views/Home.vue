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
    <h1>Welcome.</h1>

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
  text-align: center;
  color: #e0e0e0;
}

.home-page h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
}

.home-page h1::after {
  content: "";
  display: block;
  height: 3px;
  width: 60%;
  margin: 0.5rem auto 0;
  background: linear-gradient(to right, #4c00ff, #6d3bff);
  border-radius: 2px;
}

.artist-highlight {
  background: linear-gradient(to right, #1f1f1f, #2c2c2c);
  padding: 2rem;
  margin-top: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.artist-highlight h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.artist-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #4c00ff;
  box-shadow: 0 0 12px rgba(76, 0, 255, 0.3);
  margin-bottom: 1rem;
}

.artist-link {
  color: #4c00ff;
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 600;
}
.artist-link:hover {
  text-decoration: underline;
  color: #6d3bff;
}

.artist-highlight p {
  margin-top: 1rem;
  color: #ccc;
  font-size: 0.95rem;
  line-height: 1.5;
}

.error {
  color: #ff4d4d;
  margin-top: 1.5rem;
  font-weight: bold;
}
</style>
