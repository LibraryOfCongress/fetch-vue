<template>
  <q-page
    :style-fn="handlePageOffset"
    padding
    class="request"
  >
    <LoadingOverlay />

    <RequestDashboard v-if="route.name == 'request'" />
  </q-page>
</template>

<script setup>
import { inject } from 'vue'
import { useRoute } from 'vue-router'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import RequestDashboard from '@/components/Request/RequestDashboard.vue'

const route = useRoute()

// Logic
const handlePageOffset = inject('handle-page-offset')

</script>

<style lang="scss" scoped>
</style>
