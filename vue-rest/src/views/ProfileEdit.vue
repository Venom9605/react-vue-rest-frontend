<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserDataStore } from '@/stores/userDataStore';
import { ArtistService, ArtistUploadService } from '@/services/ArtistService';
import type { ArtistEditDto } from '@/types/ArtistEditDto';

const store = useUserDataStore();
const router = useRouter();

const displayName = ref('');
const bio = ref('');
const profilePicture = ref('');
const error = ref<string | null>(null);

onMounted(async () => {
  const result = await ArtistService.getUserInfo(store.jwt);
  if (result.data) {
    displayName.value = result.data.displayName;
    bio.value = result.data.bio || '';
    profilePicture.value = result.data.profilePicture || '';
  } else {
    error.value = result.errors?.[0] || 'Failed to load user info';
  }
});

const handleProfileUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement)?.files?.[0];
  if (!file) return;

  const result = await ArtistUploadService.uploadProfilePicture(file);
  if (result.data) {
    profilePicture.value = result.data.path;
  } else {
    console.error("Upload failed:", result.errors?.[0]);
  }
};

const submit = async () => {
  const dto: ArtistEditDto = {
    displayName: displayName.value,
    bio: bio.value,
    profilePicture: profilePicture.value,
  };

  const result = await ArtistService.editProfile(dto, store.jwt);
  if (!result.errors) {
    router.push('/profile');
  } else {
    error.value = result.errors[0];
  }
};
</script>

<template>
  <div class="profile-edit">
    <h1>Edit Profile</h1>
    <div v-if="error" class="error">{{ error }}</div>

    <form @submit.prevent="submit">
      <label>Display Name</label>
      <input v-model="displayName" required />

      <label>Bio</label>
      <textarea v-model="bio" />

      <label>Upload New Profile Picture</label>
      <input type="file" @change="handleProfileUpload" accept="image/*" />
      <p v-if="profilePicture">Stored path: {{ profilePicture }}</p>
      <img v-if="profilePicture" :src="`http://localhost:5081/${profilePicture}`" class="preview-img" />

      <button type="submit">Save</button>
    </form>
  </div>
</template>

<style scoped>
.profile-edit {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 70px;
}
.error {
  color: red;
  margin-bottom: 1rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
input, textarea {
  padding: 0.5rem;
}
button {
  padding: 0.6rem;
}
.preview-img {
  max-width: 100px;
  margin-top: 0.5rem;
  border-radius: 5px;
}
</style>
