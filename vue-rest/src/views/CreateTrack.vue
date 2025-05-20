<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useUserDataStore } from '@/stores/userDataStore';
import { TrackCreateService } from '@/services/TrackService';
import { ArtistRoleGetAllService } from '@/services/ArtistRoleService';
import { TagGetAllService } from '@/services/TagService';
import { MoodGetAllService } from '@/services/MoodService';
import { LinkTypeGetAllService } from '@/services/LinkTypeService';
import { TrackUploadService } from '@/services/TrackService';
import type { TrackCreateDto } from '@/types/TrackCreateDto';
import router from '@/router';
import { BASE_URL } from '@/config';

const artistRoleService = new ArtistRoleGetAllService();
const tagService = new TagGetAllService();
const moodService = new MoodGetAllService();
const linkTypeService = new LinkTypeGetAllService();
const trackService = new TrackCreateService();

const store = useUserDataStore();

const artistRoles = ref<{ id: string; name: string }[]>([]);
const tags = ref<{ id: string; name: string }[]>([]);
const moods = ref<{ id: string; name: string }[]>([]);
const linkTypes = ref<{ id: string; name: string }[]>([]);

const errors = ref<string[]>([]);
const validated = ref(false);

const uploadingAudio = ref(false);
const uploadingCover = ref(false);

const track = reactive<TrackCreateDto>({
  title: '',
  filePath: '',
  coverPath: '',
  artistRoleId: '',
  collaborators: [],
  tagsInTracks: [],
  moodsInTracks: [],
  trackLinks: []
});

const fetchReferenceData = async () => {
  const [roles, tagsData, moodsData, linkData] = await Promise.all([
    artistRoleService.getAllAsync(store.jwt),
    tagService.getAllAsync(store.jwt),
    moodService.getAllAsync(store.jwt),
    linkTypeService.getAllAsync(store.jwt)
  ]);

  artistRoles.value = roles.data ?? [];
  tags.value = tagsData.data ?? [];
  moods.value = moodsData.data ?? [];
  linkTypes.value = linkData.data ?? [];
};

onMounted(fetchReferenceData);

const addCollaborator = () => {
  track.collaborators.push({ email: '', artistRoleId: '' });
};

const addTag = () => {
  track.tagsInTracks.push({ tagId: '' });
};

const addMood = () => {
  track.moodsInTracks.push({ moodId: '' });
};

const addTrackLink = () => {
  track.trackLinks.push({ linkTypeId: '', url: '' });
};

const validate = () => {
  errors.value = [];

  if (!track.title.trim()) errors.value.push("Title is required.");
  if (!track.filePath.trim()) errors.value.push("File path is required.");
  if (!track.coverPath.trim()) errors.value.push("Cover path is required.");
  if (!track.artistRoleId) errors.value.push("Your artist role must be selected.");

  for (const [i, c] of track.collaborators.entries()) {
    if (!c.email.trim()) errors.value.push(`Collaborator ${i + 1} is missing an email.`);
    if (!c.artistRoleId) errors.value.push(`Collaborator ${i + 1} is missing a role.`);
  }

  for (const [i, t] of track.tagsInTracks.entries()) {
    if (!t.tagId) errors.value.push(`Tag ${i + 1} is not selected.`);
  }

  for (const [i, m] of track.moodsInTracks.entries()) {
    if (!m.moodId) errors.value.push(`Mood ${i + 1} is not selected.`);
  }

  for (const [i, l] of track.trackLinks.entries()) {
    if (!l.linkTypeId || !l.url.trim()) errors.value.push(`Track link ${i + 1} is incomplete.`);
  }

  return errors.value.length === 0;
};

const submit = async () => {
  validated.value = true;

  if (uploadingCover.value) {
    errors.value.push("Please wait for the cover image to finish uploading.");
    return;
  }

  if (!validate()) {
    console.warn("Validation failed:", errors.value);
    return;
  }

  const result = await trackService.addAsync(track);
  console.log(result);

  router.push('/profile/tracks');
};


const coverPreviewUrl = ref<string | null>(null);

const handleCoverUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement)?.files?.[0];
  if (!file) return;

  uploadingCover.value = true;

  const result = await TrackUploadService.uploadCover(file);
  if (result.data) {
    track.coverPath = result.data.path;
  } else {
    console.error("Upload failed:", result.errors?.[0]);
  }

  uploadingCover.value = false;
};


const handleTrackUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement)?.files?.[0];
  if (!file) return;

  const result = await TrackUploadService.uploadAudio(file);
  if (result.data) {
    track.filePath = result.data.path;
  } else {
    console.error("Audio upload failed:", result.errors?.[0]);
  }
};
</script>

<template>
    <div class="create-track-form">
      <h1>Create Track</h1>

      <label>Title:</label>
      <input v-model="track.title" placeholder="Track title" />

      <label>Upload Track File:</label>
      <input type="file" @change="handleTrackUpload" accept="audio/*" />

      <audio
        v-if="track.filePath"
        :src="`${BASE_URL}${track.filePath}`"
        controls
        class="audio-preview"
        />

      <label>Upload Cover Image:</label>
      <input type="file" @change="handleCoverUpload" accept="image/*" />

      <img
        v-if="track.coverPath"
        :src="`${BASE_URL}${track.coverPath}`"
        alt="Cover preview"
        style="max-width: 100%; border-radius: 8px; margin-top: 1rem"
      />

      <label>Your Role:</label>
      <select v-model="track.artistRoleId">
        <option disabled value="">-- Select your role --</option>
        <option v-for="role in artistRoles" :key="role.id" :value="role.id">{{ role.name }}</option>
      </select>

      <h3>Collaborators</h3>
      <button @click="addCollaborator">+ Add Collaborator</button>
      <div v-for="(c, i) in track.collaborators" :key="i">
        <input v-model="c.email" placeholder="Collaborator email" />
        <select v-model="c.artistRoleId">
          <option disabled value="">-- Role --</option>
          <option v-for="role in artistRoles" :key="role.id" :value="role.id">{{ role.name }}</option>
        </select>
          <button @click="track.collaborators.splice(i, 1)">❌</button>
      </div>

      <h3>Tags</h3>
      <button @click="addTag">+ Add Tag</button>
      <div v-for="(tag, i) in track.tagsInTracks" :key="i">
        <select v-model="tag.tagId">
          <option disabled value="">-- Tag --</option>
          <option v-for="t in tags" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
        <button @click="track.tagsInTracks.splice(i, 1)">❌</button>
      </div>

      <h3>Moods</h3>
      <button @click="addMood">+ Add Mood</button>
      <div v-for="(mood, i) in track.moodsInTracks" :key="i">
        <select v-model="mood.moodId">
          <option disabled value="">-- Mood --</option>
          <option v-for="m in moods" :key="m.id" :value="m.id">{{ m.name }}</option>
        </select>
          <button @click="track.moodsInTracks.splice(i, 1)">❌</button>
      </div>

      <h3>Track Links</h3>
      <button @click="addTrackLink">+ Add Link</button>
      <div v-for="(link, i) in track.trackLinks" :key="i">
        <select v-model="link.linkTypeId">
          <option disabled value="">-- Link Type --</option>
          <option v-for="lt in linkTypes" :key="lt.id" :value="lt.id">{{ lt.name }}</option>
        </select>
        <input v-model="link.url" />
        <button @click="track.trackLinks.splice(i, 1)">❌</button>
      </div>

        <div v-if="validated && errors.length" class="error-box">
        <ul>
            <li v-for="(e, i) in errors" :key="i">{{ e }}</li>
        </ul>
        </div>

      <br />
      <button @click="submit">Submit Track</button>
    </div>
</template>


<style scoped>
.create-track-form {
  max-width: 700px;
  margin: 0 auto;
  padding-top: 80px;
  padding-inline: 1rem;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

h1 {
  font-size: 2rem;
  color: #ffffff;
  border-bottom: 2px solid #4c00ff;
  padding-bottom: 0.3rem;
  margin-bottom: 1.2rem;
}

h3 {
  color: #cccccc;
  margin-bottom: 0.3rem;
}

label {
  font-weight: 500;
  color: #cccccc;
  margin-bottom: 0.3rem;
}

input,
select {
  width: 100%;
  padding: 0.6rem;
  background-color: #2c2c2c;
  color: #ffffff;
  border: 1px solid #555;
  border-radius: 6px;
  font-size: 1rem;
}

input::placeholder {
  color: #888;
}

input[type="file"] {
  border: none;
  padding: 0;
  background: none;
}

.audio-preview {
  width: 100%;
  margin-top: 1rem;
}

img {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 1rem;
  border: 2px solid #4c00ff33;
}

button {
  background-color: #4c00ff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  width: fit-content;
}

button:hover {
  background-color: #6d3bff;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-box {
  background-color: #2c0000;
  border: 1px solid #a00;
  color: #ff5a5a;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
}

.error-box ul {
  padding-left: 1.2rem;
  margin: 0;
}

.create-track-form > div {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

</style>
