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

        <div
          v-if="accessionJob.type == 2"
          class="col-auto q-ml-auto"
        >
          <q-btn
            no-caps
            unelevated
            icon="add"
            color="accent"
            label="Add Tray"
            class="btn-no-wrap text-body1"
            :disabled="!accessionContainer.id || !allItemsVerified || accessionJob.status == 'Paused'"
            @click="addNewTray"
          />
        </div>
      </div>

      <div class="row q-mb-xs-lg">
        <div class="col-xs-12 col-md-auto flex no-wrap justify-between q-mb-xs-md q-mb-md-none q-mr-md-auto">
          <q-btn
            no-caps
            unelevated
            icon="add"
            color="accent"
            :label="selectedContainerItems.length == 1 ? 'Edit Barcode' : 'Enter Barcode'"
            class="btn-no-wrap text-body1 q-mr-sm-md"
            :disabled="!accessionContainer.id || accessionJob.status == 'Paused'"
            @click="setBarcodeEditDisplay"
          />
          <q-btn
            no-caps
            unelevated
            icon="mdi-delete"
            color="negative"
            label="Delete"
            class="btn-no-wrap text-body1"
            :disabled="selectedContainerItems.length == 0 || accessionJob.status == 'Paused'"
            @click="showConfirmation = { type: 'delete', text:'Are you sure you want to delete selected items?' }"
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
            @click="showConfirmation = { type: 'completeJob', text:'Are you sure you want to complete the job?' }"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <EssentialTable
            ref="accessionTableComponent"
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

  <!-- barcode edit modal -->
  <PopupModal
    v-if="showBarcodeEdit"
    :title="selectedContainerItems.length == 1 ? 'Edit Barcode' : 'Enter Barcode'"
    @reset="resetBarcodeEdit"
  >
    <template #main-content>
      <q-card-section class="column no-wrap items-center">
        <div class="form-group">
          <label class="form-group-label">
            Type Barcode
          </label>
          <TextInput
            v-model="manualBarcodeEdit"
            placeholder="Please Enter Barcode"
          />
        </div>
      </q-card-section>
    </template>

    <template #footer-content>
      <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
        <q-btn
          no-caps
          unelevated
          color="accent"
          label="submit"
          class="text-body1 full-width"
          :disabled="!manualBarcodeEdit"
          :loading="isLoading"
          @click="validateContainerItemBarcode(manualBarcodeEdit); resetBarcodeEdit();"
        >
          <template #loading>
            <q-spinner-bars
              color="white"
              size="1.5rem"
            />
          </template>
        </q-btn>

        <q-space class="q-mx-xs" />

        <q-btn
          outline
          no-caps
          label="Cancel"
          class="text-body1 full-width"
          @click="resetBarcodeEdit"
        />
      </q-card-section>
    </template>
  </PopupModal>

  <!-- confirmation modal -->
  <PopupModal
    v-if="showConfirmation !== null"
    :title="'Confirm'"
    :text="showConfirmation.text"
    @reset="showConfirmation = null"
    @confirm="handleConfirmation"
  />
</template>

<script setup>
import { ref, toRaw, watch, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccessionStore } from '@/stores/accession-store'
import { useOptionStore } from '@/stores/option-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import BarcodeBox from '@/components/BarcodeBox.vue'
import EssentialTable from '@/components/EssentialTable.vue'
import SelectInput from '@/components/SelectInput.vue'
import TextInput from '@/components/TextInput.vue'
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
  patchAccessionNonTray,
  deleteAccessionTrayItem,
  deleteAccessionNonTrayItem
} = useAccessionStore()
const { accessionJob, accessionContainer, originalAccessionContainer, allItemsVerified } = storeToRefs(useAccessionStore())

// Local Data
const isLoading = ref(false)
const accessionTableComponent = ref(null)
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
const showBarcodeEdit = ref(false)
const manualBarcodeEdit = ref('')

// Logic
const handleAlert = inject('handle-alert')

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
const resetBarcodeEdit = () => {
  showBarcodeEdit.value = false
  manualBarcodeEdit.value = ''
}
const setBarcodeEditDisplay = () => {
  showBarcodeEdit.value = true
  if (selectedContainerItems.value.length == 1) {
    manualBarcodeEdit.value = selectedContainerItems.value[0].id
  }
}

const handleConfirmation = async () => {
  if (showConfirmation.value.type == 'delete') {
    await deleteContainerItem()
  }
}

const cancelContainerEdit = () => {
  accessionContainer.value = { ...toRaw(originalAccessionContainer.value) }
  editContainerSize.value = false
  editMediaType.value = false
}
const validateContainerItemBarcode = async (barcode) => {
  try {
    isLoading.value = true
    // check if barcode exists in the tray/nontray, if not add it as a new barcode
    if (accessionContainer.value.items.some(item => item.id == barcode)) {
    // check what type of container type were in (tray/nontray)
      if (accessionJob.value.type == 2) {
        await verifyTrayItemBarcode(barcode)
      } else {
        await verifyNonTrayItemBarcode(barcode)
      }
    } else {
    // add the barcode if it doesnt exist unless user is currently editing a barcode
      if (selectedContainerItems.value.length == 1) {
      // find the item in the container along with the selected item in the table and update its value to match the manualEditBarcode
        accessionContainer.value.items.find( b => b.id == selectedContainerItems.value[0].id).id = manualBarcodeEdit.value
        selectedContainerItems.value[0].id = manualBarcodeEdit.value
      } else {
        accessionContainer.value.items.push({ id: barcode, verified: false })
      }
    }
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    isLoading.value = false
  }
}
const deleteContainerItem = async () => {
  try {
    const barcodesToRemove = selectedContainerItems.value.map(item => item.id)
    if (accessionJob.value.type == 2) {
      await deleteAccessionTrayItem(barcodesToRemove)
    } else {
      await deleteAccessionNonTrayItem(barcodesToRemove)
    }

    handleAlert({
      type: 'success',
      text: 'The selected item(s) has been removed.',
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    // clear out any selected items in the table
    accessionTableComponent.value.clearSelectedData()
  }
}

const addNewTray = async () => {
  try {
    // save the current completed tray details and items to the job
    // TODO: need to update patch method to handle adding a tray
    await patchAccessionJob()

    // clear out the accession container data in store
    resetAccessionContainer()

    // route the user back to the job so we can scan a new tray container barcode
    router.push({
      name: 'accession',
      params: {
        jobId: accessionJob.value.id
      }
    })

    handleAlert({
      type: 'success',
      text: 'Successfully added a tray to the job',
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  }
}

const updateAccessionJobStatus = async (status) => {
  try {
    accessionJob.value.status = status
    await patchAccessionJob()

    handleAlert({
      type: 'success',
      text: `Job Status has been updated to: ${status}`,
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  }
}
const updateAccessionContainer = async () => {
  try {
    if (accessionJob.value.type == 2) {
      await patchAccessionTray()
    } else {
      await patchAccessionNonTray()
    }

    handleAlert({
      type: 'success',
      text: 'Container has been updated.',
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
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