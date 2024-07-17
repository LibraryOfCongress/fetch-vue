<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="route.name !== 'request-batch'"
    class="request"
  >
    <LoadingOverlay />

    <RequestDashboard v-if="route.name == 'request'" />
    <RequestBatchJobDetails v-if="route.name == 'request-batch'" />
  </q-page>
</template>

<script setup>
import { inject, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useRequestStore } from '@/stores/request-store'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import RequestDashboard from '@/components/Request/RequestDashboard.vue'
import RequestBatchJobDetails from '@/components/Request/RequestBatchJobDetails.vue'

const route = useRoute()

// Store Data
const { getRequestBatchJob } = useRequestStore()

// Logic
const handlePageOffset = inject('handle-page-offset')

onBeforeMount( async () => {
  // if there is an id in the url we need to load that request job (batch requests only)
  if (route.name == 'request-batch') {
    await getRequestBatchJob(route.params.jobId)
  }
})
</script>

<style lang="scss" scoped>
</style>
