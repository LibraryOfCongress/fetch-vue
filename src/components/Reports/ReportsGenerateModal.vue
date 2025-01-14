<template>
  <PopupModal
    ref="reportModal"
    :show-actions="false"
    @reset="emit('hide')"
    aria-label="generateReportModal"
  >
    <template #header-content="{ hideModal }">
      <q-card-section class="row items-center q-pb-none">
        <h2 class="text-h6 text-bold">
          {{ reportType }}
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
        <div
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
                Size Class
              </label>
              <SelectInput
                v-model="reportForm.size_class_id"
                :multiple="true"
                :hide-selected="false"
                :options="sizeClass"
                option-type="sizeClass"
                option-value="id"
                option-label="name"
                :placeholder="`Select Size Class`"
                @update:model-value="null"
                :aria-label="`sizeClassSelect`"
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
                :multiple="true"
                :hide-selected="false"
                :options="owners"
                option-type="owners"
                option-value="id"
                option-label="name"
                :placeholder="`Select Owner`"
                @update:model-value="null"
                :aria-label="`ownerSelect`"
              />
            </div>
          </div>

          <div class="col-12 q-mb-md">
            <div class="form-group">
              <label class="form-group-label">
                Height
              </label>
              <TextInput
                v-model="reportForm.height"
                :placeholder="`Enter Height`"
                :disabled="!reportForm.building_id"
                @update:model-value="null"
                :aria-label="`heightInput`"
              />
            </div>
          </div>

          <div class="col-12 q-mb-md">
            <div class="form-group">
              <label class="form-group-label">
                Width
              </label>
              <TextInput
                v-model="reportForm.width"
                :placeholder="`Enter Width`"
                :disabled="!reportForm.building_id"
                @update:model-value="null"
                :aria-label="`widthInput`"
              />
            </div>
          </div>

          <div class="col-12 q-mb-md">
            <div class="form-group">
              <label class="form-group-label">
                Depth
              </label>
              <TextInput
                v-model="reportForm.depth"
                :placeholder="`Enter Depth`"
                :disabled="!reportForm.building_id"
                @update:model-value="null"
                :aria-label="`depthInput`"
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
        </div>
        <!-- generalized dynamic report forms -->
        <div
          v-else
          class="row"
        >
          <template
            v-for="param in reportParams"
            :key="param.query"
          >
            <!-- date range inputs -->
            <div
              v-if="param.query.includes('_dt')"
              class="col-6 q-mb-md"
            >
              <div class="form-group q-pr-xs">
                <label class="form-group-label">
                  {{ param.label }}
                </label>
                <TextInput
                  v-model="reportForm[param.query]"
                  placeholder="Ex: MM/DD/YYYY"
                >
                  <template #append>
                    <q-icon
                      name="event"
                      class="cursor-pointer"
                    >
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="reportForm[param.query]"
                          mask="MM/DD/YYYY"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                              aria-label="closeDatePopup"
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </TextInput>
              </div>
            </div>
            <!-- text inputs -->
            <div
              v-else-if="param.query.includes('job_id') || param.query.includes('workflow_id')"
              class="col-12 q-mb-md"
            >
              <div class="form-group">
                <label class="form-group-label">
                  {{ param.label }}
                </label>
                <TextInput
                  v-model="reportForm[param.query]"
                  :placeholder="`Enter ${param.label}`"
                  :aria-label="`${param.query}_input`"
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
                  {{ param.label }}
                  <span
                    v-if="param.query == 'building_id'"
                    class="text-caption text-negative"
                  >
                    (Required)
                  </span>
                </label>
                <SelectInput
                  v-model="reportForm[param.query]"
                  :multiple="param.multiple"
                  :hide-selected="false"
                  :options="param.options"
                  :option-type="param.optionType"
                  option-value="id"
                  :option-label="'name'"
                  :placeholder="`Select ${param.label}`"
                  @update:model-value="null"
                  :aria-label="`${param.query}Select`"
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
          label="Run Report"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          :disable="!isReportFormValid"
          @click="generateReport()"
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
import { ref, inject, onBeforeMount, computed } from 'vue'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { useBuildingStore } from '@/stores/building-store'
import { useReportsStore } from '@/stores/reports-store'
import { storeToRefs } from 'pinia'
import SelectInput from '@/components/SelectInput.vue'
import ToggleButtonInput from '@/components/ToggleButtonInput.vue'
import TextInput from '@/components/TextInput.vue'
import PopupModal from '@/components/PopupModal.vue'

// Props
const mainProps = defineProps({
  reportType: {
    type: String,
    default: ''
  },
  reportHistory: undefined
})

// Emits
const emit = defineEmits([
  'hide',
  'submit',
  'update'
])

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const {
  buildings,
  owners,
  sizeClass,
  mediaTypes,
  users
} = storeToRefs(useOptionStore())
const {
  getBuildingDetails,
  getModuleDetails,
  getAisleDetails,
  getSideDetails,
  getLadderDetails,
  resetBuildingChildren,
  resetModuleChildren,
  resetAisleChildren,
  resetSideChildren
} = useBuildingStore()
const {
  renderBuildingModules,
  renderBuildingOrModuleAisles,
  renderAisleSides,
  renderSideLadders
} = storeToRefs(useBuildingStore())
const { getReport } = useReportsStore()

// Local Data
const reportModal = ref(null)
const reportParams = ref(null)
const reportForm = ref({})
const isReportFormValid = computed( () => {
  switch (mainProps.reportType) {
  case 'Item in Tray':
  case 'Non-Tray Count':
  case 'Tray/Item Count By Aisle':
    return !!reportForm.value.building_id
  case 'Open Locations':
    return !(!reportForm.value.building_id && !(reportForm.value.owner_id?.length) && !(reportForm.value.size_class_id?.length))
  default:
    return true
  }
})

// Logic
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  generateReportModal()
})

const handleLocationFormChange = async (valueType) => {
  // reset the report form depending on the edited form field type
  switch (valueType) {
  case 'Building':
    await getBuildingDetails(reportForm.value.building_id)
    reportForm.value.module_id = null
    reportForm.value.aisle_id = null
    reportForm.value.side_id = null
    reportForm.value.ladder_id = null
    resetBuildingChildren()
    return
  case 'Module':
    await getModuleDetails(reportForm.value.module_id)
    reportForm.value.aisle_id = null
    reportForm.value.side_id = null
    reportForm.value.ladder_id = null
    resetModuleChildren()
    return
  case 'Aisle':
    await getAisleDetails(reportForm.value.aisle_id)
    reportForm.value.side_id = null
    reportForm.value.ladder_id = null
    resetAisleChildren()
    return
  case 'Side':
    await getSideDetails(reportForm.value.side_id)
    reportForm.value.ladder_id = null
    resetSideChildren()
    return
  case 'Ladder':
    await getLadderDetails(reportForm.value.ladder_id)
    return
  }
}

const generateReportModal = () => {
  // creates the report modal params needed based on the selected report type
  switch (mainProps.reportType) {
  case 'Item Accession':
    reportForm.value = {
      from_dt: null,
      to_dt: null,
      owner_id: null,
      media_type_id: null,
      size_class_id: null
    }

    reportParams.value = [
      {
        query: 'from_dt',
        label: 'Accession Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Accession Date (To)'
      },
      {
        query: 'owner_id',
        multiple: true,
        label: 'Owner',
        options: owners,
        optionType: 'owners'
      },
      {
        query: 'media_type_id',
        multiple: true,
        label: 'Media Type',
        options: mediaTypes,
        optionType: 'mediaTypes'
      },
      {
        query: 'size_class_id',
        multiple: true,
        label: 'Size Class',
        options: sizeClass,
        optionType: 'sizeClass'
      }
    ]
    break
  case 'Item in Tray':
    reportForm.value = {
      building_id: null, // required
      owner_id: null,
      aisle_from: null,
      aisle_to: null,
      from_dt: null,
      to_dt: null
    }
    reportParams.value = [
      {
        query: 'building_id',
        label: 'Building',
        options: buildings,
        optionType: 'buildings'
      },
      {
        query: 'owner_id',
        label: 'Owner',
        options: owners,
        optionType: 'owners'
      },
      {
        query: 'aisle_from',
        label: 'Aisle (From)',
        options: [],
        optionType: ''
      },
      {
        query: 'aisle_to',
        label: 'Aisle (To)',
        options: [],
        optionType: ''
      },
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      }
    ]
    break
  case 'Move/Withdraw Discrepancy':
    reportForm.value = {
      from_dt: null,
      to_dt: null,
      assigned_user_id: null
    }
    reportParams.value = [
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
        options: users,
        optionType: 'users'
      }
    ]
    break
  case 'Non-Tray Count':
    reportForm.value = {
      building_id: null, // required
      owner_id: null,
      aisle_from: null,
      aisle_to: null,
      from_dt: null,
      to_dt: null,
      size_class_id: null
    }
    reportParams.value = [
      {
        query: 'building_id',
        label: 'Building',
        options: buildings,
        optionType: 'buildings'
      },
      {
        query: 'owner_id',
        label: 'Owner',
        options: owners,
        optionType: 'owners'
      },
      {
        query: 'aisle_from',
        label: 'Aisle (From)',
        options: [],
        optionType: ''
      },
      {
        query: 'aisle_to',
        label: 'Aisle (To)',
        options: [],
        optionType: ''
      },
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      },
      {
        query: 'size_class_id',
        label: 'Size Class',
        options: sizeClass,
        optionType: 'sizeClass'
      }
    ]
    break
  case 'Open Locations':
    reportForm.value = {
      building_id: null,
      module_id: null,
      aisle_id: null,
      side_id: null,
      ladder_id: null,
      owner_id: null,
      height: null,
      width: null,
      depth: null,
      partial_shelves: true
    }
    break
  case 'Refile Discrepancy':
    reportForm.value = {
      job_id: null,
      from_dt: null,
      to_dt: null,
      assigned_user_id: null
    }
    reportParams.value = [
      {
        query: 'job_id',
        label: 'Job Number',
        options: [],
        optionType: ''
      },
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
        options: users,
        optionType: 'users'
      }
    ]
    break
  case 'Shelving Job Discrepancy':
    reportForm.value = {
      from_dt: null,
      to_dt: null,
      shelving_job_id: null,
      assigned_user_id: null
    }
    reportParams.value = [
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      },
      {
        query: 'shelving_job_id',
        label: 'Job Number'
      },
      {
        query: 'assigned_user_id',
        multiple: true,
        label: 'Assigned User',
        options: users,
        optionType: 'users'
      }
    ]
    break
  case 'Total Item Retrieved':
    reportForm.value = {
      from_dt: null,
      to_dt: null,
      owner_id: null
    }
    reportParams.value = [
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      },
      {
        query: 'owner_id',
        label: 'Owner',
        options: owners,
        optionType: 'owners'
      }
    ]
    break
  case 'Tray/Item Count By Aisle':
    reportForm.value = {
      building_id: null, // required
      aisle_from: null,
      aisle_to: null
    }
    reportParams.value = [
      {
        query: 'building_id',
        label: 'Building',
        options: buildings,
        optionType: 'buildings'
      },
      {
        query: 'aisle_from',
        label: 'Aisle (From)',
        options: [],
        optionType: ''
      },
      {
        query: 'aisle_to',
        label: 'Aisle (To)',
        options: [],
        optionType: ''
      }
    ]
    break
  case 'User Job Summary':
    reportForm.value = {
      from_dt: null,
      to_dt: null,
      user_id: null
    }
    reportParams.value = [
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      },
      {
        query: 'user_id',
        label: 'User',
        options: users,
        optionType: 'users'
      }
    ]
    break
  case 'Verification Change':
    reportForm.value = {
      workflow_id: null,
      from_dt: null,
      to_dt: null,
      assigned_user_id: null
    }
    reportParams.value = [
      {
        query: 'workflow_id',
        label: 'Job Number',
        options: [],
        optionType: ''
      },
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
        options: users,
        optionType: 'users'
      }
    ]
    break
  default:
    break
  }

  // if report history was passed in we replace the generated form with the prop
  // ex: user hits redo report we want to prepopulate the form with their past report search so they can update it
  if (mainProps.reportHistory) {
    reportForm.value = mainProps.reportHistory
  }
}

const generateReport = async () => {
  try {
    appActionIsLoadingData.value = true
    let queryParams = JSON.parse(JSON.stringify(reportForm.value))
    // convert any form date values to iso format along with removing any empty query params
    Object.entries(queryParams).forEach(([
      key,
      value
    ]) => {
      if (key.includes('_dt') && value) {
        const [
          month,
          day,
          year
        ] = queryParams[key].split('/')
        if (key.includes('from')) {
          // sets from dates to begging of day
          queryParams[key] = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)).toISOString()
        }  else {
          // sets to date to end of date
          queryParams[key] = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)).toISOString()
        }
      } else if (!value) {
        delete queryParams[key]
      }
    })

    await getReport(queryParams, mainProps.reportType)

    emit('submit')
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    // emit the current form to the parent
    emit('update', reportForm.value)

    appActionIsLoadingData.value = false
    reportModal.value.hideModal()
  }
}
</script>

<style lang="scss" scoped>
</style>
