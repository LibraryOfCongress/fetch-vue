<template>
  <PopupModal
    :title="`Edit Shelving Location`"
    @reset="resetLocationForm"
  >
    <template #main-content>
      <q-card-section
        v-if="!appIsOffline"
        class="row items-end"
      >
        <div
          class="form-group q-mb-md"
        >
          <label class="form-group-label">
            Module
          </label>
          <SelectInput
            v-model="locationForm.module_id"
            :options="renderBuildingModules"
            option-value="id"
            :option-label="opt => opt.module_number?.number"
            :placeholder="'Select Module'"
            :disabled="renderBuildingModules.length == 0"
            @update:model-value="handleLocationFormChange('Module')"
          />
        </div>

        <div
          class="col-xs-12 col-sm-6 q-pr-sm-xs"
        >
          <div class="form-group">
            <label class="form-group-label">
              Aisle
            </label>
            <SelectInput
              v-model="locationForm.aisle_id"
              :options="renderBuildingOrModuleAisles"
              option-value="id"
              :option-label="opt => opt.aisle_number?.number"
              :placeholder="'Select Aisle'"
              :disabled="renderBuildingOrModuleAisles.length == 0"
              @update:model-value="handleLocationFormChange('Aisle')"
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
              v-model="locationForm.side_id"
              :options="renderAisleSides"
              option-value="id"
              option-label="side_orientation.name"
              :disabled="!renderAisleSides[0].id"
              @update:model-value="handleLocationFormChange('Side')"
            />
          </div>
        </div>

        <div
          class="form-group q-my-md"
        >
          <label class="form-group-label">
            Ladder
          </label>
          <SelectInput
            v-model="locationForm.ladder_id"
            :options="renderSideLadders"
            option-value="id"
            :option-label="opt => opt.ladder_number?.number"
            :placeholder="'Select Ladder'"
            :disabled="renderSideLadders.length == 0"
            @update:model-value="handleLocationFormChange('Ladder')"
          />
        </div>

        <div
          class="col-xs-12 col-sm-6 q-pr-sm-xs"
        >
          <div
            class="form-group"
          >
            <label class="form-group-label">
              Shelf
            </label>
            <SelectInput
              v-model="locationForm.shelf_id"
              :options="renderLadderShelves"
              option-value="id"
              :option-label="opt => opt.shelf_number?.number"
              :placeholder="'Select Shelf'"
              :disabled="renderLadderShelves.length == 0"
              @update:model-value="handleLocationFormChange('Shelf')"
            />
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-6 q-pl-sm-xs q-mt-xs-md q-mt-sm-none"
        >
          <div
            class="form-group"
          >
            <label class="form-group-label">
              Shelf Position
            </label>
            <SelectInput
              v-model="locationForm.shelf_position_id"
              :options="renderShelfPositions"
              option-value="id"
              :option-label="opt => opt.shelf_position_number?.number"
              :placeholder="'Select Shelf Position'"
              :disabled="renderShelfPositions.length == 0"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section
        v-else
        class="row items-end"
      >
        <div class="col-12">
          <BarcodeBox
            :barcode="!locationForm.shelf_barcode ? 'Please Scan Shelf' : locationForm.shelf_barcode"
            :min-height="'5rem'"
          />
        </div>
        <div
          class="col-12 q-mt-xs"
        >
          <div
            class="form-group"
          >
            <label class="form-group-label">
              Shelf Position
            </label>
            <TextInput
              v-model="locationForm.shelf_position_number"
              placeholder="Enter Shelf Postion"
              :disabled="!locationForm.shelf_barcode"
            />
          </div>
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
          :loading="appActionIsLoadingData"
          :disabled="!isLocationFormValid"
          @click="submitLocationForm(); hideModal();"
        />

        <q-space class="q-mx-xs" />

        <q-btn
          outline
          no-caps
          label="Cancel"
          class="text-body1 full-width"
          @click="hideModal()"
        />
      </q-card-section>
    </template>
  </PopupModal>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { useBuildingStore } from '@/stores/building-store'
import { useShelvingStore } from '@/stores/shelving-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import PopupModal from '@/components/PopupModal.vue'
import SelectInput from '@/components/SelectInput.vue'
import TextInput from '@/components/TextInput.vue'
import BarcodeBox from '@/components/BarcodeBox.vue'
import ToggleButtonInput from '@/components/ToggleButtonInput.vue'

const route = useRoute()

// Emits
const emit = defineEmits(['hide'])

// Compasables
const { compiledBarCode } = useBarcodeScanHandler()

// Store Data
const { appActionIsLoadingData, appIsOffline } = storeToRefs(useGlobalStore())
const {
  getModuleDetails,
  getAisleDetails,
  getSideDetails,
  getLadderDetails,
  getShelfDetails
} = useBuildingStore()
const {
  renderBuildingModules,
  renderBuildingOrModuleAisles,
  renderAisleSides,
  renderSideLadders,
  renderLadderShelves,
  renderShelfPositions
} = storeToRefs(useBuildingStore())
const { postShelvingJobContainer } = useShelvingStore()

// Local Data
const locationForm = ref({
  id: null,
  module_id: null,
  aisle_id: null,
  side_id: 1,
  ladder_id: null,
  shelf_id: null,
  shelf_position_id: null,
  shelf_barcode: null,
  shelf_position_number: null,
  trayed: false
})
const isLocationFormValid = computed(() => {
  // validate that all needed fields are filled out in the building form
  if (appIsOffline.value) {
    return locationForm.value.shelf_position_number ?? false
  } else {
    return locationForm.value.shelf_position_id ?? false
  }
})

// Logic
const handleAlert = inject('handle-alert')

watch(compiledBarCode, (barcode) => {
  if (barcode !== '' && appIsOffline.value) {
    locationForm.value.shelf_barcode = barcode
    locationForm.value.shelf_position_number = null
  }
})

const handleLocationFormChange = async (valueType) => {
  // reset the form depending on the edited form field type
  switch (valueType) {
  case 'Module':
    await getModuleDetails(locationForm.value.module_id)
    locationForm.value.aisle_id = ''
    locationForm.value.side_id = ''
    locationForm.value.ladder_id = ''
    locationForm.value.shelf_id = ''
    locationForm.value.shelf_position_id = ''
    return
  case 'Aisle':
    await getAisleDetails(locationForm.value.aisle_id)
    locationForm.value.side_id = ''
    locationForm.value.ladder_id = ''
    locationForm.value.shelf_id = ''
    locationForm.value.shelf_position_id = ''
    return
  case 'Side':
    await getSideDetails(locationForm.value.side_id)
    locationForm.value.ladder_id = ''
    locationForm.value.shelf_id = ''
    locationForm.value.shelf_position_id = ''
    return
  case 'Ladder':
    await getLadderDetails(locationForm.value.ladder_id)
    locationForm.value.shelf_id = ''
    locationForm.value.shelf_position_id = ''
    return
  case 'Shelf':
    await getShelfDetails(locationForm.value.shelf_id)
    locationForm.value.shelf_position_id = ''
    return
  }
}
const resetLocationForm = () => {
  locationForm.value = {
    id: null,
    module_id: null,
    aisle_id: null,
    side_id: '',
    ladder_id: null,
    shelf_id: null,
    shelf_position_id: null,
    shelf_barcode: null,
    shelf_position_number: null,
    trayed: false
  }
  emit('hide')
}
const submitLocationForm = async () => {
  try {
    appActionIsLoadingData.value = true

    // if app is offline then we only allow the user to scan the shelf and enter a position
    let payload
    if (appIsOffline.value) {
      payload = {
        job_id: route.params.jobId,
        container_id: locationForm.value.id,
        trayed: locationForm.value.trayed,
        shelf_position_number: locationForm.value.shelf_position_number,
        shelf_barcode_value: locationForm.value.shelf_barcode
      }
    } else {
      payload = {
        job_id: route.params.jobId,
        container_id: locationForm.value.id,
        trayed: locationForm.value.trayed,
        shelf_position_number: renderShelfPositions.value.find(shelf_pos => shelf_pos.id == locationForm.value.shelf_position_id)?.shelf_position_number.number,
        shelf_id: locationForm.value.shelf_id
      }
    }

    await postShelvingJobContainer(payload)
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appActionIsLoadingData.value = false
    resetLocationForm()
  }
}

defineExpose({ locationForm })
</script>

<style lang="scss" scoped>
</style>