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
import { useGlobalStore } from '@/stores/global-store'
import { useBuildingStore } from '@/stores/building-store'
import { storeToRefs } from 'pinia'
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
const { appIsLoadingData } = storeToRefs(useGlobalStore())
const { getBuildingsList } = useBuildingStore()
const {
  buildings,
  buildingDetails,
  moduleDetails,
  aisleDetails,
  sideDetails,
  ladderDetails
} = storeToRefs(useBuildingStore())

// Local Data
const locationData = ref([]) //TODO this needs to be rendered data from building store
const locationTableVisibleColumns = ref([])
const locationTableColumns = ref([])
const locationTableFilters =  ref([])
const renderLocationTableTitle = computed(() => {
  let title = ''
  const building = buildingDetails.value.name
  const module = moduleDetails.value?.module_number
  const aisle = aisleDetails.value?.aisle_number?.number
  const side = sideDetails.value?.side_orientation?.name
  const ladder = ladderDetails.value?.ladder_number?.number
  if (mainProps.locationType == 'buildings') {
    // returns a title in title case format
    title = `${mainProps.locationType.replace(mainProps.locationType[0], mainProps.locationType[0].toUpperCase())}`
  } else if (mainProps.locationType == 'modules') {
    // returns a title in the format of 'building: Modules'
    // ex: Fort Meade (1-2-L-3): Shelves
    title = `${building}: ${mainProps.locationType.replace(mainProps.locationType[0], mainProps.locationType[0].toUpperCase())}`
  } else {
    // returns a title in the format of 'building (location selection): locationType'
    // ex: Fort Meade (1-2-L-3): Shelves
    title = `${building} (${module ?? ''}${aisle ? '-' + aisle : ''}${side && side == 'Left' ? '-L' : side && side == 'Right' ? '-R' : ''}${ladder ? '-' + ladder : ''}): ${mainProps.locationType.replace(mainProps.locationType[0], mainProps.locationType[0].toUpperCase())}`
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
  generateLocationTableInfo()
})

const handleOptionMenu = async (rowData) => {
  // TODO remove rowData if it is not needed to be passed to the locationModal since will have store data
  console.log(rowData)
  showLocationModal.value.type = 'Edit'
}

const generateLocationTableInfo = async () => {
  // creates the report table fields needed based on the selected location type
  switch (mainProps.locationType) {
  case 'buildings':
    appIsLoadingData.value = true
    await getBuildingsList()
    appIsLoadingData.value = false

    locationData.value = buildings.value
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
        field: 'name',
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
    locationData.value = buildingDetails.value.modules
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
        field: 'module_number',
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
    locationData.value = moduleDetails.value.aisles
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
        field: row => row.aisle_number?.number,
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
    locationData.value = sideDetails.value.ladders
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
        field: row => row.ladder_number?.number,
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
    locationData.value = ladderDetails.value.shelves
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
        field: row => row.shelf_number?.number,
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
        field: row => row.owner?.name,
        label: 'Owner',
        align: 'left',
        sortable: true
      },
      {
        name: 'shelf_barcode',
        field: row => row.barcode?.value,
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