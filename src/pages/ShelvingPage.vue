<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="!route.params.jobId"
    class="shelving"
  >
    <LoadingOverlay />

    <ShelvingDashboard v-if="!route.params.jobId" />

    <ShelvingJob v-if="route.params.jobId" />
  </q-page>
</template>

<script setup>
import { inject, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useShelvingStore } from '@/stores/shelving-store'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ShelvingDashboard from '@/components/Shelving/ShelvingDashboard.vue'
import ShelvingJob from '@/components/Shelving/ShelvingJob.vue'

const route = useRoute()

// Store Data
const { getShelvingJob } = useShelvingStore()

// Logic
const handlePageOffset = inject('handle-page-offset')

onBeforeMount( async () => {
  // if there is an id in the url we need to load that shelving job
  if (route.params.jobId) {
    await getShelvingJob(route.params.jobId)
  }
})
</script>
<style lang="scss" scoped>
</style>
