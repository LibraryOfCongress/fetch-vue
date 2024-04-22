<template>
  <PopupModal
    :title="`Edit Shelving Location`"
    @reset="resetLocationForm"
  >
    <template #main-content>
      <q-card-section class="row items-end">
        <!-- <div
          class="form-group q-mb-md"
        >
          <label class="form-group-label">
            Owner
          </label>
          <SelectInput
            v-model="locationForm.owner_id"
            :options="owners"
            option-type="owners"
            option-value="id"
            option-label="name"
            :placeholder="'Select Owner'"
            @update:model-value="handleLocationFormChange('Owner')"
          />
        </div>

        <div
          class="form-group q-mb-md"
        >
          <label class="form-group-label">
            Size Class
          </label>
          <SelectInput
            v-model="locationForm.size_class_id"
            :options="sizeClass"
            option-type="sizeClass"
            option-value="id"
            option-label="name"
            :placeholder="'Select Size Class'"
            @update:model-value="handleLocationFormChange('Size Class')"
          />
        </div> -->

        <div
          class="form-group q-mb-md"
        >
          <label class="form-group-label">
            Building
          </label>
          <SelectInput
            v-model="locationForm.building_id"
            :options="buildings"
            option-type="buildings"
            option-value="id"
            option-label="name"
            :placeholder="'Select Building'"
            :disabled="!locationForm.owner_id || !locationForm.size_class_id"
            @update:model-value="handleLocationFormChange('Building')"
          />
        </div>

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
import { ref, inject, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { useBuildingStore } from '@/stores/building-store'
import PopupModal from '@/components/PopupModal.vue'
import SelectInput from '@/components/SelectInput.vue'
import ToggleButtonInput from '@/components/ToggleButtonInput.vue'

// Emits
const emit = defineEmits(['hide'])

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const {
  getBuildingDetails,
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
const {
  // owners,
  // sizeClass,
  buildings
} = storeToRefs(useOptionStore())

// Local Data
const locationForm = ref({
  id: null,
  owner_id: null,
  size_class_id: null,
  building_id: null,
  module_id: null,
  aisle_id: null,
  side_id: 1,
  ladder_id: null,
  shelf_id: null,
  shelf_position_id: null
})
const isLocationFormValid = computed(() => {
  // validate that all needed fields are filled out in the building form
  return !Object.values(locationForm.value).some(v => v == null || v == '')
})

// Logic
const handleAlert = inject('handle-alert')

const handleLocationFormChange = async (valueType) => {
  // reset the form depending on the edited form field type
  switch (valueType) {
  case 'Owner':
  case 'Size Class':
    locationForm.value.building_id = ''
    locationForm.value.module_id = ''
    locationForm.value.aisle_id = ''
    locationForm.value.side_id = ''
    locationForm.value.ladder_id = ''
    locationForm.value.shelf_id = ''
    locationForm.value.shelf_position_id = ''
    return
  case 'Building':
    await getBuildingDetails(locationForm.value.building_id)
    locationForm.value.module_id = ''
    locationForm.value.aisle_id = ''
    locationForm.value.side_id = ''
    locationForm.value.ladder_id = ''
    locationForm.value.shelf_id = ''
    locationForm.value.shelf_position_id = ''
    return
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
    owner_id: null,
    size_class_id: null,
    building_id: null,
    module_id: null,
    aisle_id: null,
    side_id: '',
    ladder_id: null,
    shelf_id: null,
    shelf_position_id: null
  }
  emit('hide')
}
const submitLocationForm = async () => {
  try {
    appActionIsLoadingData.value = true
    //TODO setup call to post/patch item location data to shelving job also update the item at the job level incase offline
    console.log('submitting location data', locationForm.value)
    resetLocationForm()
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appActionIsLoadingData.value = false
  }
}

defineExpose({ locationForm })
</script>

<style lang="scss" scoped>
</style>