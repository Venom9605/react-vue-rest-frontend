<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { TrackService } from '../services/TrackService';
import type { IResultObject } from '../types/IResultObject';
import type { ITrack } from '../domain/ITracks';
import { useUserDataStore } from '@/stores/userDataStore';

const store = useUserDataStore();
const requestIsOngoing = ref(false);
const data = reactive<IResultObject<ITrack[]>>({});
const service = new TrackService();

const fetchPageData = async () => {
  requestIsOngoing.value = true;
  try {
    const result = await service.getAllAsync(store.jwt)
    console.log(result.data);

    data.data = result.data;
    data.errors = result.errors;

  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    requestIsOngoing.value = false;
  }

};

onMounted(async () => {
  await fetchPageData();
});

</script>

<template>
  <div>Request is {{ requestIsOngoing == true ? 'ongoing' : 'done' }}</div>
  <div class="button-container">
    <RouterLink to="/tracks/create" class="button">Create new</RouterLink>
  </div>
  <div v-if="data.data">
    <table>
      <tr v-for="item, key in data.data" :key="key">
        <td>{{ item.title }}</td>
        <td>{{ item.uploaded }}</td>
        <td>{{ item.duration }}</td>
        <td>{{ item.timesPlayed }}</td>
        <td>{{ item.timesSaved }}</td>
      </tr>
    </table>
  </div>
</template>




<style scoped>

.button-container {

    margin-bottom: 20px;
    margin-top: 20px;
}

</style>
