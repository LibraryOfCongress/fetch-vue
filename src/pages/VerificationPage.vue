<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="!route.params.jobId"
    class="verification column no-wrap"
  >
    <VerificationInit v-if="!route.params.jobId" />

    <VerificationContainerDisplay
      v-if="route.params.jobId"
      ref="verificationContainerComponent"
    />
  </q-page>
</template>

<script setup>
import { onBeforeMount, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useVerificationStore } from 'src/stores/verification-store'
import VerificationInit from '@/components/Verification/VerificationInit.vue'
import VerificationContainerDisplay from '@/components/Verification/VerificationContainerDisplay.vue'

const route = useRoute()

// Store Data
const { getVerificationJob, getVerificationTray } = useVerificationStore()

// Logic
const handlePageOffset = inject('handle-page-offset')

onBeforeMount( async () => {
  // if there is an id in the url we need to load that job
  if (route.params.jobId) {
    await getVerificationJob(route.params.jobId)
  }

  if (route.params.containerId) {
    await getVerificationTray(route.params.containerId)
  }
})
</script>
