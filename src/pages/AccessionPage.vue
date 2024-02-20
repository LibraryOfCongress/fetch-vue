<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="!route.params.jobId"
    class="accession column no-wrap"
  >
    <AccessionInit v-if="!route.params.jobId" />

    <AccessionContainerDisplay v-if="route.params.jobId && store.accessionJob.type !== null" />
  </q-page>
</template>

<script setup>
import { onBeforeMount, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useAccessionStore } from 'src/stores/accession-store'
import AccessionInit from '@/components/Accession/AccessionInit.vue'
import AccessionContainerDisplay from '@/components/Accession/AccessionContainerDisplay.vue'

const route = useRoute()
const store = useAccessionStore()

// Logic
const handlePageOffset = inject('handle-page-offset')

onBeforeMount( async () => {
  // if there is an id in the url we need to load that tray/non-tray
  if (route.params.jobId) {
    await store.getAccessionJob(route.params.jobId)
  }

  if (route.params.containerId) {
    await store.getAccessionTray(route.params.containerId)
  }
})
</script>
