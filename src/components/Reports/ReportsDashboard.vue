<template>
  <div class="reports-dashboard">
    <div class="row q-mb-xs">
      <div class="col-12">
        <h1 class="text-h4 text-bold q-mb-sm">
          Reports
        </h1>
      </div>
    </div>

    <div class="row q-mb-xs-md">
      <div class="col-auto">
        <SelectInput
          v-model="reportType"
          :options="reportOptions"
          :placeholder="'Select Report'"
          @update:model-value="reportFormHistory = null; showReportModal = true;"
          aria-label="reportSelect"
        />
      </div>
      <div class="col-auto">
        <q-btn
          v-if="reportType"
          no-caps
          unelevated
          color="accent"
          label="Redo Report"
          class="text-body1 full-height q-ml-xs-xs q-ml-sm-sm"
          @click="showReportModal = true"
        />
      </div>
    </div>

    <div
      v-show="generatedTableColumns.length > 0"
      class="row q-mb-xs-xl q-mb-sm-none"
    >
      <div class="col-grow q-mb-xs-md q-mb-sm-none">
        <EssentialTable
          :table-columns="generatedTableColumns"
          :table-visible-columns="generatedTableVisibleColumns"
          :filter-options="generatedTableFilters"
          :table-data="reportData"
          :enable-table-reorder="false"
          :heading-row-class="'q-mb-xs-md q-mb-md-lg'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
          :enable-pagination="true"
          :pagination-total="reportDataTotal"
          :pagination-loading="appIsLoadingData"
          @update-pagination="regenerateReport($event)"
          @selected-table-row="null"
        >
          <template #heading-row>
            <div
              class="col-xs-12 col-sm-12 col-md-auto flex"
              :class="currentScreenSize == 'sm' || currentScreenSize == 'xs' ? 'justify-end q-mb-md' : 'order-1'"
            >
              <q-btn
                no-caps
                unelevated
                icon-right="arrow_drop_down"
                color="accent"
                label="Export Report"
                class="text-body1 q-ml-xs-none q-ml-sm-sm"
                :disabled="appIsOffline"
                aria-label="exportReportMenu"
                aria-haspopup="menu"
                :aria-expanded="exportReportMenuState"
              >
                <q-menu
                  @show="exportReportMenuState = true"
                  @hide="exportReportMenuState = false"
                  aria-label="exportReportMenuList"
                >
                  <q-list>
                    <q-item
                      clickable
                      v-close-popup
                      @click="reportPrintTemplate.printReport()"
                      role="menuitem"
                    >
                      <q-item-section>
                        <q-item-label>
                          <span>
                            Print
                          </span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="downloadReport(reportType)"
                      role="menuitem"
                    >
                      <q-item-section>
                        <q-item-label>
                          <span>
                            Download CSV
                          </span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
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
          </template>
        </EssentialTable>
      </div>
    </div>

    <!-- Generate Report Modal -->
    <ReportsGenerateModal
      v-if="showReportModal"
      :report-type="reportType"
      :report-history="reportFormHistory"
      @hide="showReportModal = false; reportType = lastReportType;"
      @update="reportFormHistory = $event"
      @submit="generateReportTableFields();"
    />
  </div>

  <!-- print component used to handle printing the reports -->
  <ReportPrintTemplate
    ref="reportPrintTemplate"
    :report-details="{
      type: reportType,
      data: reportData,
      headers: generatedTableColumns
    }"
  />
</template>

<script setup>
import { ref, inject } from 'vue'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useReportsStore } from '@/stores/reports-store'
import { useGlobalStore } from '@/stores/global-store'
import { storeToRefs } from 'pinia'
import EssentialTable from '@/components/EssentialTable.vue'
import SelectInput from '@/components/SelectInput.vue'
import ReportsGenerateModal from '@/components/Reports/ReportsGenerateModal.vue'
import ReportPrintTemplate from '@/components/Reports/ReportPrintTemplate.vue'

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { reportData, reportDataTotal } = storeToRefs(useReportsStore())
const { getReport } = useReportsStore()
const { appIsLoadingData } = storeToRefs(useGlobalStore())
const { appIsOffline } = storeToRefs(useGlobalStore())
const { downloadReport } = useReportsStore()

// Local Data
const generatedTableVisibleColumns = ref([])
const generatedTableColumns = ref([])
const generatedTableFilters =  ref([
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
const showReportModal = ref(false)
const reportFormHistory= ref(null)
const reportType = ref(null)
const lastReportType = ref(null)
const reportOptions =  ref([
  'Item Accession',
  'Item in Tray',
  'Move/Withdraw Discrepancy',
  'Non-Tray Count',
  'Open Locations',
  'Refile Discrepancy',
  'Shelving Job Discrepancy',
  'Total Item Retrieved',
  'Tray/Item Count By Aisle',
  'User Job Summary',
  'Verification Change'
])
const reportPrintTemplate = ref(null)
const exportReportMenuState = ref (false)

// Logic
const handleAlert = inject('handle-alert')
const getItemLocation = inject('get-item-location')

const generateReportTableFields = () => {
  lastReportType.value = reportType.value
  // creates the report table fields needed based on the selected report type
  switch (reportType.value) {
    case 'Item Accession':
      generatedTableColumns.value = [
        {
          name: 'owner',
          field: 'owner_name',
          label: 'Owner',
          align: 'left',
          sortable: true
        },
        {
          name: 'media_type',
          field: 'media_type_name',
          label: 'Media Type',
          align: 'left',
          sortable: true
        },
        {
          name: 'size_class',
          field: 'size_class_name',
          label: 'Size Class',
          align: 'left',
          sortable: true
        },
        {
          name: 'total_count',
          field: 'count',
          label: 'Total Accessioned Count',
          align: 'left',
          sortable: true
        }
      ]
      generatedTableVisibleColumns.value = [
        'owner',
        'media_type',
        'size_class',
        'total_count'
      ]
      break
    case 'Item in Tray':
      generatedTableColumns.value = [
        {
          name: 'size_class',
          field: row => row.size_class?.name,
          label: 'Size Class',
          align: 'left',
          sortable: true
        },
        {
          name: 'tray_count',
          field: 'tray_count',
          label: 'Total Tray Count',
          align: 'left',
          sortable: true
        },
        {
          name: 'item_count',
          field: 'item_count',
          label: 'Total Item Count',
          align: 'left',
          sortable: true
        }
      ]
      generatedTableVisibleColumns.value = [
        'size_class',
        'tray_count',
        'item_count'
      ]
      break
    case 'Move/Withdraw Discrepancy':
      generatedTableColumns.value = [
        {
          name: 'complete_dt',
          field: 'complete_dt',
          label: 'Completed Date',
          align: 'left',
          sortable: true
        },
        {
          name: 'assigned_user',
          field: row => row.assigned_user?.name,
          label: 'Completed By',
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
          name: 'size_class',
          field: row => row.size_class?.name,
          label: 'Size Class',
          align: 'left',
          sortable: true
        },
        {
          name: 'barcode',
          field: row => row.barcode?.value,
          label: 'Barcode',
          align: 'left',
          sortable: true
        },
        {
          name: 'item_location',
          field: row => row.item ? getItemLocation(row.item.tray) : getItemLocation(row.non_tray_item),
          label: 'Item Location',
          align: 'left',
          sortable: true
        },
        {
          name: 'error',
          field: 'error',
          label: 'Error Type',
          align: 'left',
          sortable: true
        }
      ]
      generatedTableVisibleColumns.value = [
        'complete_dt',
        'assigned_user',
        'container_type',
        'size_class',
        'barcode',
        'item_location',
        'error'
      ]
      break
    case 'Non-Tray Count':
      generatedTableColumns.value = [
        {
          name: 'size_class_short_name',
          field: 'size_class_short_name',
          label: 'Size Class',
          align: 'left',
          sortable: true
        },
        {
          name: 'non_tray_item_count',
          field: 'non_tray_item_count',
          label: '# of Non-Tray Items',
          align: 'left',
          sortable: true
        }
      ]
      generatedTableVisibleColumns.value = [
        'size_class_short_name',
        'non_tray_item_count'
      ]
      break
    case 'Open Locations':
      generatedTableColumns.value = [
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
          field: row => row.shelf_type?.size_class?.short_name,
          label: 'Size Class',
          align: 'left',
          sortable: true
        },
        {
          name: 'height',
          field: 'height',
          label: 'Height',
          align: 'left',
          sortable: true
        },
        {
          name: 'width',
          field: 'width',
          label: 'Width',
          align: 'left',
          sortable: true
        },
        {
          name: 'depth',
          field: 'depth',
          label: 'Depth',
          align: 'left',
          sortable: true
        },
        {
          name: 'available_space',
          field: 'available_space',
          label: 'Available Space',
          align: 'left',
          sortable: true
        }
      ]
      generatedTableVisibleColumns.value = [
        'shelf_location',
        'owner',
        'size_class',
        'height',
        'width',
        'depth',
        'available_space'
      ]
      break
    case 'Refile Discrepancy':
      generatedTableColumns.value = [
        {
          name: 'id',
          field: 'id',
          label: 'Refile Job #',
          align: 'left',
          sortable: true
        },
        {
          name: 'assigned_user',
          field: row => row.assigned_user?.name,
          label: 'Completed By',
          align: 'left',
          sortable: true
        },
        {
          name: 'complete_dt',
          field: 'complete_dt',
          label: 'Completed Date',
          align: 'left',
          sortable: true
        },
        {
          name: 'barcode',
          field: row => row.barcode?.value,
          label: 'Item Barcode',
          align: 'left',
          sortable: true
        },
        {
          name: 'tray_barcode',
          field: row => row.tray?.barcode?.value,
          label: 'Tray Barcode',
          align: 'left',
          sortable: true
        },
        {
          name: 'error',
          field: 'error',
          label: 'Error Type',
          align: 'left',
          sortable: true
        }
      ]
      generatedTableVisibleColumns.value = [
        'id',
        'assigned_user',
        'complete_dt',
        'barcode',
        'tray_barcode',
        'error'
      ]
      break
    case 'Shelving Job Discrepancy':
      generatedTableColumns.value = [
        {
          name: 'id',
          field: 'id',
          label: 'Shelving Job #',
          align: 'left',
          sortable: true
        },
        {
          name: 'assigned_user',
          field: row => row.assigned_user?.name,
          label: 'Assigned User',
          align: 'left',
          sortable: true
        },
        {
          name: 'barcode',
          field: row => row.tray ? row.tray?.barcode?.value : row.non_tray_item?.barcode?.value,
          label: 'Tray / Non-Tray Barcode',
          align: 'left',
          sortable: true
        },
        {
          name: 'size_class',
          field: row => row.size_class?.short_name,
          label: 'Size Class',
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
          name: 'assigned_location',
          field: row => row?.assigned_location,
          label: 'Assigned Location',
          align: 'left',
          sortable: true
        },
        {
          name: 'preassigned_location',
          field: row => row.preassigned_location ? row.preassigned_location?.value : 'N/A',
          label: 'Pre-Assigned Location',
          align: 'left',
          sortable: true
        },
        {
          name: 'error',
          field: 'error',
          label: 'Error Type',
          align: 'left',
          sortable: true
        }
      ]
      generatedTableVisibleColumns.value = [
        'id',
        'assigned_user',
        'barcode',
        'size_class',
        'owner',
        'assigned_location',
        'preassigned_location',
        'error'
      ]
      break
    case 'Total Item Retrieved':
      generatedTableColumns.value = [
        {
          name: 'owner_name',
          field: 'owner_name',
          label: 'Owner',
          align: 'left',
          sortable: true
        },
        {
          name: 'total_item_retrieved_count',
          field: 'total_item_retrieved_count',
          label: 'Total Item Retrieval Count',
          align: 'left',
          sortable: true
        },
        {
          name: 'max_retrieved_count',
          field: 'max_retrieved_count',
          label: 'Max Retrieval Count',
          align: 'left',
          sortable: true
        }
      ]
      generatedTableVisibleColumns.value = [
        'owner_name',
        'total_item_retrieved_count',
        'max_retrieved_count'
      ]
      break
    case 'Tray/Item Count By Aisle':
      generatedTableColumns.value = [
        {
          name: 'aisle_number',
          field: 'aisle_number',
          label: 'Aisle Number',
          align: 'left',
          sortable: true
        },
        {
          name: 'shelf_count',
          field: 'shelf_count',
          label: 'Shelf Count',
          align: 'left',
          sortable: true
        },
        {
          name: 'tray_count',
          field: 'tray_count',
          label: '# of Trays',
          align: 'left',
          sortable: true
        },
        {
          name: 'item_count',
          field: 'item_count',
          label: '# of Tray Items',
          align: 'left',
          sortable: true
        },
        {
          name: 'non_tray_item_count',
          field: 'non_tray_item_count',
          label: '# of Non-Tray Items',
          align: 'left',
          sortable: true
        },
        {
          name: 'total_item_count',
          field: 'total_item_count',
          label: 'Total Items',
          align: 'left',
          sortable: true
        }
      ]
      generatedTableVisibleColumns.value = [
        'aisle_number',
        'shelf_count',
        'tray_count',
        'item_count',
        'non_tray_item_count',
        'total_item_count'
      ]
      break
    case 'User Job Summary':
      generatedTableColumns.value = [
        {
          name: 'user',
          field: row => row.user?.username,
          label: 'User Name',
          align: 'left',
          sortable: true
        },
        {
          name: 'job_type',
          field: 'job_type',
          label: 'Job Type',
          align: 'left',
          sortable: true
        },
        {
          name: 'total_count',
          field: 'total_count',
          label: 'Total Items Processed',
          align: 'left',
          sortable: true
        }
      ]
      generatedTableVisibleColumns.value = [
        'user',
        'job_type',
        'total_count'
      ]
      break
    case 'Verification Change':
      generatedTableColumns.value = [
        {
          name: 'id',
          field: 'workflow_id',
          label: 'Verification Job #',
          align: 'left',
          sortable: true
        },
        {
          name: 'complete_dt',
          field: 'complete_dt',
          label: 'Completed Date',
          align: 'left',
          sortable: true
        },
        {
          name: 'assigned_user',
          field: row => row.assigned_user?.name,
          label: 'Completed By',
          align: 'left',
          sortable: true
        },
        {
          name: 'barcode',
          field: row => row.barcode?.value,
          label: 'Item Barcode',
          align: 'left',
          sortable: true
        },
        {
          name: 'tray_barcode',
          field: row => row.tray?.barcode?.value,
          label: 'Tray Barcode',
          align: 'left',
          sortable: true
        },
        {
          name: 'action',
          field: 'action',
          label: 'Action',
          align: 'left',
          sortable: true
        }
      ]
      generatedTableVisibleColumns.value = [
        'id',
        'complete_dt',
        'assigned_user',
        'barcode',
        'tray_barcode',
        'action'
      ]
      break
    default:
      break
  }
}

const regenerateReport = async (qParams) => {
  try {
    appIsLoadingData.value = true
    let queryParamsForm = JSON.parse(JSON.stringify(reportFormHistory.value))
    // convert any form date values to iso format along with removing any empty query params
    Object.entries(queryParamsForm).forEach(([
      key,
      value
    ]) => {
      if (key.includes('_dt') && value) {
        const [
          month,
          day,
          year
        ] = queryParamsForm[key].split('/')
        if (key.includes('from')) {
          // sets from dates to begging of day
          queryParamsForm[key] = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)).toISOString()
        }  else {
          // sets to date to end of date
          queryParamsForm[key] = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)).toISOString()
        }
      } else if ((Array.isArray(value) && value.length == 0) || !value) {
        delete queryParamsForm[key]
      }
    })

    await getReport({
      ...qParams,
      ...queryParamsForm
    }, reportType.value)
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
