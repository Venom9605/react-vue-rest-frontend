<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserDataStore } from '@/stores/userDataStore';
import { TrackDeleteService, TrackGetAllService } from '@/services/TrackService';
import type { ITrack } from '@/domain/ITracks';

const router = useRouter();
const store = useUserDataStore();
const trackService = new TrackGetAllService();
const deleteService = new TrackDeleteService();

const tracks = ref<ITrack[]>([]);

const loadTracks = async () => {
  const result = await trackService.getAllAsync(store.jwt);
  tracks.value = result.data ?? [];
};

onMounted(loadTracks);

const goToCreate = () => {
  router.push('/profile/tracks/create');
};

const deleteTrack = async (id: string) => {
  const confirmDelete = confirm("Are you sure you want to delete this track?");
  if (!confirmDelete) return;

  const result = await deleteService.deleteAsync(id);
  if (!result.errors) {
    tracks.value = tracks.value.filter(t => t.id !== id);
  }
};

</script>

<template>
    <div class="profile-tracks">
      <h1>Your Tracks</h1>
      <button @click="$router.push('/profile/tracks/create')">+ Create Track</button>
  
      <div v-if="tracks.length === 0">
        <p>No tracks found.</p>
      </div>
  
      <div v-for="track in tracks" :key="track.id" class="track-card">
        <img :src="`http://localhost:5081/${track.coverPath}`" class="track-cover" />
        <div class="track-info">
          <h2>{{ track.title }}</h2>
          <audio :src="`http://localhost:5081/${track.filePath}`" controls class="audio-player" />
          <button class="delete-btn" @click="deleteTrack(track.id)">Delete</button>
        </div>
      </div>
    </div>
</template>


<style scoped>
.profile-tracks {
  max-width: 700px;
  margin: 0 auto;
  padding-top: 70px;
}

.track-card {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0,0,0,0.05);
}

.track-cover {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.track-info {
  flex-grow: 1;
}

.audio-player {
  width: 100%;
  margin: 0.5rem 0;
}

.delete-btn {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
</style>