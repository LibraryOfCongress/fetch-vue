<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="!route.params.jobId"
    class="accession column no-wrap"
  >
    <AccessionInit v-if="!route.params.jobId" />

    <AccessionContainerDisplay v-if="route.params.jobId" />
  </q-page>
</template>

<script setup>
import { onBeforeMount, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useAccessionStore } from 'src/stores/accession-store'
import { useOptionStore } from '@/stores/option-store'
import AccessionInit from '@/components/Accession/AccessionInit.vue'
import AccessionContainerDisplay from '@/components/Accession/AccessionContainerDisplay.vue'

const route = useRoute()

// Store Data
const {
  getAccessionJob,
  getAccessionTray
} = useAccessionStore()
const { getOptions } = useOptionStore()

// Logic
const handlePageOffset = inject('handle-page-offset')

onBeforeMount( async () => {
  // if there is an id in the url we need to load that tray/non-tray and its option related data
  if (route.params.jobId) {
    await Promise.all([
      getAccessionJob(route.params.jobId),
      getOptions('owners'),
      getOptions('sizeClass'),
      getOptions('mediaTypes')
    ])
  }

  if (route.params.containerId) {
    await getAccessionTray(route.params.containerId)
  }
})
</script>
