<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="!route.params.jobId"
    class="verification column no-wrap"
  >
    <LoadingOverlay />

    <template v-if="!pageInitLoading">
      <VerificationDashboard v-if="!route.params.jobId" />
      <VerificationContainerDisplay
        v-if="route.params.jobId"
        ref="verificationContainerComponent"
      />
    </template>
  </q-page>
</template>

<script setup>
import { onBeforeMount, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useVerificationStore } from 'src/stores/verification-store'
import { useGlobalStore } from '@/stores/global-store'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import VerificationDashboard from '@/components/Verification/VerificationDashboard.vue'
import VerificationContainerDisplay from '@/components/Verification/VerificationContainerDisplay.vue'

const route = useRoute()

// Store Data
const {
  getVerificationJob,
  getVerificationTray,
  getVerificationNonTrayItem
} = useVerificationStore()
const { verificationJob } = storeToRefs(useVerificationStore())
const { pageInitLoading } = storeToRefs(useGlobalStore())

// Logic
const handlePageOffset = inject('handle-page-offset')

onBeforeMount(() => {
  pageInitLoading.value = true
})

onMounted( async () => {
  // if there is an id in the url we need to load that job
  if (route.params.jobId) {
    await getVerificationJob(route.params.jobId)
  }

  if (route.params.containerId) {
    if (verificationJob.value.trayed) {
      await getVerificationTray(route.params.containerId)
    } else {
      await getVerificationNonTrayItem(route.params.containerId)
    }
  }
  pageInitLoading.value = false
})
</script>
