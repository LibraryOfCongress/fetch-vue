<template>
  <!-- scan tray display -->
  <div
    v-if="!route.params.trayId"
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
        @click="triggerTrayScan('CH220987')"
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
        <label class="text-h6 q-mb-xs">
          Owner
        </label>
        <p class="outline">
          {{ accessionTray.owner }}
        </p>
      </div>

      <div class="accession-tray-info-details q-mb-sm-lg">
        <label class="text-h6 q-mb-xs">
          Container Type
        </label>
        <p>
          {{ accessionTray.container_type }}
        </p>
      </div>

      <div class="accession-tray-info-details q-mb-sm-lg">
        <label class="text-h6 q-mb-xs">
          Container Size
          <q-btn
            no-caps
            flat
            icon="mdi-square-edit-outline"
            color="accent"
            label="Edit"
            class="btn-no-wrap text-caption"
            @click="editContainerSize = true"
          />
        </label>
        <p
          v-if="!editContainerSize"
          class="outline"
        >
          {{ accessionTray.container_size }}
        </p>
        <SelectInput
          v-else
          v-model="accessionTray.container_size"
          :options="optionStore.containerOptions"
          option-value="name"
          option-label="name"
        />
      </div>

      <div class="accession-tray-info-details">
        <label class="text-h6 q-mb-xs">
          Media Type
          <q-btn
            no-caps
            flat
            icon="mdi-square-edit-outline"
            color="accent"
            label="Edit"
            class="btn-no-wrap text-caption"
            @click="editMediaType = true"
          />
        </label>
        <p
          v-if="!editMediaType"
          class="outline text-highlight"
        >
          {{ accessionTray.media_type }}
        </p>
        <SelectInput
          v-else
          v-model="accessionTray.media_type"
          :options="optionStore.mediaOptions"
          option-value="name"
          option-label="name"
        />
      </div>

      <div
        v-if="editContainerSize || editMediaType"
        class="row q-mt-md"
      >
        <q-space class="divider q-my-sm" />

        <div class="col-6 q-pr-sm-xs">
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Save Edits"
            class="full-width text-body1"
            @click="updateAccessionTray"
            :disabled="accessionJob.status == 'Paused'"
          />
        </div>
        <div class="col-6 q-pl-sm-xs">
          <q-btn
            no-caps
            unelevated
            outline
            color="accent"
            label="Cancel"
            class="full-width text-body1"
            @click="cancelTrayEdit"
          />
        </div>
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
            :disabled="accessionJob.status == 'Paused'"
          />
          <q-btn
            no-caps
            unelevated
            icon="mdi-delete"
            color="negative"
            label="Delete"
            class="btn-no-wrap text-body1 q-ml-sm"
            :disabled="selectedTrayItems.length == 0 || accessionJob.status == 'Paused'"
          />
        </div>

        <div class="col-auto">
          <q-btn
            v-if="accessionJob.status !== 'Paused'"
            no-caps
            unelevated
            outline
            icon="mdi-pause"
            color="accent"
            label="Pause Job"
            class="btn-no-wrap text-body1"
            @click="updateAccessionJobStatus('Paused')"
          />
          <q-btn
            v-else
            no-caps
            unelevated
            outline
            icon="mdi-play"
            color="accent"
            label="Resume Job"
            class="btn-no-wrap text-body1"
            @click="updateAccessionJobStatus('Running')"
          />
          <q-btn
            no-caps
            unelevated
            icon="check"
            color="positive"
            label="Complete Job"
            class="btn-no-wrap text-body1 q-ml-sm"
            :outline="!accessionStore.allTrayItemsVerified || accessionJob.status == 'Paused'"
            :disabled="!accessionStore.allTrayItemsVerified || accessionJob.status == 'Paused'"
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
            :enable-selection="true"
            @selected-data="selectedTrayItems = $event"
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
import { ref, toRaw, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccessionStore } from 'src/stores/accession-store'
import { useOptionStore } from 'src/stores/option-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import BarcodeBox from '@/components/BarcodeBox.vue'
import EssentialTable from 'src/components/EssentialTable.vue'
import SelectInput from '@/components/SelectInput.vue'

const router = useRouter()
const route = useRoute()

// Composables
const { compiledBarCode } = useBarcodeScanHandler()

// Store Data
const optionStore = useOptionStore()
const accessionStore = useAccessionStore()
const { accessionJob, accessionTray } = storeToRefs(accessionStore)

// Local Data
const originalAccessionTray = ref(null)
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
const selectedTrayItems = ref([])
const editContainerSize = ref(false)
const editMediaType = ref(false)

// Logic
watch(compiledBarCode, (newBarcode) => {
  if (newBarcode !== '' && accessionTray.value.id == null) {
    // if a barcode scan is detected and the user hasnt scanned a tray yet we set that barcode as the trays barcode
    triggerTrayScan(newBarcode)
  } else if (newBarcode !== '' && accessionTray.value.id !== null) {
    // user is scanning barcodes for items related to the scanned tray so we need to validate them
    validateTrayItemBarcode(newBarcode)
  }
})

const triggerTrayScan = (barcode) => {
  // TODO: manually trigger a scan on the mobile device
  accessionStore.getAccessionTray(barcode)

  router.push({
    name: 'accession-tray',
    params: {
      jobId: accessionJob.value.id,
      trayId: accessionTray.value.id
    }
  })
  // remove reactivity and create a copy of the loaded tray data
  originalAccessionTray.value = { ...toRaw(accessionTray.value) }
}

const cancelTrayEdit = () => {
  accessionTray.value = { ...toRaw(originalAccessionTray.value) }
  editContainerSize.value = false
  editMediaType.value = false
}

const validateTrayItemBarcode = (barcode) => {
  // check if barcode exists in the tray, if not add it as a new barcode
  if (accessionTray.value.items.some(item => item.barcode == barcode)) {
    accessionStore.verifyTrayItemBarcode(barcode)
  } else {
    accessionTray.value.items.push({ id: barcode, verified: false })
  }
}
const updateAccessionJobStatus = async (status) => {
  try {
    accessionJob.value.status = status
    await accessionStore.patchAccessionJob()

    //TODO: display success alert
  } catch (error) {
    // TODO: replace error with popup alert
    console.log(error)
  }
}
const updateAccessionTray = async () => {
  try {
    await accessionStore.patchAccessionTray()

    //TODO: display success alert
  } catch (error) {
    // TODO: replace error with popup alert
    console.log(error)
  } finally {
    editContainerSize.value = false
    editMediaType.value = false
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

      & label {
        position: relative;

        .q-btn {
          position: absolute;
          padding: .4rem;
        }
      }
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