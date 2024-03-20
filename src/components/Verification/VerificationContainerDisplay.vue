<template>
  <div
    class="row verification-container flex-lg-grow"
  >
    <VerificationNonTrayInfo
      v-if="!verificationJob.trayed"
      ref="nonTrayInfoComponent"
    />
    <VerificationTrayInfo
      v-else
      ref="trayInfoComponent"
    />

    <!-- scan item section -->
    <div class="col-12 col-lg-8 col-xl-9 verification-container-scan">
      <div class="row items-center q-mb-xs-md q-mb-sm-lg">
        <div
          v-if="currentScreenSize == 'xs'"
          class="col-auto"
        >
          <MoreOptionsMenu
            v-if="!verificationJob.trayed"
            :options="[{
              text: `${selectedItems.length == 1 ? 'Edit Barcode' : 'Enter Barcode'}`,
              disabled: !verificationContainer.id || verificationJob.status == 'Paused'
            }, {
              text: 'Delete Items',
              disabled: selectedItems.length == 0 || verificationJob.status == 'Paused'
            }]"
            class="q-mr-sm"
            @click="handleOptionMenu"
          />
          <MoreOptionsMenu
            v-else
            :options="[{
              text: 'Next Tray',
              disabled: !verificationContainer.id || !allItemsVerified || verificationJob.status == 'Paused'
            }, {
              text: `${selectedItems.length == 1 ? 'Edit Barcode' : 'Enter Barcode'}`,
              disabled: !verificationContainer.id || verificationJob.status == 'Paused'
            }, {
              text: 'Delete Items',
              disabled: selectedItems.length == 0 || verificationJob.status == 'Paused'
            }]"
            class="q-mr-sm"
            @click="handleOptionMenu"
          />
        </div>
        <div
          v-else
          class="col-auto"
        >
          <MoreOptionsMenu
            :options="[{ text: 'Print Job' }]"
            class="q-mr-sm"
            @click="handleOptionMenu"
          />
        </div>

        <div class="col-auto">
          <h2 class="text-h4 text-bold">
            Scan Items
          </h2>
        </div>

        <div class="col-auto q-ml-xs-auto q-ml-sm-sm">
          <span class="outline text-h6">
            {{ !verificationJob.trayed ? verificationJob.non_tray_items.length : verificationContainer.items.length }} Items
          </span>
        </div>

        <div
          v-if="currentScreenSize !== 'xs' && verificationJob.trayed && verificationJob.trays.length > 0"
          class="col-xs-12 col-sm-auto q-ml-sm-auto"
        >
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Next Tray"
            class="text-body1"
            :disabled="verificationJob.status == 'Paused' || !allItemsVerified || allTraysCompleted"
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
            :disabled="verificationJob.trayed && !verificationContainer.id || verificationJob.status == 'Paused'"
            @click="setBarcodeEditDisplay"
          />

          <q-btn
            no-caps
            unelevated
            icon="mdi-delete"
            color="negative"
            label="Delete"
            class="btn-no-wrap text-body1"
            :disabled="selectedItems.length == 0 || verificationJob.status == 'Paused'"
            @click="showConfirmation = { type: 'delete', text:'Are you sure you want to delete selected items?' }"
          />
        </div>

        <div
          v-if="currentScreenSize !== 'xs'"
          class="col-xs-12 col-md-auto flex justify-between"
        >
          <q-btn
            no-caps
            unelevated
            outline
            :icon="verificationJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
            color="accent"
            :label="verificationJob.status !== 'Paused' ? 'Pause Job' : 'Resume Job'"
            class="btn-no-wrap text-body1"
            @click="verificationJob.status !== 'Paused' ? updateVerificationJobStatus('Paused') : updateVerificationJobStatus('Running')"
          />
          <q-btn
            no-caps
            unelevated
            icon="check"
            color="positive"
            label="Complete Job"
            class="btn-no-wrap text-body1 q-ml-sm"
            :class="currentScreenSize == 'xs' ? 'full-width' : ''"
            :outline="!allTraysCompleted || !allItemsVerified || verificationJob.status == 'Paused'"
            :disabled="!allTraysCompleted || !allItemsVerified || verificationJob.status == 'Paused'"
            @click="showConfirmation = { type: 'completeJob', text:'Are you sure you want to complete the job?' }"
          />
        </div>
      </div>

      <div class="row q-mb-xs-xl q-mb-sm-none">
        <div class="col-12 q-mb-xs-md q-mb-sm-none">
          <EssentialTable
            ref="verificationTableComponent"
            :table-columns="verificationTableColumns"
            :table-data="verificationJob.trayed ? verificationContainer.items : verificationJob.non_tray_items"
            :disable-table-reorder="true"
            :hide-table-rearrange="true"
            :enable-selection="true"
            @selected-data="selectedItems = $event"
          >
            <template #table-td="{ props, colName, value }">
              <span
                v-if="colName == 'id' && verificationJob.trayed"
                :class="props.row.scanned_for_accession == false ? 'disabled' : ''"
              >
                {{ value }}
              </span>
              <span
                v-else-if="colName == 'id' && !verificationJob.trayed"
                :class="props.row.scanned_for_accession == true || verificationContainer.id == props.row.id ? '' : 'disabled'"
              >
                {{ value }}
              </span>

              <span
                v-if="colName == 'verified'"
                class="text-bold"
                :class="value == true ? 'text-positive' : value == 'not found' ? 'text-negative' : ''"
              >
                {{ value == true ? 'Item Verified' : value == 'not found' ? 'Item Not Found' : '' }}
                <q-icon
                  v-if="value == true"
                  name="mdi-check-circle"
                  color="positive"
                  size="25px"
                  class="text-bold q-ml-xs"
                />
                <q-icon
                  v-else-if="value == 'not found'"
                  name="close"
                  color="negative"
                  size="25px"
                  class="text-bold q-ml-xs"
                />
              </span>
            </template>
          </EssentialTable>
        </div>
      </div>
    </div>

    <!-- mobile actions menu -->
    <!-- <div
      v-if="currentScreenSize == 'xs'"
      class="verification-container-mobile-menu"
    >
      <template v-if="editMode">
        <q-btn
          no-caps
          unelevated
          color="accent"
          label="Save Edits"
          class="full-width text-body1"
          @click="verificationContainer.id == null ? updateVerificationJob() : updateVerificationContainer()"
          :disabled="verificationJob.status == 'Paused'"
        />

        <q-space class="q-mx-xs" />

        <q-btn
          no-caps
          unelevated
          outline
          color="accent"
          label="Cancel"
          class="full-width text-body1"
          @click="verificationContainer.id == null ? cancelJobEdit() : cancelContainerEdit()"
        />
      </template>

      <template v-else>
        <q-btn
          no-caps
          unelevated
          outline
          :icon="verificationJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
          color="accent"
          :label="verificationJob.status !== 'Paused' ? 'Pause Job' : 'Resume Job'"
          class="btn-no-wrap text-body1 full-width"
          @click="verificationJob.status !== 'Paused' ? updateVerificationJobStatus('Paused') : updateVerificationJobStatus('Running')"
        />

        <q-space class="q-mx-xs" />

        <q-btn
          no-caps
          unelevated
          icon="check"
          color="positive"
          label="Complete Job"
          class="btn-no-wrap text-body1 full-width"
          :outline="!allTraysCompleted || !allItemsVerified || verificationJob.status == 'Paused'"
          :disabled="!allTraysCompleted || !allItemsVerified || verificationJob.status == 'Paused'"
          @click="showConfirmation = 'Are you sure you want to complete the job?'"
        />
      </template>
    </div> -->
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
          @click="validateItemBarcode(manualBarcodeEdit); resetBarcodeEdit();"
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
    @confirm="handleConfirmationModal"
  />

  <!-- next tray modal (only for trayed jobs) -->
  <PopupModal
    v-if="showNextTrayModal"
    :title="'Select Tray'"
    :show-actions="false"
    @reset="showNextTrayModal = false"
  >
    <template #main-content="{ hideModal }">
      <q-card-section class="row verification-next-tray">
        <div
          v-for="tray in verificationJob.trays.filter(tray => tray.id !== verificationContainer.id && tray.scanned_for_verification == false)"
          :key="tray.id"
          class="col-12 q-mb-sm"
        >
          <q-btn
            no-caps
            outline
            color="secondary"
            class="verification-next-tray-action full-width"
            @click="setActiveVerificationTray(tray.id); hideModal();"
          >
            <div class="col-grow text-left">
              <p class="text-h6 text-color-black">
                Tray #: {{ tray.id }}
              </p>
              <p class="text-body1">
                Trayed
              </p>
            </div>

            <div class="col-auto">
              <p
                class="text-body1"
                :class="!tray.scanned_for_verification ? 'outline text-highlight-red' : ''"
              >
                {{ !tray.scanned_for_verification ? 'Not Started' : 'In Progress' }}
              </p>
            </div>
          </q-btn>
        </div>
      </q-card-section>
    </template>
  </PopupModal>

  <!-- print component used to handle printing the template -->
  <VerificationBatchSheet
    ref="batchSheetComponent"
    :verification-job-details="verificationJob"
  />
</template>

<script setup>
import { ref, watch, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useVerificationStore } from '@/stores/verification-store'
import { useBarcodeStore } from '@/stores/barcode-store'
import { useOptionStore } from '@/stores/option-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from '@/components/EssentialTable.vue'
import TextInput from '@/components/TextInput.vue'
import PopupModal from '@/components/PopupModal.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import VerificationTrayInfo from '@/components/Verification/VerificationTrayInfo.vue'
import VerificationNonTrayInfo from '@/components/Verification/VerificationNonTrayInfo.vue'
import VerificationBatchSheet from '@/components/Verification/VerificationBatchSheet.vue'

const router = useRouter()
const route = useRoute()

// Composables
const { compiledBarCode } = useBarcodeScanHandler()
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { verifyBarcode } = useBarcodeStore()
const { barcodeDetails } = storeToRefs(useBarcodeStore())
const { sizeClass } = storeToRefs(useOptionStore())
const {
  resetVerificationContainer,
  getVerificationTray,
  patchVerificationJob,
  getVerificationTrayItem,
  getVerificationNonTrayItem,
  postVerificationTrayItem,
  postVerificationNonTrayItem,
  deleteVerificationTrayItem,
  deleteVerificationNonTrayItem
} = useVerificationStore()
const {
  allItemsVerified,
  allTraysCompleted,
  verificationJob,
  verificationContainer
} = storeToRefs(useVerificationStore())

// Local Data
const batchSheetComponent = ref(null)
const isLoading = ref(false)
const verificationTableComponent = ref(null)
const verificationTableColumns = ref([
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

// Logic
const handleAlert = inject('handle-alert')

watch(route, () => {
  if (!route.params.containerId) {
    // if the user clicks to go back to the job in the breadcrumb
    // clear out any verificationContainer State if there is no containerId in the route
    resetVerificationContainer()
  }
})

watch(compiledBarCode, (barcode_value) => {
  if (barcode_value !== '' && verificationJob.value.trayed && verificationContainer.value.id) {
    // if were in a trayed job only trigger scan if we already loaded a tray container
    triggerItemScan(barcode_value)
  } else if (barcode_value !== '' && verificationJob.value.trayed == false) {
    triggerItemScan(barcode_value)
  }
})
const triggerItemScan = async (barcode_value) => {
  try {
    // example barcode for trayed item 'BK123'
    // check if the barcode is in the system otherwise create it
    await verifyBarcode(barcode_value)

    if (verificationJob.value.trayed) {
      // check if the scanned barcode already exists in the tray job if not add it
      if (verificationJob.value.trayed && verificationContainer.value.items.some(item => item.barcode_id == barcodeDetails.value.id)) {
        await validateItemBarcode()
      } else {
        await addContainerItem(barcode_value)
      }
    } else {
      // example barcode for non tray item: 'CL555923'
      // check if the scanned barcode already exists in the non tray job if not add it
      if (verificationJob.value.non_tray_items.some(item => item.barcode_id == barcodeDetails.value.id)) {
        // get the scanned non tray item barcode info
        await getVerificationNonTrayItem(verificationJob.value.non_tray_items.find(item => item.barcode_id == barcodeDetails.value.id).id)
      } else {
        await addContainerItem(barcode_value)
      }

      // set the scanned item as the container id in the route
      router.push({
        name: 'verification-container',
        params: {
          jobId: verificationJob.value.id,
          containerId: verificationContainer.value.id
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
const validateItemBarcode = async () => {
  try {
    isLoading.value = true
    // get the passed in item barcodes data
    if (verificationJob.trayed) {
      // tray items will be marked as verified after getting their data since these match the verification job
      const trayItemId = verificationContainer.value.items.some(item => item.barcode_id == barcodeDetails.value.id).id
      await getVerificationTrayItem(trayItemId)
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
const addContainerItem = async (barcode_value) => {
  try {
    const currentDate = new Date()
    if ( verificationJob.value.trayed ) {
      // TODO: Rremove this hardcoded item data since it will mostly come from folio?
      const payload = {
        arbitrary_data: 'Signed copy',
        barcode_id: barcodeDetails.value.id,
        condition: 'Good',
        media_type_id: verificationContainer.value.media_type_id,
        owner_id: verificationJob.value.owner_id,
        size_class_id: verificationContainer.value.size_class_id,
        status: 'In',
        title: 'Lord of The Ringss',
        tray_id: verificationContainer.value.id,
        volume: 'I',
        withdrawal_dt: currentDate
      }
      await postVerificationTrayItem(payload)
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
        barcode_id: barcodeDetails.value.id,
        media_type_id: verificationJob.value.media_type_id,
        owner_id: verificationJob.value.owner_id,
        size_class_id: generateSizeClass
      }
      await postVerificationNonTrayItem(payload)
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
const deleteContainerItem = async () => {
  try {
    const barcodesToRemove = selectedItems.value.map(item => item.id)
    if (verificationJob.value.trayed) {
      //TODO: do we need to delete barcode as well?
      await deleteVerificationTrayItem(barcodesToRemove)
    } else {
      await deleteVerificationNonTrayItem(barcodesToRemove)

      router.push({
        name: 'verification',
        params: {
          jobId: verificationJob.value.id
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
    verificationTableComponent.value.clearSelectedData()
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

const handleConfirmationModal = async () => {
  if (showConfirmation.value.type == 'delete') {
    await deleteContainerItem()
  } else {
    await completeVerificationJob()
  }
}
const handleOptionMenu = (option) => {
  if (option.text == 'Print Job') {
    batchSheetComponent.value.printBatchReport()
  } else if (option.text == 'Enter Barcode' || option.text == 'Edit Barcode') {
    setBarcodeEditDisplay()
  } else if (option.text == 'Delete Items') {
    showConfirmation.value = { type: 'delete', text:'Are you sure you want to delete selected items?' }
  } else if (option.text == 'Next Tray') {
    showNextTrayModal.value = !showNextTrayModal.value
  }
}

const setActiveVerificationTray = async (barcode) => {
  //TODO: need to see if we wont need this since when you select a new tray we usually send the user back to the job and wait for new tray scan?
  try {
    await getVerificationTray(barcode)

    //TODO: need a way to set the retrieved tray scanned_for_verification as true since this will be the current active tray for the job

    router.push({ name: 'verification', params: { jobId: verificationJob.value.id } })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  }
}
const updateVerificationJobStatus = async (status) => {
  try {
    const payload = {
      id: route.params.jobId,
      status
    }
    await patchVerificationJob(payload)

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
const completeVerificationJob = async () => {
  try {
    const payload = {
      id: route.params.jobId,
      status: 'Completed'
    }
    await patchVerificationJob(payload)

    handleAlert({
      type: 'success',
      text: 'The Job has been completed.',
      autoClose: true
    })

    // route the user back to the verification dashboard
    router.push({
      name: 'verification',
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
.verification-container {
  width: 100%;
  height: auto;

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

  &-mobile-menu {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    padding: 8px;
    background-color: $color-white;
    z-index: 2000;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1), 0 0px 10px rgba(0, 0, 0, 0.12);
    }
  }
}

.verification-next-tray {
  &-action {
    min-height: 72px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
}
</style>
