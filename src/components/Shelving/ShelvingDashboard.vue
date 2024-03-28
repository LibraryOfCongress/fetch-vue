<template>
  <div class="shelving-dashboard">
    <div class="row">
      <div class="col-grow">
        <EssentialTable
          :table-columns="shelfItemsTableColumns"
          :table-visible-columns="shelfItemsTableVisibleColumns"
          :filter-options="shelfItemTableFilters"
          :table-data="shelvingJobList"
          :disable-table-reorder="currentScreenSize == 'xs' ? true : false"
          :heading-row-class="'q-mb-xs-md q-mb-md-lg'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
        >
          <template #heading-row>
            <div
              class="col-sm-5 col-md-12 col-lg-auto"
              :class="currentScreenSize == 'sm' || currentScreenSize == 'xs' ? '' : 'self-center'"
            >
              <label class="text-h4 text-bold">
                Shelving Jobs
              </label>
            </div>

            <div
              class="col-xs-grow col-sm-7 col-md-auto flex"
              :class="currentScreenSize == 'sm' || currentScreenSize == 'xs' ? 'justify-end q-mb-md' : 'order-1'"
            >
              <q-btn
                no-caps
                unelevated
                color="accent"
                label="Create Shelving Job"
                class="btn-no-wrap text-body1 q-ml-xs-none q-ml-sm-sm"
                @click="showShelfModal = !showShelfModal"
              />
            </div>
          </template>

          <template #table-td="{ colName, value }">
            <span
              v-if="colName == 'status'"
              class="outline text-nowrap"
              :class="value == 'In Queue' ? 'text-highlight' : value == 'Paused' ? 'text-highlight-yellow' : 'text-highlight-red'"
            >
              {{ value }}
            </span>
            <span
              v-else-if="colName == 'containers'"
              class="outline text-nowrap"
            >
              {{ value }} Containers
            </span>
          </template>
        </EssentialTable>
      </div>
    </div>

    <!-- Create Shelving Job Modal -->
    <PopupModal
      v-if="showShelfModal"
      title="Create New Shelf"
      :show-actions="false"
      @reset="resetCreateShelfModal"
    >
      <template #main-content>
        <q-card-section class="column no-wrap items-center">
          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Owner
            </label>
            <SelectInput
              v-model="newShelf.owner"
              :options="owners"
              option-value="id"
              option-label="name"
              :placeholder="'Select Owner'"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Shelf Number
            </label>
            <TextInput
              v-model="newShelf.shelf_number"
              placeholder="Enter Shelf Number"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Shelf Width
            </label>
            <TextInput
              v-model="newShelf.shelf_width"
              placeholder="Enter Shelf Width"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Shelf Height
            </label>
            <TextInput
              v-model="newShelf.shelf_height"
              placeholder="Enter Shelf Height"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Shelf Depth
            </label>
            <TextInput
              v-model="newShelf.shelf_depthr"
              placeholder="Enter Shelf Depth"
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
      </template>

      <template #footer-content="{ hideModal }">
        <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Create Shelf"
            class="text-body1 full-width"
            @click="hideModal"
          />

          <q-space class="q-mx-xs" />

          <q-btn
            outline
            no-caps
            label="Cancel"
            class="shelving-modal-btn text-body1 full-width"
            @click="hideModal"
          />
        </q-card-section>
      </template>
    </PopupModal>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, inject } from 'vue'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { useShelvingStore } from '@/stores/shelving-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from 'src/components/EssentialTable.vue'
import SelectInput from 'src/components/SelectInput.vue'
import TextInput from 'src/components/TextInput.vue'
import PopupModal from 'src/components/PopupModal.vue'

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appIsLoadingData } = storeToRefs(useGlobalStore())
const { containerTypes, owners } = storeToRefs(useOptionStore())
const { shelvingJobList } = storeToRefs(useShelvingStore())
const { getShelvingJobList } = useShelvingStore()

// Local Data
//TODO: remove once api is loading shelving jobs data
// const shelfItems = ref([
//   {
//     id: '00924891289',
//     containers: 5,
//     status: 'Paused',
//     user_id: 'User1',
//     create_dt: '01/01/2000'
//   },
//   {
//     id: '00924891290',
//     containers: 6,
//     status: 'In Queue',
//     user_id: 'User1',
//     create_dt: '01/01/2000'
//   },
//   {
//     id: '00924891291',
//     containers: 7,
//     status: 'Incomplete',
//     user_id: '',
//     create_dt: '01/01/2001'
//   },
//   {
//     id: '00924891292',
//     containers: 7,
//     status: 'Cancelled',
//     user_id: 'User2',
//     create_dt: '01/01/2002'
//   }
// ])
const shelfItemsTableVisibleColumns = ref([
  'id',
  'containers',
  'status',
  'user_id',
  'create_dt'
])
const shelfItemsTableColumns = ref([
  {
    name: 'id',
    field: 'id',
    label: 'Job Number',
    align: 'left',
    sortable: true,
    order: 0
  },
  {
    name: 'containers',
    field: 'containers',
    label: '# of Containers in Job',
    align: 'left',
    sortable: true,
    order: 1
  },
  {
    name: 'status',
    field: 'status',
    label: 'Status',
    align: 'left',
    sortable: true,
    order: 2
  },
  {
    name: 'user_id',
    field: 'user_id',
    label: 'Assigned User',
    align: 'left',
    sortable: true,
    order: 3
  },
  {
    name: 'create_dt',
    field: 'create_dt',
    label: 'Date Added',
    align: 'left',
    sortable: true,
    order: 4
  }
])
const shelfItemTableFilters =  ref([
  {
    field: 'status',
    options: [
      {
        text: 'Paused',
        value: false
      },
      {
        text: 'In Queue',
        value: false
      },
      {
        text: 'Incomplete',
        value: false
      },
      {
        text: 'Cancelled',
        value: false
      }
    ]
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
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  loadShelvingJobs()

  if (currentScreenSize.value == 'xs') {
    shelfItemsTableVisibleColumns.value = [
      'job_number',
      'status',
      'assigned_user',
      'added_date'
    ]
  }
})

const resetCreateShelfModal = () => {
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

const loadShelvingJobs = async () => {
  try {
    appIsLoadingData.value = true
    await getShelvingJobList()
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appIsLoadingData.value = false
  }
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
}
</style>