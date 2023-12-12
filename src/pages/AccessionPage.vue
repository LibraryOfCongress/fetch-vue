<template>
  <q-page
    :padding="!$route.params.id"
    class="accession"
  >
    <BreadCrumb v-if="$route.params.id" />

    <AccessionInit v-if="!$route.params.id" />

    <AccessionTrayDisplay v-if="$route.params.id && store.accessionJob.type == 2" />
  </q-page>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useAccessionStore } from 'src/stores/accession-store'
import AccessionInit from '@/components/Accession/AccessionInit.vue'
import AccessionTrayDisplay from '@/components/Accession/AccessionTrayDisplay.vue'
import BreadCrumb from '@/components/BreadCrumb.vue'

const route = useRoute()
const store = useAccessionStore()

onBeforeMount( async () => {
  // if there is an id in the url we need to load that tray/non-tray
  if (route.params.id) {
    await store.getAccessionJob()
  }
})
</script>
