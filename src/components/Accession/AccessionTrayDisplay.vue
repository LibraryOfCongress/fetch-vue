<template>
  <!-- scan tray display -->
  <div
    v-if="accessionTray.id == null"
    class="absolute-center accession-tray"
  >
    <div class="column items-center">
      <h1 class="text-h4 text-bold text-center q-mb-lg">
        Scan Tray Barcode
      </h1>

      <q-btn
        class="text-h3 q-pa-xl"
        no-caps
        unelevated
        color="secondary"
        label="Scan Barcode"
        @click="store.verifyTrayBarcode('CH220987')"
      />
    </div>
  </div>

  <!-- tray display -->
  <div
    v-else
    class="row accession-tray"
  >
    <div class="col-4 accession-tray-info">
      {{ accessionTray.title }}
    </div>

    <div class="col-8">
      <div class="row">
        <div class="col-12">
          <h1 class="text-h4">
            Scan Items
          </h1>
        </div>
      </div>

      <q-space class="divider" />

      <div class="row">
        <div class="col-12">
          barcode table
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccessionStore } from 'src/stores/accession-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'

const store = useAccessionStore()

// Composables
const { compiledBarCode } = useBarcodeScanHandler()

// Store Data
const { accessionTray } = storeToRefs(store)

// Logic
watch(compiledBarCode, (newBarcode) => {
  if (newBarcode !== '' && accessionTray.id == null) {
    // if a barcode scan is detected and the user hasnt scanned a tray yet we set that barcode as the trays barcode
    accessionTray.id.value = newBarcode
    store.verifyTrayBarcode(newBarcode)
  } else if (newBarcode !== '' && accessionTray.id !== null) {
    // user is scanning barcodes for items related to the scanned tray so we need to validate them
    validateTrayItemBarcode(newBarcode)
  }
})

const validateTrayItemBarcode = (barcode) => {
  // check if barcode exists in the tray, if not add it as a new barcode
  if (accessionTray.items.value.some(item => item.barcode == barcode)) {
    store.verifyTrayItemBarcode(barcode)
  } else {
    accessionTray.items.push({ id: barcode, verified: false })
  }
}
</script>

<style lang="scss" scoped>
.accession-tray {
  &-info {
    border-right: 1px solid;
    border-color: $secondary;
  }
}
</style>