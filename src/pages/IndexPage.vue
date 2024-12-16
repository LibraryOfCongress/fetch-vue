<template>
  <q-page
    :style-fn="handlePageOffset"
    padding
    class="flex flex-center column"
  >
    <h1>Scanned Bar Codes</h1>
    <ul class="demo">
      <li v-if="testData.length == 0">
        No barcodes found...
      </li>
      <li
        v-for="(barcode, i) in testData"
        :key="i"
      >
        {{ barcode }}
      </li>
    </ul>
    <h2 class="text-body1 q-mt-md text-center">
      Currently using {{ storageUsed }}MB of {{ storageAvailable }}MB Available storage
    </h2>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'

// Composables
const { compiledBarCode } = useBarcodeScanHandler()

// Local Data
const testData = ref([])
const storageUsed = ref(0)
const storageAvailable = ref(0)

// Logic
const handlePageOffset = inject('handle-page-offset')

onMounted(() => {
  navigator.storage.estimate().then((estimate) => {
    storageUsed.value = (estimate.usage / 1024 / 1024).toFixed(2)
    storageAvailable.value = (estimate.quota / 1024 / 1024).toFixed(2)
  })
})

watch(compiledBarCode, (newValue) => {
  if (newValue !== '') {
    testData.value.push(newValue)
  }
})
</script>

<style lang="scss" scoped>
h1 {
  font-size: 30px;
  color: $primary;
}

.demo {
  display: inline-block;
  width: max-content;
  min-width: 300px;
  list-style: none;
  background-color: $color-gray;
  border-radius: 4px;
  padding: 0.5rem;
}
</style>
