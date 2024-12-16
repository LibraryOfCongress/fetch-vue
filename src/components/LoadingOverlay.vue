<template>
  <div
    v-if="appIsLoadingData || testLoading"
    class="overlay"
  >
    <q-spinner-bars
      color="primary"
      size="2rem"
      class="overlay-loading"
    />
  </div>
</template>

<script setup>
import { useGlobalStore } from '@/stores/global-store'
import { storeToRefs } from 'pinia'
// Props
defineProps({
  // used for unit test
  testLoading: {
    type: Boolean,
    default: false
  }
})
// Store Data
const { appIsLoadingData } = storeToRefs(useGlobalStore())
</script>