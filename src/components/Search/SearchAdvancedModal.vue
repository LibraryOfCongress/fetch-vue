<template>
  <PopupModal
    ref="searchModal"
    :show-actions="false"
    @reset="emit('hide'); resetBuildingStore();"
    aria-label="advancedSearchModal"
  >
    <template #header-content="{ hideModal }">
      <q-card-section class="row items-center q-pb-none">
        <h2 class="text-h6 text-bold">
          Advanced {{ searchType }} Search
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
        <!-- shelf search form -->
        <div
          v-if="searchType == 'Shelf'"
          class="row"
        >
          <div class="col-12 q-mb-md">
            <div class="form-group">
              <label class="form-group-label">
                Building
              </label>
              <SelectInput
                v-model="searchForm.building_id"
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
                v-model="searchForm.module_id"
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
                v-model="searchForm.aisle_id"
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
                v-model="searchForm.side_id"
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
                v-model="searchForm.ladder_id"
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
                v-model="searchForm.shelf_id"
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
                Owner
              </label>
              <SelectInput
                v-model="searchForm.owner_id"
                :options="owners"
                option-type="owners"
                option-value="id"
                option-label="name"
                :placeholder="`Select Owner`"
                :disabled="!searchForm.shelf_id"
                @update:model-value="null"
                :aria-label="`ownerSelect`"
              />
            </div>
          </div>

          <div class="col-12 q-mb-md">
            <div class="form-group">
              <label class="form-group-label">
                Size Class
              </label>
              <SelectInput
                v-model="searchForm.size_class_id"
                :options="sizeClass"
                option-type="sizeClass"
                option-value="id"
                option-label="name"
                :placeholder="`Select Size Class`"
                :disabled="!searchForm.shelf_id"
                @update:model-value="null"
                :aria-label="`sizeClassSelect`"
              />
            </div>
          </div>
        </div>
        <!-- dynamic search forms (job, item, tray) -->
        <div
          v-else
          class="row"
        >
          <template
            v-for="param in searchParams"
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
                  v-model="searchForm[param.query]"
                  placeholder="MM/DD/YYYY"
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
                          v-model="searchForm[param.query]"
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
              v-else-if="param.query == 'barcode' || param.query == 'job_id' || param.query == 'requestor_name'"
              class="col-12 q-mb-md"
            >
              <div class="form-group">
                <label class="form-group-label">
                  {{ param.label }}
                </label>
                <TextInput
                  v-model="searchForm[param.query]"
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
                </label>
                <SelectInput
                  v-model="searchForm[param.query]"
                  :options="param.options"
                  :option-type="param.optionType"
                  :option-value="param.optionType ? 'id' : ''"
                  :option-label="!param.optionType ? '' : param.optionType == 'users' ? 'first_name' : 'name'"
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
          label="Search"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          :disable="searchForm.hasOwnProperty('building_id') && searchForm.building_id == null"
          @click="executeAdvancedSearch()"
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
import { ref, inject, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { useBuildingStore } from '@/stores/building-store'
import { useSearchStore } from '@/stores/search-store'
import { storeToRefs } from 'pinia'
import SelectInput from '@/components/SelectInput.vue'
import ToggleButtonInput from '@/components/ToggleButtonInput.vue'
import TextInput from '@/components/TextInput.vue'
import PopupModal from '@/components/PopupModal.vue'

const router = useRouter()

// Props
const mainProps = defineProps({
  searchType: {
    type: String,
    default: ''
  },
  searchBarInput: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['hide'])

// Composables

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
  resetBuildingStore,
  resetBuildingChildren,
  resetModuleChildren,
  resetAisleChildren,
  resetSideChildren
} = useBuildingStore()
const {
  renderBuildingModules,
  renderBuildingOrModuleAisles,
  renderAisleSides,
  renderSideLadders,
  renderLadderShelves
} = storeToRefs(useBuildingStore())
const { getAdvancedSearchResults } = useSearchStore()

// Local Data
const searchModal = ref(null)
const searchParams = ref(null)
const searchForm = ref({})

// Logic
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  generateSearchModal()
})

watch(() => mainProps.searchType, () => {
  generateSearchModal()
})

const handleLocationFormChange = async (valueType) => {
  // reset the report form depending on the edited form field type
  switch (valueType) {
  case 'Building':
    await getBuildingDetails(searchForm.value.building_id)
    searchForm.value.module_id = null
    searchForm.value.aisle_id = null
    searchForm.value.side_id = null
    searchForm.value.ladder_id = null
    searchForm.value.shelf_id = null
    resetBuildingChildren()
    return
  case 'Module':
    await getModuleDetails(searchForm.value.module_id)
    searchForm.value.aisle_id = null
    searchForm.value.side_id = null
    searchForm.value.ladder_id = null
    searchForm.value.shelf_id = null
    resetModuleChildren()
    return
  case 'Aisle':
    await getAisleDetails(searchForm.value.aisle_id)
    searchForm.value.side_id = null
    searchForm.value.ladder_id = null
    searchForm.value.shelf_id = null
    resetAisleChildren()
    return
  case 'Side':
    await getSideDetails(searchForm.value.side_id)
    searchForm.value.ladder_id = null
    searchForm.value.shelf_id = null
    resetSideChildren()
    return
  case 'Ladder':
    await getLadderDetails(searchForm.value.ladder_id)
    searchForm.value.shelf_id = null
    return
  }
}

const generateSearchModal = () => {
  // creates the advanced search modal params needed based on the selected search type
  switch (mainProps.searchType) {
  case 'Item':
    searchForm.value = {
      from_dt: null,
      to_dt: null,
      owner_id: null,
      status: '',
      size_class_id: null,
      media_type_id: null
    }
    searchParams.value = [
      {
        query: 'from_dt',
        label: 'Accession Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Accession Date Date (To)'
      },
      {
        query: 'owner_id',
        label: 'Owner',
        options: owners,
        optionType: 'owners'
      },
      {
        query: 'status',
        label: 'Status',
        options: [
          'In',
          'Out',
          'Requested',
          'Withdrawn'
        ],
        optionType: ''
      },
      {
        query: 'size_class_id',
        label: 'Size Class',
        options: sizeClass,
        optionType: 'sizeClass'
      },
      {
        query: 'media_type_id',
        label: 'Media Type',
        options: mediaTypes,
        optionType: 'mediaTypes'
      }
    ]
    break
  case 'Tray':
    searchForm.value = {
      from_dt: null,
      to_dt: null,
      owner_id: null,
      size_class_id: null,
      media_type_id: null
    }
    searchParams.value = [
      {
        query: 'from_dt',
        label: 'Accession Date Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Accession Date Date (To)'
      },
      {
        query: 'owner_id',
        label: 'Owner',
        options: owners,
        optionType: 'owners'
      },
      {
        query: 'size_class_id',
        label: 'Size Class',
        options: sizeClass,
        optionType: 'sizeClass'
      },
      {
        query: 'media_type_id',
        label: 'Media Type',
        options: mediaTypes,
        optionType: 'mediaTypes'
      }
    ]
    break
  case 'Shelf':
    searchForm.value = {
      building_id: null,
      module_id: null,
      aisle_id: null,
      side_id: null,
      ladder_id: null,
      shelf_id: null,
      owner_id: null,
      size_class_id: null
    }
    break
  case 'Request':
    searchForm.value = {
      from_dt: null,
      to_dt: null,
      status: '',
      requestor_name: ''
    }
    searchParams.value = [
      {
        query: 'from_dt',
        label: 'Created Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Created Date (To)'
      },
      {
        query: 'status',
        label: 'Status',
        options: [
          'In',
          'Out',
          'Requested',
          'Completed'
        ],
        optionType: ''
      },
      {
        query: 'requestor_name',
        label: 'Requested By'
      }
    ]
    break
  default:
    searchForm.value = {
      from_dt: null,
      to_dt: null,
      status: null,
      created_by_id: null,
      user_id: null
    }
    searchParams.value = [
      {
        query: 'from_dt',
        label: 'Created Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Created Date (To)'
      },
      {
        query: 'status',
        label: 'Status',
        options: [
          'Created',
          'Paused',
          'Running',
          'Cancelled',
          'Completed'
        ],
        optionType: ''
      },
      {
        query: 'created_by_id',
        label: 'Created By',
        options: users,
        optionType: 'users'
      },
      {
        query: 'user_id',
        label: 'Completed By',
        options: users,
        optionType: 'users'
      }
    ]
    break
  }
}

const executeAdvancedSearch = async () => {
  try {
    appActionIsLoadingData.value = true
    let queryParams = JSON.parse(JSON.stringify(searchForm.value))
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
      } else if (key == 'user_id' && value) {
        //set status to completed by default on all searchs that include the completed by param in the query
        queryParams.status = 'Completed'
      } else if (!value) {
        delete queryParams[key]
      }
    })
    await getAdvancedSearchResults(queryParams, mainProps.searchType)

    router.push({
      name: 'search-results',
      params: {
        searchType: mainProps.searchType
      }
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appActionIsLoadingData.value = false
    searchModal.value.hideModal()
  }
}
</script>

<style lang="scss" scoped>
</style>