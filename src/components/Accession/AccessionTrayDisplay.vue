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
    class="row accession-tray flex-grow"
  >
    <div class="col-4 column accession-tray-info">
      <h1 class="text-h4 text-bold q-mb-sm-lg">
        {{ accessionTray.title }}
      </h1>

      <BarcodeBox
        :barcode="accessionTray.id"
        class="q-mb-sm-lg"
      />

      <div class="accession-tray-info-details q-mb-sm-lg">
        <label class="text-h6">
          Owner
        </label>
        <p class="outline">
          {{ accessionTray.owner }}
        </p>
      </div>

      <div class="accession-tray-info-details q-mb-sm-lg">
        <label class="text-h6">
          Container Type
        </label>
        <p>
          {{ accessionTray.container_type }}
        </p>
      </div>

      <div class="accession-tray-info-details q-mb-sm-lg">
        <label class="text-h6">
          Container Size
        </label>
        <p class="outline">
          {{ accessionTray.container_size }}
        </p>
      </div>

      <div class="accession-tray-info-details">
        <label class="text-h6">
          Media Type
        </label>
        <p class="outline text-highlight">
          {{ accessionTray.media_type }}
        </p>
      </div>
    </div>

    <div class="col-8 accession-tray-scan">
      <div class="row items-center q-mb-sm-lg">
        <div class="col-auto">
          <h2 class="text-h4 text-bold">
            Scan Items
          </h2>
        </div>

        <div class="col-auto q-ml-sm">
          <span class="outline text-h6">
            {{ accessionTray.items.length }} Items
          </span>
        </div>
      </div>

      <div class="row q-mb-sm-lg">
        <div class="col-grow">
          <q-btn
            no-caps
            unelevated
            icon="add"
            color="accent"
            label="Add Item"
            class="btn-no-wrap text-body1"
          />
          <q-btn
            no-caps
            unelevated
            icon="mdi-delete"
            color="negative"
            label="Delete"
            class="btn-no-wrap text-body1 q-ml-sm"
          />
        </div>

        <div class="col-auto">
          <q-btn
            no-caps
            unelevated
            outline
            icon="mdi-pause"
            color="accent"
            label="Pause Job"
            class="btn-no-wrap text-body1"
          />
          <q-btn
            no-caps
            unelevated
            icon="check"
            color="positive"
            label="Complete Job"
            class="btn-no-wrap text-body1 q-ml-sm"
            :outline="true"
            :disabled="true"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <EssentialTable
            :table-columns="accessionTrayTableColumns"
            :table-data="accessionTray.items"
            :disable-table-reorder="true"
            :hide-table-filter="true"
          >
            <template #table-td="{ colName, value }">
              <span
                v-if="colName == 'verified'"
              >
                <q-icon
                  v-if="value == true"
                  name="check"
                  color="positive"
                  size="30px"
                  class="text-bold"
                />
                <q-icon
                  v-else
                  name="close"
                  color="negative"
                  size="30px"
                  class="text-bold"
                />
              </span>
            </template>
          </EssentialTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccessionStore } from 'src/stores/accession-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import BarcodeBox from '@/components/BarcodeBox.vue'
import EssentialTable from 'src/components/EssentialTable.vue'

const store = useAccessionStore()

// Composables
const { compiledBarCode } = useBarcodeScanHandler()

// Store Data
const { accessionTray } = storeToRefs(store)

// Local Data
const accessionTrayTableColumns = ref([
  {
    name: 'id',
    field: 'id',
    label: 'Barcode',
    align: 'left',
    sortable: true
  },
  {
    name: 'verified',
    field: 'verified',
    label: '',
    align: 'right',
    sortable: false
  }
])

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
    padding: 3rem;

    &-details {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      width: 100%;
    }
  }

  &-scan {
    & > div:first-child {
      padding: 0 1.5rem;
      padding-top: 3rem;
    }
    & > div:nth-child(2) {
      padding: 0 1.5rem;
    }
  }
}
</style>