<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ITrack } from '@/domain/ITracks';
import { useUserDataStore } from '@/stores/userDataStore';
import { TrackSaveService } from '@/services/TrackService'; // for removeSavedTrack

const store = useUserDataStore();
const savedTracks = ref<ITrack[]>([]);

const loadSavedTracks = async () => {
  const result = await TrackSaveService.getSavedTracks();
  savedTracks.value = result.data ?? [];
};

onMounted(loadSavedTracks);

const removeSaved = async (trackId: string) => {
  const confirmDelete = confirm("Unsave this track?");
  if (!confirmDelete) return;

  const result = await TrackSaveService.removeSavedTrack(trackId);
  if (!result.errors) {
    savedTracks.value = savedTracks.value.filter(t => t.id !== trackId);
  }
};
</script>

<template>
  <div class="profile-tracks">
    <h1>Saved Tracks</h1>

    <div v-if="savedTracks.length === 0">
      <p>You haven't saved any tracks yet.</p>
    </div>

    <div v-for="track in savedTracks" :key="track.id" class="track-card">
      <img :src="`http://localhost:5081/${track.coverPath}`" class="track-cover" />
      <div class="track-info">
        <h2>{{ track.title }}</h2>
        <audio :src="`http://localhost:5081/${track.filePath}`" controls class="audio-player" />
        <button class="delete-btn" @click="removeSaved(track.id)">Unsave</button>
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