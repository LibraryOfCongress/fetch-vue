<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="!route.params.jobId"
    class="request"
  >
    <LoadingOverlay />

    <RefileDashboard v-if="!route.params.jobId" />
    <RefileJobDetails v-if="route.params.jobId" />
  </q-page>
</template>

<script setup>
import { inject, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useRefileStore } from '@/stores/refile-store'
import { useOptionStore } from '@/stores/option-store'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import RefileDashboard from '@/components/Refile/RefileDashboard.vue'
import RefileJobDetails from '@/components/Refile/RefileJobDetails.vue'

const route = useRoute()

// Store Data
const { getRefileJob } = useRefileStore()
const { getOptions } = useOptionStore()

// Logic
const handlePageOffset = inject('handle-page-offset')

onBeforeMount( async () => {
  // load any options info that will be needed on the refile page
  await Promise.all([getOptions('users')])

  // if there is an id in the url we need to load that refile job
  if (route.params.jobId) {
    await getRefileJob(route.params.jobId)
  }
})
</script>

<style lang="scss" scoped>
</style>
