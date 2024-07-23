<template>
  <div class="admin-location-manager q-pa-xs-sm q-pa-sm-lg">
    <div class="row q-mb-xs-xl q-mb-sm-none">
      <div class="col-grow q-mb-xs-md q-mb-sm-none">
        <EssentialTable
          :table-columns="locationTableColumns"
          :table-visible-columns="locationTableVisibleColumns"
          :filter-options="locationTableFilters"
          :table-data="locationData"
          :enable-table-reorder="false"
          :heading-row-class="'q-mb-xs-md q-mb-md-lg'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
          :heading-rearrange-class="'q-mr-xs-md q-mr-sm-none'"
        >
          <template #heading-row>
            <div
              class="col-xs-5 col-sm-auto q-mr-auto q-pl-xs-md"
              :class="currentScreenSize == 'xs' ? '' : 'self-center'"
            >
              <label class="text-h4 text-bold">
                {{ renderLocationTableTitle }}
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
                :label="renderLocationTableAction"
                class="btn-no-wrap text-body1 q-ml-sm"
                @click="showLocationModal.type = 'Add'"
              />
            </div>
          </template>

          <template #table-td="{ colName, props }">
            <span
              v-if="colName == 'actions'"
            >
              <MoreOptionsMenu
                :options="renderLocationTableOptionsMenu"
                class=""
                @click="handleOptionMenu(props.row)"
              />
            </span>

            <!-- <span
              v-if="colName == 'shelf_width' || colName == 'shelf_height' || colName == 'shelf_depth'"
            >
              {{ value }} ft
            </span> -->
          </template>
        </EssentialTable>
      </div>
    </div>
  </div>

  <!-- add/edit location property modal -->
  <AdminLocationManagerModal
    v-if="showLocationModal.type !== ''"
    :location-type="locationType"
    :action-type="showLocationModal.type"
    @hide="showLocationModal.type = ''"
  />
</template>

<script setup>
import { onBeforeMount, ref, computed } from 'vue'
// import { useBuildingStore } from '@/stores/building-store'
// import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from 'src/components/EssentialTable.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import AdminLocationManagerModal from '@/components/Admin/AdminLocationManagerModal.vue'

// Props
const mainProps = defineProps({
  locationType: {
    type: String,
    default: 'buildings',
    required: true
  }
})

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
// const { buildingDetails } = storeToRefs(useBuildingStore())

// Local Data
const locationData = ref([]) //TODO this needs to be rendered data from building store
const locationTableVisibleColumns = ref([])
const locationTableColumns = ref([])
const locationTableFilters =  ref([])
const renderLocationTableTitle = computed(() => {
  let title = ''
  switch (mainProps.locationType) {
  case 'shelves':
    title = 'Shelf'
    break
  default:
    title = mainProps.locationType
    title = title.replace(title[0], title[0].toUpperCase())
    break
  }
  return title
})
const renderLocationTableAction = computed(() => {
  let actionText = ''
  switch (mainProps.locationType) {
  case 'buildings':
    actionText = 'Add Building'
    break
  case 'modules':
    actionText = 'Add Module'
    break
  case 'aisles':
    actionText = 'Add Aisle'
    break
  case 'ladders':
    actionText = 'Add Ladder'
    break
  case 'shelves':
    actionText = 'Add Shelf'
    break
  default:
    break
  }
  return actionText
})
const renderLocationTableOptionsMenu = computed(() => {
  let options = []
  switch (mainProps.locationType) {
  case 'buildings':
    options = [{ text: 'Edit Building' }]
    break
  case 'modules':
    options = [{ text: 'Edit Module' }]
    break
  case 'aisles':
    options = [{ text: 'Edit Aisle' }]
    break
  case 'ladders':
    options = [{ text: 'Edit Ladder' }]
    break
  case 'shelves':
    options = [{ text: 'Edit Shelf' }]
    break
  default:
    break
  }
  return options
})
const showLocationModal = ref({
  type: '',
  locationType: mainProps.locationType
})


// Logic
onBeforeMount(() => {
  generateLocationTableFields()
})

const handleOptionMenu = async (rowData) => {
  // TODO remove rowData if it is not needed to be passed to the locationModal since will have store data
  console.log(rowData)
  showLocationModal.value.type = 'Edit'
}

const generateLocationTableFields = () => {
  // creates the report table fields needed based on the selected location type
  switch (mainProps.locationType) {
  case 'buildings':
    locationTableColumns.value = [
      {
        name: 'actions',
        field: 'actions',
        label: '',
        align: 'center',
        sortable: false,
        required: true
      },
      {
        name: 'building',
        field: row => row.building?.name,
        label: 'Building',
        align: 'left',
        sortable: true
      },
      {
        name: 'create_dt',
        field: 'create_dt',
        label: 'Created Date',
        align: 'left',
        sortable: true
      },
      {
        name: 'update_dt',
        field: 'update_dt',
        label: 'Last Updated',
        align: 'left',
        sortable: true
      }
    ]
    locationTableVisibleColumns.value = [
      'actions',
      'building',
      'create_dt',
      'update_dt'
    ]
    break
  case 'modules':
    locationTableColumns.value = [
      {
        name: 'actions',
        field: 'actions',
        label: '',
        align: 'center',
        sortable: false,
        required: true
      },
      {
        name: 'module',
        field: row => row.module?.module_number,
        label: 'Module',
        align: 'left',
        sortable: true
      },
      {
        name: 'create_dt',
        field: 'create_dt',
        label: 'Created Date',
        align: 'left',
        sortable: true
      },
      {
        name: 'update_dt',
        field: 'update_dt',
        label: 'Last Updated',
        align: 'left',
        sortable: true
      }
    ]
    locationTableVisibleColumns.value = [
      'actions',
      'module',
      'create_dt',
      'update_dt'
    ]
    break
  case 'aisles':
    locationTableColumns.value = [
      {
        name: 'actions',
        field: 'actions',
        label: '',
        align: 'center',
        sortable: false,
        required: true
      },
      {
        name: 'aisle',
        field: row => row.aisle?.aisle_number?.number,
        label: 'Aisle',
        align: 'left',
        sortable: true
      },
      {
        name: 'sort_priority',
        field: 'sort_priority',
        label: 'Location Logical Order',
        align: 'left',
        sortable: true
      },
      {
        name: 'create_dt',
        field: 'create_dt',
        label: 'Created Date',
        align: 'left',
        sortable: true
      },
      {
        name: 'update_dt',
        field: 'update_dt',
        label: 'Last Updated',
        align: 'left',
        sortable: true
      }
    ]
    locationTableVisibleColumns.value = [
      'actions',
      'aisle',
      'sort_priority',
      'create_dt',
      'update_dt'
    ]
    break
  case 'ladders':
    locationTableColumns.value = [
      {
        name: 'actions',
        field: 'actions',
        label: '',
        align: 'center',
        sortable: false,
        required: true
      },
      {
        name: 'ladder',
        field: row => row.ladder?.ladder_number?.number,
        label: 'Ladder',
        align: 'left',
        sortable: true
      },
      {
        name: 'sort_priority',
        field: 'sort_priority',
        label: 'Location Logical Order',
        align: 'left',
        sortable: true
      },
      {
        name: 'create_dt',
        field: 'create_dt',
        label: 'Created Date',
        align: 'left',
        sortable: true
      },
      {
        name: 'update_dt',
        field: 'update_dt',
        label: 'Last Updated',
        align: 'left',
        sortable: true
      }
    ]
    locationTableVisibleColumns.value = [
      'actions',
      'ladder',
      'sort_priority',
      'create_dt',
      'update_dt'
    ]
    break
  case 'shelves':
    locationTableColumns.value = [
      {
        name: 'actions',
        field: 'actions',
        label: '',
        align: 'center',
        sortable: false,
        required: true
      },
      {
        name: 'shelf_number',
        field: 'shelf_number',
        label: 'Shelf Number',
        align: 'left',
        sortable: true
      },
      {
        name: 'shelf_width',
        field: 'shelf_width',
        label: 'Shelf Width',
        align: 'left',
        sortable: true
      },
      {
        name: 'shelf_height',
        field: 'shelf_height',
        label: 'Shelf Height',
        align: 'left',
        sortable: true
      },
      {
        name: 'shelf_depth',
        field: 'shelf_depth',
        label: 'Shelf Depth',
        align: 'left',
        sortable: true
      },
      {
        name: 'size_class',
        field: 'size_class',
        label: 'Size Class',
        align: 'left',
        sortable: true
      },
      {
        name: 'max_capacity',
        field: 'max_capacity',
        label: 'Max Capacity',
        align: 'left',
        sortable: true
      },
      {
        name: 'container_type',
        field: 'container_type',
        label: 'Container Type',
        align: 'left',
        sortable: true
      },
      {
        name: 'owner',
        field: 'owner',
        label: 'Owner',
        align: 'left',
        sortable: true
      },
      {
        name: 'shelf_barcode',
        field: 'barcode',
        label: 'Shelf Barcode',
        align: 'left',
        sortable: true
      }
    ]
    locationTableVisibleColumns.value = [
      'actions',
      'shelf_number',
      'shelf_width',
      'shelf_height',
      'shelf_depth',
      'size_class',
      'max_capacity',
      'container_type',
      'owner',
      'shelf_barcode'
    ]
    break
  default:
    break
  }
}
</script>

<style lang="scss" scoped>
</style>
