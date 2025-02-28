<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="!route.params.jobId"
    class="request"
  >
    <LoadingOverlay />
    <template v-if="!pageInitLoading">
      <RefileDashboard v-if="!route.params.jobId" />
      <RefileJobDetails v-if="route.params.jobId" />
    </template>
  </q-page>
</template>

<script setup>
import { inject, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRefileStore } from '@/stores/refile-store'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import RefileDashboard from '@/components/Refile/RefileDashboard.vue'
import RefileJobDetails from '@/components/Refile/RefileJobDetails.vue'

const route = useRoute()

// Store Data
const { getRefileJob } = useRefileStore()
const { getOptions } = useOptionStore()
const { pageInitLoading } = storeToRefs(useGlobalStore())

// Logic
const handlePageOffset = inject('handle-page-offset')

onMounted( async () => {
  pageInitLoading.value = true
  // load any options info that will be needed on the refile page
  await Promise.all([
    getOptions('mediaTypes'),
    getOptions('users'),
    getOptions('owners'),
    getOptions('sizeClass')
  ])

  // if there is an id in the url we need to load that refile job
  if (route.params.jobId) {
    await getRefileJob(route.params.jobId)
  }
  pageInitLoading.value = false
})
</script>

<style lang="scss" scoped>
</style>
