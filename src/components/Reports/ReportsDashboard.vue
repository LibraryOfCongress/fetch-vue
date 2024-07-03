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
            @update:model-value="showReportModal = true"
            aria-label="reportSelect"
          />
        </div>
      </div>
    </div>

    <div class="row q-mb-xs-xl q-mb-sm-none">
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
      @reset="showReportModal = false; reportType = null;"
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
        <q-card-section>
          <div class="row">
            <div class="col-6 q-mb-md">
              <div class="form-group q-pr-xs">
                <label class="form-group-label">
                  Date (From)
                </label>
                <TextInput
                  v-model="reportParams.from_dt"
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
                          v-model="reportParams.from_dt"
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
            <div class="col-6 q-mb-md">
              <div class="form-group q-pl-xs">
                <label class="form-group-label">
                  Date (To)
                </label>
                <TextInput
                  v-model="reportParams.to_dt"
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
                          v-model="reportParams.to_dt"
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
            <div class="col-12">
              <div class="form-group">
                <label class="form-group-label">
                  Assigned User
                </label>
                <SelectInput
                  v-model="reportParams.assigned_user"
                  :options="[]"
                  option-type="users"
                  option-value="id"
                  option-label="name"
                  :placeholder="'Select Assigned User'"
                  @update:model-value="null"
                  aria-label="userSelect"
                />
              </div>
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
import { onBeforeMount, ref, inject } from 'vue'
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
const generatedTableVisibleColumns = ref([
  'id',
  'status'
])
const generatedTableColumns = ref([
  {
    name: 'id',
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
  }
])
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
const reportParams = ref({
  from_dt: null,
  to_dt: null
})

// Logic
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  if (currentScreenSize.value == 'xs') {
    generatedTableVisibleColumns.value = [
      'id',
      'status'
    ]
  }
})

const generateReport = async () => {
  try {
    appActionIsLoadingData.value = true
    // TODO setup store and endpoints to handle generating a report using the user selected params
    // await postReport(reportParams.value)
    console.log('generating report', reportParams.value)
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