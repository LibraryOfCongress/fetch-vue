<template>
  <div
    class="row accession-container flex-lg-grow"
  >
    <AccessionNonTrayInfo
      v-if="!accessionJob.trayed"
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
            v-if="!accessionJob.trayed"
            :options="[{
              text: `${selectedItems.length == 1 ? 'Edit Barcode' : 'Enter Barcode'}`,
              disabled: accessionJob.trayed && !accessionContainer.id || accessionJob.status == 'Paused' || barcodeScanAllowed
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
              text: `Add Tray (${accessionJob.trays.length})`,
              disabled: !accessionContainer.id || !allItemsVerified || accessionJob.status == 'Paused'
            }, {
              text: `${selectedItems.length == 1 ? 'Edit Barcode' : 'Enter Barcode'}`,
              disabled: accessionJob.trayed && !accessionContainer.id || accessionJob.status == 'Paused' || barcodeScanAllowed
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
            {{ accessionJob.trayed ? accessionContainer.items.length : accessionJob.non_tray_items.length }} Items
          </span>
        </div>

        <div
          v-if="accessionJob.trayed && currentScreenSize !== 'xs'"
          class="col-auto q-ml-auto"
        >
          <q-btn
            no-caps
            unelevated
            icon="add"
            color="accent"
            :label="`Add Tray (${accessionJob.trays.length})`"
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
            :disabled="accessionJob.trayed && !accessionContainer.id || accessionJob.status == 'Paused' || barcodeScanAllowed"
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

      <div class="row q-mb-xs-xl q-mb-sm-none">
        <div class="col-12 q-mb-xs-md q-mb-sm-none">
          <EssentialTable
            ref="accessionTableComponent"
            :table-columns="accessionTableColumns"
            :table-data="accessionJob.trayed ? accessionContainer.items.slice().reverse() : accessionJob.non_tray_items.slice().reverse()"
            :hide-table-rearrange="true"
            :enable-selection="true"
            @selected-data="selectedItems = $event"
          >
            <template #table-td="{ colName, value }">
              <span
                v-if="colName == 'verified'"
              >
                <q-icon
                  v-if="value == true || accessionJob.trayed"
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
    <MobileActionBar
      v-if="currentScreenSize == 'xs' && !renderIsEditMode"
      button-one-color="accent"
      :button-one-icon="accessionJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
      :button-one-label="accessionJob.status == 'Paused' ? 'Resume Job' : 'Pause Job'"
      :button-one-outline="true"
      @button-one-click="accessionJob.status == 'Paused' ? updateAccessionJobStatus('Running') : updateAccessionJobStatus('Paused')"
      button-two-color="positive"
      button-two-label="Complete Job"
      :button-two-outline="false"
      :button-two-disabled="!allItemsVerified || accessionJob.status == 'Paused'"
      :button-two-loading="appActionIsLoadingData"
      @button-two-click="showConfirmation = { type: 'completeJob', text:'Are you sure you want to complete the job?' }"
    />
  </div>

  <!-- barcode edit modal -->
  <PopupModal
    v-if="showBarcodeEdit"
    ref="barcodeEditModal"
    :title="selectedItems.length == 1 ? 'Edit Barcode' : 'Enter Barcode'"
    @reset="resetBarcodeEdit"
    aria-label="barcodeEditModal"
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
            @keyup.enter="selectedItems.length == 1 ? updateContainerItem(manualBarcodeEdit) : triggerItemScan(manualBarcodeEdit)"
          />
        </div>
      </q-card-section>
    </template>

    <template #footer-content="{ hideModal }">
      <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
        <q-btn
          no-caps
          unelevated
          color="accent"
          label="submit"
          class="text-body1 full-width"
          :disabled="!manualBarcodeEdit"
          :loading="appActionIsLoadingData"
          @click="selectedItems.length == 1 ? updateContainerItem(manualBarcodeEdit) : triggerItemScan(manualBarcodeEdit)"
        />

        <q-space class="q-mx-xs" />

        <q-btn
          outline
          no-caps
          label="Cancel"
          class="text-body1 full-width"
          @click="hideModal"
        />
      </q-card-section>
    </template>
  </PopupModal>

  <!-- confirmation modal -->
  <PopupModal
    v-if="showConfirmation !== null"
    :title="'Confirm'"
    :text="showConfirmation.text"
    :show-actions="false"
    @reset="showConfirmation = null"
    aria-label="confirmationModal"
  >
    <template #footer-content="{ hideModal }">
      <q-card-section
        v-if="showConfirmation.type == 'completeJob'"
        class="row no-wrap justify-between items-center q-pt-sm"
      >
        <q-btn
          no-caps
          unelevated
          color="accent"
          label="Complete & Print"
          class="btn-no-wrap text-body1 full-width"
          :loading="appActionIsLoadingData"
          @click="handleConfirmation('completePrint'); hideModal();"
        />

        <q-space class="q-mx-xs" />

        <q-btn
          no-caps
          unelevated
          color="accent"
          label="Complete"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          @click="handleConfirmation('completeJob'); hideModal();"
        />

        <q-space
          v-if="currentScreenSize !== 'xs'"
          class="q-mx-lg"
        />

        <q-btn
          v-if="currentScreenSize !== 'xs'"
          outline
          no-caps
          label="Cancel"
          class="accession-modal-btn text-body1 full-width"
          @click="hideModal"
        />
      </q-card-section>
      <q-card-section
        v-else-if="showConfirmation.type == 'delete'"
        class="row no-wrap justify-between items-center q-pt-sm"
      >
        <q-btn
          no-caps
          unelevated
          color="accent"
          label="Confirm"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          @click="handleConfirmation('delete'); hideModal();"
        />

        <q-space class="q-mx-xs" />

        <q-btn
          outline
          no-caps
          label="Cancel"
          class="accession-modal-btn text-body1 full-width"
          @click="hideModal"
        />
      </q-card-section>
    </template>
  </PopupModal>

  <!-- next tray modal (only for trayed jobs) -->
  <PopupModal
    v-if="showNextTrayModal"
    :title="'Select Tray'"
    :show-actions="false"
    @reset="showNextTrayModal = false"
    aria-label="nextTrayModal"
  >
    <template #main-content="{ hideModal }">
      <q-card-section class="row accession-next-tray">
        <div class="col-12">
          <q-btn
            no-caps
            unelevated
            outline
            icon="add"
            color="accent"
            :label="`Add Tray (${accessionJob.trays.length})`"
            align="left"
            class="accession-next-tray-action btn-dashed btn-no-wrap text-body1 full-width"
            @click="addNewTray(); hideModal();"
          />
        </div>
        <div
          v-for="tray in accessionJob.trays"
          :key="tray.id"
          class="col-12 q-mt-sm"
          role="list"
        >
          <q-item class="accession-next-tray-item">
            <div class="col-12 text-left">
              <p class="text-h6 text-color-black">
                Tray #: {{ tray.barcode.value }}
              </p>
              <p class="text-body1">
                Trayed
              </p>
            </div>
          </q-item>
        </div>
      </q-card-section>
    </template>
  </PopupModal>

  <!-- print component used to handle printing the template -->
  <AccessionBatchSheet
    ref="batchSheetComponent"
    :accession-job-details="accessionJob"
  />
</template>

<script setup>
import { ref, watch, computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { useAccessionStore } from '@/stores/accession-store'
import { useBarcodeStore } from '@/stores/barcode-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import AccessionNonTrayInfo from '@/components/Accession/AccessionNonTrayInfo.vue'
import AccessionTrayInfo from '@/components/Accession/AccessionTrayInfo.vue'
import EssentialTable from '@/components/EssentialTable.vue'
import TextInput from '@/components/TextInput.vue'
import PopupModal from '@/components/PopupModal.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'
import AccessionBatchSheet from '@/components/Accession/AccessionBatchSheet.vue'

const router = useRouter()
const route = useRoute()

// Composables
const { compiledBarCode } = useBarcodeScanHandler()
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const {
  verifyBarcode,
  patchBarcode,
  deleteBarcode
} = useBarcodeStore()
const { barcodeDetails, barcodeScanAllowed } = storeToRefs(useBarcodeStore())
const {
  resetAccessionContainer,
  patchAccessionJob,
  patchAccessionTray,
  postAccessionTrayItem,
  patchAccessionTrayItem,
  deleteAccessionTrayItem,
  getAccessionNonTrayItem,
  postAccessionNonTrayItem,
  patchAccessionNonTrayItem,
  deleteAccessionNonTrayItem
} = useAccessionStore()
const { accessionJob, accessionContainer, allItemsVerified } = storeToRefs(useAccessionStore())

// Local Data
const barcodeEditModal = ref(null)
const trayInfoComponent = ref(null)
const nonTrayInfoComponent = ref(null)
const accessionTableComponent = ref(null)
const batchSheetComponent = ref(null)
const accessionTableColumns = ref([
  {
    name: 'barcode_value',
    field: row => row.barcode.value,
    label: 'Barcode',
    align: 'left',
    sortable: true
  },
  {
    name: 'verified',
    field: 'scanned_for_accession',
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
  if (barcode !== '' && accessionJob.value.trayed && accessionContainer.value.id) {
    // if were in a trayed job only trigger scan if we already loaded a tray container
    triggerItemScan(barcode)
  } else if (barcode !== '' && accessionJob.value.trayed == false) {
    triggerItemScan(barcode)
  }
})
const triggerItemScan = async (barcode_value) => {
  try {
    appActionIsLoadingData.value = true
    // example barcode for trayed item 'BK123'
    // check if the barcode is in the system otherwise create it
    await verifyBarcode(barcode_value, 'Item')

    if (accessionJob.value.trayed) {
      // check if the scanned barcode already exists in the tray job if not add it
      if (accessionJob.value.trayed && accessionContainer.value.items.some(item => item.barcode.id == barcodeDetails.value.id)) {
        // validation is not needed in trays so we just return
        return
      } else {
        await addContainerItem()
      }
    } else {
      // example barcode for non tray item: 'CL555923'
      // check if the scanned barcode already exists in the non tray job if not add it
      if (accessionJob.value.non_tray_items.some(item => item.barcode_id == barcodeDetails.value.id)) {
        // get the scanned non tray item barcode info
        await getAccessionNonTrayItem(barcode_value)
      } else {
        await addContainerItem()
      }

      // set the scanned item barcode as the container id in the route
      router.push({
        name: 'accession-container',
        params: {
          jobId: accessionJob.value.workflow_id,
          containerId: accessionContainer.value.barcode.value
        }
      })
    }
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      persistent: true
    })
  } finally {
    appActionIsLoadingData.value = false
    barcodeEditModal.value.hideModal()
  }
}
const resetBarcodeEdit = () => {
  showBarcodeEdit.value = false
  manualBarcodeEdit.value = ''
}
const setBarcodeEditDisplay = () => {
  showBarcodeEdit.value = true
  if (selectedItems.value.length == 1) {
    manualBarcodeEdit.value = selectedItems.value[0].barcode.value
  }
}
const addContainerItem = async () => {
  try {
    const currentDate = new Date()
    if ( accessionJob.value.trayed ) {
      // TODO: Remove this hardcoded item data since it will mostly come from folio
      const payload = {
        accession_dt: currentDate,
        accession_job_id: accessionJob.value.id,
        arbitrary_data: 'Signed copy',
        barcode_id: barcodeDetails.value.id,
        condition: 'Good',
        media_type_id: accessionContainer.value.media_type_id,
        scanned_for_accession: true,
        size_class_id: accessionContainer.value.size_class_id,
        status: 'In',
        title: 'Lord of The Ringss',
        tray_id: accessionContainer.value.id,
        volume: 'I',
        withdrawal_dt: currentDate
      }
      await postAccessionTrayItem(payload)
    } else {
      const payload = {
        accession_dt: currentDate,
        accession_job_id: accessionJob.value.id,
        barcode_id: barcodeDetails.value.id,
        media_type_id: accessionJob.value.media_type_id,
        scanned_for_accession: accessionJob.value.media_type_id && accessionJob.value.size_class_id ? true : false,
        size_class_id: accessionJob.value.size_class_id,
        status: 'In',
        withdrawal_dt: currentDate
      }
      await postAccessionNonTrayItem(payload)
    }
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      persistent: true
    })
  }
}
const updateContainerItem = async (barcode_value) => {
  try {
    appActionIsLoadingData.value = true
    // update the barcode in the system
    await patchBarcode(selectedItems.value[0].barcode.id, barcode_value)

    // update the container item along with the selected item in the table to match the manualEditBarcode text
    if (accessionJob.value.trayed) {
      const itemPayload = {
        id: selectedItems.value[0].id,
        barcode: {
          value: barcode_value
        }
      }
      await patchAccessionTrayItem(itemPayload)
    } else {
      const itemPayload = {
        id: selectedItems.value[0].id,
        barcode: {
          value: barcode_value
        }
      }
      await patchAccessionNonTrayItem(itemPayload)

      router.push({
        name: 'accession-container',
        params: {
          jobId: accessionJob.value.workflow_id,
          containerId: barcode_value
        }
      })
    }
    selectedItems.value[0].barcode.value = barcode_value

    handleAlert({
      type: 'success',
      text: 'The item has been updated.',
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      persistent: true
    })
  } finally {
    // clear out any selected items in the table
    accessionTableComponent.value.clearSelectedData()
    appActionIsLoadingData.value = false
    barcodeEditModal.value.hideModal()
  }
}
const deleteContainerItem = async () => {
  try {
    appActionIsLoadingData.value = true
    const itemsToRemove = selectedItems.value.map(item => item.id)
    if (accessionJob.value.trayed) {
      await deleteAccessionTrayItem(itemsToRemove)
    } else {
      await deleteAccessionNonTrayItem(itemsToRemove)

      router.push({
        name: 'accession',
        params: {
          jobId: accessionJob.value.workflow_id
        }
      })
    }

    // delete the barcodes from the system after we delete the item to get rid of the association in the database
    await Promise.all(selectedItems.value.map(item => {
      return deleteBarcode(item.barcode.id)
    }))

    handleAlert({
      type: 'success',
      text: 'The selected item(s) has been removed.',
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      persistent: true
    })
  } finally {
    // clear out any selected items in the table
    accessionTableComponent.value.clearSelectedData()
    appActionIsLoadingData.value = false
  }
}

const handleConfirmation = async (confirmType) => {
  if (confirmType == 'delete') {
    await deleteContainerItem()
  } else if (confirmType == 'completeJob') {
    await completeAccessionJob()
  } else if (confirmType == 'completePrint') {
    await completeAccessionJob()

    // print the job after completion
    batchSheetComponent.value.printBatchReport()
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

const addNewTray = async () => {
  //mark the current tray as complete since you can only add a new tray if the current tray has all its items
  await patchAccessionTray({ id: accessionContainer.value.id, collection_accessioned: true })

  // clear out the accession container data in store
  resetAccessionContainer()

  // route the user back to the job so we can scan a new tray container barcode
  router.push({
    name: 'accession',
    params: {
      jobId: accessionJob.value.workflow_id
    }
  })
}

const updateAccessionJobStatus = async (status) => {
  try {
    const payload = {
      id: accessionJob.value.id,
      status
    }

    await patchAccessionJob(payload)

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
const completeAccessionJob = async () => {
  try {
    appActionIsLoadingData.value = true
    //if were in a tray job we need to mark the current tray collection as complete before completing the job
    if (accessionJob.value.trayed && !accessionContainer.value.collection_accessioned) {
      await patchAccessionTray({ id: accessionContainer.value.id, collection_accessioned: true })
    }

    const payload = {
      id: accessionJob.value.id,
      status: 'Completed'
    }
    await patchAccessionJob(payload)

    handleAlert({
      type: 'success',
      text: 'The Job has been completed and moved for verification.',
      autoClose: true
    })

    // route the user back to the accession init dashboard
    router.push({
      name: 'accession',
      params: {
        jobId: null
      }
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      persistent: true
    })
  } finally {
    appActionIsLoadingData.value = false
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