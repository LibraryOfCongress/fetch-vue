<template>
  <PopupModal
    ref="bulkUploadLocationModal"
    title="Bulk Upload Ladders/Shelves"
    @reset="emit('hide'); resetBulkUploadLocationForm();"
    aria-label="bulkUploadLocationModal"
  >
    <template #main-content>
      <q-card-section class="row items-end">
        <div class="col-grow">
          <p class="text-body2">
            Support files: .csv
          </p>
        </div>
        <div class="col-auto flex justify-end">
          <DownloadExcel
            class="link text-body2 text-accent"
            :data="bulkLocationTemplateData"
            type="csv"
            name="bulk-location-template.csv"
            worksheet="Bulk Location"
            :escape-csv="false"
            aria-label="downloadLocationUploadTemplateLink"
          >
            Click to Download Template
          </DownloadExcel>
        </div>

        <div class="col-12 q-mt-md">
          <FileUploadInput
            :allow-multiple-files="false"
            :allowed-file-types="['.csv']"
            input-class="q-py-xs-md q-px-xs-lg q-py-sm-xl q-px-sm-lg"
            @file-change="bulkUploadLocationFile = $event"
          />
        </div>

        <div class="col-12 q-mt-md q-mb-sm">
          <p class="text-body1">
            Select Areas to Upload:
          </p>
        </div>

        <div class="col-12 q-mb-md">
          <div class="form-group">
            <label class="form-group-label">
              Building
            </label>
            <SelectInput
              v-model="bulkUploadLocationForm.building_id"
              :options="buildings"
              option-type="buildings"
              option-value="id"
              option-label="name"
              :clearable="false"
              :placeholder="'Select Building'"
              @update:model-value="handleLocationFormChange('Building')"
              aria-label="buildingSelect"
            />
          </div>
        </div>
        <div class="col-12 q-mb-md">
          <div class="form-group">
            <label class="form-group-label">
              Module
            </label>
            <SelectInput
              v-model="bulkUploadLocationForm.module_id"
              :options="modules"
              option-type="modules"
              :option-query="{
                building_id: bulkUploadLocationForm.building_id
              }"
              option-value="id"
              option-label="module_number"
              :placeholder="'Select Module'"
              :clearable="false"
              :disabled="!bulkUploadLocationForm.building_id"
              @update:model-value="handleLocationFormChange('Module')"
              aria-label="moduleSelect"
            />
          </div>
        </div>

        <div
          class="col-xs-12 col-sm-6 q-pr-sm-xs"
        >
          <div class="form-group">
            <label class="form-group-label">
              Aisle
            </label>
            <SelectInput
              v-model="bulkUploadLocationForm.aisle_id"
              :options="aisles"
              option-type="aisles"
              :option-query="{
                building_id: bulkUploadLocationForm.building_id,
                module_id: bulkUploadLocationForm.module_id,
                sort_by: 'aisle_number'
              }"
              option-value="id"
              option-label="aisle_number"
              :placeholder="'Select Aisle'"
              :clearable="false"
              :disabled="!bulkUploadLocationForm.module_id"
              @update:model-value="handleLocationFormChange('Aisle')"
              aria-label="aisleSelect"
            />
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-6 q-pl-sm-xs q-mt-xs-md q-mt-sm-none"
        >
          <div class="form-group">
            <label class="form-group-label">
              Side
            </label>
            <ToggleButtonInput
              v-model="bulkUploadLocationForm.side_id"
              :options="sides"
              option-value="id"
              option-label="side_orientation.name"
              :disabled="!bulkUploadLocationForm.aisle_id"
              @update:model-value="handleLocationFormChange('Side')"
            />
          </div>
        </div>
      </q-card-section>
    </template>

    <template #footer-content="{ hideModal }">
      <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
        <BaseButton
          no-caps
          unelevated
          color="accent"
          label="Submit"
          class="text-body1 full-width"
          :disabled="!isBulkUploadLocationValid"
          :loading="appActionIsLoadingData"
          @click="submitBulkUploadLocationForm()"
        />

        <q-space class="q-mx-xs" />

        <BaseButton
          outline
          no-caps
          label="Cancel"
          class="text-body1 full-width"
          @click="hideModal"
        />
      </q-card-section>
    </template>
  </PopupModal>
</template>

<script setup>
import BaseButton from '@/components/Base/BaseButton.vue'
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { notify } from '@/utils/notify'
import { useOptionStore } from '@/stores/option-store'
import { useBuildingStore } from '@/stores/building-store'
import PopupModal from '@/components/PopupModal.vue'
import FileUploadInput from '@/components/FileUploadInput.vue'
import SelectInput from '@/components/SelectInput.vue'
import ToggleButtonInput from '@/components/ToggleButtonInput.vue'

// Emits
const emit = defineEmits(['hide'])

// Composables

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const {
  buildings,
  modules,
  aisles
} = storeToRefs(useOptionStore())
const {
  postBulkLocation,
  getBatchUpload,
  getSideList,
  resetBuildingStore,
  resetBuildingChildren,
  resetModuleChildren,
  resetAisleChildren
} = useBuildingStore()
const { sides } = storeToRefs(useBuildingStore())

// Local Data
const bulkUploadLocationModal = ref(null)
const showBulkUploadLocationForm = ref(false)
const bulkLocationTemplateData = ref([
  {
    'Ladder Number': '',
    'Ladder Sort Priority': '',
    'Shelf Number': '',
    'Shelf Sort Priority': '',
    'Owner': '',
    'Size Class': '',
    'Container Type': '',
    'Shelf Type': '',
    'Width': '',
    'Height': '',
    'Depth': '',
    'Shelf Barcode': ''
  }
])
const bulkUploadLocationFile = ref([])
const bulkUploadLocationForm = ref({
  building_id: null,
  module_id: null,
  aisle_id: null,
  side_id: null
})
const isBulkUploadLocationValid = computed(() => {
  // validate that all needed fields are filled out in the bulk upload form
  if (bulkUploadLocationFile.value.length > 0 && Object.values(bulkUploadLocationForm.value).every(val => val !== null)) {
    return true
  } else {
    return false
  }
})

// Logic


const handleLocationFormChange = async (valueType) => {
  // reset the report form depending on the edited form field type
  switch (valueType) {
    case 'Building':
      resetBuildingChildren()
      bulkUploadLocationForm.value.module_id = null
      bulkUploadLocationForm.value.aisle_id = null
      bulkUploadLocationForm.value.side_id = null
      return
    case 'Module':
      resetModuleChildren()
      bulkUploadLocationForm.value.aisle_id = null
      bulkUploadLocationForm.value.side_id = null
      return
    case 'Aisle':
      resetAisleChildren()
      // get sides since sides are toggle buttons and not dynamically loaded from a options select input
      await getSideList({
        building_id: bulkUploadLocationForm.value.building_id,
        module_id: bulkUploadLocationForm.value.module_id,
        aisle_id: bulkUploadLocationForm.value.aisle_id
      })
      bulkUploadLocationForm.value.side_id = null
      return
    default:
      return
  }
}
const resetBulkUploadLocationForm = () => {
  bulkUploadLocationFile.value = []
  bulkUploadLocationForm.value = {
    building_id: null,
    module_id: null,
    aisle_id: null,
    side_id: null
  }
  showBulkUploadLocationForm.value = false
  resetBuildingStore()
}
// Show ONE consolidated negative notification for a list of per-row errors
// (used by both the synchronous validation reject and the async Failed result).
const showConsolidatedErrors = (message, rowErrors) => {
  if (rowErrors && rowErrors.length) {
    const summary = message || `${rowErrors.length} row(s) could not be processed. No locations were created.`
    const lines = rowErrors.map(e => `Line ${e.line}: ${e.error}`).join('\n')
    notify({
      type: 'negative',
      message: summary,
      caption: lines,
      html: false,
      multiLine: true,
      timeout: 0,
      actions: [
        {
          icon: 'close',
          color: 'white'
        }
      ]
    })
  } else {
    notify({
      type: 'negative',
      message: message || 'Failed to upload locations'
    })
  }
}

// Poll the async location upload job every 5s until it finishes.
const pollBatchUploadStatus = async (id) => {
  const POLL_MS = 5000
  const MAX_MS = 10 * 60 * 1000 // give up after 10 minutes
  const start = Date.now()
  while (Date.now() - start < MAX_MS) {
    await new Promise(resolve => setTimeout(resolve, POLL_MS))
    let batchUpload
    try {
      const res = await getBatchUpload(id)
      batchUpload = res?.data
    } catch (e) {
      continue // transient poll error — keep trying
    }
    const status = batchUpload?.status
    if (status === 'Completed') {
      const result = batchUpload?.result || {}
      notify({
        type: 'positive',
        message: result.message || `Successfully created ${result.shelves_created ?? ''} locations!`
      })
      return
    }
    if (status === 'Failed') {
      const result = batchUpload?.result || {}
      showConsolidatedErrors(result.message, Array.isArray(result.errors) ? result.errors : null)
      return
    }
    // 'Processing' / 'New' -> keep polling
  }
  notify({
    type: 'warning',
    message: 'Upload is still processing. Please check the batch upload status shortly.'
  })
}

const submitBulkUploadLocationForm = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      file: bulkUploadLocationFile.value[0].file,
      ...bulkUploadLocationForm.value
    }
    // POST validates synchronously; on success it returns 202 + a batch_upload_id.
    // Validation has passed at this point, so we let the modal close (in finally)
    // immediately and poll for the background result WITHOUT awaiting -- the
    // completion toast pops up later, the form doesn't sit on a spinner.
    const res = await postBulkLocation(payload)
    const batchId = res?.data?.batch_upload_id

    if (!batchId) {
      notify({
        type: 'positive',
        message: res?.data?.message || 'Successfully Uploaded New Locations!'
      })
      return
    }

    notify({
      type: 'info',
      message: 'Upload accepted — processing in the background…'
    })
    // fire-and-forget: don't block the modal on the background job
    pollBatchUploadStatus(batchId).catch(() => {})
  } catch (error) {
    // Synchronous validation failures (400/422) come back here with the
    // consolidated { message, errors } payload.
    const data = error.response?.data
    const rowErrors = Array.isArray(data?.errors)
      ? data.errors
      : Array.isArray(data) ? data : null
    showConsolidatedErrors(data?.message || data?.detail || error.message, rowErrors)
  } finally {
    appActionIsLoadingData.value = false
    bulkUploadLocationModal.value.hideModal()
  }
}
</script>

<style lang="scss" scoped>
</style>