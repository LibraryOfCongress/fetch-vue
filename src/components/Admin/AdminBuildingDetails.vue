<template>
  <div class="building">
    <div class="row justify-between q-mt-xs-lg q-mt-md-xl q-mx-md">
      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="building-details q-mb-xs-md q-mb-sm-md q-mr-sm-xl">
          <label
            id="moduleSelection"
            for="module"
            class="building-details-label text-h4 text-bold q-mr-sm"
          >
            Module:
          </label>
          <SelectInput
            v-model="shelfData.module"
            :options="buildingDetails.modules"
            option-value="id"
            option-label="name"
            @update:model-value="handleShelfDataChange('Module')"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  No Modules Found
                </q-item-section>
              </q-item>
            </template>
          </SelectInput>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="building-details q-mb-xs-md q-mb-sm-md q-mr-sm-xl">
          <label
            id="aisleSelection"
            for="aisle"
            class="building-details-label text-h4 text-bold q-mr-sm"
          >
            Aisle:
          </label>
          <SelectInput
            v-model="shelfData.aisle"
            :options="renderAisleOptions"
            option-value="id"
            option-label="id"
            @update:model-value="handleShelfDataChange('Aisle')"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  No Aisles Found
                </q-item-section>
              </q-item>
            </template>
          </SelectInput>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="building-details q-mb-xs-md q-mb-sm-none q-mr-sm-xl">
          <label
            id="sideSelection"
            for="side"
            class="building-details-label text-h4 text-bold q-mr-sm"
          >
            Side:
          </label>
          <q-btn-toggle
            v-model="shelfData.side"
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
            @update:model-value="handleShelfDataChange('Side')"
          />
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="building-details q-mb-xs-sm q-mb-sm-none">
          <label
            id="ladderSelection"
            for="ladder"
            class="building-details-label text-h4 text-bold q-mr-sm"
          >
            Ladder:
          </label>
          <SelectInput
            v-model="shelfData.ladder"
            :options="renderladderOptions"
            option-value="id"
            option-label="id"
            @update:model-value="handleShelfDataChange('Ladder')"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  No Ladders Found
                </q-item-section>
              </q-item>
            </template>
          </SelectInput>
        </div>
      </div>
    </div>

    <q-space class="divider q-my-xs-lg q-my-md-xl" />

    <div class="row">
      <div class="col-grow">
        <EssentialTable
          :table-columns="shelfItemsTableColumns"
          :table-visible-columns="shelfItemsTableVisibleColumns"
          :filter-options="shelfItemsTableFilters"
          :table-data="shelfData.items"
          :disable-table-reorder="currentScreenSize == 'xs' ? true : false"
          :heading-row-class="'q-mb-lg'"
          :heading-filter-class="'q-ml-auto'"
          :heading-rearrange-class="'q-mr-xs-md q-mr-sm-none'"
        >
          <template #heading-row>
            <div
              class="col-xs-5 col-sm-auto q-mr-auto q-pl-xs-md"
              :class="currentScreenSize == 'xs' ? '' : 'self-center'"
            >
              <label class="text-h4 text-bold">
                Shelf:
              </label>
            </div>

            <div
              class="col-xs-6 col-sm-auto flex q-pr-xs-md"
              :class="currentScreenSize == 'xs' ? 'justify-end q-mb-md' : 'order-1'"
            >
              <q-btn
                no-caps
                unelevated
                icon="add"
                color="accent"
                label="Add Shelf"
                class="btn-no-wrap text-body1 q-ml-sm"
                @click="showShelfModal = !showShelfModal"
              />
            </div>
          </template>

          <template #table-td="{ colName, props, value }">
            <span
              v-if="colName == 'actions'"
            >
              <MoreOptionsMenu
                :options="[{ text: 'Edit Shelf' }]"
                class=""
                @click="handleOptionMenu($event, props.row)"
              />
            </span>

            <span
              v-if="colName == 'shelf_width' || colName == 'shelf_height' || colName == 'shelf_depth'"
            >
              {{ value }} ft
            </span>
          </template>
        </EssentialTable>
      </div>

    </div>

    <!-- Create Shelf Modal -->
    <q-dialog
      :persistent="true"
      v-model="showShelfModal"
    >
      <q-card class="building-modal">
        <q-card-section class="row items-center justify-between q-pb-none">
          <h2 class="text-h6">
            {{ shelfItemDetails.id ? 'Edit Shelf' : 'Add Shelf' }}
          </h2>

          <q-btn
            icon="close"
            flat
            round
            dense
            @click="resetModal"
          />
        </q-card-section>

        <q-card-section class="row items-center">
          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Shelf Number
            </label>
            <TextInput
              v-model="shelfItemDetails.shelf_number"
              placeholder="Enter Shelf Number"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Owner
            </label>
            <SelectInput
              v-model="shelfItemDetails.owner"
              :options="owners"
              option-value="id"
              option-label="name"
              :placeholder="'Select Owner'"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Container Size
            </label>
            <SelectInput
              v-model="shelfItemDetails.size_class"
              :options="sizeClass"
              option-value="id"
              option-label="name"
              :placeholder="'Select Container Size'"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Max Container Capacity
            </label>
            <TextInput
              v-model="shelfItemDetails.max_capacity"
              placeholder="Enter Max Capacity"
            />
          </div>

          <div class="col-4 q-pr-sm">
            <div class="form-group q-mb-md">
              <label class="form-group-label">
                Shelf Width
              </label>
              <TextInput
                v-model="shelfItemDetails.shelf_width"
                placeholder="Enter Shelf Width"
              />
            </div>
          </div>

          <div class="col-4">
            <div class="form-group q-mb-md">
              <label class="form-group-label">
                Shelf Height
              </label>
              <TextInput
                v-model="shelfItemDetails.shelf_height"
                placeholder="Enter Shelf Height"
              />
            </div>
          </div>

          <div class="col-4 q-pl-sm">
            <div class="form-group q-mb-md">
              <label class="form-group-label">
                Shelf Depth
              </label>
              <TextInput
                v-model="shelfItemDetails.shelf_depth"
                placeholder="Enter Shelf Depth"
              />
            </div>
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Shelf Barcode
            </label>
            <SelectInput
              v-model="shelfItemDetails.shelf_barcode"
              :options="[]"
              option-value="id"
              option-label="name"
              :placeholder="'Select Shelf Barcode'"
            />
          </div>
        </q-card-section>

        <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
          <q-btn
            no-caps
            unelevated
            color="accent"
            :label="shelfItemDetails.id ? 'Update' : 'Create'"
            class="text-body1 full-width"
            @click="resetModal"
          />

          <q-space class="q-mx-xs" />

          <q-btn
            outline
            no-caps
            label="Cancel"
            class="building-modal-btn text-body1 full-width"
            @click="resetModal"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue'
import { useBuildingStore } from '@/stores/building-store'
import { useOptionStore } from '@/stores/option-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from 'src/components/EssentialTable.vue'
import SelectInput from 'src/components/SelectInput.vue'
import TextInput from 'src/components/TextInput.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { buildingDetails } = storeToRefs(useBuildingStore())
const { sizeClass, owners } = storeToRefs(useOptionStore())

// Local Data
const shelfData = ref({
  module: null,
  aisle: null,
  side: 'left',
  ladder: null,
  items: [
    {
      id: '00924891289',
      shelf_number: 1,
      shelf_width: 12,
      shelf_height: 3,
      shelf_depth: 22,
      size_class: 'A High',
      max_capacity: 15,
      container_type: 'Trayed',
      owner: 'John Doe'
    },
    {
      id: '00924891290',
      shelf_number: 2,
      shelf_width: 22.2,
      shelf_height: 3,
      shelf_depth: 22,
      size_class: 'B Low',
      max_capacity: 60,
      container_type: 'Trayed',
      owner: 'George Washington'
    },
    {
      id: '00924891291',
      shelf_number: 15,
      shelf_width: 24,
      shelf_height: 4.4,
      shelf_depth: 22,
      size_class: 'C High',
      max_capacity: 100,
      container_type: 'Non-Trayed',
      owner: 'John Doe'
    }
  ]
})
const shelfItemsTableVisibleColumns = ref([
  'actions',
  'shelf_number',
  'shelf_width',
  'shelf_height',
  'shelf_depth',
  'size_class',
  'max_capacity',
  'container_type',
  'owner',
  'id'
])
const shelfItemsTableColumns = ref([
  {
    name: 'actions',
    field: 'actions',
    label: '',
    align: 'center',
    sortable: false,
    required: true,
    order: 0
  },
  {
    name: 'shelf_number',
    field: 'shelf_number',
    label: 'Shelf Number',
    align: 'left',
    sortable: true,
    order: 1
  },
  {
    name: 'shelf_width',
    field: 'shelf_width',
    label: 'Shelf Width',
    align: 'left',
    sortable: true,
    order: 2
  },
  {
    name: 'shelf_height',
    field: 'shelf_height',
    label: 'Shelf Height',
    align: 'left',
    sortable: true,
    order: 3
  },
  {
    name: 'shelf_depth',
    field: 'shelf_depth',
    label: 'Shelf Depth',
    align: 'left',
    sortable: true,
    order: 4
  },
  {
    name: 'size_class',
    field: 'size_class',
    label: 'Size Class',
    align: 'left',
    sortable: true,
    order: 5
  },
  {
    name: 'max_capacity',
    field: 'max_capacity',
    label: 'Max Capacity',
    align: 'left',
    sortable: true,
    order: 6
  },
  {
    name: 'container_type',
    field: 'container_type',
    label: 'Container Type',
    align: 'left',
    sortable: true,
    order: 7
  },
  {
    name: 'owner',
    field: 'owner',
    label: 'Owner',
    align: 'left',
    sortable: true,
    order: 8
  },
  {
    name: 'id',
    field: 'id',
    label: 'Shelf Barcode',
    align: 'left',
    sortable: true,
    order: 9
  }
])
const shelfItemsTableFilters =  ref([
  {
    field: 'size_class',
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
    field: 'container_type',
    options: [
      {
        text: 'Trayed',
        value: false
      },
      {
        text: 'Non-Trayed',
        value: false
      }
    ]
  },
  {
    field: 'owner',
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
const showShelfModal = ref(false)
const shelfItemDetails = ref({
  shelf_number: '',
  owner: null,
  size_class: null,
  max_capacity: '',
  shelf_width: '',
  shelf_height: '',
  shelf_depth: '',
  shelf_barcode: ''
})
const renderAisleOptions = computed(() => {
  let aisles = []
  if (shelfData.value.module !== null) {
    aisles = buildingDetails.value.modules.find(m => m.id == shelfData.value.module).aisles
  } else {
    aisles = buildingDetails.value.aisles
  }
  return aisles
})
const renderladderOptions = computed(() => {
  let ladders = []
  if (shelfData.value.aisle !== null) {
    // converts the ladder value to an array that can be used in a select input
    const ladderTotal = renderAisleOptions.value.find(a => a.id == shelfData.value.aisle).ladders
    ladders = [...Array(ladderTotal)].map((n, i) => {
      return { id: i + 1 }
    })
  }
  return ladders
})


// Logic
onBeforeMount(() => {
  if (currentScreenSize.value == 'xs') {
    shelfItemsTableVisibleColumns.value = [
      'actions',
      'shelf_number',
      'shelf_width',
      'shelf_height',
      'shelf_depth'
    ]
  }
})

const handleShelfDataChange = (valueType) => {
  // reset the shelf filters depending on the changed field type
  switch (valueType) {
  case 'Module':
    shelfData.value.aisle = null
    shelfData.value.side = 'left'
    shelfData.value.ladder = null
    return
  case 'Aisle':
    shelfData.value.side = 'left'
    shelfData.value.ladder = null
    return
  }

  //TODO: load the items for the filtered shelf data
}
const handleOptionMenu = (action, rowData) => {
  // display the shelfItemDetail Modal using the selected rowData
  shelfItemDetails.value = {
    shelf_number: rowData.shelf_number,
    owner: rowData.owner,
    size_class: rowData.size_class,
    max_capacity: rowData.max_capacity,
    shelf_width: rowData.shelf_width,
    shelf_height: rowData.shelf_height,
    shelf_depth: rowData.shelf_depth,
    shelf_barcode: rowData.id,
    id: rowData.id
  }
  showShelfModal.value = true
}

const resetModal = () => {
  shelfItemDetails.value = {
    shelf_number: '',
    owner: null,
    size_class: null,
    max_capacity: '',
    shelf_width: '',
    shelf_height: '',
    shelf_depth: '',
    shelf_barcode: ''
  },
  showShelfModal.value = false
}
</script>
<style lang="scss" scoped>
.building {
  &-details {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    @media (max-width: $breakpoint-sm-min) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &-modal {
    width: 500px;

    @media (max-width: $breakpoint-sm-min) {
      width: 90vw;
    }

    &-btn {
      transition: .3s ease;

      &:hover {
        color: $accent;
        border-color: $accent;
      }
    }
  }
}
</style>
