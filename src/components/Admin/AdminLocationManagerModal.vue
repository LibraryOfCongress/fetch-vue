<template>
  <PopupModal
    ref="locationModal"
    :show-actions="false"
    @reset="emit('hide')"
    aria-label="locationAddOrEditModal"
  >
    <template #header-content="{ hideModal }">
      <q-card-section class="row items-center q-pb-none">
        <h2 class="text-h6 text-bold">
          {{ actionType == 'Add' ? 'Add New' : 'Edit' }} {{ titleCaseLocationType }}
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
        <!-- <div
          v-if="reportType == 'Open Locations'"
          class="row"
        >
          <div class="col-12 q-mb-md">
            <div class="form-group">
              <label class="form-group-label">
                Building
                <span class="text-caption text-negative">
                  (Required)
                </span>
              </label>
              <SelectInput
                v-model="reportForm.building_id"
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
          <div class="col-12 q-mb-md">
            <div class="form-group">
              <label class="form-group-label">
                Module
              </label>
              <SelectInput
                v-model="reportForm.module_id"
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
            class="col-xs-12 col-sm-6 q-pr-sm-xs"
          >
            <div class="form-group">
              <label class="form-group-label">
                Aisle
              </label>
              <SelectInput
                v-model="reportForm.aisle_id"
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
            class="col-xs-12 col-sm-6 q-pl-sm-xs q-mt-xs-md q-mt-sm-none"
          >
            <div class="form-group">
              <label class="form-group-label">
                Side
              </label>
              <ToggleButtonInput
                v-model="reportForm.side_id"
                :options="renderAisleSides"
                option-value="id"
                option-label="side_orientation.name"
                :disabled="!renderAisleSides[0].id"
                @update:model-value="handleLocationFormChange('Side')"
              />
            </div>
          </div>

          <div
            class="col-12 q-my-md"
          >
            <div class="form-group">
              <label class="form-group-label">
                Ladder
              </label>
              <SelectInput
                v-model="reportForm.ladder_id"
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

          <div class="col-12 q-mb-md">
            <div class="form-group">
              <label class="form-group-label">
                Shelf
              </label>
              <SelectInput
                v-model="reportForm.shelf_id"
                :options="renderLadderShelves"
                option-value="id"
                :option-label="opt => opt.shelf_number.number"
                :placeholder="'Select Shelf'"
                :disabled="renderLadderShelves.length == 0"
                @update:model-value="handleLocationFormChange('Shelf')"
                aria-label="shelfSelect"
              />
            </div>
          </div>

          <div class="col-12 q-mb-md">
            <div class="form-group">
              <label class="form-group-label">
                Size Class
              </label>
              <SelectInput
                v-model="reportForm.size_class_id"
                :options="sizeClass"
                option-type="sizeClass"
                option-value="id"
                option-label="name"
                :placeholder="`Select Size Class`"
                :disabled="!reportForm.shelf_id"
                @update:model-value="null"
                :aria-label="`size_class_id_select`"
              />
            </div>
          </div>

          <div class="col-12 q-mb-md">
            <div class="form-group">
              <label class="form-group-label">
                Owner
              </label>
              <SelectInput
                v-model="reportForm.owner_id"
                :options="owners"
                option-type="owners"
                option-value="id"
                option-label="name"
                :placeholder="`Select Owner`"
                :disabled="!reportForm.shelf_id"
                @update:model-value="null"
                :aria-label="`owner_id_select`"
              />
            </div>
          </div>

          <div class="col-12 q-mb-md">
            <div class="form-group">
              <label class="form-group-label">
                Height
              </label>
              <SelectInput
                v-model="reportForm.height_id"
                :options="[]"
                option-type="''"
                option-value="id"
                option-label="name"
                :placeholder="`Select Height`"
                :disabled="!reportForm.shelf_id"
                @update:model-value="null"
                :aria-label="`height_id_select`"
              />
            </div>
          </div>

          <div class="col-12 q-mb-md">
            <div class="form-group">
              <label class="form-group-label">
                Width
              </label>
              <SelectInput
                v-model="reportForm.width_id"
                :options="[]"
                option-type="''"
                option-value="id"
                option-label="name"
                :placeholder="`Select Width`"
                :disabled="!reportForm.shelf_id"
                @update:model-value="null"
                :aria-label="`width_id_select`"
              />
            </div>
          </div>

          <div class="col-12 q-mb-md">
            <div class="form-group">
              <label class="form-group-label">
                Depth
              </label>
              <SelectInput
                v-model="reportForm.depth_id"
                :options="[]"
                option-type="''"
                option-value="id"
                option-label="name"
                :placeholder="`Select Depth`"
                :disabled="!reportForm.shelf_id"
                @update:model-value="null"
                :aria-label="`depth_id_select`"
              />
            </div>
          </div>

          <div class="col-xs-12 col-sm-8 flex items-center q-mb-sm-md">
            <p :class="currentScreenSize !== 'xs' ? 'text-h6' : 'text-body1 q-mb-xs'">
              Show Partial Shelves?
            </p>
          </div>
          <div class="col-xs-12 col-sm-4 q-mb-md">
            <div class="form-group">
              <ToggleButtonInput
                v-model="reportForm.partial_shelves"
                :options="[
                  {label: 'Yes', value: true},
                  {label: 'No', value: false}
                ]"
              />
            </div>
          </div>
        </div> -->
        <!-- generalized dynamic report forms -->
        <div
          class="row"
        >
          <template
            v-for="field in locationFields"
            :key="field.field"
          >
            <!-- text inputs -->
            <div
              v-if="field.field == 'name'"
              class="col-12 q-mb-md"
            >
              <div class="form-group">
                <label class="form-group-label">
                  {{ field.label }}
                </label>
                <TextInput
                  v-model="locationForm[field.field]"
                  :placeholder="`Enter ${field.label}`"
                  :aria-label="`${field.field}_input`"
                />
              </div>
            </div>
            <!-- select inputs -->
            <div
              v-else
              class="col-12 q-mb-md"
            >
              <div class="form-group">
                <label class="form-group-label">
                  {{ field.label }}
                  <span
                    v-if="field.field == 'building_id'"
                    class="text-caption text-negative"
                  >
                    (Required)
                  </span>
                </label>
                <SelectInput
                  v-model="locationForm[field.field]"
                  :options="field.options"
                  :option-type="field.optionType"
                  option-value="id"
                  :option-label="field.optionType == 'users' ? 'first_name' : 'name'"
                  :placeholder="`Select ${field.label}`"
                  @update:model-value="null"
                  :aria-label="`${field.field}_select`"
                />
              </div>
            </div>
          </template>
        </div>
      </q-card-section>
    </template>

    <template #footer-content="{ hideModal }">
      <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
        <q-btn
          no-caps
          unelevated
          color="accent"
          :label="actionType == 'Add' ? `Add ${titleCaseLocationType}` : `Update ${titleCaseLocationType}`"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          :disable="false"
          @click="hideModal"
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
import { ref, computed, onBeforeMount } from 'vue'
// import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useGlobalStore } from '@/stores/global-store'
// import { useOptionStore } from '@/stores/option-store'
// import { useBuildingStore } from '@/stores/building-store'
import { storeToRefs } from 'pinia'
import SelectInput from '@/components/SelectInput.vue'
// import ToggleButtonInput from '@/components/ToggleButtonInput.vue'
import TextInput from '@/components/TextInput.vue'
import PopupModal from '@/components/PopupModal.vue'

// Props
const mainProps = defineProps({
  actionType: {
    type: String,
    required: true
  },
  locationType: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits([
  'hide',
  'submit'
])

// Composables
// const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
// const {
//   buildings,
//   owners,
//   sizeClass,
//   mediaTypes,
//   users
// } = storeToRefs(useOptionStore())
// const {
//   getBuildingDetails,
//   getModuleDetails,
//   getAisleDetails,
//   getSideDetails,
//   getLadderDetails
// } = useBuildingStore()
// const {
//   renderBuildingModules,
//   renderBuildingOrModuleAisles,
//   renderAisleSides,
//   renderSideLadders,
//   renderLadderShelves
// } = storeToRefs(useBuildingStore())

// Local Data
const titleCaseLocationType = computed(() => {
  return mainProps.locationType.replace(mainProps.locationType[0], mainProps.locationType[0].toUpperCase()).slice(0, -1)
})
const locationModal = ref(null)
const locationFields = ref(null)
const locationForm = ref({})

// Logic
// const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  generateLocationModal()
})

// const handleLocationFormChange = async (valueType) => {
//   // reset the report form depending on the edited form field type
//   switch (valueType) {
//   case 'Building':
//     await getBuildingDetails(reportForm.value.building_id)
//     reportForm.value.module_id = null
//     reportForm.value.aisle_id = null
//     reportForm.value.side_id = null
//     reportForm.value.ladder_id = null
//     reportForm.value.shelf_id = null
//     return
//   case 'Module':
//     await getModuleDetails(reportForm.value.module_id)
//     reportForm.value.aisle_id = null
//     reportForm.value.side_id = null
//     reportForm.value.ladder_id = null
//     reportForm.value.shelf_id = null
//     return
//   case 'Aisle':
//     await getAisleDetails(reportForm.value.aisle_id)
//     reportForm.value.side_id = null
//     reportForm.value.ladder_id = null
//     reportForm.value.shelf_id = null
//     return
//   case 'Side':
//     await getSideDetails(reportForm.value.side_id)
//     reportForm.value.ladder_id = null
//     reportForm.value.shelf_id = null
//     return
//   case 'Ladder':
//     await getLadderDetails(reportForm.value.ladder_id)
//     reportForm.value.shelf_id = null
//     return
//   }
// }

const generateLocationModal = () => {
  // creates the modal fields needed based on the locationType
  switch (mainProps.locationType) {
  case 'buildings':
    locationForm.value = {
      name: '' //TODO replace this with the current name if actionType is edit
    }
    locationFields.value = [
      {
        field: 'name',
        label: 'Building Name'
      }
    ]
    break
  case 'Move/Withdraw Discrepency':
    locationForm.value = {
      from_dt: null,
      to_dt: null,
      assigned_user_id: null
    }
    locationFields.value = [
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      },
      {
        query: 'assigned_user_id',
        label: 'Assigned User',
        options: [],
        optionType: 'users'
      }
    ]
    break
  case 'Open Locations':
    locationForm.value = {
      building_id: null,
      module_id: null,
      aisle_id: null,
      side_id: 1,
      ladder_id: null,
      shelf_id: null,
      owner_id: null,
      height_id: null,
      width_id: null,
      depth_id: null,
      partial_shelves: true
    }
    break
  default:
    break
  }
}

// const generateReport = async () => {
//   try {
//     appActionIsLoadingData.value = true
//     // convert any form date values to iso format
//     if (Object.entries(reportForm.value).some(([
//       key,
//       value
//     ]) => key.includes('_dt') && value)) {
//       Object.keys(reportForm.value).forEach(key => {
//         if (key.includes('_dt')) {
//           const [
//             month,
//             day,
//             year
//           ] = reportForm.value[key].split('/')
//           reportForm.value[key] = new Date(year, month - 1, day).toISOString()
//         }
//       })
//     }

//     await getReport(reportForm.value, mainProps.reportType)

//     emit('submit')
//   } catch (error) {
//     handleAlert({
//       type: 'error',
//       text: error,
//       autoClose: true
//     })
//   } finally {
//     appActionIsLoadingData.value = false
//     reportModal.value.hideModal()
//   }
// }
</script>

<style lang="scss" scoped>
</style>