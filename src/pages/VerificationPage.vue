<template>
  <q-page
    :padding="!$route.params.jobId"
    class="verification column no-wrap"
  >
    <BreadCrumb v-if="$route.params.jobId" />

    <VerificationInit v-if="!$route.params.jobId" />
  </q-page>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useVerificationStore } from 'src/stores/verification-store'
import BreadCrumb from '@/components/BreadCrumb.vue'
import VerificationInit from '@/components/Verification/VerificationInit.vue'

const route = useRoute()
const store = useVerificationStore()

onBeforeMount( async () => {
  // if there is an id in the url we need to load that job
  if (route.params.jobId) {
    await store.getVerificationJob(route.params.jobId)
  }
})
</script>
