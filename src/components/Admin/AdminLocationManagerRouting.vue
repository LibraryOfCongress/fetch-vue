<template>
  <PopupModal
    ref="locationRoutingModal"
    :show-actions="false"
    @reset="emit('hide')"
    aria-label="locationManagerRoutingModal"
  >
    <template #header-content="{ hideModal }">
      <q-card-section class="row items-center q-pb-none">
        <h2 class="text-h6 text-bold">
          Manage {{ locationTitle }}
        </h2>

        <q-btn
          icon="close"
          flat
          round
          dense
          class="q-ml-auto"
          @click="hideModal"
          aria-label="closeModal"
        />
      </q-card-section>
    </template>
    <template #main-content>
      <q-card-section class="q-pb-none">
        <!-- location based report form -->
        <div class="row">
          <div class="col-12 q-mb-md">
            <div class="form-group">
              <label class="form-group-label">
                Building
                <span class="text-caption text-negative">
                  (Required)
                </span>
              </label>
              <SelectInput
                v-model="locationRoutingForm.building_id"
                :options="buildings"
                option-type="buildings"
                option-value="id"
                option-label="name"
                :placeholder="'Select Building'"
                @update:model-value="handleLocationFormChange('Building')"
                aria-label="buildingSelect"
              />
            </div>
          </div>
          <div
            v-if="renderFormElement('Module')"
            class="col-12 q-mb-md"
          >
            <div class="form-group">
              <label class="form-group-label">
                Module
                <span class="text-caption text-negative">
                  (Required)
                </span>
              </label>
              <SelectInput
                v-model="locationRoutingForm.module_id"
                :options="renderBuildingModules"
                option-value="id"
                option-label="module_number"
                :placeholder="'Select Module'"
                :disabled="renderBuildingModules.length == 0"
                @update:model-value="handleLocationFormChange('Module')"
                aria-label="moduleSelect"
              />
            </div>
          </div>

          <div
            v-if="renderFormElement('Aisle')"
            class="col-xs-12 col-sm-6 q-pr-sm-xs"
          >
            <div class="form-group">
              <label class="form-group-label">
                Aisle
                <span class="text-caption text-negative">
                  (Required)
                </span>
              </label>
              <SelectInput
                v-model="locationRoutingForm.aisle_id"
                :options="renderBuildingOrModuleAisles"
                option-value="id"
                :option-label="opt => opt.aisle_number.number"
                :placeholder="'Select Aisle'"
                :disabled="renderBuildingOrModuleAisles.length == 0"
                @update:model-value="handleLocationFormChange('Aisle')"
                aria-label="aisleSelect"
              />
            </div>
          </div>
          <div
            v-if="renderFormElement('Side')"
            class="col-xs-12 col-sm-6 q-pl-sm-xs q-mt-xs-md q-mt-sm-none"
          >
            <div class="form-group">
              <label class="form-group-label">
                Side
                <span class="text-caption text-negative">
                  (Required)
                </span>
              </label>
              <ToggleButtonInput
                v-model="locationRoutingForm.side_id"
                :options="renderAisleSides"
                option-value="id"
                option-label="side_orientation.name"
                :disabled="!renderAisleSides[0].id"
                @update:model-value="handleLocationFormChange('Side')"
              />
            </div>
          </div>

          <div
            v-if="renderFormElement('Ladder')"
            class="col-12 q-my-md"
          >
            <div class="form-group">
              <label class="form-group-label">
                Ladder
                <span class="text-caption text-negative">
                  (Required)
                </span>
              </label>
              <SelectInput
                v-model="locationRoutingForm.ladder_id"
                :options="renderSideLadders"
                option-value="id"
                :option-label="opt => opt.ladder_number.number"
                :placeholder="'Select Ladder'"
                :disabled="renderSideLadders.length == 0"
                @update:model-value="handleLocationFormChange('Ladder')"
                aria-label="ladderSelect"
              />
            </div>
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
          :label="`Manage ${locationTitle}`"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          :disable="!isRoutingValid"
          @click="handleLocationRouting"
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { useBuildingStore } from '@/stores/building-store'
import { storeToRefs } from 'pinia'
import SelectInput from '@/components/SelectInput.vue'
import ToggleButtonInput from '@/components/ToggleButtonInput.vue'
import PopupModal from '@/components/PopupModal.vue'

import { useRouter } from 'vue-router'

const router = useRouter()

// Props
const mainProps = defineProps({
  locationTitle: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits([
  'hide',
  'submit'
])

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const { buildings } = storeToRefs(useOptionStore())
const {
  getBuildingDetails,
  getModuleDetails,
  getAisleDetails,
  getSideDetails,
  getLadderDetails
} = useBuildingStore()
const {
  renderBuildingModules,
  renderBuildingOrModuleAisles,
  renderAisleSides,
  renderSideLadders
} = storeToRefs(useBuildingStore())

// Local Data
const locationRoutingModal = ref(null)
const locationRoutingForm = ref({
  building_id: null,
  module_id: null,
  aisle_id: null,
  side_id: null,
  ladder_id: null
})
const isRoutingValid = computed(() => {
  let routingFormValid = false
  let optionalFields = []
  switch (mainProps.locationTitle) {
  case 'Modules':
    optionalFields = [
      'module_id',
      'aisle_id',
      'side_id',
      'ladder_id'
    ]
    routingFormValid = Object.keys(locationRoutingForm.value).every(key => optionalFields.includes(key) || locationRoutingForm.value[key] !== null && locationRoutingForm.value[key] !== '')
    break
  case 'Aisles':
    optionalFields = [
      'aisle_id',
      'side_id',
      'ladder_id'
    ]
    routingFormValid = Object.keys(locationRoutingForm.value).every(key => optionalFields.includes(key) || locationRoutingForm.value[key] !== null && locationRoutingForm.value[key] !== '')
    break
  case 'Ladders':
    optionalFields = ['ladder_id']
    routingFormValid = Object.keys(locationRoutingForm.value).every(key => optionalFields.includes(key) || locationRoutingForm.value[key] !== null && locationRoutingForm.value[key] !== '')
    break
  case 'Shelves':
    routingFormValid = Object.keys(locationRoutingForm.value).every(key => locationRoutingForm.value[key] !== null && locationRoutingForm.value[key] !== '')
    break
  }
  return routingFormValid
})

// Logic
const renderFormElement = (formField) => {
  // checks if the passed in form field is allowed to display on the ui depending on the locaitonTitle
  // Ex: when routing to manage aisles we only want to see building and module form fields
  let allowedTitles = []
  switch (formField) {
  case 'Module':
    allowedTitles = [
      'Aisles',
      'Ladders',
      'Shelves'
    ]
    return allowedTitles.some(str => mainProps.locationTitle.includes(str))
  case 'Aisle':
    allowedTitles = [
      'Ladders',
      'Shelves'
    ]
    return allowedTitles.some(str => mainProps.locationTitle.includes(str))
  case 'Side':
    allowedTitles = [
      'Ladders',
      'Shelves'
    ]
    return allowedTitles.some(str => mainProps.locationTitle.includes(str))
  case 'Ladder':
    allowedTitles = ['Shelves']
    return allowedTitles.some(str => mainProps.locationTitle.includes(str))
  }
}

const handleLocationFormChange = async (valueType) => {
  // reset the report form depending on the edited form field type
  switch (valueType) {
  case 'Building':
    await getBuildingDetails(locationRoutingForm.value.building_id)
    locationRoutingForm.value.module_id = null
    locationRoutingForm.value.aisle_id = null
    locationRoutingForm.value.side_id = null
    locationRoutingForm.value.ladder_id = null
    return
  case 'Module':
    await getModuleDetails(locationRoutingForm.value.module_id)
    locationRoutingForm.value.aisle_id = null
    locationRoutingForm.value.side_id = null
    locationRoutingForm.value.ladder_id = null
    return
  case 'Aisle':
    await getAisleDetails(locationRoutingForm.value.aisle_id)
    locationRoutingForm.value.side_id = null
    locationRoutingForm.value.ladder_id = null
    return
  case 'Side':
    await getSideDetails(locationRoutingForm.value.side_id)
    locationRoutingForm.value.ladder_id = null
    return
  case 'Ladder':
    await getLadderDetails(locationRoutingForm.value.ladder_id)
    return
  }
}

const handleLocationRouting = () => {
  switch (mainProps.locationTitle) {
  case 'Modules':
    router.push({
      name: 'admin-manage-modules',
      params: {
        buildingId: locationRoutingForm.value.building_id
      }
    })
    break
  case 'Aisles':
    router.push({
      name: 'admin-manage-aisles',
      params: {
        buildingId: locationRoutingForm.value.building_id,
        moduleId: locationRoutingForm.value.module_id
      }
    })
    break
  case 'Ladders':
    router.push({
      name: 'admin-manage-ladders',
      params: {
        buildingId: locationRoutingForm.value.building_id,
        moduleId: locationRoutingForm.value.module_id,
        aisleId: locationRoutingForm.value.aisle_id,
        sideId: locationRoutingForm.value.side_id
      }
    })
    break
  case 'Shelves':
    router.push({
      name: 'admin-manage-shelves',
      params: {
        buildingId: locationRoutingForm.value.building_id,
        moduleId: locationRoutingForm.value.module_id,
        aisleId: locationRoutingForm.value.aisle_id,
        sideId: locationRoutingForm.value.side_id,
        ladderId: locationRoutingForm.value.ladder_id
      }
    })
    break
  default:
    break
  }
}
</script>

<style lang="scss" scoped>
</style>