<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="!route.params.jobId"
    class="shelving"
  >
    <LoadingOverlay />

    <ShelvingDashboard v-if="route.name == 'shelving' && !route.params.jobId" />
    <ShelvingJobDetails v-else-if="route.name == 'shelving' && route.params.jobId" />
    <ShelvingJobDirectToShelf v-else-if="route.name == 'shelving-dts'" />
  </q-page>
</template>

<script setup>
import { inject, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useShelvingStore } from '@/stores/shelving-store'
import { useOptionStore } from '@/stores/option-store'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ShelvingDashboard from '@/components/Shelving/ShelvingDashboard.vue'
import ShelvingJobDetails from '@/components/Shelving/ShelvingJobDetails.vue'
import ShelvingJobDirectToShelf from '@/components/Shelving/ShelvingJobDirectToShelf.vue'

const route = useRoute()

// Store Data
const { getShelvingJob } = useShelvingStore()
const { getOptions } = useOptionStore()

// Logic
const handlePageOffset = inject('handle-page-offset')

onBeforeMount( async () => {
  // load any options info that will be needed in accession
  await Promise.all([
    getOptions('owners'),
    getOptions('sizeClass'),
    getOptions('buildings')
  ])

  // if there is an id in the url we need to load that shelving job
  if (route.params.jobId) {
    await getShelvingJob(route.params.jobId)
  }
})
</script>
<style lang="scss" scoped>
</style>
