<template>
  <div class="reports-dashboard">
    <div class="row q-mb-xs-md">
      <div class="col-auto">
        <div class="form-group">
          <label class="text-h4 text-bold q-mb-sm">
            Reports
          </label>
          <SelectInput
            v-model="reportType"
            :options="reportOptions"
            :placeholder="'Select Report'"
            @update:model-value="generateReportModal()"
            aria-label="reportSelect"
          />
        </div>
      </div>
    </div>

    <div
      v-if="generatedTableColumns.length > 0"
      class="row q-mb-xs-xl q-mb-sm-none"
    >
      <div class="col-grow q-mb-xs-md q-mb-sm-none">
        <EssentialTable
          :table-columns="generatedTableColumns"
          :table-visible-columns="generatedTableVisibleColumns"
          :filter-options="generatedTableFilters"
          :table-data="[]"
          :enable-table-reorder="false"
          :heading-row-class="'q-mb-xs-md q-mb-md-lg'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
          @selected-table-row="null"
        >
          <template #heading-row>
            <div
              class="col-xs-grow col-sm-7 col-md-auto flex"
              :class="currentScreenSize == 'sm' || currentScreenSize == 'xs' ? 'justify-end q-mb-md' : 'order-1'"
            >
              <q-btn
                no-caps
                flat
                color="accent"
                label="Export Report"
                class="btn-no-wrap text-body1 q-ml-auto"
                @click="null"
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
          </template>
        </EssentialTable>
      </div>
    </div>

    <!-- Generate Report Modal -->
    <PopupModal
      v-if="showReportModal"
      ref="reportModal"
      :show-actions="false"
      @reset="showReportModal = false; reportType = lastReportType"
      aria-label="generateReportModal"
    >
      <template #header-content="{ hideModal }">
        <q-card-section class="row items-center q-pb-none">
          <h2 class="text-h6 text-bold">
            {{ reportType }}
          </h2>

          <q-btn
            icon="close"
            flat
            round
            dense
            class="q-ml-auto"
            @click="hideModal"
            aria-label="closeModal"
          />
        </q-card-section>
      </template>
      <template #main-content>
        <q-card-section class="q-pb-none">
          <div class="row">
            <template
              v-for="param in reportParams"
              :key="param.query"
            >
              <!-- date range inputs -->
              <div
                v-if="param.query == 'from_dt'"
                class="col-6 q-mb-md"
              >
                <div class="form-group q-pr-xs">
                  <label class="form-group-label">
                    {{ param.label }}
                  </label>
                  <TextInput
                    v-model="reportForm[param.query]"
                    placeholder="Ex: MM/DD/YYYY"
                  >
                    <template #append>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                      >
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="reportForm[param.query]"
                            mask="MM/DD/YYYY"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                                aria-label="closeDatePopup"
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </TextInput>
                </div>
              </div>
              <div
                v-else-if="param.query == 'to_dt'"
                class="col-6 q-mb-md"
              >
                <div class="form-group q-pl-xs">
                  <label class="form-group-label">
                    {{ param.label }}
                  </label>
                  <TextInput
                    v-model="reportForm[param.query]"
                    placeholder="Ex: MM/DD/YYYY"
                  >
                    <template #append>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                      >
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="reportForm[param.query]"
                            mask="MM/DD/YYYY"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                                aria-label="closeDatePopup"
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </TextInput>
                </div>
              </div>
              <!-- select inputs -->
              <div
                v-else
                class="col-12 q-mb-md"
              >
                <div class="form-group">
                  <label class="form-group-label">
                    {{ param.label }}
                  </label>
                  <SelectInput
                    v-model="reportForm[param.query]"
                    :options="[]"
                    option-type="''"
                    option-value="id"
                    option-label="name"
                    :placeholder="`Select ${param.label}`"
                    @update:model-value="null"
                    :aria-label="`${param.query}_select`"
                  />
                </div>
              </div>
            </template>
          </div>
        </q-card-section>
      </template>

      <template #footer-content="{ hideModal }">
        <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Run Report"
            class="text-body1 full-width"
            :loading="appActionIsLoadingData"
            @click="generateReport()"
          />

          <q-space class="q-mx-xs" />

          <q-btn
            outline
            no-caps
            label="Cancel"
            class="text-body1 full-width"
            @click="hideModal"
          />
        </q-card-section>
      </template>
    </PopupModal>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useGlobalStore } from '@/stores/global-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from '@/components/EssentialTable.vue'
import TextInput from '@/components/TextInput.vue'
import SelectInput from '@/components/SelectInput.vue'
import PopupModal from '@/components/PopupModal.vue'

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())

// Local Data
const reportModal = ref(null)
const generatedTableVisibleColumns = ref([])
const generatedTableColumns = ref([])
const generatedTableFilters =  ref([
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
const showReportModal = ref(false)
const reportType = ref(null)
const lastReportType = ref(null)
const reportOptions =  ref([
  'Direct To Shelf Discrepency',
  'Item Accession',
  'Item in Tray',
  'Move/Withdraw Discrepency',
  'Non-Tray Count',
  'Open Locations',
  'Refile Discrepency',
  'Refile Job Error',
  'Shelving Job Discrepency',
  'Total Item Retrieved',
  'Tray/Item Count By Aisle',
  'User Job Summary',
  'Verification Change'
])
const reportParams = ref(null)
const reportForm = ref({})

// Logic
const handleAlert = inject('handle-alert')
const getItemLocation = inject('get-item-location')

// onBeforeMount(() => {
//   if (currentScreenSize.value == 'xs') {
//     generatedTableVisibleColumns.value = [
//       'id',
//       'status'
//     ]
//   }
// })

const generateReportModal = () => {
  // creates the report modal params needed based on the selected report type
  switch (reportType.value) {
  case 'Direct To Shelf Discrepency':
    // PENDING might be removed
    reportForm.value = {}
    break
  case 'Item Accession':
    reportForm.value = {
      from_dt: null,
      to_dt: null,
      owner_id: null,
      media_type_id: null,
      size_class_id: null
    }
    reportParams.value = [
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      },
      {
        query: 'owner_id',
        label: 'Owner'
      },
      {
        query: 'media_type_id',
        label: 'Media Type'
      },
      {
        query: 'size_class_id',
        label: 'Date (To)'
      }
    ]
    break
  case 'Item in Tray':
    reportForm.value = {
      building_id: null, // required
      owner_id: null,
      aisle_from: null,
      aisle_to: null,
      from_dt: null,
      to_dt: null
    }
    reportParams.value = [
      {
        query: 'building_id',
        label: 'Building'
      },
      {
        query: 'owner_id',
        label: 'Owner'
      },
      {
        query: 'aisle_from',
        label: 'Aisle (From)'
      },
      {
        query: 'aisle_to',
        label: 'Aisle (To)'
      },
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      }
    ]
    break
  case 'Move/Withdraw Discrepency':
    reportForm.value = {
      from_dt: null,
      to_dt: null,
      assigned_user_id: null
    }
    reportParams.value = [
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      },
      {
        query: 'assigned_user_id',
        label: 'Assigned User'
      }
    ]
    break
  case 'Non-Tray Count':
    reportForm.value = {
      building_id: null, // required
      owner_id: null,
      aisle_from: null,
      aisle_to: null,
      from_dt: null,
      to_dt: null,
      size_class_id: null
    }
    reportParams.value = [
      {
        query: 'building_id',
        label: 'Building'
      },
      {
        query: 'owner_id',
        label: 'Owner'
      },
      {
        query: 'aisle_from',
        label: 'Aisle (From)'
      },
      {
        query: 'aisle_to',
        label: 'Aisle (To)'
      },
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      },
      {
        query: 'size_class_id',
        label: 'Size Class'
      }
    ]
    break
  case 'Open Locations':
    // implement shelving job location style modal
    break
  case 'Refile Discrepency':
    reportForm.value = {
      job_id: null, // allows multi select
      from_dt: null,
      to_dt: null,
      assigned_user_id: null
    }
    reportParams.value = [
      {
        query: 'job_id',
        label: 'Job Number'
      },
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      },
      {
        query: 'assigned_user_id',
        label: 'Assigned User'
      }
    ]
    break
  case 'Refile Job Error':
    // PENDING might delete
    reportForm.value = {}
    break
  case 'Shelving Job Discrepency':
    reportForm.value = {
      from_dt: null,
      to_dt: null,
      assigned_user_id: null
    }
    reportParams.value = [
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      },
      {
        query: 'assigned_user_id',
        label: 'Assigned User'
      }
    ]
    break
  case 'Total Item Retrieved':
    reportForm.value = {
      from_dt: null,
      to_dt: null,
      owner_id: null
    }
    reportParams.value = [
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      },
      {
        query: 'owner_id',
        label: 'Owner'
      }
    ]
    break
  case 'Tray/Item Count By Aisle':
    reportForm.value = {
      building_id: null, // required
      aisle_from: null,
      aisle_to: null
    }
    reportParams.value = [
      {
        query: 'building_id',
        label: 'Building'
      },
      {
        query: 'aisle_from',
        label: 'Aisle (From)'
      },
      {
        query: 'aisle_to',
        label: 'Aisle (To)'
      }
    ]
    break
  case 'User Job Summary':
    reportForm.value = {
      from_dt: null,
      to_dt: null,
      user_id: null
    }
    reportParams.value = [
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      },
      {
        query: 'user_id',
        label: 'User'
      }
    ]
    break
  case 'Verification Change':
    reportForm.value = {
      job_id: null,
      from_dt: null,
      to_dt: null,
      assigned_user_id: null
    }
    reportParams.value = [
      {
        query: 'job_id',
        label: 'Job Number'
      },
      {
        query: 'from_dt',
        label: 'Date (From)'
      },
      {
        query: 'to_dt',
        label: 'Date (To)'
      },
      {
        query: 'assigned_user_id',
        label: 'Assigned User'
      }
    ]
    break
  default:
    break
  }

  showReportModal.value = true
}

const generateReportTableFields = () => {
  // creates the report table fields needed based on the selected report type
  switch (reportType.value) {
  case 'Direct To Shelf Discrepency':
    // PENDING might be removed
    generatedTableColumns.value = []
    generatedTableVisibleColumns.value = []
    break
  case 'Item Accession':
    generatedTableColumns.value = [
      {
        name: 'create_dt',
        field: 'create_dt',
        label: 'Date Created',
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
        name: 'media_type',
        field: row => row.media_type?.name,
        label: 'Media Type',
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
        name: 'total_count',
        field: 'total_count',
        label: 'Total Accessioned Count',
        align: 'left',
        sortable: true
      }
    ]
    generatedTableVisibleColumns.value = [
      'create_dt',
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
  case 'Move/Withdraw Discrepency':
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
        name: 'size_class',
        field: row => row.size_class?.name,
        label: 'Size Class',
        align: 'left',
        sortable: true
      },
      {
        name: 'item_count',
        field: 'item_count',
        label: '# of Non-Tray Items',
        align: 'left',
        sortable: true
      }
    ]
    generatedTableVisibleColumns.value = [
      'size_class',
      'item_count'
    ]
    break
  case 'Open Locations':
    // implement shelving job location style modal
    break
  case 'Refile Discrepency':
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
  case 'Refile Job Error':
    // PENDING might delete
    generatedTableColumns.value = []
    generatedTableVisibleColumns.value = []
    break
  case 'Shelving Job Discrepency':
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
        field: row => row.barcode?.value,
        label: 'Tray / Non-Tray Barcode',
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
        name: 'owner',
        field: row => row.owner?.name,
        label: 'Owner',
        align: 'left',
        sortable: true
      },
      {
        name: 'assigned_location',
        field: row => row.item ? getItemLocation(row.item.tray) : getItemLocation(row.non_tray_item),
        label: 'Assigned Location',
        align: 'left',
        sortable: true
      },
      {
        name: 'preassigned_location',
        field: 'preassigned_location',
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
        name: 'owner',
        field: row => row.owner?.name,
        label: 'Owner',
        align: 'left',
        sortable: true
      },
      {
        name: 'total_count',
        field: 'total_count',
        label: 'Total Item Count',
        align: 'left',
        sortable: true
      },
      {
        name: 'retrieved_count',
        field: 'retrieved_count',
        label: 'Retreival Count',
        align: 'left',
        sortable: true
      }
    ]
    generatedTableVisibleColumns.value = [
      'owner',
      'total_count',
      'retrieved_count'
    ]
    break
  case 'Tray/Item Count By Aisle':
    generatedTableColumns.value = [
      {
        name: 'aisle',
        field: row => row.aisle?.aisle_number?.number,
        label: 'Aisle Number',
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
        name: 'tray_item_count',
        field: 'tray_item_count',
        label: '# of Tray Items',
        align: 'left',
        sortable: true
      },
      {
        name: 'non_tray_count',
        field: 'non_tray_count',
        label: '# of Non-Tray Items',
        align: 'left',
        sortable: true
      },
      {
        name: 'total_count',
        field: 'total_count',
        label: 'Total Items',
        align: 'left',
        sortable: true
      }
    ]
    generatedTableVisibleColumns.value = [
      'aisle',
      'tray_count',
      'tray_item_count',
      'non_tray_count',
      'total_count'
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
        field: 'id',
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

  showReportModal.value = true
}

const generateReport = async () => {
  try {
    appActionIsLoadingData.value = true
    // TODO setup store and endpoints to handle generating a report using the user selected params
    // await postReport(reportParams.value)
    console.log('generating report', reportForm.value)
    generateReportTableFields()

    // set report type history
    lastReportType.value = reportType.value
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appActionIsLoadingData.value = false
    reportModal.value.hideModal()
  }
}

// const loadVerificationJobs = async () => {
//   try {
//     await getVerificationJobList({ unshelved: true })
//   } catch (error) {
//     handleAlert({
//       type: 'error',
//       text: error,
//       autoClose: true
//     })
//   }
// }

</script>
<style lang="scss" scoped>
</style>