<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import type { ITrack } from '@/domain/ITracks';
import { useUserDataStore } from '@/stores/userDataStore';
import { TrackSaveService } from '@/services/TrackService'; // for removeSavedTrack
import { TrackPlayService } from '@/services/TrackService';
import { RatingService } from '@/services/RatingService';
import type { RatingCreateDto } from '@/types/RatingCreateDto';

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

const feedbackVisibleFor = ref<string | null>(null);
const feedback = reactive<RatingCreateDto>({
  trackId: '',
  score: 5,
  comment: ''
});

const toggleFeedback = (trackId: string) => {
  if (feedbackVisibleFor.value === trackId) {
    feedbackVisibleFor.value = null;
  } else {
    feedbackVisibleFor.value = trackId;
    feedback.trackId = trackId;
    feedback.score = 5;
    feedback.comment = '';
  }
};

const playedTracks = new Set<string>();

const incrementPlay = async (trackId: string) => {
  if (playedTracks.has(trackId)) return;

  playedTracks.add(trackId);
  await TrackPlayService.incrementPlayCount(trackId, store.jwt);
};

const submitFeedback = async () => {
  const result = await RatingService.create({ ...feedback });
  if (!result.errors) {
    console.log("Feedback submitted!");
    feedbackVisibleFor.value = null;
    feedback.comment = '';
    feedback.score = 5;
  } else {
    console.error("Submit failed:", result.errors[0]);
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
        <audio :src="`http://localhost:5081/${track.filePath}`" 
          controls class="audio-player" 
          @play="incrementPlay(track.id)"
        />
        <button class="delete-btn" @click="removeSaved(track.id)">Unsave</button>

        <button @click="toggleFeedback(track.id)">💬 Leave Feedback</button>

        <div v-if="feedbackVisibleFor === track.id" class="feedback-form">
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

.feedback-form {
  margin-top: 0.75rem;
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