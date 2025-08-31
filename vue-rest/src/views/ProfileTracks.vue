<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserDataStore } from '@/stores/userDataStore';
import { TrackDeleteService, TrackGetAllService } from '@/services/TrackService';
import type { ITrack } from '@/domain/ITracks';
import { BASE_URL } from '@/config';

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
      <button @click="$router.push('/profile/tracks/create')">+ Upload Track</button>

      <div v-if="tracks.length === 0">
        <p>No tracks found.</p>
      </div>

      <div v-for="track in tracks" :key="track.id" class="track-card">

        <img :src="`${BASE_URL}${track.coverPath}`" class="track-cover" />

        <div class="track-info">
          <h2>{{ track.title }}</h2>

          <audio :src="`${BASE_URL}${track.filePath}`" controls class="audio-player" />

          <p><strong>Saved:</strong> {{ track.timesSaved }} time<span v-if="track.timesSaved !== 1">s</span></p>
          <p><strong>Played:</strong> {{ track.timesPlayed }} time<span v-if="track.timesPlayed !== 1">s</span></p>

          <button class="delete-btn" @click="deleteTrack(track.id)">Delete</button>

          <div v-if="track.rating.length" class="ratings-section">
            <h3>Feedback:</h3>
            <ul>
              <li v-for="r in track.rating" :key="r.id" class="rating-entry">

                <router-link :to="`/profile/${r.userId}`" class="comment-author">
                  {{ r.artistDisplayName }}
                </router-link>

                <span class="score">rated it {{ r.score }}/5</span>

                <p class="comment">"{{ r.comment }}"</p>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
</template>


<style scoped>
.profile-tracks {
  max-width: 700px;
  margin: 0 auto;
  padding-inline: 1rem;
  color: #e0e0e0;
}

h1 {
  font-size: 2.2rem;
  color: #fff;
  border-bottom: 2px solid #4c00ff;
  padding-bottom: 0.3rem;
  margin-bottom: 1.5rem;
}

button {
  padding: 0.6rem 1.2rem;
  background-color: #4c00ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: background 0.2s ease;
}

button:hover {
  background-color: #6d3bff;
}

.track-card {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  background: #1e1e1e;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.track-card:hover {
  transform: scale(1.01);
  transition: transform 0.2s ease;
}

.track-cover {
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #4c00ff33;
}

.track-info {
  flex-grow: 1;
}

.track-info h2 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: #fff;
}

.audio-player {
  width: 100%;
  margin: 0.5rem 0;
}

audio::-webkit-media-controls-panel {
  background-color: #4c00ff;
}

.delete-btn {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s ease;
}

.delete-btn:hover {
  background-color: #ff1a1a;
}

.ratings-section {
  margin-top: 1rem;
  background: #2c2c2c;
  padding: 0.75rem;
  border-radius: 6px;
}

.ratings-section h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #ccc;
}

.rating-entry {
  margin-bottom: 0.75rem;
}

.comment-author {
  font-weight: bold;
  color: #4c00ff;
  text-decoration: none;
}

.comment-author:hover {
  text-decoration: underline;
}

.score {
  margin-left: 0.5rem;
  color: #aaa;
}

.comment {
  margin: 0.25rem 0 0 0;
  font-style: italic;
  color: #ccc;
}

</style>
