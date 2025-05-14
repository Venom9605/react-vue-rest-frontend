<script setup lang="ts">
import { useUserDataStore } from '@/stores/userDataStore';
import { onMounted, reactive, ref } from 'vue';
import type { IResultObject } from '../types/IResultObject';
import type { ITrack } from '../domain/ITracks';
import { TrackGetRandomService, TrackSaveService, TrackPlayService  } from '../services/TrackService';
import { RatingService } from '@/services/RatingService';
import type { RatingCreateDto } from '@/types/RatingCreateDto';

const store = useUserDataStore();
const requestIsOngoing = ref(false);
const track = ref<ITrack | null>(null);
const error = ref<string | null>(null);

const service = new TrackGetRandomService();

const fetchPageData = async () => {
  requestIsOngoing.value = true;
  try {
    const result = await service.getRandomTrack(store.jwt)
    console.log(result.data);

    track.value = result.data ?? null;
    error.value = result.errors?.[0] ?? null;
    if (track.value) {
      await TrackPlayService.incrementPlayCount(track.value.id, store.jwt);
    }

} catch (e) {
    console.error('Error fetching data:', e);
    error.value = 'Unexpected error occurred';
  } finally {
    requestIsOngoing.value = false;
  }

};


const skipTrack = async () => {
  await fetchPageData();
};

const saveCurrentTrack = async () => {
  if (!track.value) return;
  const result = await TrackSaveService.saveTrack(track.value.id);
  if (!result.errors) {
    console.log("Track saved!");
  } else {
    console.error("Save failed:", result.errors[0]);
  }
};

const feedbackVisible = ref(false);
const feedback = reactive<RatingCreateDto>({
  trackId: '',
  score: 5,
  comment: ''
});

const toggleFeedback = () => {
  feedbackVisible.value = !feedbackVisible.value;
  if (track.value) feedback.trackId = track.value.id;
};

const submitFeedback = async () => {
  const result = await RatingService.create({ ...feedback });
  if (!result.errors) {
    console.log("Feedback submitted!");
    feedbackVisible.value = false;
    feedback.comment = '';
    feedback.score = 5;
  } else {
    console.error("Failed to submit:", result.errors[0]);
  }
};


onMounted(async () => {
  await fetchPageData();
});
</script>

<template>
    <div class="discover-container">
      <h1>Discover</h1>
  
      <div v-if="requestIsOngoing">
        <p>Loading...</p>
      </div>
  
      <div v-else-if="track">
        <div class="track-card">
          <!-- Title -->
          <h2>{{ track.title }}</h2>
  
          <!-- Cover image -->
          <img :src="`http://localhost:5081/${track.coverPath}`" alt="Track cover" class="cover-image" />
  
          <!-- Audio player -->
          <audio
            ref="audioRef"
            :src="`http://localhost:5081/${track.filePath}`"
            controls
            autoplay
            @ended="skipTrack"
            class="audio-player"
          />
  
          <!-- Artists -->
          <div v-if="track.artistInTracks.length">
            <h3>Artists:</h3>
            <ul>
              <li v-for="artist in track.artistInTracks" :key="artist.id">
                <router-link
                  :to="`/profile/${artist.userId}`"
                  class="artist-link"
                >
                  {{ artist.artistDisplayName }}
                </router-link> ({{ artist.artistRoleName }})
              </li>
            </ul>
          </div>
  
          <!-- Track Links -->
          <div v-if="track.trackLinks.length">
            <h3>Links:</h3>
            <ul>
              <li v-for="link in track.trackLinks" :key="link.id">
                {{ link.linkTypeName }}:
                <a :href="link.url" target="_blank">{{ link.url }}</a>
              </li>
            </ul>
          </div>
  
          <!-- Tags -->
          <div v-if="track.tagsInTracks.length">
            <h3>Tags:</h3>
            <ul>
              <li v-for="tag in track.tagsInTracks" :key="tag.id">
                {{ tag.tagName }}
              </li>
            </ul>
          </div>
  
          <!-- Moods -->
          <div v-if="track.moodsInTracks.length">
            <h3>Moods:</h3>
            <ul>
              <li v-for="mood in track.moodsInTracks" :key="mood.id">
                {{ mood.moodName }}
              </li>
            </ul>
          </div>

          <div class="track-actions">
            <button @click="skipTrack">⏭️ Skip</button>
            <button @click="toggleFeedback">💬 Leave Feedback</button>
            <button @click="saveCurrentTrack">💾 Save</button>
          </div>

          <div v-if="feedbackVisible" class="feedback-form">
            <label>
              Rating:
              <select v-model="feedback.score">
                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
              </select>
            </label>

            <label>
              Comment:
              <textarea v-model="feedback.comment" rows="3" placeholder="Write your thoughts..."></textarea>
            </label>

            <button @click="submitFeedback">Submit</button>
          </div>

        </div>
      </div>
  
      <div v-else>
        <p>No track found.</p>
      </div>
    </div>
  </template>
  
  <style scoped>
  .discover-container {
    padding-top: 70px;
    max-width: 600px;
    margin: 0 auto;
    text-align: left;
  }
  
  .track-card {
    margin-top: 2rem;
    background: #f8f8f8;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(77, 26, 26, 0.1);
  }
  
  .cover-image {
    max-width: 100%;
    max-height: 250px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  .audio-player {
    width: 100%;
    margin-bottom: 1rem;
  }


  .track-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.track-actions button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

audio::-webkit-media-controls-panel {
  background-color: #9e5e5e;
}

.artist-link {
  color: #0055aa;
  text-decoration: none;
  font-weight: bold;
}
.artist-link:hover {
  text-decoration: underline;
}

.feedback-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feedback-form textarea {
  width: 100%;
  resize: vertical;
  padding: 0.5rem;
}

.feedback-form select {
  width: 60px;
  padding: 0.25rem;
}

.feedback-form button {
  align-self: flex-start;
  background-color: #0055aa;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
</style>