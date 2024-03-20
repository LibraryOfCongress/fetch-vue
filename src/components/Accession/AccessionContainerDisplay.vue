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
              disabled: accessionJob.trayed && !accessionContainer.id || accessionJob.status == 'Paused'
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
              disabled: accessionJob.trayed && !accessionContainer.id || accessionJob.status == 'Paused'
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
            :disabled="accessionJob.trayed && !accessionContainer.id || accessionJob.status == 'Paused'"
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
            :table-data="accessionJob.trayed ? accessionContainer.items : accessionJob.non_tray_items"
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
          @click="selectedItems.length == 1 ? updateContainerItem(manualBarcodeEdit) : triggerItemScan(manualBarcodeEdit); resetBarcodeEdit();"
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
    :show-actions="false"
    @reset="showConfirmation = null"
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
          @click="handleConfirmation('completePrint'); hideModal();"
        />

        <q-space class="q-mx-xs" />

        <q-btn
          no-caps
          unelevated
          color="accent"
          label="Complete"
          class="text-body1 full-width"
          @click="handleConfirmation('completeJob'); hideModal();"
        />

        <q-space class="q-mx-lg" />

        <q-btn
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
import { useAccessionStore } from '@/stores/accession-store'
import { useBarcodeStore } from '@/stores/barcode-store'
import { useOptionStore } from '@/stores/option-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import AccessionNonTrayInfo from '@/components/Accession/AccessionNonTrayInfo.vue'
import AccessionTrayInfo from '@/components/Accession/AccessionTrayInfo.vue'
import EssentialTable from '@/components/EssentialTable.vue'
import TextInput from '@/components/TextInput.vue'
import PopupModal from '@/components/PopupModal.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import AccessionMobileActionBar from '@/components/Accession/AccessionMobileActionBar.vue'
import AccessionBatchSheet from '@/components/Accession/AccessionBatchSheet.vue'

const router = useRouter()
const route = useRoute()

// Composables
const { compiledBarCode } = useBarcodeScanHandler()
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { verifyBarcode, patchBarcode } = useBarcodeStore()
const { barcodeDetails } = storeToRefs(useBarcodeStore())
const { sizeClass } = storeToRefs(useOptionStore())
const {
  resetAccessionContainer,
  // verifyTrayItemBarcode,
  // verifyNonTrayItemBarcode,
  patchAccessionJob,
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
const isLoading = ref(false)
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
  if (barcode !== '' && accessionJob.value.trayed && accessionContainer.value.id) {
    // if were in a trayed job only trigger scan if we already loaded a tray container
    triggerItemScan(barcode)
  } else if (barcode !== '' && accessionJob.value.trayed == false) {
    triggerItemScan(barcode)
  }
})
const triggerItemScan = async (barcode) => {
  try {
    // example barcode for trayed item 'BK123'
    // check if the barcode is in the system otherwise create it
    await verifyBarcode(barcode)

    if (accessionJob.value.trayed) {
      // check if the scanned barcode already exists in the tray job if not add it
      if (accessionJob.value.trayed && accessionContainer.value.items.some(item => item.barcode_id == barcodeDetails.value.id)) {
        // validation is not needed in trays so we just return
        return
      } else {
        await addContainerItem(barcode)
      }
    } else {
      // example barcode for non tray item: 'CL555923'
      // check if the scanned barcode already exists in the non tray job if not add it
      if (accessionJob.value.non_tray_items.some(item => item.barcode_id == barcodeDetails.value.id)) {
        // get the scanned non tray item barcode info
        await getAccessionNonTrayItem(accessionJob.value.non_tray_items.find(item => item.barcode_id == barcodeDetails.value.id).id)

        //if barcode does exist, check if hte media_type was set then trigger a validation if it wasnt already validated
        if (!accessionContainer.value.scanned_for_accession && accessionContainer.value.media_type_id) {
          await validateContainerItemBarcode()
        }
      } else {
        await addContainerItem(barcode)
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
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  }
}
const validateContainerItemBarcode = async () => {
  try {
    isLoading.value = true

    // we only need to validate items for non trays
    const itemPayload = {
      id: accessionContainer.value.id,
      scanned_for_accession: true
    }
    await patchAccessionNonTrayItem(itemPayload)

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
    manualBarcodeEdit.value = selectedItems.value[0].barcode.value
  }
}
const addContainerItem = async (barcode_value) => {
  try {
    const currentDate = new Date()
    if ( accessionJob.value.trayed ) {
      // TODO: Rremove this hardcoded item data since it will mostly come from folio
      const payload = {
        accession_dt: currentDate,
        arbitrary_data: 'Signed copy',
        barcode_id: barcodeDetails.value.id,
        condition: 'Good',
        media_type_id: accessionContainer.value.media_type_id,
        owner_id: accessionJob.value.owner_id,
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
      const generateSizeClass = sizeClass.value.find(size => size.short_name == barcode_value.slice(0, 2))?.id
      if (!generateSizeClass) {
        handleAlert({
          type: 'error',
          text: `The item can not be added, the container size ${barcode_value.slice(0, 2)} doesnt exist in the system. Please add it and try again.`,
          autoClose: true
        })
        return
      }

      // TODO: figure out what payload data is actually needed here
      const payload = {
        accession_dt: currentDate,
        accession_job_id: accessionJob.value.id,
        barcode_id: barcodeDetails.value.id,
        media_type_id: accessionJob.value.media_type_id,
        owner_id: accessionJob.value.owner_id,
        scanned_for_accession: false,
        size_class_id: generateSizeClass,
        status: 'In',
        withdrawal_dt: currentDate
      }
      await postAccessionNonTrayItem(payload)
    }

    handleAlert({
      type: 'success',
      text: 'The item has been added.',
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
const updateContainerItem = async (barcode_value) => {
  try {
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
          jobId: accessionJob.value.id,
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
    if (accessionJob.value.trayed) {
      //TODO: do we need to delete barcode as well?
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
  // clear out the accession container data in store
  resetAccessionContainer()

  // route the user back to the job so we can scan a new tray container barcode
  router.push({
    name: 'accession',
    params: {
      jobId: accessionJob.value.id
    }
  })
}

const updateAccessionJobStatus = async (status) => {
  try {
    const payload = {
      id: route.params.jobId,
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
    const payload = {
      id: route.params.jobId,
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