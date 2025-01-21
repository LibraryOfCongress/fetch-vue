<template>
  <div class="advanced-search-results">
    <div class="row q-mb-xs-xl q-mb-sm-none">
      <div class="col-grow q-mb-xs-md q-mb-sm-none">
        <EssentialTable
          :table-columns="searchResultsTableColumns"
          :table-visible-columns="searchResultsTableVisibleColumns"
          :filter-options="searchResultsTableFilters"
          :table-data="searchResults"
          :enable-table-reorder="false"
          :heading-row-class="'q-mb-xs-md q-mb-md-lg'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
          :enable-pagination="true"
          :pagination-total="searchResultsTotal"
          :pagination-loading="appIsLoadingData"
          @update-pagination="loadAdvancedSearch($event)"
          @selected-table-row="handleResultSelection($event)"
        >
          <template #heading-row>
            <div
              class="col-12 q-mb-sm"
            >
              <h1 class="text-h4 text-bold">
                Advanced Search
              </h1>
            </div>

            <div
              v-if="route.params.searchType == 'Item'"
              class="col-xs-12 col-sm-auto col-md-auto q-mb-xs-md q-mb-sm-none"
            >
              <ToggleButtonInput
                v-model="toggleSearchTab"
                :options="[
                  {label: 'Non-Tray Items', value: 'nonTrayItem'},
                  {label: 'Tray Items', value: 'trayItem'}
                ]"
                @update:model-value="loadAdvancedSearch(advanceSearchHistory, toggleSearchTab)"
                class="text-no-wrap"
              />
            </div>
          </template>

          <template #table-td="{ colName, value }">
            <span
              v-if="colName == 'status'"
              class="outline text-nowrap"
              :class="value == 'Created' || value == 'Completed' ? 'text-highlight' : value == 'Paused' || value == 'Running' ? 'text-highlight-warning' : 'text-highlight-negative'"
            >
              {{ value }}
            </span>
            <span v-else-if="colName.includes('_dt')">
              {{ formatDateTime(value).date }}
            </span>
          </template>
        </EssentialTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, inject, watch } from 'vue'
import { useRoute, useRouter  } from 'vue-router'
import { useSearchStore } from '@/stores/search-store'
import { useGlobalStore } from '@/stores/global-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from '@/components/EssentialTable.vue'
import ToggleButtonInput from '@/components/ToggleButtonInput.vue'

const route = useRoute()
const router = useRouter()

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const {
  searchResults,
  searchResultsTotal,
  advanceSearchHistory
} = storeToRefs(useSearchStore())
const { getAdvancedSearchResults } = useSearchStore()
const { appIsLoadingData } = storeToRefs(useGlobalStore())

// Local Data
const toggleSearchTab = ref(null)
const searchResultsTableVisibleColumns = ref([])
const searchResultsTableColumns = ref([])
// TODO need to figure out how filtering will work
const searchResultsTableFilters =  ref([
  {
    field: 'status',
    label: 'Status',
    options: [
      {
        text: 'Created',
        value: false
      },
      {
        text: 'Paused',
        value: false
      },
      {
        text: 'Completed',
        value: false
      }
    ]
  }
])

// Logic
const formatDateTime = inject('format-date-time')
const handleAlert = inject('handle-alert')
const renderItemBarcodeDisplay = inject('render-item-barcode-display')

onBeforeMount(() => {
  loadAdvancedSearch(route.query)
  generateSearchTableFields()
})
watch(route, () => {
  generateSearchTableFields()
})

const generateSearchTableFields = () => {
  // creates the search table fields needed based on the route searcType
  switch (route.params.searchType) {
    case 'Item':
    // set the default tab for advance item search
      toggleSearchTab.value = 'nonTrayItem'
      searchResultsTableColumns.value = [
        {
          name: 'accession_dt',
          field: 'accession_dt',
          label: 'Accession Date',
          align: 'left',
          sortable: true,
          classes: row => row.withdrawn_barcode_id ? 'q-td--no-hover' : ''
        },
        {
          name: 'status',
          field: 'status',
          label: 'Status',
          align: 'left',
          sortable: true,
          classes: row => row.withdrawn_barcode_id ? 'q-td--no-hover' : ''
        },
        {
          name: 'owner',
          field: row => row.owner?.name,
          label: 'Owner',
          align: 'left',
          sortable: true,
          classes: row => row.withdrawn_barcode_id ? 'q-td--no-hover' : ''
        },
        {
          name: 'size_class',
          field: row => row.size_class?.name,
          label: 'Size Class',
          align: 'left',
          sortable: true,
          classes: row => row.withdrawn_barcode_id ? 'q-td--no-hover' : ''
        },
        {
          name: 'media_type',
          field: row => row.media_type?.name,
          label: 'Media Type',
          align: 'left',
          sortable: true,
          classes: row => row.withdrawn_barcode_id ? 'q-td--no-hover' : ''
        },
        {
          name: 'barcode',
          field: row => renderItemBarcodeDisplay(row),
          label: 'Item Barcode',
          align: 'left',
          sortable: true,
          classes: row => row.withdrawn_barcode_id ? 'q-td--no-hover' : ''
        }
      ]
      searchResultsTableVisibleColumns.value = [
        'accession_dt',
        'status',
        'owner',
        'size_class',
        'media_type',
        'barcode'
      ]
      if (currentScreenSize.value == 'xs') {
        searchResultsTableVisibleColumns.value = [
          'accession_dt',
          'status',
          'size_class',
          'media_type',
          'barcode'
        ]
      }
      break
    case 'Tray':
      searchResultsTableColumns.value = [
        {
          name: 'accession_dt',
          field: 'accession_dt',
          label: 'Accession Date',
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
          name: 'size_class',
          field: row => row.size_class?.name,
          label: 'Size Class',
          align: 'left',
          sortable: true
        },
        {
          name: 'media_type',
          field: row => row.media_type?.name,
          label: 'Media Type',
          align: 'left',
          sortable: true
        },
        {
          name: 'barcode',
          field: row => renderItemBarcodeDisplay(row),
          label: 'Tray Barcode',
          align: 'left',
          sortable: true
        }
      ]
      searchResultsTableVisibleColumns.value = [
        'accession_dt',
        'owner',
        'size_class',
        'media_type',
        'barcode'
      ]
      if (currentScreenSize.value == 'xs') {
        searchResultsTableVisibleColumns.value = [
          'accession_dt',
          'size_class',
          'media_type',
          'barcode'
        ]
      }
      break
    case 'Shelf':
      searchResultsTableColumns.value = [
        {
          name: 'barcode',
          field: row => renderItemBarcodeDisplay(row),
          label: 'Shelf Barcode',
          align: 'left',
          sortable: true
        },
        {
          name: 'shelf_location',
          field: 'location',
          label: 'Shelf Location',
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
          name: 'size_class',
          field: row => row.shelf_type?.size_class?.name,
          label: 'Size Class',
          align: 'left',
          sortable: true
        }
      ]
      searchResultsTableVisibleColumns.value = [
        'barcode',
        'shelf_location',
        'owner',
        'size_class'
      ]
      break
    case 'Accession':
      searchResultsTableColumns.value = [
        {
          name: 'create_dt',
          field: 'create_dt',
          label: 'Create Date',
          align: 'left',
          sortable: true
        },
        {
          name: 'job_id',
          field: 'workflow_id',
          label: 'Job Number',
          align: 'left',
          sortable: true
        },
        {
          name: 'status',
          field: 'status',
          label: 'Status',
          align: 'left',
          sortable: true
        },
        {
          name: 'created_by',
          field: row => renderUserName(row.created_by),
          label: 'Created By',
          align: 'left',
          sortable: true
        },
        {
          name: 'user_id',
          field: row => renderUserName(row.user),
          label: 'Completed By',
          align: 'left',
          sortable: true
        }
      ]
      searchResultsTableVisibleColumns.value = [
        'create_dt',
        'job_id',
        'status',
        'created_by',
        'user_id'
      ]
      if (currentScreenSize.value == 'xs') {
        searchResultsTableVisibleColumns.value = [
          'create_dt',
          'job_id',
          'status',
          'user_id'
        ]
      }
      break
    case 'Verification':
      searchResultsTableColumns.value = [
        {
          name: 'create_dt',
          field: 'create_dt',
          label: 'Create Date',
          align: 'left',
          sortable: true
        },
        {
          name: 'job_id',
          field: 'workflow_id',
          label: 'Job Number',
          align: 'left',
          sortable: true
        },
        {
          name: 'status',
          field: 'status',
          label: 'Status',
          align: 'left',
          sortable: true
        },
        {
          name: 'created_by',
          field: row => renderUserName(row.created_by),
          label: 'Created By',
          align: 'left',
          sortable: true
        },
        {
          name: 'user_id',
          field: row => renderUserName(row.user),
          label: 'Completed By',
          align: 'left',
          sortable: true
        }
      ]
      searchResultsTableVisibleColumns.value = [
        'create_dt',
        'job_id',
        'status',
        'created_by',
        'user_id'
      ]
      if (currentScreenSize.value == 'xs') {
        searchResultsTableVisibleColumns.value = [
          'create_dt',
          'job_id',
          'status',
          'user_id'
        ]
      }
      break
    case 'Request':
      searchResultsTableColumns.value = [
        {
          name: 'create_dt',
          field: 'create_dt',
          label: 'Create Date',
          align: 'left',
          sortable: true
        },
        {
          name: 'job_id',
          field: 'id',
          label: 'Request ID #',
          align: 'left',
          sortable: true
        },
        {
          name: 'requestor_name',
          field: 'requestor_name',
          label: 'Requested By',
          align: 'left',
          sortable: true
        }
      ]
      searchResultsTableVisibleColumns.value = [
        'create_dt',
        'job_id',
        'requestor_name'
      ]
      if (currentScreenSize.value == 'xs') {
        searchResultsTableVisibleColumns.value = [
          'create_dt',
          'job_id',
          'requestor_name'
        ]
      }
      break
    case 'Refile':
      searchResultsTableColumns.value = [
        {
          name: 'create_dt',
          field: 'create_dt',
          label: 'Create Date',
          align: 'left',
          sortable: true
        },
        {
          name: 'job_id',
          field: 'id',
          label: 'Job Number',
          align: 'left',
          sortable: true
        },
        {
          name: 'status',
          field: 'status',
          label: 'Status',
          align: 'left',
          sortable: true
        },
        {
          name: 'created_by',
          field: row => renderUserName(row.created_by),
          label: 'Created By',
          align: 'left',
          sortable: true
        },
        {
          name: 'assigned_user',
          field: row => renderUserName(row.assigned_user),
          label: 'Completed By',
          align: 'left',
          sortable: true
        }
      ]
      searchResultsTableVisibleColumns.value = [
        'create_dt',
        'job_id',
        'status',
        'created_by',
        'assigned_user'
      ]
      if (currentScreenSize.value == 'xs') {
        searchResultsTableVisibleColumns.value = [
          'create_dt',
          'job_id',
          'status',
          'assigned_user'
        ]
      }
      break
    case 'Withdraw':
      searchResultsTableColumns.value = [
        {
          name: 'create_dt',
          field: 'create_dt',
          label: 'Create Date',
          align: 'left',
          sortable: true
        },
        {
          name: 'job_id',
          field: 'id',
          label: 'Job Number',
          align: 'left',
          sortable: true
        },
        {
          name: 'status',
          field: 'status',
          label: 'Status',
          align: 'left',
          sortable: true
        },
        {
          name: 'created_by',
          field: row => renderUserName(row.created_by),
          label: 'Created By',
          align: 'left',
          sortable: true
        },
        {
          name: 'assigned_user',
          field: row => renderUserName(row.assigned_user),
          label: 'Completed By',
          align: 'left',
          sortable: true
        }
      ]
      searchResultsTableVisibleColumns.value = [
        'create_dt',
        'job_id',
        'status',
        'created_by',
        'assigned_user'
      ]
      if (currentScreenSize.value == 'xs') {
        searchResultsTableVisibleColumns.value = [
          'create_dt',
          'job_id',
          'status',
          'assigned_user'
        ]
      }
      break
    default:
      searchResultsTableColumns.value = [
        {
          name: 'create_dt',
          field: 'create_dt',
          label: 'Create Date',
          align: 'left',
          sortable: true
        },
        {
          name: 'job_id',
          field: 'id',
          label: 'Job Number',
          align: 'left',
          sortable: true
        },
        {
          name: 'status',
          field: 'status',
          label: 'Status',
          align: 'left',
          sortable: true
        },
        {
          name: 'created_by',
          field: row => renderUserName(row.created_by),
          label: 'Created By',
          align: 'left',
          sortable: true
        },
        {
          name: 'user_id',
          field: row => renderUserName(row.user),
          label: 'Completed By',
          align: 'left',
          sortable: true
        }
      ]
      searchResultsTableVisibleColumns.value = [
        'create_dt',
        'job_id',
        'status',
        'created_by',
        'user_id'
      ]
      if (currentScreenSize.value == 'xs') {
        searchResultsTableVisibleColumns.value = [
          'create_dt',
          'job_id',
          'status',
          'user_id'
        ]
      }
      break
  }
}

const renderUserName = (userObj) => {
  let userName = ''
  if (userObj && userObj.first_name && userObj.last_name) {
    userName = `${userObj.first_name} ${userObj.last_name}`
  }
  return userName
}

const handleResultSelection = (rowData) => {
  switch (route.params.searchType) {
    case 'Item':
      if (rowData.barcode) {
        router.push({
          name: 'record-management-items',
          params: {
            barcode: rowData.barcode.value
          }
        })
      }
      break
    case 'Tray':
      router.push({
        name: 'record-management-tray',
        params: {
          barcode: rowData.barcode.value
        }
      })
      break
    case 'Shelf':
      router.push({
        name: 'record-management-shelf',
        params: {
          barcode: rowData.barcode.value
        }
      })
      break
    case 'Accession':
      router.push({
        name: 'accession',
        params: {
          jobId: rowData.workflow_id
        }
      })
      break
    case 'Verification':
      router.push({
        name: 'verification',
        params: {
          jobId: rowData.workflow_id
        }
      })
      break
    case 'Shelving':
      router.push({
        name: 'shelving',
        params: {
          jobId: rowData.id
        }
      })
      break
    case 'Request':
      router.push({
        name: 'request',
        params: {
          jobId: rowData.id
        }
      })
      break
    case 'Picklist':
      router.push({
        name: 'picklist',
        params: {
          jobId: rowData.id
        }
      })
      break
    case 'Refile':
      router.push({
        name: 'refile',
        params: {
          jobId: rowData.id
        }
      })
      break
    case 'Withdraw':
      router.push({
        name: 'withdrawal',
        params: {
          jobId: rowData.id
        }
      })
      break
    default:
      break
  }
}

const loadAdvancedSearch = async (qParams, subType) => {
  try {
    appIsLoadingData.value = true
    await getAdvancedSearchResults({
      ...advanceSearchHistory.value,
      ...qParams
    }, route.params.searchType, subType)

    // update route queries to match new searches
    router.replace({
      query: {
        ...advanceSearchHistory.value,
        ...qParams
      }
    })
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
</style>