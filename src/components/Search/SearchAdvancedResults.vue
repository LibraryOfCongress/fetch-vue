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
          @selected-table-row="null"
        >
          <template #heading-row>
            <div
              class="col-xs-12 col-sm-auto col-md-12 col-lg-auto"
              :class="currentScreenSize == 'sm' || currentScreenSize == 'xs' ? '' : 'self-center'"
            >
              <h1 class="text-h4 text-bold">
                Advanced Search
              </h1>
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
import { useRoute } from 'vue-router'
import { useSearchStore } from '@/stores/search-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from '@/components/EssentialTable.vue'

const route = useRoute()

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const {
  searchResults
} = storeToRefs(useSearchStore())

// Local Data
const searchResultsTableVisibleColumns = ref([])
const searchResultsTableColumns = ref([])
const searchResultsTableFilters =  ref([
  {
    field: 'status',
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
const getItemLocation = inject('get-item-location')

onBeforeMount(() => {
  generateSearchTableFields()
})
watch(route, () => {
  generateSearchTableFields()
})

const generateSearchTableFields = () => {
  // creates the search table fields needed based on the route searcType
  switch (route.params.searchType) {
  case 'Item':
    searchResultsTableColumns.value = [
      {
        name: 'from_dt',
        field: 'from_dt',
        label: 'Date (From)',
        align: 'left',
        sortable: true
      },
      {
        name: 'to_dt',
        field: 'to_dt',
        label: 'Date (To)',
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
        name: 'status',
        field: 'status',
        label: 'Status',
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
        field: row => row.barcode?.value,
        label: 'Item Barcode',
        align: 'left',
        sortable: true
      }
    ]
    searchResultsTableVisibleColumns.value = [
      'accession_dt',
      'to_dt',
      'owner',
      'status',
      'size_class',
      'media_type',
      'barcode'
    ]
    if (currentScreenSize.value == 'xs') {
      searchResultsTableVisibleColumns.value = [
        'accession_dt',
        'to_dt',
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
        field: row => row.barcode?.value,
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
        field: row => row.barcode?.value,
        label: 'Shelf Barcode',
        align: 'left',
        sortable: true
      },
      {
        name: 'shelf_location',
        field: row => getItemLocation(row),
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
        field: row => row.size_class?.name,
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
        name: 'from_dt',
        field: 'from_dt',
        label: 'Date (From)',
        align: 'left',
        sortable: true
      },
      {
        name: 'to_dt',
        field: 'to_dt',
        label: 'Date (To)',
        align: 'left',
        sortable: true
      },
      {
        name: 'shelf_location',
        field: row => getItemLocation(row),
        label: 'Shelf Location',
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
        name: 'create_dt',
        field: 'create_dt',
        label: 'Date Created',
        align: 'left',
        sortable: true
      },
      {
        name: 'complet_dt',
        field: 'complet_dt',
        label: 'Date Completed',
        align: 'left',
        sortable: true
      }
    ]
    searchResultsTableVisibleColumns.value = [
      'from_dt',
      'to_dt',
      'job_id',
      'status',
      'create_dt',
      'complete_dt'
    ]
    if (currentScreenSize.value == 'xs') {
      searchResultsTableVisibleColumns.value = [
        'from_dt',
        'to_dt',
        'job_id',
        'status'
      ]
    }
    break
  case 'Verification':
    searchResultsTableColumns.value = [
      {
        name: 'from_dt',
        field: 'from_dt',
        label: 'Date (From)',
        align: 'left',
        sortable: true
      },
      {
        name: 'to_dt',
        field: 'to_dt',
        label: 'Date (To)',
        align: 'left',
        sortable: true
      },
      {
        name: 'shelf_location',
        field: row => getItemLocation(row),
        label: 'Shelf Location',
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
        name: 'create_dt',
        field: 'create_dt',
        label: 'Date Created',
        align: 'left',
        sortable: true
      },
      {
        name: 'complet_dt',
        field: 'complet_dt',
        label: 'Date Completed',
        align: 'left',
        sortable: true
      }
    ]
    searchResultsTableVisibleColumns.value = [
      'from_dt',
      'to_dt',
      'job_id',
      'status',
      'create_dt',
      'complete_dt'
    ]
    if (currentScreenSize.value == 'xs') {
      searchResultsTableVisibleColumns.value = [
        'from_dt',
        'to_dt',
        'job_id',
        'status'
      ]
    }
    break
  default:
    searchResultsTableColumns.value = [
      {
        name: 'from_dt',
        field: 'from_dt',
        label: 'Date (From)',
        align: 'left',
        sortable: true
      },
      {
        name: 'to_dt',
        field: 'to_dt',
        label: 'Date (To)',
        align: 'left',
        sortable: true
      },
      {
        name: 'shelf_location',
        field: row => getItemLocation(row),
        label: 'Shelf Location',
        align: 'left',
        sortable: true
      },
      {
        name: 'job_id',
        field: 'job_id',
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
        name: 'create_dt',
        field: 'create_dt',
        label: 'Date Created',
        align: 'left',
        sortable: true
      },
      {
        name: 'complet_dt',
        field: 'complet_dt',
        label: 'Date Completed',
        align: 'left',
        sortable: true
      }
    ]
    searchResultsTableVisibleColumns.value = [
      'from_dt',
      'to_dt',
      'job_id',
      'status',
      'create_dt',
      'complete_dt'
    ]
    if (currentScreenSize.value == 'xs') {
      searchResultsTableVisibleColumns.value = [
        'from_dt',
        'to_dt',
        'job_id',
        'status'
      ]
    }
    break
  }
}
</script>
<style lang="scss" scoped>
</style>