<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="route.name == 'admin-home'"
    class="admin-page column no-wrap"
  >
    <AdminDashboard v-if="route.name == 'admin-home'" />

    <AdminBuildingDisplay v-if="route.name == 'admin-building-view' && !route.params.buildingId" />
    <AdminBuildingDetails v-if="route.name == 'admin-building-view' && route.params.buildingId" />

    <AdminGroups v-if="route.name == 'admin-groups'" />
  </q-page>
</template>

<script setup>
import { onBeforeMount, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useBuildingStore } from '@/stores/building-store'
import AdminDashboard from '@/components/Admin/AdminDashboard.vue'
import AdminBuildingDisplay from '@/components/Admin/AdminBuildingDisplay.vue'
import AdminBuildingDetails from '@/components/Admin/AdminBuildingDetails.vue'
import AdminGroups from '@/components/Admin/AdminGroups.vue'

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