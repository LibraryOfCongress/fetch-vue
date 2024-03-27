<template>
  <div class="shelving-job">
    <div class="row justify-between q-mt-xs-lg q-mt-md-xl q-mx-md">
      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
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

      <div class="col-xs-12 col-sm-6 col-md-2">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="shelving-job-details-label text-h6 text-bold q-mt-lg"
          >
            Building:
          </label>
          <p class="text-body1">
            {{ shelvingJob.building?.name }}
          </p>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-2">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="shelving-job-details-label text-h6 text-bold q-mt-lg"
          >
            Assigned User:
          </label>
          <!-- TODO display this read only option for non admin users -->
          <!-- <p class="text-body1">
            {{ shelvingJob.assigned_user?.name }}
          </p> -->
          <SelectInput
            v-model="shelvingJob.assigned_user.name"
            :options="owners"
            option-type="owners"
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

      <div class="col-xs-12 col-sm-6 col-md-2">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="shelving-job-details-label text-h6 text-bold q-mt-lg"
          >
            Date Created:
          </label>
          <p class="text-body1">
            {{ shelvingJob.create_dt }}
          </p>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-auto">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-sm">
          <label
            class="shelving-job-details-label text-h6 text-bold q-mt-lg"
          >
            Status:
          </label>
          <p
            class="text-body1"
            :class="shelvingJob.status == 'In Progress' ? 'outline text-highlight-yellow' : null"
          >
            {{ shelvingJob.status }}
          </p>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-2">
        <div class="shelving-job-details-action">
          <q-btn
            no-caps
            unelevated
            color="positive"
            :label="'Execute Shelving'"
            class="text-body1"
            @click="null"
          />
        </div>
      </div>
    </div>

    <q-space class="divider q-my-xs-lg q-my-md-xl" />

    <div class="row">
      <div class="col-grow">
        <EssentialTable
          :table-columns="shelfTableColumns"
          :filter-options="shelfTableFilters"
          :table-data="shelvingJob.containers"
          :hide-table-rearrange="true"
          :disable-table-reorder="true"
          :heading-row-class="'q-mb-lg'"
          :heading-filter-class="'q-ml-auto'"
        >
          <template #heading-row>
            <div
              class="col-xs-5 col-sm-auto q-mr-auto q-pl-xs-md"
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
                :options="!props.row.module ? [{ text: 'Assign Location' }] : [{ text: 'Edit Location' }]"
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
              :options="selectedBuildingModules"
              option-value="id"
              option-label="name"
              :placeholder="'Select Module'"
              :disabled="selectedBuildingModules.length == 0"
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
                :options="selectedBuildingOrModuleAisles"
                option-value="id"
                option-label="number"
                :placeholder="'Select Aisle'"
                :disabled="selectedBuildingOrModuleAisles.length == 0"
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
              :options="selectedAisleLadders"
              option-value="id"
              option-label="number"
              :placeholder="'Select Ladder'"
              :disabled="selectedAisleLadders.length == 0"
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
import { ref, inject, computed } from 'vue'
import { useShelvingStore } from '@/stores/shelving-store'
import { useOptionStore } from 'src/stores/option-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import MoreOptionsMenu from 'src/components/MoreOptionsMenu.vue'
import EssentialTable from 'src/components/EssentialTable.vue'
import SelectInput from 'src/components/SelectInput.vue'
import PopupModal from 'src/components/PopupModal.vue'

// Compasables
const { currentScreenSize } = useCurrentScreenSize()

// // Store Data
const { shelvingJob } = storeToRefs(useShelvingStore())
const { owners, sizeClass, buildings } = storeToRefs(useOptionStore())

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
    field: 'module',
    label: 'Module',
    align: 'left',
    sortable: true,
    order: 4
  },
  {
    name: 'aisle',
    field: 'aisle',
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
    field: 'ladder',
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
const shelfTableFilters = ref([
  {
    field: row => row.size_class.name,
    options: [
      {
        text: 'A High',
        value: false
      },
      {
        text: 'B Low',
        value: false
      },
      {
        text: 'C High',
        value: false
      }
    ]
  },
  {
    field: row => row.owner.name,
    options: [
      {
        text: 'John Doe',
        value: false
      },
      {
        text: 'George Washington',
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
const selectedBuildingModules = computed(() => {
  let modules = []
  if (locationForm.value.building_id) {
    modules = buildings.value.find(b => b.id == locationForm.value.building_id).modules
  }
  return modules
})
const selectedBuildingOrModuleAisles = computed(() => {
  let aisles = []
  if (locationForm.value.module_id && selectedBuildingModules.value.length > 0) {
    aisles = selectedBuildingModules.value.find(m => m.id == locationForm.value.module_id).aisles
  } else if (locationForm.value.building_id && buildings.value.some(b => b.id == locationForm.value.building_id).aisles) {
    aisles = buildings.value.find(b => b.id == locationForm.value.building_id).aisles
  }
  return aisles
})
const selectedAisleLadders = computed(() => {
  let ladders = []
  if (locationForm.value.aisle_id && selectedBuildingOrModuleAisles.value.length > 0) {
    ladders = selectedBuildingOrModuleAisles.value.find(a => a.id == locationForm.value.aisle_id).ladders
  }
  return ladders
})
const selectedLadderShelves = computed(() => {
  let shelves = []
  if (locationForm.value.ladder_id && selectedAisleLadders.value.length > 0) {
    shelves = selectedAisleLadders.value.find(l => l.id == locationForm.value.ladder_id).shelves
  }
  return shelves
})
const selectedShelfPositions = computed(() => {
  let shelfPositions = []
  console.log('test', selectedLadderShelves.value)
  if (locationForm.value.shelf_id && selectedLadderShelves.value.length > 0) {
    shelfPositions = selectedLadderShelves.value.find(s => s.id == locationForm.value.shelf_id).shelf_numbers
  }
  return shelfPositions
})

// Logic
const handleAlert = inject('handle-alert')

const handleOptionMenu = (action, rowData) => {
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

const handleLocationFormChange = (valueType) => {
  // reset the form depending on the edited form field type
  switch (valueType) {
  case 'Owner' || 'Size Class':
    locationForm.value.building_id = ''
    locationForm.value.module_id = ''
    locationForm.value.aisle_id = ''
    locationForm.value.side_id = 'left'
    locationForm.value.ladder_id = ''
    locationForm.value.shelf_id = ''
    locationForm.value.shelf_position_id = ''
    return
  case 'Building':
    locationForm.value.module_id = ''
    locationForm.value.aisle_id = ''
    locationForm.value.side_id = 'left'
    locationForm.value.ladder_id = ''
    locationForm.value.shelf_id = ''
    locationForm.value.shelf_position_id = ''
    return
  case 'Module':
    locationForm.value.aisle_id = ''
    locationForm.value.side_id = 'left'
    locationForm.value.ladder_id = ''
    locationForm.value.shelf_id = ''
    locationForm.value.shelf_position_id = ''
    return
  case 'Aisle':
    locationForm.value.side_id = 'left'
    locationForm.value.ladder_id = ''
    locationForm.value.shelf_id = ''
    locationForm.value.shelf_position_id = ''
    return
  case 'Ladder':
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

    &-action {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
    }
  }
}
</style>