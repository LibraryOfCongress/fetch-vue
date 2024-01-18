<template>
  <q-page padding>
    <div class="row justify-between q-my-md">
      <div class="col-xs-12 col-sm-4 col-md-3">
        <div class="shelving-details q-mb-xs-md q-mb-sm-none q-mr-sm-xl">
          <label
            id="aisleSelection"
            for="aisle"
            class="shelving-details-label text-h4 text-bold q-mr-sm"
          >
            Aisle:
          </label>
          <SelectInput
            v-model="shelfData.aisle"
            :options="aisleOptions"
            option-value="id"
            option-label="name"
          />
        </div>
      </div>

      <div class="col-xs-12 col-sm-4 col-md-3">
        <div class="shelving-details q-mb-xs-md q-mb-sm-none q-mr-sm-xl">
          <label
            id="sideSelection"
            for="side"
            class="shelving-details-label text-h4 text-bold q-mr-sm"
          >
            Side:
          </label>
          <SelectInput
            v-model="shelfData.side"
            :options="sideOptions"
            option-value="id"
            option-label="name"
          />
        </div>
      </div>

      <div class="col-xs-12 col-sm-4 col-md-3">
        <div class="shelving-details q-mb-xs-sm q-mb-sm-none">
          <label
            id="ladderSelection"
            for="ladder"
            class="shelving-details-label text-h4 text-bold q-mr-sm"
          >
            Ladder:
          </label>
          <SelectInput
            v-model="shelfData.ladder"
            :options="ladderOptions"
            option-value="id"
            option-label="name"
          />
        </div>
      </div>
    </div>

    <q-space class="divider q-my-xs-lg q-my-sm-xl" />

    <div class="row">
      <div class="col-grow">
        <EssentialTable
          :table-columns="shelfItemsTableColumns"
          :table-visible-columns="shelfItemsTableVisibleColumns"
          :table-data="shelfData.items"
          :disable-table-reorder="currentScreenSize == 'xs' ? true : false"
          :heading-row-class="'q-mb-lg'"
        >
          <template #heading-row>
            <div class="col-sm-auto col-xs-5 self-center q-mr-auto">
              <label class="text-h4 text-bold">
                Shelf:
              </label>
            </div>

            <div
              class="col-sm-auto col-xs-6 flex"
              :class="currentScreenSize == 'xs' ? 'order-1 q-mt-lg' : null"
            >
              <q-btn
                no-caps
                flat
                color="accent"
                label="Export Report"
                class="btn-no-wrap text-body1 q-mr-sm"
              />
            </div>

            <div
              class="col-auto flex"
              :class="currentScreenSize == 'xs' ? 'order-2 q-ml-auto q-mt-lg' : 'order-1'"
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

          <template #table-td="{ colName, value }">
            <span
              v-if="colName == 'vacancy'"
              class="outline"
              :class="value > 66 ? 'text-highlight' : value < 33 ? 'text-highlight-red' : 'text-highlight-yellow'"
            >
              {{ value }}%
            </span>
            <span
              v-else-if="colName == 'available_capacity'"
              class="outline"
              :class="value > 66 ? 'text-highlight' : value < 33 ? 'text-highlight-red' : 'text-highlight-yellow'"
            >
              {{ value }} Containers Left
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
      <q-card class="shelving-modal">
        <q-card-section class="row items-center justify-between q-pb-none">
          <h2 class="text-h6">
            Create New Shelf
          </h2>

          <q-btn
            icon="close"
            flat
            round
            dense
            @click="resetModal"
          />
        </q-card-section>

        <q-card-section class="column no-wrap items-center">
          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Owner
            </label>
            <SelectInput
              v-model="newShelf.owner"
              :options="ownerOptions"
              option-value="id"
              option-label="name"
              :placeholder="'Select Owner'"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Shelf Number
            </label>
            <q-input
              outlined
              placeholder="Enter Shelf Number"
              :dense="currentScreenSize == 'xs'"
              v-model="newShelf.shelf_number"
              class="full-width"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Shelf Width
            </label>
            <q-input
              outlined
              placeholder="Enter Shelf Width"
              :dense="currentScreenSize == 'xs'"
              v-model="newShelf.shelf_width"
              class="full-width"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Shelf Height
            </label>
            <q-input
              outlined
              placeholder="Enter Shelf Height"
              :dense="currentScreenSize == 'xs'"
              v-model="newShelf.shelf_height"
              class="full-width"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Shelf Depth
            </label>
            <q-input
              outlined
              placeholder="Enter Shelf Depth"
              :dense="currentScreenSize == 'xs'"
              v-model="newShelf.shelf_depthr"
              class="full-width"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Allowed Container Type
            </label>
            <SelectInput
              v-model="newShelf.container_type"
              :options="containerTypes"
              option-value="id"
              option-label="name"
              :placeholder="'Select Type'"
            />
          </div>
        </q-card-section>

        <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Create Shelf"
            class="text-body1 full-width"
            @click="resetModal"
          />

          <q-space class="q-mx-xs" />

          <q-btn
            outline
            no-caps
            label="Cancel"
            class="shelving-modal-btn text-body1 full-width"
            @click="resetModal"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue'
import { useOptionStore } from '@/stores/option-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from 'src/components/EssentialTable.vue'
import SelectInput from 'src/components/SelectInput.vue'

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { containerTypes, ownerOptions } = storeToRefs(useOptionStore())

// Local Data
const shelfData = ref({
  aisle: null,
  side: null,
  ladder: null,
  items: [
    {
      id: '00924891289',
      shelf_width: '12 ft',
      shelf_height: '3 ft',
      shelf_depth: '22 ft',
      vacancy: 47,
      max_capacity: 15,
      current_capacity: 7,
      available_capacity: 8,
      size_class: 'Trayed'
    },
    {
      id: '00924891290',
      shelf_width: '22.2 ft',
      shelf_height: '3 ft',
      shelf_depth: '22 ft',
      vacancy: 93,
      max_capacity: 60,
      current_capacity: 4,
      available_capacity: 56,
      size_class: 'Trayed'
    },
    {
      id: '00924891291',
      shelf_width: '24 ft',
      shelf_height: '4.4 ft',
      shelf_depth: '22 ft',
      vacancy: 0,
      max_capacity: 100,
      current_capacity: 100,
      available_capacity: 0,
      size_class: 'Non-Trayed'
    }
  ]
})
const aisleOptions = ref([
  {
    id: 1,
    name: '56'
  },
  {
    id: 2,
    name: '57'
  },
  {
    id: 3,
    name: '58'
  }
])
const sideOptions = ref([
  {
    id: 1,
    name: 'Left'
  },
  {
    id: 2,
    name: 'Right'
  }
])
const ladderOptions = ref([
  {
    id: 1,
    name: '11A'
  },
  {
    id: 2,
    name: '11B'
  },
  {
    id: 3,
    name: '12A'
  },
  {
    id: 4,
    name: '12B'
  }
])
const shelfItemsTableVisibleColumns = ref([
  'shelf_width',
  'shelf_height',
  'shelf_depth',
  'vacancy',
  'max_capacity',
  'current_capacity',
  'available_capacity',
  'size_class',
  'id'
])
const shelfItemsTableColumns = ref([
  {
    name: 'shelf_width',
    field: 'shelf_width',
    label: 'Shelf Width',
    align: 'left',
    sortable: true,
    order: 0
  },
  {
    name: 'shelf_height',
    field: 'shelf_height',
    label: 'Shelf Height',
    align: 'left',
    sortable: true,
    order: 1
  },
  {
    name: 'shelf_depth',
    field: 'shelf_depth',
    label: 'Shelf Depth',
    align: 'left',
    sortable: true,
    order: 2
  },
  {
    name: 'vacancy',
    field: 'vacancy',
    label: 'Vacancy',
    align: 'left',
    sortable: true,
    order: 3
  },
  {
    name: 'max_capacity',
    field: 'max_capacity',
    label: 'Max Capacity',
    align: 'left',
    sortable: true,
    order: 4
  },
  {
    name: 'current_capacity',
    field: 'current_capacity',
    label: 'Current Capacity',
    align: 'left',
    sortable: true,
    order: 5
  },
  {
    name: 'available_capacity',
    field: 'available_capacity',
    label: 'Available Capacity',
    align: 'left',
    sortable: true,
    order: 6
  },
  {
    name: 'size_class',
    field: 'size_class',
    label: 'Size Class',
    align: 'left',
    sortable: true,
    order: 7
  },
  {
    name: 'id',
    field: 'id',
    label: 'Shelf Barcode',
    align: 'left',
    sortable: true,
    order: 8
  }
])
const showShelfModal = ref(false)
const newShelf = ref({
  owner: null,
  container_type: null,
  shelf_number: '',
  shelf_width: '',
  shelf_height: '',
  shelf_depth: ''
})

// Logic
onBeforeMount(() => {
  if (currentScreenSize.value == 'xs') {
    shelfItemsTableVisibleColumns.value = [
      'shelf_width',
      'shelf_height',
      'shelf_depth',
      'vacancy'
    ]
  }
})

watch(currentScreenSize, () => {
  if (currentScreenSize.value == 'xs') {
    shelfItemsTableVisibleColumns.value = [
      'shelf_width',
      'shelf_height',
      'shelf_depth',
      'vacancy'
    ]
  } else {
    shelfItemsTableVisibleColumns.value = [
      'shelf_width',
      'shelf_height',
      'shelf_depth',
      'vacancy',
      'max_capacity',
      'current_capacity',
      'available_capacity',
      'size_class',
      'id'
    ]
  }
})

const resetModal = () => {
  newShelf.value = {
    owner: null,
    container_type: null,
    shelf_number: '',
    shelf_width: '',
    shelf_height: '',
    shelf_depth: ''
  },
  showShelfModal.value = false
}
</script>
<style lang="scss" scoped>
.shelving {
  &-details {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

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
