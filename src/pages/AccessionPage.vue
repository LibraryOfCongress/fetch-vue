<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="!route.params.jobId"
    class="accession column no-wrap"
  >
    <LoadingOverlay />

    <AccessionDashboard v-if="!route.params.jobId" />

    <AccessionContainerDisplay v-if="route.params.jobId" />
  </q-page>
</template>

<script setup>
import { onBeforeMount, inject } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccessionStore } from 'src/stores/accession-store'
import { useOptionStore } from '@/stores/option-store'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import AccessionDashboard from '@/components/Accession/AccessionDashboard.vue'
import AccessionContainerDisplay from '@/components/Accession/AccessionContainerDisplay.vue'

const route = useRoute()

// Store Data
const {
  getAccessionJob,
  getAccessionTray,
  getAccessionNonTrayItem
} = useAccessionStore()
const { accessionJob } = storeToRefs(useAccessionStore())
const { getOptions } = useOptionStore()

// Logic
const handlePageOffset = inject('handle-page-offset')

onBeforeMount( async () => {
  // load any options info that will be needed in accession
  await Promise.all([
    getOptions('owners'),
    getOptions('sizeClass'),
    getOptions('mediaTypes')
  ])

  if (route.params.jobId) {
    await getAccessionJob(route.params.jobId)
  }

  if (route.params.containerId) {
    if (accessionJob.value.trayed) {
      await getAccessionTray(route.params.containerId)
    } else {
      await getAccessionNonTrayItem(route.params.containerId)
    }
  }
})
</script>
