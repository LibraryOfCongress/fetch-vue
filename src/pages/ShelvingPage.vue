<template>
  <q-page
    :style-fn="handlePageOffset"
    padding
    class="shelving"
  >
    <LoadingOverlay />

    <ShelvingDashboard />
  </q-page>
</template>

<script setup>
import { inject } from 'vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ShelvingDashboard from '@/components/Shelving/ShelvingDashboard.vue'

// Logic
const handlePageOffset = inject('handle-page-offset')
</script>
<style lang="scss" scoped>
</style>
