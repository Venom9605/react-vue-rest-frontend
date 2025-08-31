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
import { BASE_URL } from '@/config';


const store = useUserDataStore();
const route = useRoute();

const artist = ref<IArtist | null>(null);
const tracks = ref<ITrack[]>([]);

const error = ref<string | null>(null);
const saveMessages = reactive<Record<string, string>>({});

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
    saveMessages[id] = "✅ Track saved!";
  } else {
        saveMessages[id] = "Already saved.";
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
        :src="`${BASE_URL}${artist.profilePicture}`"
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
            <img :src="`${BASE_URL}${track.coverPath}`" class="track-cover" />

            <div class="track-info">
                <h3>{{ track.title }}</h3>
                <audio :src="`${BASE_URL}${track.filePath}`"
                    controls class="audio-player"
                    @play="incrementPlay(track.id)"
                />
                <p v-if="saveMessages[track.id]" class="save-message">
                  {{ saveMessages[track.id] }}
                </p>
                <button v-if="store.jwt.length > 0" @click="saveTrack(track.id)" class="save-btn">💾 Save</button>
                <button v-if="store.jwt.length > 0" @click="toggleFeedback(track.id)">💬 Leave Feedback</button>

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
  max-width: 700px;
  margin: 0 auto;
  padding-inline: 1rem;
  color: #e0e0e0;
}

.profile-picture {
  width: 150px;
  height: 150px;
  object-fit: cover; /* Ensures the image fills the box without distortion */
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 3px solid #4c00ff66;
  box-shadow: 0 0 12px rgba(76, 0, 255, 0.3);
}

h1 {
  font-size: 2.2rem;
  color: #fff;
  border-bottom: 2px solid #4c00ff;
  padding-bottom: 0.3rem;
  margin-bottom: 1.5rem;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #cccccc;
  font-size: 1.5rem;
}

.error {
  color: #ff4d4d;
  margin-bottom: 1rem;
}

.track-card {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1rem;
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

.track-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: #fff;
}

.audio-player {
  width: 100%;
  margin-bottom: 0.5rem;
}

.save-btn,
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

.save-btn:hover,
.track-info button:hover {
  background-color: #6d3bff;
}

.save-message {
  margin-top: 0.4rem;
  font-size: 0.9rem;
  color: #b3b3b3;
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


audio {
  width: 100%;
  margin-top: 0.5rem;
}

audio::-webkit-media-controls-panel {
  background-color: #4c00ff;
}

</style>
