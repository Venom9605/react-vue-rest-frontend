<script setup lang="ts">
import { ref } from 'vue'
import { useUserDataStore } from '@/stores/userDataStore'
import { IdentityService } from '@/services/IdentityService'
import { useRouter } from 'vue-router'
import '@/assets/formStyles.css'
import { watch } from 'vue'
import { ArtistUploadService } from '@/services/ArtistService'


const router = useRouter()
const store = useUserDataStore()

const error = ref<string | null>(null);
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const confirmPasswordEl = ref<HTMLInputElement | null>(null);

const username = ref('')
const bio = ref('')
const profilePicture = ref('')



watch([password, confirmPassword], () => {
  if (confirmPasswordEl.value) {
    confirmPasswordEl.value.setCustomValidity(
      password.value === confirmPassword.value ? '' : 'Passwords do not match'
    );
  }
});

const doRegister = async () => {
    const response = await IdentityService.register(
        email.value, password.value, username.value, profilePicture.value, bio.value);

  console.log(response);

  if (response.data) {
    store.jwt = response.data.jwt;
    store.refreshToken = response.data.refreshToken;

    router.push({ name: 'Home' });
  } else {
    error.value = response.errors?.[0] || 'Register failed. Please try again.';
  }
}

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

</script>

<template>
  <main role="main" class="pb-3">
    <div class="form-container">

        <h1>Register</h1>

        <div class="error">
          {{ error }}
        </div>

        <section>
          <form @submit.prevent="doRegister" id="account" method="post">

            <div class="form-group">
              <label class="form-label" for="Input_Email">Email</label>
              <input v-model="email" class="form-control" autocomplete="username" aria-required="true"
                placeholder="name@example.com" type="email">
            </div>

            <div class="form-group">
              <label class="form-label" for="Input_Password">Password</label>
              <input v-model="password" class="form-control" autocomplete="current-password" aria-required="true"
                placeholder="password" type="password">
            </div>

            <div class="form-group">
              <label class="form-label" for="Input_ConfirmPassword">Confirm password</label>
              <input ref="confirmPasswordEl" v-model="confirmPassword" class="form-control" autocomplete="new-password" aria-required="true"
                placeholder="Confirm password" type="password" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="Input_Username">Username</label>
              <input v-model="username" class="form-control" autocomplete="username" aria-required="true"
                placeholder="username" type="username">
            </div>

            <div class="form-group">
              <label class="form-label" for="Input_Bio">Bio</label>
              <input v-model="bio" class="form-control" autocomplete="bio" aria-required="true"
                placeholder="bio" type="bio">
            </div>

            <div class="form-group">
              <label class="form-label" for="Input_ProfilePicture">Profile Cover</label>
              <input type="file" @change="handleProfileUpload" accept="image/*" class="form-control" />
            </div>


            <div>
              <button id="login-submit" type="submit" class="button">Register</button>
            </div>

          </form>
        </section>

    </div>

  </main>
</template>
