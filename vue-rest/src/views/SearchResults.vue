<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { ITrack } from '@/domain/ITracks';
import type { IArtist } from '@/domain/IArtist';
import { SearchService } from '@/services/SearchService';

const route = useRoute();
const router = useRouter();

const tracks = ref<ITrack[]>([]);
const artists = ref<IArtist[]>([]);
const error = ref<string | null>(null);
const loading = ref(true);

const fetchResults = async () => {
  const query = route.query.q?.toString() ?? '';
  if (!query) return;

  loading.value = true;
  const res = await SearchService.searchAll(query);
  loading.value = false;

  if (res.data) {
    tracks.value = res.data.tracks;
    artists.value = res.data.artists;
  } else {
    error.value = res.errors?.[0] || 'Search failed';
  }
};

onMounted(fetchResults);

watch(() => route.query.q, fetchResults);
</script>

<template>
  <div class="search-page">
    <h1>Search Results</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-if="tracks.length">
        <h2>Tracks</h2>
        <ul>
          <li v-for="track in tracks" :key="track.id">

            <router-link :to="`/profile/${track.artistInTracks?.[0]?.userId}`">
              {{ track.title }}
            </router-link>

          </li>
        </ul>
      </div>

      <div v-if="artists.length">
        <h2>Artists</h2>
        <ul>
          <li v-for="artist in artists" :key="artist.id">
            <router-link :to="`/profile/${artist.id}`">
              {{ artist.displayName }}
            </router-link>
          </li>
        </ul>
      </div>

      <div v-if="!tracks.length && !artists.length">
        No results found.
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  padding-top: 80px;
  max-width: 700px;
  margin: 0 auto;
  color: #e0e0e0;
  text-align: left;
  padding-inline: 1rem;
}

h1 {
  font-size: 2.4rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
  border-bottom: 2px solid #4c00ff;
  padding-bottom: 0.3rem;
}

h2 {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  color: #cccccc;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  background: #1e1e1e;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: background 0.2s ease;
}

li:hover {
  background: #2a2a2a;
}

a {
  color: #4c00ff;
  font-weight: 500;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

div[role="status"],
div[role="alert"] {
  margin-top: 1rem;
  color: #ccc;
  font-style: italic;
}
</style>
