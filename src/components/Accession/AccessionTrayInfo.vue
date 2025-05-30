<template>
  <div class="col-12 col-lg-4 col-xl-3 accession-container-info">
    <div class="row">
      <div class="col-12 flex no-wrap items-center q-mb-xs-md q-mb-sm-lg">
        <MoreOptionsMenu
          :options="!route.params.containerId ? [
            { text: 'Edit', disabled: accessionJob.status == 'Completed' },
            { text: 'Cancel Job', optionClass: 'text-negative', disabled: accessionJob.status == 'Completed', hidden: !checkUserPermission('can_cancel_accession')},
            { text: 'Print Job' },
            { text: 'View History' }
          ] : [
            { text: 'Edit', disabled: accessionJob.status == 'Completed'},
            { text: 'Cancel Job', optionClass: 'text-negative', disabled: accessionJob.status == 'Completed', hidden: !checkUserPermission('can_cancel_accession')},
            { text: 'Edit Tray Barcode', disabled: barcodeScanAllowed || accessionJob.status == 'Completed'},
            { text: 'Delete Tray', optionClass: 'text-negative', disabled: accessionJob.status == 'Completed'},
            { text: 'Print Job' },
            { text: 'View History' }
          ]"
          class="q-mr-sm"
          @click="handleOptionMenu"
        />
        <h1 class="text-h4 text-bold">
          {{ `Job: ${accessionJob.workflow_id}` }}
        </h1>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-12 q-mb-xs-md q-mb-sm-none q-mb-lg-lg">
        <BarcodeBox
          :barcode="!route.params.containerId ? 'Please Scan Tray' : accessionContainer.barcode?.value"
          class="q-mb-md-xl q-mb-lg-none"
        />
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-12">
        <div class="row">
          <div class="accession-container-info-details col-xs-6 col-sm-12 q-mb-xs-sm q-mb-lg-lg">
            <label class="text-h6 q-mb-xs">
              Owner
            </label>
            <p
              class="outline"
            >
              {{ accessionJob.owner?.name }}
            </p>
          </div>

          <div class="accession-container-info-details col-xs-6 col-sm-12 q-mb-xs-sm q-mb-lg-lg">
            <label class="text-h6 q-mb-xs">
              Container Type
            </label>
            <p>
              Trayed
            </p>
          </div>

          <div class="accession-container-info-details col-xs-6 col-sm-12 q-mb-xs-sm q-mb-lg-lg">
            <label class="text-h6 q-mb-xs">
              Container Size
            </label>
            <p
              :class="accessionContainer.id ? 'outline' : ''"
            >
              {{ accessionContainer.size_class?.name }}
            </p>
          </div>

          <div class="accession-container-info-details col-xs-6 col-sm-12">
            <label class="text-h6 q-mb-xs">
              Media Type
            </label>
            <p
              v-if="!editMode"
              :class="accessionJob.media_type || accessionContainer.media_type ? 'outline text-highlight' : ''"
            >
              {{ !accessionContainer.id ? accessionJob.media_type?.name : accessionContainer.media_type?.name }}
            </p>
            <template v-else>
              <SelectInput
                v-if="!accessionContainer.id"
                aria-label="mediaTypeSelect"
                v-model="accessionJob.media_type_id"
                :options="mediaTypes"
                :clearable="false"
                option-type="mediaTypes"
                option-value="id"
                option-label="name"
              />
              <SelectInput
                v-else
                aria-label="mediaTypeSelect"
                v-model="accessionContainer.media_type_id"
                :options="mediaTypes"
                :clearable="false"
                option-type="mediaTypes"
                option-value="id"
                option-label="name"
              />
            </template>
          </div>
        </div>

        <div
          v-if="currentScreenSize !== 'xs' && editMode"
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
              :loading="appActionIsLoadingData"
              @click="!accessionContainer.id ? updateTrayJob() : updateTrayContainer()"
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
              @click="cancelTrayEdits"
            />
          </div>
        </div>
      </div>

      <!-- mobile actions menu -->
      <MobileActionBar
        v-if="currentScreenSize == 'xs' && editMode"
        button-one-color="accent"
        button-one-label="Save Edits"
        :button-one-outline="false"
        :button-one-loading="appActionIsLoadingData"
        @button-one-click="!accessionContainer.id ? updateTrayJob() : updateTrayContainer()"
        button-two-color="accent"
        button-two-label="Cancel"
        :button-two-outline="true"
        @button-two-click="cancelTrayEdits"
      />
    </div>
  </div>

  <!-- tray barcode edit modal -->
  <PopupModal
    v-if="showEditTrayModal"
    ref="trayBarcodeModal"
    :title="'Edit Tray Barcode'"
    @reset="showEditTrayModal = false; trayBarcodeInput = '';"
    aria-label="trayBarcodeEditModal"
  >
    <template #main-content>
      <q-card-section class="column no-wrap items-center">
        <div class="form-group">
          <label class="form-group-label">
            Type Barcode
          </label>
          <TextInput
            v-model="trayBarcodeInput"
            placeholder="Please Enter Tray Barcode"
            @keyup.enter="!trayBarcodeInput ? null : updateTrayContainerBarcode()"
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
          :disabled="!trayBarcodeInput"
          :loading="appActionIsLoadingData"
          @click="updateTrayContainerBarcode"
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
    v-if="showConfirmationModal"
    ref="confirmationModal"
    :title="'Delete'"
    :text="showConfirmationModal == 'CancelJob' ? 'Are you sure you want to cancel the accession job? Warning: All associated trays and items will be deleted.' : 'Are you sure you want to delete the tray? Warning: All associated tray items will be deleted.'"
    :show-actions="false"
    @reset="showConfirmationModal = null"
    aria-label="confirmationModal"
  >
    <template #footer-content="{ hideModal }">
      <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
        <q-btn
          v-if="showConfirmationModal == 'CancelJob'"
          no-caps
          unelevated
          color="negative"
          label="Cancel Job"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          @click="cancelAccessionJob()"
        />
        <q-btn
          v-else
          no-caps
          unelevated
          color="negative"
          label="Delete Tray"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          @click="removeTrayContainer()"
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

  <!-- audit trail modal -->
  <AuditTrail
    v-if="showAuditTrailModal"
    ref="historyModal"
    @reset="showAuditTrailModal = null"
    :job-type="showAuditTrailModal"
    :job-id="accessionJob.id"
  />
</template>

<script setup>
import { ref, watch, toRaw, inject, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import { usePermissionHandler } from '@/composables/usePermissionHandler.js'
import { useGlobalStore } from '@/stores/global-store'
import { useBarcodeStore } from '@/stores/barcode-store'
import { useAccessionStore } from '@/stores/accession-store'
import { useOptionStore } from '@/stores/option-store'
import BarcodeBox from '@/components/BarcodeBox.vue'
import SelectInput from '@/components/SelectInput.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'
import PopupModal from '@/components/PopupModal.vue'
import TextInput from '@/components/TextInput.vue'
import AuditTrail from '@/components/AuditTrail.vue'

const route = useRoute()
const router = useRouter()

// Composables
const { currentScreenSize } = useCurrentScreenSize()
const { compiledBarCode } = useBarcodeScanHandler()
const { checkUserPermission } = usePermissionHandler()

// Store Data
const { appIsLoadingData, appActionIsLoadingData } = storeToRefs(useGlobalStore())
const { verifyBarcode } = useBarcodeStore()
const { barcodeDetails, barcodeScanAllowed } = storeToRefs(useBarcodeStore())
const {
  sizeClass,
  mediaTypes
} = storeToRefs(useOptionStore())
const {
  getOptions
} = useOptionStore()
const {
  patchAccessionJob,
  getAccessionTray,
  postAccessionTray,
  patchAccessionTray,
  deleteAccessionTray,
  deleteAccessionTrayItem
} = useAccessionStore()
const {
  accessionJob,
  accessionContainer,
  originalAccessionContainer,
  originalAccessionJob
} = storeToRefs(useAccessionStore())

// Emits
const emit = defineEmits(['print'])

// Local Data
const editMode = ref(false)
const confirmationModal = ref(null)
const showConfirmationModal = ref(false)
const trayBarcodeModal = ref(null)
const showEditTrayModal = ref(false)
const trayBarcodeInput = ref('')
const historyModal = ref(null)
const showAuditTrailModal = ref(false)

// Logic
const handleAlert = inject('handle-alert')
const renderItemBarcodeDisplay = inject('render-item-barcode-display')

watch(route, () => {
  if (!route.params.containerId) {
    // if the user clicks to go back to the job in the breadcrumb
    // we need to kick the user out of the edit mode
    editMode.value = false
  }
})

const handleOptionMenu = async (option) => {
  if (option.text == 'Edit') {
    editMode.value = true
  } else if (option.text == 'Cancel Job') {
    showConfirmationModal.value = 'CancelJob'
  } else if (option.text == 'Edit Tray Barcode') {
    trayBarcodeInput.value = accessionContainer.value.barcode.value
    showEditTrayModal.value = true
  } else if (option.text == 'Delete Tray') {
    showConfirmationModal.value = 'DeleteTray'
  } else if (option.text == 'Print Job') {
    emit('print')
  } else if (option.text == 'View History') {
    showAuditTrailModal.value = 'accession_jobs'
  }
}

watch(compiledBarCode, (barcode) => {
  if (barcode !== '' && !accessionContainer.value.id && accessionJob.value.status !== 'Paused') {
    handleTrayScan(barcode)
  }
})
const handleTrayScan = async (barcode_value) => {
  try {
    appIsLoadingData.value = true
    // stop the scan if no size class matches the scanned tray
    await getOptions('sizeClass', { short_name: barcode_value.slice(0, 2) })
    const generateSizeClass = sizeClass.value.find(size => size.short_name == barcode_value.slice(0, 2))?.id
    if (!generateSizeClass && accessionJob.value.status !== 'Completed') {
      handleAlert({
        type: 'error',
        text: `The tray can not be added, the container size ${barcode_value.slice(0, 2)} doesnt exist in the system. Please add it and try again.`,
        persistent: true
      })
      return
    }

    //check if the barcode is in the system otherwise create it
    await verifyBarcode(barcode_value, 'Tray', true)

    // example barcode for tray: 'CH220987'
    // if the scanned tray exists in the accessionJob load the tray details
    if (accessionJob.value.trays && (accessionJob.value.trays.some(tray => tray.barcode_id == barcodeDetails.value.id) || accessionJob.value.trays.some(tray => tray.withdrawn_barcode?.id == barcodeDetails.value.id)) ) {
      await getAccessionTray(barcode_value)
    } else if (accessionJob.value.status !== 'Completed') {
      // if the scanned tray barcode doesn't exist create the scanned tray using the scanned barcodes uuid
      const currentDate = new Date()
      const payload = {
        accession_dt: currentDate,
        accession_job_id: accessionJob.value.id,
        barcode_id: barcodeDetails.value.id,
        collection_accessioned: false,
        media_type_id: accessionJob.value.media_type_id,
        scanned_for_accession: true,
        size_class_id: generateSizeClass
      }
      await postAccessionTray(payload)
    }

    // set the scanned tray barcode as the container id in the route
    if (accessionContainer.value.id) {
      router.push({
        name: 'accession-container',
        params: {
          jobId: accessionJob.value.workflow_id,
          containerId: renderItemBarcodeDisplay(accessionContainer.value)
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
    appIsLoadingData.value = false
  }
}

const cancelTrayEdits = () => {
  if (!route.params.containerId) {
    accessionJob.value = { ...toRaw(originalAccessionJob.value) }
  } else {
    accessionContainer.value = { ...toRaw(originalAccessionContainer.value) }
  }

  editMode.value = false
}
const updateTrayJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: accessionJob.value.id,
      media_type_id: accessionJob.value.media_type_id
    }

    await patchAccessionJob(payload)

    handleAlert({
      type: 'success',
      text: 'The job has been updated.',
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      persistent: true
    })
  } finally {
    appActionIsLoadingData.value = false
    editMode.value = false
  }
}
const cancelAccessionJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: accessionJob.value.id,
      status: 'Cancelled'
    }
    await patchAccessionJob(payload)

    handleAlert({
      type: 'success',
      text: 'The Accession Job has been canceled.',
      autoClose: true
    })
    appActionIsLoadingData.value = false

    await nextTick()

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
    appActionIsLoadingData.value = false
  }
}
const updateTrayContainer = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      ...accessionContainer.value
    }

    await patchAccessionTray(payload)

    handleAlert({
      type: 'success',
      text: 'The tray has been updated.',
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      persistent: true
    })
  } finally {
    appActionIsLoadingData.value = false
    editMode.value = false
  }
}
const updateTrayContainerBarcode = async () => {
  try {
    appActionIsLoadingData.value = true

    //check if the barcode is in the system otherwise create it
    await verifyBarcode(trayBarcodeInput.value, 'Tray', true)

    const payload = {
      id: accessionContainer.value.id,
      barcode_id: barcodeDetails.value.id
    }
    await patchAccessionTray(payload)

    handleAlert({
      type: 'success',
      text: 'The tray has been updated.',
      autoClose: true
    })

    // update our router params without reloading the page
    router.replace({
      name: route.name,
      params: {
        jobId: accessionJob.value.workflow_id,
        containerId: trayBarcodeInput.value
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
    trayBarcodeModal.value.hideModal()
  }
}
const removeTrayContainer = async () => {
  try {
    appActionIsLoadingData.value = true
    // delete all tray items before deleting the tray
    await deleteAccessionTrayItem(accessionContainer.value.items.map(item => item.id))
    await deleteAccessionTray(accessionContainer.value.id)

    handleAlert({
      type: 'success',
      text: 'The Tray Container has been deleted.',
      autoClose: true
    })
    confirmationModal.value.hideModal()
    appActionIsLoadingData.value = false

    router.push({
      name: 'accession',
      params: {
        jobId: accessionJob.value.workflow_id
      }
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      persistent: true
    })
    appActionIsLoadingData.value = false
  }
}

defineExpose({ editMode })
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

        &:nth-child(odd) {
          padding-left: 0;
          padding-right: 4px;
        }

        &:nth-child(even) {
          padding-left: 4px;
          padding-right: 0;
        }
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
}
</style>
