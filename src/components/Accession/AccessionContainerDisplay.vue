<template>
  <div
    class="row accession-container flex-lg-grow"
  >
    <AccessionNonTrayInfo
      v-if="accessionJob.type == 1"
      ref="nonTrayInfoComponent"
    />
    <AccessionTrayInfo
      v-else
      ref="trayInfoComponent"
    />

    <div class="col-12 col-lg-8 col-xl-9 accession-container-scan">
      <div class="row items-center q-mb-xs-md q-mb-sm-lg">
        <div
          v-if="currentScreenSize == 'xs'"
          class="col-auto"
        >
          <MoreOptionsMenu
            v-if="accessionJob.type == 1"
            :options="[{
              text: `${selectedItems.length == 1 ? 'Edit Barcode' : 'Enter Barcode'}`,
              disabled: accessionJob.type == 2 && !accessionContainer.id || accessionJob.status == 'Paused'
            }, {
              text: 'Delete Items',
              disabled: selectedItems.length == 0 || accessionJob.status == 'Paused'
            }]"
            class="q-mr-sm"
            @click="handleOptionMenu"
          />
          <MoreOptionsMenu
            v-else
            :options="[{
              text: 'Add Tray',
              disabled: !accessionContainer.id || !allItemsVerified || accessionJob.status == 'Paused'
            }, {
              text: `${selectedItems.length == 1 ? 'Edit Barcode' : 'Enter Barcode'}`,
              disabled: accessionJob.type == 2 && !accessionContainer.id || accessionJob.status == 'Paused'
            }, {
              text: 'Delete Items',
              disabled: selectedItems.length == 0 || accessionJob.status == 'Paused'
            }]"
            class="q-mr-sm"
            @click="handleOptionMenu"
          />
        </div>

        <div class="col-auto">
          <h2 class="text-h4 text-bold">
            Scan Items
          </h2>
        </div>

        <div class="col-auto q-ml-sm">
          <span class="outline text-h6">
            {{ accessionJob.type == 2 ? accessionContainer.items.length : accessionJob.items.length }} Items
          </span>
        </div>

        <div
          v-if="accessionJob.type == 2 && currentScreenSize !== 'xs'"
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
            @click="showNextTrayModal = !showNextTrayModal"
          />
        </div>
      </div>

      <div
        v-if="currentScreenSize !== 'xs'"
        class="row q-mb-xs-lg"
      >
        <div class="col-xs-12 col-md-auto flex no-wrap justify-between q-mb-xs-md q-mb-md-none q-mr-md-auto">
          <q-btn
            no-caps
            unelevated
            icon="add"
            color="accent"
            :label="selectedItems.length == 1 ? 'Edit Barcode' : 'Enter Barcode'"
            class="btn-no-wrap text-body1 q-mr-sm-md"
            :disabled="accessionJob.type == 2 && !accessionContainer.id || accessionJob.status == 'Paused'"
            @click="setBarcodeEditDisplay"
          />
          <q-btn
            no-caps
            unelevated
            icon="mdi-delete"
            color="negative"
            label="Delete"
            class="btn-no-wrap text-body1"
            :disabled="selectedItems.length == 0 || accessionJob.status == 'Paused'"
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
            :table-data="accessionJob.type == 1 ? accessionJob.items : accessionContainer.items"
            :disable-table-reorder="true"
            :hide-table-rearrange="true"
            :enable-selection="true"
            @selected-data="selectedItems = $event"
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

    <!-- mobile actions menu -->
    <AccessionMobileActionBar
      v-if="currentScreenSize == 'xs' && !renderIsEditMode"
      @pause-job="updateAccessionJobStatus('Paused')"
      @resume-job="updateAccessionJobStatus('Running')"
      @complete-job="showConfirmation = { type: 'completeJob', text:'Are you sure you want to complete the job?' }"
    />
  </div>

  <!-- barcode edit modal -->
  <PopupModal
    v-if="showBarcodeEdit"
    :title="selectedItems.length == 1 ? 'Edit Barcode' : 'Enter Barcode'"
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
          @click="selectedItems.length == 1 ? updateContainerItem(manualBarcodeEdit) : triggerBarcodeScan(manualBarcodeEdit); resetBarcodeEdit();"
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

  <!-- next tray modal (only for trayed jobs) -->
  <PopupModal
    v-if="showNextTrayModal"
    :title="'Select Tray'"
    :show-actions="false"
    @reset="showNextTrayModal = false"
  >
    <template #main-content="{ hideModal }">
      <q-card-section class="row accession-next-tray">
        <div
          v-for="tray in accessionJob.trays"
          :key="tray.id"
          class="col-12 q-mb-sm"
        >
          <q-item class="accession-next-tray-item">
            <div class="col-12 text-left">
              <p class="text-h6 text-color-black">
                Tray #: {{ tray.id }}
              </p>
              <p class="text-body1">
                Trayed
              </p>
            </div>
          </q-item>
        </div>

        <div class="col-12">
          <q-btn
            no-caps
            unelevated
            outline
            icon="add"
            color="accent"
            label="Add Tray"
            align="left"
            class="accession-next-tray-action btn-dashed btn-no-wrap text-body1 full-width"
            @click="addNewTray(); hideModal();"
          />
        </div>
      </q-card-section>
    </template>
  </PopupModal>

</template>

<script setup>
import { ref, watch, computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccessionStore } from '@/stores/accession-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import AccessionNonTrayInfo from '@/components/Accession/AccessionNonTrayInfo.vue'
import AccessionTrayInfo from '@/components/Accession/AccessionTrayInfo.vue'
import EssentialTable from '@/components/EssentialTable.vue'
import TextInput from '@/components/TextInput.vue'
import PopupModal from '@/components/PopupModal.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import AccessionMobileActionBar from '@/components/Accession/AccessionMobileActionBar.vue'

const router = useRouter()
const route = useRoute()

// Composables
const { compiledBarCode } = useBarcodeScanHandler()
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const {
  resetAccessionContainer,
  getAccessionTray,
  getAccessionNonTray,
  verifyTrayItemBarcode,
  verifyNonTrayItemBarcode,
  patchAccessionJob,
  deleteAccessionTrayItem,
  deleteAccessionNonTrayItem
} = useAccessionStore()
const { accessionJob, accessionContainer, allItemsVerified } = storeToRefs(useAccessionStore())

// Local Data
const isLoading = ref(false)
const trayInfoComponent = ref(null)
const nonTrayInfoComponent = ref(null)
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
const selectedItems = ref([])
const showConfirmation = ref(null)
const showBarcodeEdit = ref(false)
const manualBarcodeEdit = ref('')
const showNextTrayModal = ref(false)
const renderIsEditMode = computed(() => {
  if (trayInfoComponent.value && trayInfoComponent.value.editMode) {
    return true
  } else if (nonTrayInfoComponent.value && nonTrayInfoComponent.value.editMode) {
    return true
  } else {
    return false
  }
})

// Logic
const handleAlert = inject('handle-alert')

watch(route, () => {
  if (!route.params.containerId) {
    // if the user clicks to go back to the job in the breadcrumb
    // clear out any accessionContainer State if there is no containerId in the route
    resetAccessionContainer()
  }
})

watch(compiledBarCode, (barcode) => {
  if (barcode !== '') {
    triggerBarcodeScan(barcode)
  }
})
const triggerBarcodeScan = (barcode) => {
  if (accessionJob.value.type == 2) {
    // example barcode for tray: 'CH220987'
    // if there is no container set yet for a trayed job user is scanning a tray
    if (accessionContainer.value.id == null) {
      // get the scanned tray info
      getAccessionTray(barcode)

      // set the scanned tray as the container id in the route
      router.push({
        name: 'accession-container',
        params: {
          jobId: accessionJob.value.id,
          containerId: accessionContainer.value.id
        }
      })
    } else {
      // if there is a container id user is scanning that trays items
      // check if the scanned barcode already exists in the non tray job if not add it
      if (accessionContainer.value.items.some(item => item.id == barcode)) {
        // if barcode does exist trigger a validation
        validateContainerItemBarcode(barcode)
      } else {
        addContainerItem(barcode)
      }
    }
  } else {
    // example barcode for tray: 'NT555923'
    // get the scanned barcodes info
    getAccessionNonTray(barcode)

    // check if the scanned barcode already exists in the non tray job if not add it
    if (accessionJob.value.items.some(item => item.id == barcode)) {
      // if barcode does exist trigger a validation
      validateContainerItemBarcode(barcode)
    } else {
      addContainerItem(barcode)
    }

    // set the scanned item as the container id in the route
    router.push({
      name: 'accession-container',
      params: {
        jobId: accessionJob.value.id,
        containerId: accessionContainer.value.id
      }
    })
  }
}
const validateContainerItemBarcode = async (barcode) => {
  try {
    isLoading.value = true

    if (accessionJob.value.type == 2) {
      await verifyTrayItemBarcode(barcode)
    } else {
      await verifyNonTrayItemBarcode(barcode)
    }

    handleAlert({
      type: 'success',
      text: 'The item has been validated.',
      autoClose: true
    })
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

const resetBarcodeEdit = () => {
  showBarcodeEdit.value = false
  manualBarcodeEdit.value = ''
}
const setBarcodeEditDisplay = () => {
  showBarcodeEdit.value = true
  if (selectedItems.value.length == 1) {
    manualBarcodeEdit.value = selectedItems.value[0].id
  }
}

const handleConfirmation = async () => {
  if (showConfirmation.value.type == 'delete') {
    await deleteContainerItem()
  }
}
const handleOptionMenu = (option) => {
  if (option.text == 'Add Tray') {
    showNextTrayModal.value = !showNextTrayModal.value
  } else if (option.text == 'Enter Barcode' || option.text == 'Edit Barcode') {
    setBarcodeEditDisplay()
  } else if (option.text == 'Delete Items') {
    showConfirmation.value = { type: 'delete', text:'Are you sure you want to delete selected items?' }
  }
}


const addContainerItem = (barcode) => {
  if ( accessionJob.value.type == 2) {
    accessionContainer.value.items.push({ id: barcode, verified: false })
  } else {
    accessionJob.value.items.push({ id: barcode, verified: false })
  }
}
const updateContainerItem = async (barcode) => {
  try {
    // find the item in the container along with the selected item in the table and update its value to match the manualEditBarcode
    if (accessionJob.value.type == 2) {
      accessionContainer.value.items.find( item => item.id == selectedItems.value[0].id).id = barcode
    } else {
      accessionJob.value.items.find( item => item.id == selectedItems.value[0].id).id = barcode

      router.push({
        name: 'accession-container',
        params: {
          jobId: accessionJob.value.id,
          containerId: barcode
        }
      })
    }
    selectedItems.value[0].id = barcode

    handleAlert({
      type: 'success',
      text: 'The item has been updated.',
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
const deleteContainerItem = async () => {
  try {
    const barcodesToRemove = selectedItems.value.map(item => item.id)
    if (accessionJob.value.type == 2) {
      await deleteAccessionTrayItem(barcodesToRemove)
    } else {
      await deleteAccessionNonTrayItem(barcodesToRemove)

      router.push({
        name: 'accession',
        params: {
          jobId: accessionJob.value.id
        }
      })
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
</script>

<style lang="scss" scoped>
.accession-container {
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

.accession-next-tray {
  &-item {
    border: 2px dashed $secondary;
    border-radius: 3px;
    color: $secondary;
  }

  &-action {
    min-height: 72px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
}
</style>