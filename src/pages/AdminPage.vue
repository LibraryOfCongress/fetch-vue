<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="!route.params.buildingId"
    class="admin-page column no-wrap"
  >
    <AdminBuildingDisplay v-if="!route.params.buildingId" />

    <AdminBuildingDetails v-if="route.params.buildingId" />
  </q-page>
</template>

<script setup>
import { onBeforeMount, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useBuildingStore } from '@/stores/building-store'
import AdminBuildingDisplay from '@/components/Admin/AdminBuildingDisplay.vue'
import AdminBuildingDetails from '@/components/Admin/AdminBuildingDetails.vue'

const route = useRoute()

// Store Data
const { getBuildingsList, getBuildingDetails } = useBuildingStore()

// Logic
const handlePageOffset = inject('handle-page-offset')

onBeforeMount( async () => {
  // if there is an id in the url we need to load that specific building
  if (route.params.buildingId) {
    await getBuildingDetails(route.params.buildingId)
  } else {
    await getBuildingsList()
  }
})
</script>