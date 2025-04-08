<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="!route.params.jobId"
    class="accession column no-wrap"
  >
    <LoadingOverlay />

    <template v-if="!pageInitLoading">
      <AccessionDashboard v-if="!route.params.jobId" />
      <AccessionContainerDisplay v-if="route.params.jobId" />
    </template>
  </q-page>
</template>

<script setup>
import { onBeforeMount, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccessionStore } from 'src/stores/accession-store'
import { useGlobalStore } from '@/stores/global-store'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import AccessionDashboard from '@/components/Accession/AccessionDashboard.vue'
import AccessionContainerDisplay from '@/components/Accession/AccessionContainerDisplay.vue'

const route = useRoute()
const router = useRouter()

// Store Data
const {
  getAccessionJob,
  getAccessionTray,
  getAccessionNonTrayItem
} = useAccessionStore()
const { accessionJob } = storeToRefs(useAccessionStore())
const { pageInitLoading } = storeToRefs(useGlobalStore())

// Logic
const handlePageOffset = inject('handle-page-offset')
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  pageInitLoading.value = true
})

onMounted( async () => {
  if (route.params.jobId) {
    await getAccessionJob(route.params.jobId)
  }

  if (route.params.containerId) {
    if (accessionJob.value.trayed) {
      await getAccessionTray(route.params.containerId).catch(error => {
        handleAlert({
          type: 'error',
          text: error,
          autoClose: true
        })
        router.push({
          name: 'accession',
          params: {
            jobId: route.params.jobId
          }
        })
      })
    } else {
      await getAccessionNonTrayItem(route.params.containerId).catch(error => {
        handleAlert({
          type: 'error',
          text: error,
          autoClose: true
        })
        router.push({
          name: 'accession',
          params: {
            jobId: route.params.jobId
          }
        })
      })
    }
  }
  pageInitLoading.value = false
})
</script>
