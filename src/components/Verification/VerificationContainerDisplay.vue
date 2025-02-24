<template>
  <div class="row verification-container flex-lg-grow">
    <VerificationNonTrayInfo
      v-if="!verificationJob.trayed"
      ref="nonTrayInfoComponent"
      @print="handleOptionMenu({ text: 'Print Job' })"
    />
    <VerificationTrayInfo
      v-else
      ref="trayInfoComponent"
      @print="handleOptionMenu({ text: 'Print Job' })"
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
            :options="[
              {
                text: `${
                  selectedItems.length == 1 ? 'Edit Barcode' : 'Enter Barcode'
                }`,
                disabled:
                  verificationJob.status == 'Paused' || verificationJob.status == 'Completed' || barcodeScanAllowed,
              },
              {
                text: 'Delete Items',
                disabled:
                  selectedItems.length == 0 ||
                  verificationJob.status == 'Paused' ||
                  verificationJob.status == 'Completed'
              },
            ]"
            class="q-mr-sm"
            @click="handleOptionMenu"
          />
          <MoreOptionsMenu
            v-else
            :options="[
              {
                text: `${
                  !verificationContainer.id ? 'View Trays' : 'Next Tray'
                }`,
                disabled:
                  !allItemsVerified ||
                  verificationJob.status == 'Paused' ||
                  verificationJob.status == 'Completed' ||
                  verificationJob.trays.length <= 1
              },
              {
                text: `${
                  selectedItems.length == 1 ? 'Edit Barcode' : 'Enter Barcode'
                }`,
                disabled:
                  !verificationContainer.id ||
                  verificationJob.status == 'Paused' ||
                  verificationJob.status == 'Completed' ||
                  barcodeScanAllowed,
              },
              {
                text: 'Delete Items',
                disabled:
                  selectedItems.length == 0 ||
                  verificationJob.status == 'Paused' ||
                  verificationJob.status == 'Completed'
              },
            ]"
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
            {{
              !verificationJob.trayed
                ? verificationJob.non_tray_items.length
                : verificationContainer.items.length
            }}
            Items
          </span>
        </div>

        <div
          v-if="
            currentScreenSize !== 'xs' &&
              verificationJob.trayed &&
              verificationJob.trays.length > 1
          "
          class="col-xs-12 col-sm-auto q-ml-sm-auto"
        >
          <q-btn
            no-caps
            unelevated
            color="accent"
            :label="!verificationContainer.id ? 'View Trays' : 'Next Tray'"
            class="text-body1"
            :disabled="
              verificationJob.status == 'Paused' ||
                verificationJob.status == 'Completed' ||
                !allItemsVerified ||
                allTraysCompleted
            "
            @click="showNextTrayModal = !showNextTrayModal"
          />
        </div>
      </div>

      <div
        v-if="currentScreenSize !== 'xs'"
        class="row q-mb-xs-lg"
      >
        <div
          class="col-xs-12 col-md-auto flex no-wrap justify-between q-mb-xs-md q-mb-md-none q-mr-md-auto"
        >
          <q-btn
            no-caps
            unelevated
            icon="add"
            color="accent"
            :label="
              selectedItems.length == 1 ? 'Edit Barcode' : 'Enter Barcode'
            "
            class="btn-no-wrap text-body1 q-mr-sm-md"
            :disabled="
              (verificationJob.trayed && !verificationContainer.id) ||
                verificationJob.status == 'Paused' ||
                verificationJob.status == 'Completed' ||
                barcodeScanAllowed
            "
            @click="setBarcodeEditDisplay"
          />

          <q-btn
            no-caps
            unelevated
            icon="mdi-delete"
            color="negative"
            label="Delete"
            class="btn-no-wrap text-body1"
            :disabled="
              selectedItems.length == 0 || verificationJob.status == 'Paused' || verificationJob.status == 'Completed'
            "
            @click="
              showConfirmation = {
                type: 'delete',
                text: 'Are you sure you want to delete selected items?',
              }
            "
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
            :icon="
              verificationJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'
            "
            color="accent"
            :label="
              verificationJob.status !== 'Paused' ? 'Pause Job' : 'Resume Job'
            "
            class="btn-no-wrap text-body1"
            :disabled="verificationJob.status == 'Completed'"
            @click="
              verificationJob.status !== 'Paused'
                ? updateVerificationJobStatus('Paused')
                : updateVerificationJobStatus('Running')
            "
          />
          <q-btn
            no-caps
            unelevated
            icon="check"
            color="positive"
            label="Complete Job"
            class="btn-no-wrap text-body1 q-ml-sm"
            :class="currentScreenSize == 'xs' ? 'full-width' : ''"
            :outline="
              !allTraysCompleted ||
                !allItemsVerified ||
                verificationJob.status == 'Paused'
            "
            :disabled="
              !allTraysCompleted ||
                !allItemsVerified ||
                verificationJob.status == 'Paused' ||
                verificationJob.status == 'Completed'
            "
            @click="
              showConfirmation = {
                type: 'completeJob',
                text: 'Are you sure you want to complete the job?',
              }
            "
          />
        </div>
      </div>

      <div class="row q-mb-xs-xl q-mb-sm-none">
        <div class="col-12 q-mb-xs-md q-mb-sm-none">
          <EssentialTable
            ref="verificationTableComponent"
            :table-columns="verificationTableColumns"
            :table-data="
              verificationJob.trayed
                ? verificationContainer.items.slice().reverse()
                : verificationJob.non_tray_items.slice().reverse()
            "
            :hide-table-rearrange="true"
            :enable-selection="true"
            @selected-data="selectedItems = $event"
          >
            <template #table-td="{ props, colName, value }">
              <span
                v-if="colName == 'barcode_value' && verificationJob.trayed"
                :class="!props.row.scanned_for_verification ? 'disabled' : ''"
              >
                {{ value }}
              </span>
              <span
                v-else-if="
                  colName == 'barcode_value' && !verificationJob.trayed
                "
                :class="
                  props.row.scanned_for_verification ||
                    verificationContainer.id == props.row.id
                    ? ''
                    : 'disabled'
                "
              >
                {{ value }}
              </span>

              <span
                v-if="colName == 'verified'"
                class="text-bold"
                :class="
                  value == true
                    ? 'text-positive'
                    : value == 'not found'
                      ? 'text-negative'
                      : ''
                "
              >
                {{
                  value == true
                    ? "Item Verified"
                    : value == "not found"
                      ? "Item Not Found"
                      : ""
                }}
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
    <MobileActionBar
      v-if="currentScreenSize == 'xs' && !renderIsEditMode"
      button-one-color="accent"
      :button-one-icon="
        verificationJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'
      "
      :button-one-label="
        verificationJob.status == 'Paused' ? 'Resume Job' : 'Pause Job'
      "
      :button-one-outline="true"
      :button-one-disabled="verificationJob.status == 'Completed'"
      @button-one-click="
        verificationJob.status !== 'Paused'
          ? updateVerificationJobStatus('Paused')
          : updateVerificationJobStatus('Running')
      "
      button-two-color="positive"
      button-two-label="Complete Job"
      :button-two-outline="false"
      :button-two-disabled="
        !allTraysCompleted ||
          !allItemsVerified ||
          verificationJob.status == 'Paused' ||
          verificationJob.status == 'Completed'
      "
      :button-two-loading="appActionIsLoadingData"
      @button-two-click="
        showConfirmation = {
          type: 'completeJob',
          text: 'Are you sure you want to complete the job?',
        }
      "
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
          <label class="form-group-label"> Type Barcode </label>
          <TextInput
            v-model="manualBarcodeEdit"
            placeholder="Please Enter Barcode"
            @keyup.enter="
              selectedItems.length == 1
                ? updateContainerItem(manualBarcodeEdit)
                : triggerItemScan(manualBarcodeEdit)
            "
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
          label="Submit"
          class="text-body1 full-width"
          :disabled="!manualBarcodeEdit"
          :loading="appActionIsLoadingData"
          @click="
            selectedItems.length == 1
              ? updateContainerItem(manualBarcodeEdit)
              : triggerItemScan(manualBarcodeEdit)
          "
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
          @click="
            handleConfirmationModal('completePrint');
            hideModal();
          "
        />

        <q-space class="q-mx-xs" />

        <q-btn
          no-caps
          unelevated
          color="accent"
          label="Complete"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          @click="
            handleConfirmationModal('completeJob');
            hideModal();
          "
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
          class="text-body1 full-width"
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
          @click="
            handleConfirmationModal('delete');
            hideModal();
          "
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
      <q-card-section
        v-else-if="showConfirmation.type == 'addItem'"
        class="row no-wrap justify-between items-center q-pt-sm"
      >
        <q-btn
          no-caps
          unelevated
          color="accent"
          label="Add New Item"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          @click="
            handleConfirmationModal('addItem');
            hideModal();
          "
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

  <!-- next tray modal (only for trayed jobs) -->
  <PopupModal
    v-if="showNextTrayModal"
    :title="'Select Tray'"
    :show-actions="false"
    @reset="showNextTrayModal = false"
    aria-label="nextTrayModal"
  >
    <template #main-content="{ hideModal }">
      <q-card-section class="row verification-next-tray">
        <div
          v-for="tray in verificationJob.trays"
          :key="tray.id"
          class="col-12 q-mb-sm"
          role="list"
        >
          <q-item
            v-if="!verificationContainer.id"
            class="verification-next-tray-item"
          >
            <div class="col-12">
              <p class="text-h6 text-color-black">
                Tray #: {{ tray.barcode?.value }}
              </p>
            </div>
            <div class="col-grow text-left">
              <p class="text-body1">
                Trayed
              </p>
            </div>
            <div class="col-auto">
              <p
                class="text-body1 outline"
                :class="
                  tray.collection_verified
                    ? 'text-highlight'
                    : !tray.collection_verified && tray.scanned_for_verification
                      ? 'text-highlight-warning'
                      : 'text-highlight-negative'
                "
              >
                {{
                  tray.collection_verified
                    ? "Completed"
                    : !tray.collection_verified && tray.scanned_for_verification
                      ? "In Progress"
                      : "Not Started"
                }}
              </p>
            </div>
          </q-item>
          <q-item
            v-else-if="tray.id == verificationContainer.id"
            class="verification-next-tray-item"
          >
            <div class="col-12">
              <p class="text-h6 text-color-black">
                Tray #: {{ tray.barcode?.value }}
              </p>
            </div>
            <div class="col-grow text-left">
              <p class="text-body1">
                Trayed
              </p>
            </div>
            <div class="col-auto">
              <p class="text-body1 outline text-highlight">
                Completed
              </p>
            </div>
          </q-item>
          <q-item
            v-else
            class="q-pa-none"
          >
            <q-btn
              no-caps
              outline
              color="secondary"
              class="verification-next-tray-action full-width"
              @click="
                setNextVerificationTray();
                hideModal();
              "
            >
              <div class="col-12 text-left">
                <p class="text-h6 text-color-black">
                  Tray #: {{ tray.barcode?.value }}
                </p>
              </div>
              <div class="col-grow text-left">
                <p class="text-body1">
                  Trayed
                </p>
              </div>
              <div class="col-auto">
                <p
                  class="text-body1 outline"
                  :class="
                    tray.collection_verified
                      ? 'text-highlight'
                      : !tray.collection_verified &&
                        tray.scanned_for_verification
                        ? 'text-highlight-warning'
                        : 'text-highlight-negative'
                  "
                >
                  {{
                    tray.collection_verified
                      ? "Completed"
                      : !tray.collection_verified &&
                        tray.scanned_for_verification
                        ? "In Progress"
                        : "Not Started"
                  }}
                </p>
              </div>
            </q-btn>
          </q-item>
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
import { ref, watch, inject, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { useUserStore } from '@/stores/user-store'
import { useVerificationStore } from '@/stores/verification-store'
import { useBarcodeStore } from '@/stores/barcode-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from '@/components/EssentialTable.vue'
import TextInput from '@/components/TextInput.vue'
import PopupModal from '@/components/PopupModal.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'
import VerificationTrayInfo from '@/components/Verification/VerificationTrayInfo.vue'
import VerificationNonTrayInfo from '@/components/Verification/VerificationNonTrayInfo.vue'
import VerificationBatchSheet from '@/components/Verification/VerificationBatchSheet.vue'

const router = useRouter()
const route = useRoute()

// Composables
const { compiledBarCode } = useBarcodeScanHandler()
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const { userData } = storeToRefs(useUserStore())
const { verifyBarcode, patchBarcode, deleteBarcode } = useBarcodeStore()
const { barcodeDetails, barcodeScanAllowed } = storeToRefs(useBarcodeStore())
const {
  resetVerificationContainer,
  patchVerificationJob,
  patchVerificationTray,
  getVerificationNonTrayItem,
  postVerificationTrayItem,
  patchVerificationTrayItem,
  postVerificationNonTrayItem,
  patchVerificationNonTrayItem,
  deleteVerificationTrayItem,
  deleteVerificationNonTrayItem,
  verifyTrayItem,
  verifyNonTrayItem
} = useVerificationStore()
const {
  allItemsVerified,
  allTraysCompleted,
  verificationJob,
  verificationContainer
} = storeToRefs(useVerificationStore())

// Local Data
const barcodeEditModal = ref(null)
const batchSheetComponent = ref(null)
const trayInfoComponent = ref(null)
const nonTrayInfoComponent = ref(null)
const verificationTableComponent = ref(null)
const verificationTableColumns = ref([
  {
    name: 'barcode_value',
    field: (row) => renderItemBarcodeDisplay(row),
    label: 'Barcode',
    align: 'left',
    sortable: true
  },
  {
    name: 'verified',
    field: 'scanned_for_verification',
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
  } else if (
    nonTrayInfoComponent.value &&
    nonTrayInfoComponent.value.editMode
  ) {
    return true
  } else {
    return false
  }
})

// Logic
const handleAlert = inject('handle-alert')
const audioAlert = inject('audio-alert')
const renderItemBarcodeDisplay = inject('render-item-barcode-display')
const currentIsoDate = inject('current-iso-date')

watch(route, () => {
  if (!route.params.containerId) {
    // if the user clicks to go back to the job in the breadcrumb
    // clear out any verificationContainer State if there is no containerId in the route
    resetVerificationContainer()
  }
})

watch(compiledBarCode, (barcode_value) => {
  // ignore scans if job is paused
  if (verificationJob.value.status == 'Paused' || verificationJob.value.status == 'Completed') {
    return
  }

  if (
    barcode_value !== '' &&
    verificationJob.value.trayed &&
    verificationContainer.value.id
  ) {
    // if were in a trayed job only trigger scan if we already loaded a tray container
    triggerItemScan(barcode_value)
  } else if (barcode_value !== '' && verificationJob.value.trayed == false) {
    triggerItemScan(barcode_value)
  }
})
const triggerItemScan = async (barcode_value) => {
  try {
    appActionIsLoadingData.value = true
    // check if the barcode is in the system otherwise create it
    await verifyBarcode(barcode_value, 'Item', true)

    if (verificationJob.value.trayed) {
      // check if the scanned barcode already exists in the tray job if not add it
      if (
        verificationJob.value.trayed &&
        verificationContainer.value.items.some(
          (item) => item.barcode.id == barcodeDetails.value.id
        )
      ) {
        await validateItemBarcode()
      } else {
        // display alert to confirm adding new items at verification job level
        showConfirmation.value = {
          type: 'addItem',
          text: 'Are you sure you want to add a new item to the job?'
        }
        audioAlert()
      }
    } else {
      // check if we have a current active item and validate it if it hasnt been verified yet
      if (
        verificationContainer.value.id &&
        !verificationContainer.value.scanned_for_verification
      ) {
        await validateItemBarcode()
      }

      // check if the scanned barcode already exists in the non tray job if not add it
      if (
        verificationJob.value.non_tray_items.some(
          (item) => item.barcode_id == barcodeDetails.value.id
        )
      ) {
        // get the scanned non tray item barcode info
        await getVerificationNonTrayItem(barcode_value)
      } else {
        // display alert to confirm adding new items at verification job level
        showConfirmation.value = {
          type: 'addItem',
          text: 'Are you sure you want to add a new item to the job?'
        }
        audioAlert()
      }

      // set job status to running if it isnt already running
      if (verificationJob.value.status !== 'Running') {
        await updateVerificationJobStatus('Running')
      }

      // set the scanned item barcode as the container id in the route
      if (verificationContainer.value.id) {
        router.push({
          name: 'verification-container',
          params: {
            jobId: verificationJob.value.workflow_id,
            containerId: renderItemBarcodeDisplay(verificationContainer.value)
          }
        })
      }
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
const validateItemBarcode = async () => {
  try {
    appActionIsLoadingData.value = true
    // get the passed in item barcodes data
    if (verificationJob.value.trayed) {
      // tray items will be marked as verified when getting their data since these match the verification job
      const trayItemId = verificationContainer.value.items.find(
        (item) => item.barcode.id == barcodeDetails.value.id
      ).id
      await verifyTrayItem(trayItemId)
    } else {
      // non tray items will be marked as verified after user loads their data and verifies the inforamtion is correct or modifies the data
      const nonTrayItemId = verificationContainer.value.id
      await verifyNonTrayItem(nonTrayItemId)
    }
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
const addContainerItem = async () => {
  try {
    const currentDate = new Date()
    if (verificationJob.value.trayed) {
      // TODO: Remove this hardcoded item data since it will mostly come from folio?
      const payload = {
        accession_dt: verificationContainer.value.accession_dt,
        arbitrary_data: 'Signed copy',
        barcode_id: barcodeDetails.value.id,
        barcode_value: barcodeDetails.value.value,
        condition: 'Good',
        media_type_id: verificationContainer.value.media_type_id,
        scanned_for_verification: true,
        size_class_id: verificationContainer.value.size_class_id,
        status: 'In',
        title: 'Lord of The Ringss',
        tray_id: verificationContainer.value.id,
        verification_job_id: verificationJob.value.id,
        volume: 'I',
        withdrawal_dt: currentDate,
        user_id: userData.value.user_id
      }
      await postVerificationTrayItem(payload)
    } else {
      // TODO: figure out what payload data is actually needed here
      const payload = {
        barcode_id: barcodeDetails.value.id,
        barcode_value: barcodeDetails.value.value,
        media_type_id: verificationJob.value.media_type_id,
        size_class_id: verificationJob.value.size_class_id,
        status: 'In',
        verification_job_id: verificationJob.value.id,
        user_id: userData.value.user_id
      }
      await postVerificationNonTrayItem(payload)
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
    if (verificationJob.value.trayed) {
      const itemPayload = {
        id: selectedItems.value[0].id,
        barcode: {
          value: barcode_value
        }
      }
      await patchVerificationTrayItem(itemPayload)
    } else {
      const itemPayload = {
        id: selectedItems.value[0].id,
        barcode: {
          value: barcode_value
        }
      }
      await patchVerificationNonTrayItem(itemPayload)

      router.push({
        name: 'verification-container',
        params: {
          jobId: verificationJob.value.workflow_id,
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
    verificationTableComponent.value.clearSelectedData()
    appActionIsLoadingData.value = false
    barcodeEditModal.value.hideModal()
  }
}
const deleteContainerItem = async () => {
  try {
    appActionIsLoadingData.value = true
    const itemsToRemove = selectedItems.value.map((item) => {
      return {
        ...item,
        user_id: userData.value.user_id
      }
    })
    if (verificationJob.value.trayed) {
      await deleteVerificationTrayItem(itemsToRemove)
    } else {
      await deleteVerificationNonTrayItem(itemsToRemove)

      router.push({
        name: 'verification',
        params: {
          jobId: verificationJob.value.workflow_id
        }
      })
    }

    // delete the barcodes from the system after we delete the item to get rid of the association in the database
    await Promise.all(
      selectedItems.value.map((item) => {
        return deleteBarcode(item.barcode.id)
      })
    )

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
    appActionIsLoadingData.value = false
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
    manualBarcodeEdit.value = selectedItems.value[0].barcode.value
  }
}

const handleConfirmationModal = async (confirmType) => {
  if (confirmType == 'delete') {
    await deleteContainerItem()
  } else if (confirmType == 'addItem') {
    await addContainerItem()
  } else if (confirmType == 'completeJob') {
    await completeVerificationJob()
  } else if (confirmType == 'completePrint') {
    await completeVerificationJob()

    // print the job after completion
    batchSheetComponent.value.printBatchReport()
  }
}
const handleOptionMenu = (option) => {
  if (option.text == 'Print Job') {
    batchSheetComponent.value.printBatchReport()
  } else if (option.text == 'Enter Barcode' || option.text == 'Edit Barcode') {
    setBarcodeEditDisplay()
  } else if (option.text == 'Delete Items') {
    showConfirmation.value = {
      type: 'delete',
      text: 'Are you sure you want to delete selected items?'
    }
  } else if (option.text == 'View Trays' || option.text == 'Next Tray') {
    showNextTrayModal.value = !showNextTrayModal.value
  }
}

const setNextVerificationTray = async () => {
  try {
    // set the current tray to completed status since user can only go to the next tray if the current tray is done
    if (!verificationContainer.value.collection_verified) {
      const payload = {
        id: verificationContainer.value.id,
        collection_verified: true
      }
      await patchVerificationTray(payload)
    }

    // send the user back to the job and wait for next tray to be scanned
    router.push({
      name: 'verification',
      params: { jobId: verificationJob.value.workflow_id }
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      persistent: true
    })
  }
}
const updateVerificationJobStatus = async (status) => {
  try {
    const payload = {
      id: verificationJob.value.id,
      status,
      run_timestamp: currentIsoDate()
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
    appActionIsLoadingData.value = true
    const payload = {
      id: verificationJob.value.id,
      status: 'Completed',
      run_timestamp: currentIsoDate(),
      user_id: userData.value.user_id
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
      persistent: true
    })
  } finally {
    appActionIsLoadingData.value = false
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
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1),
        0 0px 10px rgba(0, 0, 0, 0.12);
    }
  }
}

.verification-next-tray {
  &-item {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
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
