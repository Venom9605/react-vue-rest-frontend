<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { TrackGetAllService } from '../services/TrackService';
import type { IResultObject } from '../types/IResultObject';
import type { ITrack } from '../domain/ITracks';
import { useUserDataStore } from '@/stores/userDataStore';

const store = useUserDataStore();
const requestIsOngoing = ref(false);
const data = reactive<IResultObject<ITrack[]>>({});
const service = new TrackGetAllService();

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
      <thead>
        <tr>
          <th>Title</th>
          <th>Cover</th>
          <th>FilePath</th>
          <th>Uploaded</th>
          <th>Duration</th>
          <th>Times Played</th>
          <th>Times Saved</th>
        </tr>
      </thead>
      <tr v-for="item, key in data.data" :key="key">
        <td>{{ item.title }}</td>
        <td>{{ item.coverPath }}</td>
        <td>{{ item.filePath }}</td>
        <td>{{ item.uploaded }}</td>
        <td>{{ item.duration }}</td>
        <td>{{ item.timesPlayed }}</td>
        <td>{{ item.timesSaved }}</td>
        <td>
          <RouterLink :to="`/tracks/edit/${item.id}`" class="btn-edit">Edit</RouterLink>
          <RouterLink :to="`/tracks/delete/${item.id}`" class="btn-del">Delete</RouterLink>
        </td>
      </tr>
    </table>
  </div>
</template>




<style scoped>

.button-container {

    margin-bottom: 20px;
    margin-top: 20px;
}

.btn-edit {
  margin-right: 20px;
}

.btn-del {
  margin-left: 20px;
}


table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  font-size: 16px;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px 16px;
  text-align: left;
}

thead {
  background-color: #f2f2f2;
}

th {
  font-weight: bold;
}

tr:hover {
  background-color: #f9f9f9;
}

td {
  vertical-align: middle;
}
</style>
