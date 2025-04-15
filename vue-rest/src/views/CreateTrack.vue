<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { TrackCreateService } from '@/services/TrackService';
import { useUserDataStore } from '@/stores/userDataStore';
import type { TrackCreateDto } from '@/types/TrackCreateDto'

const router = useRouter();
const store = useUserDataStore();
const trackService = new TrackCreateService();


const error = ref<string | null>(null);
const track = reactive<TrackCreateDto>({
  title: '',
  filepath: '',
  coverpath: ''
});

const createTrack = async () => {
  const response = await trackService.addAsync(track);

  console.log(response);

  if (response.data) {
    router.push({ name: 'Tracks' });
  } else {
    error.value = response.errors?.[0] || 'Create failed. Please try again.';
  }

};
</script>

<template>
  <main class="form-container">
    <h1>Create New Track</h1>

    <div class="error" v-if="error">{{ error }}</div>

    <form @submit.prevent="createTrack">
      <div class="form-group">
        <label for="title">Title</label>
        <input v-model="track.title" type="text" id="title" required />
      </div>

      <div class="form-group">
        <label for="filePath">File Path</label>
        <input v-model="track.filepath" type="text" id="filePath" required />
      </div>

      <div class="form-group">
        <label for="coverPath">Cover Path</label>
        <input v-model="track.coverpath" type="text" id="coverPath" />
      </div>

      <button class="button" type="submit">Create</button>
    </form>

  </main>
</template>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.error {
  color: red;
  margin-bottom: 1rem;
}

.button {
  background-color: #4c00ff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
