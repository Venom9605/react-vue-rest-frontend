<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import type { ITrack } from '@/domain/ITracks';
import { useUserDataStore } from '@/stores/userDataStore';
import { TrackSaveService } from '@/services/TrackService'; // for removeSavedTrack
import { TrackPlayService } from '@/services/TrackService';
import { RatingService } from '@/services/RatingService';
import type { RatingCreateDto } from '@/types/RatingCreateDto';
import { BASE_URL } from '@/config';

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

      <img :src="`${BASE_URL}${track.coverPath}`" class="track-cover" />

      <div class="track-info">

        <h2>{{ track.title }}</h2>

        <div v-if="track.artistInTracks?.length">
          <p class="track-artists">
            <span v-for="(artist, index) in track.artistInTracks" :key="artist.id">
              <router-link
                :to="`/profile/${artist.userId}`"
                class="artist-link"
              >
                {{ artist.artistDisplayName }}
              </router-link>
              <span v-if="index < track.artistInTracks.length - 1">, </span>
            </span>
          </p>
        </div>

        <audio :src="`${BASE_URL}${track.filePath}`"
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
  padding-inline: 1rem;
  color: #e0e0e0;
}

h1 {
  font-size: 2.2rem;
  color: #ffffff;
  border-bottom: 2px solid #4c00ff;
  padding-bottom: 0.3rem;
  margin-bottom: 1.5rem;
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

.track-artists {
  margin: 0.25rem 0;
  font-size: 0.95rem;
  color: #ccc;
}

.artist-link {
  color: #4c00ff;
  text-decoration: none;
  font-weight: 500;
}

.artist-link:hover {
  text-decoration: underline;
}

.audio-player {
  width: 100%;
  margin: 0.5rem 0;
}

audio::-webkit-media-controls-panel {
  background-color: #4c00ff;
}

.delete-btn,
.track-info button {
  background-color: #4c00ff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 0.5rem;
  margin-top: 0.5rem;
  transition: background 0.2s ease;
}

.delete-btn:hover,
.track-info button:hover {
  background-color: #6d3bff;
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
  background: #2c2c2c;
  color: #e0e0e0;
  border: 1px solid #555;
  border-radius: 6px;
}

.feedback-form select {
  width: 60px;
  padding: 0.3rem;
  background: #2c2c2c;
  color: white;
  border: 1px solid #555;
  border-radius: 6px;
}

.feedback-form button {
  align-self: flex-start;
  background-color: #4c00ff;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.feedback-form button:hover {
  background-color: #6d3bff;
}

</style>
