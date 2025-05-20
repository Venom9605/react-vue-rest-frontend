<script setup lang="ts">
import { useUserDataStore } from '@/stores/userDataStore';
import { onMounted, reactive, ref } from 'vue';
import type { ITrack } from '../domain/ITracks';
import { TrackGetRandomService, TrackSaveService, TrackPlayService  } from '../services/TrackService';
import { RatingService } from '@/services/RatingService';
import { MoodGetAllService } from '@/services/MoodService';
import { TagGetAllService } from '@/services/TagService';
import type { RatingCreateDto } from '@/types/RatingCreateDto';
import type { TagDto } from '@/types/TagDto';
import type { MoodDto } from '@/types/MoodDto';
import { BASE_URL } from '@/config';

const store = useUserDataStore();

const requestIsOngoing = ref(false);

const track = ref<ITrack | null>(null);

const allTags = ref<TagDto[]>([]);
const allMoods = ref<MoodDto[]>([]);

const selectedTagObjects = ref<{ tagId: string }[]>([]);
const selectedMoodObjects = ref<{ moodId: string }[]>([]);

const playedTrackIds = new Set<string>();

const error = ref<string | null>(null);

const service = new TrackGetRandomService();

const autoplayNext = ref(true);

const addTagFilter = () => selectedTagObjects.value.push({ tagId: '' });
const addMoodFilter = () => selectedMoodObjects.value.push({ moodId: '' });

const fetchPageData = async () => {
  requestIsOngoing.value = true;

  try {
    const tagIds = selectedTagObjects.value.map(t => t.tagId).filter(Boolean);
    const moodIds = selectedMoodObjects.value.map(m => m.moodId).filter(Boolean);

    const maxAttempts = 15;
    let attempts = 0;
    let newTrack: ITrack | null = null;

    while (attempts < maxAttempts) {
      const result = await service.getFilteredTrack(store.jwt, tagIds, moodIds);
      const candidate = result.data ?? null;

      if (!candidate) {
        error.value = result.errors?.[0] ?? "No track found.";
        track.value = null;
        return;
      }

      if (!playedTrackIds.has(candidate.id)) {
        newTrack = candidate;
        break;
      }

      attempts++;
    }

    if (newTrack) {
      track.value = newTrack;
      playedTrackIds.add(newTrack.id);
      error.value = null;
      await TrackPlayService.incrementPlayCount(newTrack.id, store.jwt);

    } else {
      track.value = null;
      error.value = "No more unique tracks found. Try changing filters.";
    }

  } catch (e) {
    console.error("Error fetching data:", e);
    track.value = null;
    error.value = "Unexpected error occurred.";

  } finally {
    requestIsOngoing.value = false;
  }
};

const fetchFilters = async () => {
  const tagResult = await new TagGetAllService().getAllAsync(store.jwt);
  const moodResult = await new MoodGetAllService().getAllAsync(store.jwt);
  allTags.value = tagResult.data ?? [];
  allMoods.value = moodResult.data ?? [];
};

const applyFilters = async () => {
  playedTrackIds.clear();
  await fetchPageData();
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

  if (track.value) {
    feedback.trackId = track.value.id;
  }
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
    error.value = "You have already rated this track!";
  }
};

onMounted(async () => {
  await fetchFilters();
  await fetchPageData();
});
</script>

<template>
  <div class="discover-wrapper">
    <div class="track-and-filters">
      <div class="discover-container">
        <h1>Discover</h1>

        <div v-if="requestIsOngoing">
          <p>Loading...</p>
        </div>

        <div
          class="track-card-wrapper"
          v-else-if="track"
          :style="{ backgroundImage: `url(${BASE_URL}${track.coverPath})` }"
        >
          <div class="track-card">
            <h2>{{ track.title }}</h2>

            <audio
              :src="`${BASE_URL}${track.filePath}`"
              controls
              autoplay
              @ended="autoplayNext ? skipTrack() : null"
              class="audio-player"
            />

            <div v-if="track.artistInTracks.length">
              <h3>Artists:</h3>
              <ul>
                <li v-for="artist in track.artistInTracks" :key="artist.id">

                  <router-link :to="`/profile/${artist.userId}`" class="artist-link">
                    {{ artist.artistDisplayName }}
                  </router-link> ({{ artist.artistRoleName }})

                </li>
              </ul>
            </div>

            <div v-if="track.trackLinks.length">
              <h3>Links:</h3>
              <ul>
                <li v-for="link in track.trackLinks" :key="link.id">

                  <a :href="link.url" target="_blank">{{ link.linkTypeName }}</a>

                </li>
              </ul>
            </div>

            <div v-if="track.tagsInTracks.length || track.moodsInTracks.length" class="tags-moods-wrapper">
              <div v-if="track.tagsInTracks.length" class="tags-section">

                <h3>Tags:</h3>
                <ul>
                  <li v-for="tag in track.tagsInTracks" :key="tag.id">{{ tag.tagName }}</li>
                </ul>

              </div>

              <div v-if="track.moodsInTracks.length" class="moods-section">

                <h3>Moods:</h3>
                <ul>
                  <li v-for="mood in track.moodsInTracks" :key="mood.id">{{ mood.moodName }}</li>
                </ul>

              </div>
            </div>

            <div class="track-actions">

              <button @click="skipTrack">⏭️ Skip</button>

              <button @click="toggleFeedback">💬 Leave Feedback</button>

              <button @click="saveCurrentTrack">💾 Save</button>


              <label class="autoplay-toggle">
                <input type="checkbox" v-model="autoplayNext" />
                Autoplay Next
              </label>

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

              <div v-if="error" class="error-message">
                <p>{{ error }}</p>
              </div>

              <button @click="submitFeedback">Submit</button>

            </div>
          </div>
        </div>


        <div v-else>
          <p v-if="error">{{ error }}</p>
          <p v-else>No track found.</p>
        </div>

      </div>


      <div class="filters">

        <label>Filter by Tags:</label>
        <button @click="addTagFilter">+ Add Tag</button>

        <div v-for="(tag, i) in selectedTagObjects" :key="'tag' + i" class="filter-item">
          <select v-model="tag.tagId">

            <option disabled value="">-- Tag --</option>

            <option v-for="t in allTags" :key="t.id" :value="t.id">
              {{ t.name }}
            </option>

          </select>
          <button @click="selectedTagObjects.splice(i, 1)">❌</button>
        </div>

        <label>Filter by Moods:</label>
        <button @click="addMoodFilter">+ Add Mood</button>

        <div v-for="(mood, i) in selectedMoodObjects" :key="'mood' + i" class="filter-item">
          <select v-model="mood.moodId">

            <option disabled value="">-- Mood --</option>

            <option v-for="m in allMoods" :key="m.id" :value="m.id">
              {{ m.name }}
            </option>

          </select>
          <button @click="selectedMoodObjects.splice(i, 1)">❌</button>
        </div>

        <button @click="applyFilters">🔍 Apply Filters</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Layout wrapper */
.discover-wrapper {
  display: flex;
  justify-content: center;
  color: #e0e0e0;
}

/* Two-column layout */
.track-and-filters {
  display: flex;
  gap: 2rem;
  align-items: center;
}
/* Main content */
.discover-container {
  max-width: 600px;
  flex-shrink: 0;
  text-align: left;
}

.track-card-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  background-size: cover;
  background-position: center;
}

.track-card-wrapper::before {
  content: "";
  position: absolute;
  inset: 0;
  background: inherit;
  filter: blur(1px) brightness(0.6);
  z-index: 0;
}

/* Track card */
.track-card {
  position: relative;
  z-index: 1;
  background-color: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(1px);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

/* Track image */
.cover-image {
  max-width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
  border: 2px solid #4c00ff33;
}


.audio-player {
  width: 100%;
  margin-bottom: 1rem;
}
audio::-webkit-media-controls-panel {
  background-color: #4c00ff;
}

.track-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}
.track-actions button {
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  background: #4c00ff;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}
.track-actions button:hover {
  background: #6d3bff;
  transform: scale(1.03);
}

.artist-link {
  color: #4c00ff;
  text-decoration: none;
  font-weight: 600;
}
.artist-link:hover {
  text-decoration: underline;
}

.tags-moods-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 1rem;
}

.tags-section,
.moods-section {
  flex: 1;
}

.tags-section ul,
.moods-section ul {
  padding-left: 1rem;
}

.feedback-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
  width: 80px;
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

.filters {
  width: 220px;
  background-color: #2c2c2c;
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.95rem;
}

.filters label {
  font-weight: 600;
  color: #ccc;
}

.filters select {
  width: 100%;
  padding: 0.4rem;
  background: #1e1e1e;
  color: white;
  border: 1px solid #555;
  border-radius: 6px;
}

.filters button {
  padding: 0.5rem 0.8rem;
  font-size: 0.9rem;
  background: #4c00ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.filters button:hover {
  background: #6d3bff;
}

.filter-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.autoplay-toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
  color: #ccc;
}

.error-message p {
  color: #ff4d4d;
  font-weight: 500;
}

</style>
