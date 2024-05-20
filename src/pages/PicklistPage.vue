<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="!route.params.jobId"
    class="picklist"
  >
    <LoadingOverlay />

    <PicklistDashboard v-if="!route.params.jobId" />
    <PicklistDetails v-else-if="route.params.jobId" />
  </q-page>
</template>

<script setup>
import { inject, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { usePicklistStore } from '@/stores/picklist-store'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import PicklistDashboard from '@/components/Picklist/PicklistDashboard.vue'
import PicklistDetails from '@/components/Picklist/PicklistDetails.vue'

const route = useRoute()

// Store Data
const { getPicklistJob } = usePicklistStore()

// Logic
const handlePageOffset = inject('handle-page-offset')

onBeforeMount( async () => {
  // if there is an id in the url we need to load that picklist job
  if (route.params.jobId) {
    await getPicklistJob(route.params.jobId)
  }
})
</script>

<style lang="scss" scoped>
</style>
