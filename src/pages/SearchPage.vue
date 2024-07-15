<template>
  <q-page
    :style-fn="handlePageOffset"
    padding
    class="search"
  >
    <LoadingOverlay />

    <SearchAdvancedResults />
  </q-page>
</template>

<script setup>
import { inject, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore } from '@/stores/search-store'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import SearchAdvancedResults from '@/components/Search/SearchAdvancedResults.vue'

const route = useRoute()

// Store Data
const { getSearchResults } = useSearchStore()

// Logic
const handlePageOffset = inject('handle-page-offset')

onBeforeMount( async () => {
  // if there is a query in the route make sure to get searh results for that query
  if (route.params.query) {
    await getSearchResults(route.params.query, route.params.searchType)
  }
})
</script>

<style lang="scss" scoped>
</style>
