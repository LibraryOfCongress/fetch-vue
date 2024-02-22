<template>
  <div
    class="row accession-container flex-lg-grow"
  >
    <div class="col-12 col-lg-4 col-xl-3 accession-container-info">
      <div class="row">
        <div class="col-12">
          <h1 class="text-h4 text-bold q-mb-xs-md q-mb-sm-lg">
            {{ accessionContainer.title }}
          </h1>
        </div>

        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-12 q-mb-xs-md q-mb-sm-none q-mb-lg-lg">
          <BarcodeBox
            :barcode="!accessionContainer.id ? (accessionJob.type == 1 ? 'Please Scan Non-Tray' : 'Please Scan Tray') : accessionContainer.id"
            class="q-mb-md-xl q-mb-lg-none"
          />
        </div>

        <div
          v-if="accessionContainer.id"
          class="col-xs-12 col-sm-6 col-md-6 col-lg-12"
        >
          <div class="accession-container-info-details q-mb-xs-sm q-mb-lg-lg">
            <label class="text-h6 q-mb-xs">
              Owner
            </label>
            <p
              class="outline"
            >
              {{ accessionContainer.owner }}
            </p>
          </div>

          <div class="accession-container-info-details q-mb-xs-sm q-mb-lg-lg">
            <label class="text-h6 q-mb-xs">
              Container Type
            </label>
            <p>
              {{ accessionContainer.container_type }}
            </p>
          </div>

          <div class="accession-container-info-details q-mb-xs-sm q-mb-lg-lg">
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
              {{ accessionContainer.container_size }}
            </p>
            <SelectInput
              v-else
              v-model="accessionContainer.container_size"
              :options="optionStore.containerOptions"
              option-value="name"
              option-label="name"
            />
          </div>

          <div class="accession-container-info-details">
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
              {{ accessionContainer.media_type }}
            </p>
            <SelectInput
              v-else
              v-model="accessionContainer.media_type"
              :options="optionStore.mediaOptions"
              option-value="name"
              option-label="name"
            />
          </div>

          <div
            v-if="editContainerSize || editMediaType"
            class="row q-pl-sm-md q-pl-lg-none q-mt-md-sm"
          >
            <q-space class="divider q-my-sm" />

            <div class="col-6 q-pr-xs-xs">
              <q-btn
                no-caps
                unelevated
                color="accent"
                label="Save Edits"
                class="full-width text-body1"
                @click="updateAccessionContainer"
                :disabled="accessionJob.status == 'Paused'"
              />
            </div>
            <div class="col-6 q-pl-xs-xs">
              <q-btn
                no-caps
                unelevated
                outline
                color="accent"
                label="Cancel"
                class="full-width text-body1"
                @click="cancelContainerEdit"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-8 col-xl-9 accession-container-scan">
      <div class="row items-center q-mb-xs-md q-mb-sm-lg">
        <div class="col-auto">
          <h2 class="text-h4 text-bold">
            Scan Items
          </h2>
        </div>

        <div class="col-auto q-ml-sm">
          <span class="outline text-h6">
            {{ accessionContainer.items.length }} Items
          </span>
        </div>
      </div>

      <div class="row q-mb-xs-lg">
        <div class="col-xs-12 col-md-auto flex no-wrap justify-between q-mb-xs-md q-mb-md-none q-mr-md-auto">
          <q-btn
            no-caps
            unelevated
            icon="add"
            color="accent"
            label="Add Item"
            class="btn-no-wrap text-body1 q-mr-sm-md"
            :disabled="accessionJob.status == 'Paused'"
            @click="showConfirmation = 'Are you sure you want to add an item?'"
          />
          <q-btn
            no-caps
            unelevated
            icon="mdi-delete"
            color="negative"
            label="Delete"
            class="btn-no-wrap text-body1"
            :disabled="selectedContainerItems.length == 0 || accessionJob.status == 'Paused'"
            @click="showConfirmation = 'Are you sure you want to delete selected items?'"
          />
        </div>

        <div class="col-xs-12 col-md-auto flex justify-between">
          <q-btn
            v-if="accessionJob.status !== 'Paused'"
            no-caps
            unelevated
            outline
            icon="mdi-pause"
            color="accent"
            label="Pause Job"
            class="btn-no-wrap text-body1"
            :class="currentScreenSize == 'xs' ? 'full-width q-mb-md' : ''"
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
            :class="currentScreenSize == 'xs' ? 'full-width q-mb-md' : ''"
            @click="updateAccessionJobStatus('Running')"
          />
          <q-btn
            no-caps
            unelevated
            icon="check"
            color="positive"
            label="Complete Job"
            class="btn-no-wrap text-body1 q-ml-sm"
            :class="currentScreenSize == 'xs' ? 'full-width' : ''"
            :outline="!allItemsVerified || accessionJob.status == 'Paused'"
            :disabled="!allItemsVerified || accessionJob.status == 'Paused'"
            @click="showConfirmation = 'Are you sure you want to complete the job?'"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <EssentialTable
            :table-columns="accessionTableColumns"
            :table-data="accessionContainer.items"
            :disable-table-reorder="true"
            :hide-table-rearrange="true"
            :enable-selection="true"
            @selected-data="selectedContainerItems = $event"
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

  <!-- confirmation modal -->
  <PopupModal
    v-if="showConfirmation !== null"
    :title="'Confirm'"
    :text="showConfirmation"
    @reset="showConfirmation = null"
  />
</template>

<script setup>
import { ref, toRaw, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccessionStore } from '@/stores/accession-store'
import { useOptionStore } from '@/stores/option-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import BarcodeBox from '@/components/BarcodeBox.vue'
import EssentialTable from '@/components/EssentialTable.vue'
import SelectInput from '@/components/SelectInput.vue'
import PopupModal from '@/components/PopupModal.vue'

const router = useRouter()
const route = useRoute()

// Composables
const { compiledBarCode } = useBarcodeScanHandler()
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const optionStore = useOptionStore()
const {
  resetAccessionContainer,
  getAccessionTray,
  getAccessionNonTray,
  verifyTrayItemBarcode,
  verifyNonTrayItemBarcode,
  patchAccessionJob,
  patchAccessionTray,
  patchAccessionNonTray
} = useAccessionStore()
const { accessionJob, accessionContainer, originalAccessionContainer, allItemsVerified } = storeToRefs(useAccessionStore())

// Local Data
const accessionTableColumns = ref([
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
const selectedContainerItems = ref([])
const editContainerSize = ref(false)
const editMediaType = ref(false)
const showConfirmation = ref(null)

// Logic
watch(route, () => {
  if (!route.params.containerId) {
    // if the user clicks to go back to the job in the breadcrumb
    // clear out any accessionContainer State if there is no containerId in the route
    resetAccessionContainer()
  }
})

watch(compiledBarCode, (newBarcode) => {
  if (newBarcode !== '' && accessionContainer.value.id == null) {
    // if a barcode scan is detected and the user hasnt scanned a tray/nontray yet we trigger a scan and get that scanned containers data
    triggerBarcodeScan(newBarcode)
  } else if (newBarcode !== '' && accessionContainer.value.id) {
    // user is scanning barcodes for items related to the scanned container so we need to validate them
    validateContainerItemBarcode(newBarcode)
  }
})
const triggerBarcodeScan = (barcode) => {
  if (accessionJob.value.type == 2) {
    // example barcode for tray: 'CH220987'
    console.log(barcode)
    getAccessionTray(barcode)
  } else {
    // example barcode for tray: 'NT555923'
    getAccessionNonTray(barcode)
  }

  router.push({
    name: 'accession-container',
    params: {
      jobId: accessionJob.value.id,
      containerId: accessionContainer.value.id
    }
  })
}

const cancelContainerEdit = () => {
  accessionContainer.value = { ...toRaw(originalAccessionContainer.value) }
  editContainerSize.value = false
  editMediaType.value = false
}

const validateContainerItemBarcode = (barcode) => {
  // check if barcode exists in the tray/nontray, if not add it as a new barcode
  if (accessionContainer.value.items.some(item => item.id == barcode)) {
    // check what type of container type were in (tray/nontray)
    if (accessionJob.value.type == 2) {
      verifyTrayItemBarcode(barcode)
    } else {
      verifyNonTrayItemBarcode(barcode)
    }
  } else {
    accessionContainer.value.items.push({ id: barcode, verified: false })
  }
}
const updateAccessionJobStatus = async (status) => {
  try {
    accessionJob.value.status = status
    await patchAccessionJob()

    //TODO: display success alert
  } catch (error) {
    // TODO: replace error with popup alert
    console.log(error)
  }
}
const updateAccessionContainer = async () => {
  try {
    if (accessionJob.value.type == 2) {
      await patchAccessionTray()
    } else {
      await patchAccessionNonTray()
    }

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
.accession-container {
  &-info {
    border-right: 1px solid;
    border-color: $secondary;
    padding: 3rem;

    @media (max-width: $breakpoint-md-max) {
      border-right: none;
      padding: 3rem 1.5rem;
      padding-bottom: 0;
    }

    @media (max-width: $breakpoint-sm-min) {
      padding: 1rem;
      padding-bottom: 0;
    }

    &-details {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;

      @media (max-width: $breakpoint-md-max) {
        align-items: flex-start;
        padding-left: 1rem;
      }

      @media (max-width: $breakpoint-sm-min) {
        align-items: flex-start;
        padding-left: 0rem;
      }

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

      @media (max-width: $breakpoint-sm-min) {
        padding: 0 1rem;
        padding-top: 2rem;
      }
    }
    & > div:nth-child(2) {
      padding: 0 1.5rem;

      @media (max-width: $breakpoint-sm-min) {
        padding: 0 1rem;
      }
    }
  }
}
</style>