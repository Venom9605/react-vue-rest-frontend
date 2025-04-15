<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TrackGetService } from '@/services/TrackService';
import { TrackUpdateService } from '@/services/TrackService';
import type { ITrack } from '@/domain/ITracks';
import type { TrackUpdateDto } from '@/types/TrackUpdateDto';

const router = useRouter();
const route = useRoute();

const trackGetService = new TrackGetService();
const trackUpdateService = new TrackUpdateService();

const error = ref<string | null>(null);
const requestIsOngoing = ref(false);

const track = ref<ITrack | null>(null);

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

const updateTrack = async () => {
    if (!track.value) return;
    
    const trackDto = reactive<TrackUpdateDto>({
        id: track.value.id,
        title: track.value.title,
        coverpath: track.value.coverPath
});

  try {
    await trackUpdateService.updateAsync(track.value.id, trackDto);
    router.push({name: "Tracks"})
  } catch (e) {
    console.log(e)
    error.value = 'Update failed.';
  }
};
</script>

<template>
  <main class="form-container">
    <h1>Edit Track</h1>

    
    <div class="error" v-if="error">{{ error }}</div>

    <form @submit.prevent="updateTrack" v-if="track">

      <div class="form-group">
        <label for="title">Title</label>
        <input v-model="track.title" type="text" id="title" required/>
      </div>

      <div class="form-group">
        <label for="coverPath">Cover Path</label>
        <input v-model="track.coverPath" type="text" id="coverPath" />
      </div>
      <div class="form-group">
        <button class="button" type="submit">Update</button>
      </div>
    </form>
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

.form-group {
  margin-bottom: 1rem;
  margin-left: 3rem;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.3rem;
  font-weight: bold;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error {
  color: red;
  margin-bottom: 1rem;
  text-align: center;
}

</style>