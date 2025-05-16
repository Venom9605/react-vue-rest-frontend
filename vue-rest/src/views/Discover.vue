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

        <div v-else-if="track">
          <div class="track-card">
            <h2>{{ track.title }}</h2>

            <img 
              :src="`${BASE_URL}${track.coverPath}`" 
              alt="Track cover" 
              class="cover-image" 
            />

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

            <div v-if="track.tagsInTracks.length">
              <h3>Tags:</h3>
              <ul>
                <li v-for="tag in track.tagsInTracks" :key="tag.id">

                  {{ tag.tagName }}

                </li>
              </ul>
            </div>

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
  padding-top: 70px;
}

/* Two-column layout */
.track-and-filters {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* Main content center */
.discover-container {
  max-width: 600px;
  flex-shrink: 0;
  text-align: left;
}

/* Track card */
.track-card {
  background: #f8f8f8;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(77, 26, 26, 0.1);
  margin-top: 2rem;
}

/* Track image */
.cover-image {
  max-width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* Audio player */
.audio-player {
  width: 100%;
  margin-bottom: 1rem;
}
audio::-webkit-media-controls-panel {
  background-color: #9e5e5e;
}

/* Action buttons */
.track-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.track-actions button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  flex-wrap: wrap;
}

/* Artist links */
.artist-link {
  color: #0055aa;
  text-decoration: none;
  font-weight: bold;
}
.artist-link:hover {
  text-decoration: underline;
}

/* Feedback */
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

/* Sidebar filters */
.filters {
  width: 220px;
  background-color: #f3f3f3;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.filters select {
  width: 100%;
  padding: 0.4rem;
}

.filters button {
  padding: 0.4rem 0.6rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.filter-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.autoplay-toggle {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.95rem;
}
</style>