<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import type { IArtist } from '@/domain/IArtist';
import { ArtistService } from '@/services/ArtistService';
import { useUserDataStore } from '@/stores/userDataStore';
import { TrackGetByUserIdService } from '@/services/TrackService';
import { TrackSaveService } from '@/services/TrackService';
import { TrackPlayService } from '@/services/TrackService';
import type { ITrack } from '@/domain/ITracks';
import { RatingService } from '@/services/RatingService';
import type { RatingCreateDto } from '@/types/RatingCreateDto'


const store = useUserDataStore();
const route = useRoute();

const artist = ref<IArtist | null>(null);
const tracks = ref<ITrack[]>([]);

const error = ref<string | null>(null);

const fetchTracks = async () => {
  const userId = route.params.id as string;
  const result = await TrackGetByUserIdService.getTracksByUserId(userId, store.jwt);
  if (result.data) {
    tracks.value = result.data;
  } else {
    console.error(result.errors?.[0] || "Failed to load tracks.");
  }
};

const fetchArtist = async () => {
  const userId = route.params.id as string;
  const result = await ArtistService.getUserInfoById(userId, store.jwt);
  if (result.data) {
    artist.value = result.data;
  } else {
    error.value = result.errors?.[0] || "Failed to load artist info.";
  }
};


const saveTrack = async (id: string) => {
  const result = await TrackSaveService.saveTrack(id);
  if (!result.errors) {
    console.log("Track saved!");
  } else {
    console.error("Save failed:", result.errors[0]);
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

const playedTracks = new Set<string>();

const incrementPlay = async (trackId: string) => {
  if (playedTracks.has(trackId)) return;

  playedTracks.add(trackId);
  await TrackPlayService.incrementPlayCount(trackId, store.jwt);
};

onMounted(async () => {
  await fetchArtist();
  await fetchTracks();
});
</script>

<template>
  <div class="profile-container">
    <h1>Artist Profile</h1>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-else-if="artist">
      <img
        v-if="artist.profilePicture"
        :src="`http://localhost:5081/${artist.profilePicture}`"
        alt="Profile"
        class="profile-picture"
      />

      <p><strong>Display Name:</strong> {{ artist.displayName }}</p>
      <p><strong>Bio:</strong> {{ artist.bio }}</p>
      <p><strong>Joined:</strong> {{ new Date(artist.joinDate).toLocaleDateString() }}</p>
    </div>

    <div v-else>
      <p>Loading profile...</p>
    </div>

    <div v-if="tracks.length">
        <h2>Tracks by {{ artist?.displayName }}</h2>

        <div v-for="track in tracks" :key="track.id" class="track-card">
            <img :src="`http://localhost:5081/${track.coverPath}`" class="track-cover" />

            <div class="track-info">
                <h3>{{ track.title }}</h3>
                <audio :src="`http://localhost:5081/${track.filePath}`" 
                    controls class="audio-player" 
                    @play="incrementPlay(track.id)"
                />
                <button @click="saveTrack(track.id)" class="save-btn">💾 Save</button>
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

    <div v-else>
        <p>This artist has no tracks yet.</p>
    </div>

  </div>
</template>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 70px;
}

.profile-picture {
  max-width: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.error {
  color: red;
  margin-bottom: 1rem;
}

.track-card {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  background: #f4f4f4;
  padding: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.04);
}

.track-cover {
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 6px;
}

.track-info {
  flex-grow: 1;
}

.track-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}

.audio-player {
  width: 100%;
}

.save-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
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
