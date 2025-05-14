// stores/userDataStore.ts
import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useUserDataStore = defineStore('userData', () => {
  const jwt = ref(localStorage.getItem('jwt') || '');
  const refreshToken = ref(localStorage.getItem('refreshToken') || '');

  // Sync changes to localStorage
  watch(jwt, (newVal) => {
    if (newVal) localStorage.setItem('jwt', newVal);
    else localStorage.removeItem('jwt');
  });

  watch(refreshToken, (newVal) => {
    if (newVal) localStorage.setItem('refreshToken', newVal);
    else localStorage.removeItem('refreshToken');
  });

  function clearTokens() {
    jwt.value = '';
    refreshToken.value = '';
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
  }

  return { jwt, refreshToken, clearTokens }
});
