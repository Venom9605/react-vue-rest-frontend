<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TrackGetService } from '@/services/TrackService';
import { TrackDeleteService } from '@/services/TrackService';
import type { ITrack } from '@/domain/ITracks';


const router = useRouter();
const route = useRoute();
const trackGetService = new TrackGetService();
const trackDeleteService = new TrackDeleteService();

const error = ref<string | null>(null);
const track = ref<ITrack | null>(null);
const requestIsOngoing = ref(false);

const fetchPageData = async () => {
  requestIsOngoing.value = true;
  try {
    const trackId = route.params.id as string;
    const result = await trackGetService.findAsync(trackId);
    console.log(result.data);

    if (result.data) {
      track.value = result.data;
    } else {
      error.value = result.errors?.[0] || 'Track not found.';
    }

  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    requestIsOngoing.value = false;
  }

};

onMounted(async () => {
  await fetchPageData();
});

const deleteTrack = async () => {
    if (!track.value) return;

  try {
    await trackDeleteService.deleteAsync(track.value.id);
    router.push({name: "Tracks"})
  } catch (e) {
    console.log(e)
    error.value = 'Delete failed.';
  }
};

</script>

<template>
<main class="form-container">
    <h1>Delete Track</h1>

    <div v-if="requestIsOngoing">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="track">
        <p><strong>Title:</strong> {{ track.title }}</p>
        <p><strong>File Path:</strong> {{ track.filePath }}</p>
        <p><strong>Cover Path:</strong> {{ track.coverPath }}</p>
        <p><strong>Uploaded:</strong> {{ track.uploaded }}</p>
        <p><strong>Duration:</strong> {{ track.duration }}s</p>
        <p><strong>Times Played:</strong> {{ track.timesPlayed }}</p>
        <p><strong>Times Saved:</strong> {{ track.timesSaved }}</p>

        <div class="button-row">
            <button @click="deleteTrack" class="button danger">Delete</button>
            <router-link to="/tracks" class="button cancel">Cancel</router-link>
        </div>
    </div>
</main>
</template>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.error {
  color: red;
  margin-bottom: 1rem;
}

.button {
  width: 100px;
  text-align: center;
  padding: 0.5rem 1rem;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  font-weight: bold;
}

.button.danger {
  background-color: #d9534f;
  color: white;
}

.button.cancel {
  background-color: #6c757d;
  color: white;
}

.button-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

</style>