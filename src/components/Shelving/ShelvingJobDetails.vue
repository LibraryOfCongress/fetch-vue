<template>
  <div class="shelving-job">
    <div class="row justify-between q-mt-xs-md q-mt-md-xl q-mx-xs-sm q-mx-sm-md">
      <div class="col-xs-12 col-md-12 col-lg-3">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-lg-lg">
          <label
            id="jobNumber"
            class="shelving-job-details-label text-h4 text-bold"
          >
            Job Number:
          </label>
          <p class="shelving-job-number-box text-h4 q-pa-md">
            {{ shelvingJob.id }}
          </p>
        </div>
      </div>

      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="shelving-job-details-label-2 text-h6 text-bold"
          >
            Building:
          </label>
          <p class="text-body1">
            {{ shelvingJob.building?.name }}
          </p>
        </div>
      </div>

      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="shelving-job-details-label-2 text-h6 text-bold"
          >
            Assigned User:
          </label>
          <!-- TODO display this read only option for non admin users -->
          <!-- <p class="text-body1">
            {{ shelvingJob.assigned_user?.name }}
          </p> -->
          <SelectInput
            v-model="shelvingJob.assigned_user.name"
            :options="users"
            option-value="id"
            option-label="name"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  No Users Found
                </q-item-section>
              </q-item>
            </template>
          </SelectInput>
        </div>
      </div>

      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="shelving-job-details q-mb-xs-none q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="shelving-job-details-label-2 text-h6 text-bold"
          >
            Date Created:
          </label>
          <p class="text-body1">
            {{ shelvingJob.create_dt }}
          </p>
        </div>
      </div>

      <div class="col-xs-6 col-sm-auto col-md-auto q-mr-auto">
        <div class="shelving-job-details q-mb-xs-none q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-sm">
          <label
            class="shelving-job-details-label-2 text-h6 text-bold"
          >
            Status:
          </label>
          <p
            class="text-body1"
            :class="shelvingJob.status == 'Ready For Shelving' || shelvingJob.status == 'In Progress' ? 'outline text-highlight' : shelvingJob.status == 'Paused' ? 'outline text-highlight-yellow' : null"
          >
            {{ shelvingJob.status }}
          </p>
        </div>
      </div>

      <div
        v-if="currentScreenSize !== 'xs'"
        class="col-sm-12 col-md-12 col-lg-3 q-ml-auto"
      >
        <div class="shelving-job-details-action q-mt-sm-sm q-mt-md-md">
          <q-btn
            v-if="shelvingJob.status !== 'Ready For Shelving'"
            no-caps
            unelevated
            outline
            color="accent"
            :icon="shelvingJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
            :label="shelvingJob.status == 'Paused' ? 'Resume Job' : 'Pause Job'"
            class="btn-no-wrap text-body1 q-mr-sm"
            @click="shelvingJob.status == 'Paused' ? updateShelvingJobStatus('In Progress') : updateShelvingJobStatus('Paused')"
          />
          <q-btn
            no-caps
            unelevated
            color="positive"
            :label="shelvingJob.status == 'Ready For Shelving' ? 'Execute Job' : 'Complete Job'"
            class="btn-no-wrap text-body1"
            :disabled="shelvingJob.status == 'Paused'"
            @click="shelvingJob.status == 'Ready For Shelving' ? executeShelvingJob() : completeShelvingJob()"
          />
        </div>
      </div>
      <MobileActionBar
        v-else
        button-one-color="accent"
        :button-one-icon="shelvingJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
        :button-one-label="shelvingJob.status == 'Paused' ? 'Resume Job' : 'Pause Job'"
        :button-one-outline="true"
        :button-one-disabled="shelvingJob.status == 'Ready For Shelving'"
        @button-one-click="shelvingJob.status == 'Paused' ? updateShelvingJobStatus('In Progress') : updateShelvingJobStatus('Paused')"
        button-two-color="positive"
        :button-two-label="shelvingJob.status == 'Ready For Shelving' ? 'Execute Job' : 'Complete Job'"
        :button-two-outline="false"
        :button-two-disabled="shelvingJob.status == 'Paused'"
        @button-two-click="shelvingJob.status == 'Ready For Shelving' ? executeShelvingJob() : completeShelvingJob()"
      />
    </div>

    <q-space class="divider q-my-xs-lg q-my-md-xl" />

    <div class="row">
      <div class="col-grow">
        <EssentialTable
          :table-columns="shelfTableColumns"
          :table-visible-columns="shelfTableVisibleColumns"
          :filter-options="shelfTableFilters"
          :table-data="shelvingJob.containers"
          :hide-table-rearrange="false"
          :disable-table-reorder="true"
          :heading-row-class="'q-mb-lg q-px-xs-sm q-px-sm-md'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
        >
          <template #heading-row>
            <div
              class="col-xs-12 col-sm-grow q-mr-auto"
            >
              <label class="text-h4 text-bold">
                Containers in Job:
              </label>
            </div>
          </template>

          <template #table-td="{ colName, props }">
            <span
              v-if="colName == 'actions'"
            >
              <MoreOptionsMenu
                :options="!props.row.module_id ? [{ text: 'Assign Location' }] : [{ text: 'Edit Location' }]"
                class=""
                @click="handleOptionMenu($event, props.row)"
              />
            </span>
          </template>
        </EssentialTable>
      </div>
    </div>

    <!-- Location Form Modal -->
    <PopupModal
      v-if="showShelvingLocationModal"
      :title="!locationForm.module_id ? 'Assign Shelving Location' : `Edit Shelving Location`"
      @reset="resetLocationForm"
    >
      <template #main-content>
        <q-card-section class="row items-end">
          <div
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
          </div>

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
              option-label="id"
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
                option-label="number"
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
              <q-btn-toggle
                v-model="locationForm.side_id"
                spread
                no-caps
                unelevated
                toggle-color="accent"
                color="white"
                text-color="black"
                class="form-toggle"
                :style="[ currentScreenSize == 'xs' ? 'height:40px;' : 'height:56px;' ]"
                :options="[
                  {label: 'Left', value: 'left'},
                  {label: 'Right', value: 'right'}
                ]"
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
              :options="renderAisleLadders"
              option-value="id"
              option-label="number"
              :placeholder="'Select Ladder'"
              :disabled="renderAisleLadders.length == 0"
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
                :options="selectedLadderShelves"
                option-value="id"
                option-label="number"
                :placeholder="'Select Shelf'"
                :disabled="selectedLadderShelves.length == 0"
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
                :options="selectedShelfPositions"
                option-value="id"
                option-label="number"
                :placeholder="'Select Shelf Position'"
                :disabled="selectedShelfPositions.length == 0"
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
            :loading="isLoading"
            :disabled="!isLocationFormValid || shelvingJob.status == 'Paused'"
            @click="submitLocationForm(); hideModal();"
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
            @click="hideModal()"
          />
        </q-card-section>
      </template>
    </PopupModal>
  </div>
</template>

<script setup>
import { ref, inject, computed, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useShelvingStore } from '@/stores/shelving-store'
import { useOptionStore } from '@/stores/option-store'
import { useBuildingStore } from '@/stores/building-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import EssentialTable from '@/components/EssentialTable.vue'
import SelectInput from '@/components/SelectInput.vue'
import PopupModal from '@/components/PopupModal.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'

const router = useRouter()
const route = useRoute()

// Compasables
const { currentScreenSize } = useCurrentScreenSize()

// // Store Data
const {
  getBuildingDetails,
  getModuleDetails,
  getAisleDetails,
  getLadderDetails
} = useBuildingStore()
const {
  renderBuildingModules,
  renderBuildingOrModuleAisles,
  renderAisleLadders
} = storeToRefs(useBuildingStore())
const { patchShelvingJob } = useShelvingStore()
const { shelvingJob } = storeToRefs(useShelvingStore())
const { users, owners, sizeClass, buildings } = storeToRefs(useOptionStore())

// Local Data
const isLoading = ref(false)
const shelfTableColumns = ref([
  {
    name: 'actions',
    field: 'actions',
    label: '',
    align: 'center',
    sortable: false,
    required: true
  },
  {
    name: 'barcode',
    field: row => row.barcode.value,
    label: 'Barcode',
    align: 'left',
    sortable: true,
    order: 1
  },
  {
    name: 'owner',
    field: row => row.owner.name,
    label: 'Owner',
    align: 'left',
    sortable: true,
    order: 2
  },
  {
    name: 'size_class',
    field: row => row.size_class.name,
    label: 'Size Class',
    align: 'left',
    sortable: true,
    order: 3
  },
  {
    name: 'module',
    field: 'module_id',
    label: 'Module',
    align: 'left',
    sortable: true,
    order: 4
  },
  {
    name: 'aisle',
    field: 'aisle_id',
    label: 'Aisle',
    align: 'left',
    sortable: true,
    order: 5
  },
  {
    name: 'side',
    field: 'side',
    label: 'Side',
    align: 'left',
    sortable: true,
    order: 6
  },
  {
    name: 'ladder',
    field: 'ladder_id',
    label: 'Ladder',
    align: 'left',
    sortable: true,
    order: 7
  },
  {
    name: 'shelf',
    field: 'shelf_id',
    label: 'Shelf',
    align: 'left',
    sortable: true,
    order: 8
  },
  {
    name: 'shelf_position',
    field: 'shelf_position_id',
    label: 'Shelf Position',
    align: 'left',
    sortable: true,
    order: 9
  }
])
const shelfTableVisibleColumns = ref([
  'actions',
  'barcode',
  'owner',
  'size_class',
  'module',
  'aisle',
  'side',
  'ladder',
  'shelf',
  'shelf_position'
])
const shelfTableFilters = ref([
  {
    field: row => row.size_class.name,
    options: [
      {
        text: 'C High',
        value: false
      },
      {
        text: 'C Low',
        value: false
      }
    ]
  }
])
const showShelvingLocationModal = ref(false)
const locationForm = ref({
  item_id: null,
  owner_id: null,
  size_class_id: null,
  building_id: null,
  module_id: null,
  aisle_id: null,
  side_id: 'left',
  ladder_id: null,
  shelf_id: null,
  shelf_position_id: null
})
const isLocationFormValid = computed(() => {
  // validate that all needed fields are filled out in the building form
  return !Object.values(locationForm.value).some(v => v == null || v == '')
})
//TODO need to figure out how shelfs work and if they live in ladders?
const selectedLadderShelves = computed(() => {
  let shelves = []
  return shelves
})
const selectedShelfPositions = computed(() => {
  let shelfPositions = []
  return shelfPositions
})

// Logic
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  if (currentScreenSize.value == 'xs') {
    shelfTableVisibleColumns.value = [
      'actions',
      'barcode',
      'owner',
      'size_class',
      'module'
    ]
  }
})

const handleOptionMenu = async (action, rowData) => {
  // if the rowData contains a building_id we can get that buildings details to populate out any related fields
  if (rowData.building_id) {
    await getBuildingDetails(rowData.building_id)
  }

  if (action.text == 'Edit Location') {
    locationForm.value.item_id = rowData.item_id
    locationForm.value.owner_id = rowData.owner_id
    locationForm.value.size_class_id = rowData.size_class_id
    locationForm.value.building_id = rowData.building_id
    locationForm.value.module_id = rowData.module_id
    locationForm.value.aisle_id = rowData.aisle_id
    locationForm.value.side_id = rowData.side_id
    locationForm.value.ladder_id = rowData.ladder_id
    locationForm.value.shelf_id = rowData.shelf_id
    locationForm.value.shelf_position_id = rowData.shelf_position_id
  } else if (action.text == 'Assign Location') {
    locationForm.value.item_id = rowData.item_id
    locationForm.value.owner_id = rowData.owner_id
    locationForm.value.size_class_id = rowData.size_class_id
  }

  showShelvingLocationModal.value = true
}

const handleLocationFormChange = async (valueType) => {
  // reset the form depending on the edited form field type
  switch (valueType) {
  case 'Owner':
  case 'Size Class':
    locationForm.value.building_id = ''
    locationForm.value.module_id = ''
    locationForm.value.aisle_id = ''
    locationForm.value.side_id = 'left'
    locationForm.value.ladder_id = ''
    locationForm.value.shelf_id = ''
    locationForm.value.shelf_position_id = ''
    return
  case 'Building':
    await getBuildingDetails(locationForm.value.building_id)
    locationForm.value.module_id = ''
    locationForm.value.aisle_id = ''
    locationForm.value.side_id = 'left'
    locationForm.value.ladder_id = ''
    locationForm.value.shelf_id = ''
    locationForm.value.shelf_position_id = ''
    return
  case 'Module':
    await getModuleDetails(locationForm.value.module_id)
    locationForm.value.aisle_id = ''
    locationForm.value.side_id = 'left'
    locationForm.value.ladder_id = ''
    locationForm.value.shelf_id = ''
    locationForm.value.shelf_position_id = ''
    return
  case 'Aisle':
    await getAisleDetails(locationForm.value.aisle_id)
    locationForm.value.side_id = 'left'
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
    locationForm.value.shelf_position_id = ''
    return
  }
}
const resetLocationForm = () => {
  locationForm.value = {
    item_id: null,
    owner_id: null,
    size_class_id: null,
    building_id: null,
    module_id: null,
    aisle_id: null,
    side_id: 'left',
    ladder_id: null,
    shelf_id: null,
    shelf_position_id: null
  }
  showShelvingLocationModal.value = false
}
const submitLocationForm = async () => {
  try {
    isLoading.value = true
    //TODO setup call to post/patch item location data to shelving job
    console.log('submitting location data', locationForm.value)
    resetLocationForm()
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

const executeShelvingJob = async () => {
  try {
    const payload = {
      id: route.params.jobId,
      status: 'In Progress'
    }
    await patchShelvingJob(payload)

    handleAlert({
      type: 'success',
      text: 'Shelving Job Successfully Started',
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
const updateShelvingJobStatus = async (status) => {
  try {
    const payload = {
      id: route.params.jobId,
      status
    }

    await patchShelvingJob(payload)

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
const completeShelvingJob = async () => {
  try {
    const payload = {
      id: route.params.jobId,
      status: 'Completed'
    }
    await patchShelvingJob(payload)

    handleAlert({
      type: 'success',
      text: 'The Shelving Job has been completed.',
      autoClose: true
    })

    router.push({
      name: 'shelving',
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
.shelving-job {
  position: relative;

  &-number-box {
    background-color: $secondary;
    color: $color-white;
    text-align: center;
    border-radius: 3px;
    width: 100%;
  }

  &-details {
    position: relative;
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: flex-start;

    &-label {
      &-2 {
        margin-top: 2rem;

        @media (max-width: $breakpoint-sm-max) {
          margin-top: 0;
        }
      }
    }

    &-action {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
    }
  }
}
</style>