<template>
  <div class="shelving-dashboard">
    <div class="row">
      <div class="col-grow">
        <EssentialTable
          :table-columns="shelfTableColumns"
          :table-visible-columns="shelfTableVisibleColumns"
          :filter-options="shelfTableFilters"
          :table-data="shelvingJobList"
          :enable-table-reorder="false"
          :heading-row-class="'q-mb-xs-md q-mb-md-lg'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
          @selected-table-row="loadShelvingJob($event.id)"
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
                :disabled="appIsOffline"
                @click="showShelvingJobModal = !showShelvingJobModal"
              />
            </div>
          </template>

          <template #table-td="{ colName, value }">
            <span
              v-if="colName == 'status'"
              class="outline text-nowrap"
              :class="value == 'Created' || value == 'Completed' ? 'text-highlight' : value == 'Paused' || value == 'Running' ? 'text-highlight-yellow' : 'text-highlight-red'"
            >
              {{ value }}
            </span>
            <span
              v-else-if="colName == 'containers'"
              class="outline text-nowrap"
            >
              {{ value }} Containers
            </span>
            <span v-else-if="colName == 'create_dt'">
              {{ formatDateTime(value).date }}
            </span>
          </template>
        </EssentialTable>
      </div>
    </div>

    <!-- Create Shelving Job Modal -->
    <PopupModal
      v-if="showShelvingJobModal"
      :show-actions="false"
      :modal-width="'600px'"
      @reset="resetCreateShelfJobModal"
    >
      <template #header-content="{ hideModal }">
        <q-card-section class="row items-center q-pb-none">
          <h2
            v-if="shelvingJob.type == null"
            class="text-h6 text-bold"
          >
            Create Shelving Job
          </h2>
          <template v-else>
            <q-btn
              icon="chevron_left"
              name="back"
              no-caps
              flat
              dense
              class="text-body1"
              @click="shelvingJob.type = null"
            />
            <h2 class="text-h6 text-bold q-ml-xs">
              Create Shelving Job
            </h2>
          </template>

          <q-btn
            icon="close"
            flat
            round
            dense
            class="q-ml-auto"
            @click="hideModal"
          />
        </q-card-section>
      </template>
      <template #main-content>
        <q-card-section
          v-if="shelvingJob.type == null"
          class="column no-wrap items-center"
        >
          <q-btn
            outline
            no-caps
            padding="14px md"
            label="Direct To Shelve"
            class="full-width text-body1 q-mb-md"
            @click="submitDirectToShelfJob()"
          />

          <q-btn
            outline
            no-caps
            padding="14px md"
            label="From Verification Job"
            class="full-width text-body1"
            @click="shelvingJob.type = 'Verification'"
          />
        </q-card-section>

        <q-card-section v-else-if="shelvingJob.type == 'Verification'">
          <div class="row q-mb-md">
            <div class="col-xs-12 col-sm-8 flex items-center">
              <p :class="currentScreenSize !== 'xs' ? 'text-h6' : 'text-body1 q-mb-xs'">
                Assign Shelving Location?
              </p>
            </div>
            <div class="col-xs-12 col-sm-4">
              <div class="form-group">
                <ToggleButtonInput
                  v-model="shelvingJob.assignLocation"
                  :options="[
                    {label: 'Yes', value: true},
                    {label: 'No', value: false}
                  ]"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12 q-mb-sm">
              <h3 class="text-h6 text-bold">
                Verification Job List:
              </h3>
            </div>
            <div class="col-12">
              <div class="form-group">
                <label class="form-group-label">
                  Please Select Verification Job(s)
                </label>
                <SelectInput
                  v-model="shelvingJob.verification_jobs"
                  :multiple="true"
                  :use-chips="true"
                  :hide-selected="false"
                  :options="completedVerificationJobs"
                  option-value="id"
                  option-label="id"
                  :placeholder="'Select Verification Job(s) by Number'"
                  @focus="loadVerificationJobs"
                >
                  <template #option="{ itemProps, opt, selected, toggleOption }">
                    <q-item v-bind="itemProps">
                      <q-item-section>
                        <q-item-label class="text-body1">
                          <span>Job #: {{ opt.id }}</span>
                          <span class="text-secondary"> - 0 Containers ({{ opt.trayed ? 'Trayed' : 'Non-Tray' }})</span>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-checkbox
                          :model-value="selected"
                          @update:model-value="toggleOption(opt)"
                        />
                      </q-item-section>
                    </q-item>
                  </template>
                </SelectInput>
              </div>
            </div>
          </div>

          <div class="row q-mt-md">
            <div class="col-12 q-mb-sm">
              <h3 class="text-h6 text-bold">
                Please Select Shelving Location:
              </h3>
            </div>
            <div class="col-12">
              <div
                class="form-group q-mb-md"
              >
                <label class="form-group-label">
                  Building
                </label>
                <SelectInput
                  v-model="shelvingJob.building_id"
                  :options="buildings"
                  option-type="buildings"
                  option-value="id"
                  option-label="name"
                  :placeholder="'Select Building'"
                  @update:model-value="handleShelvingJobFormChange('Building')"
                />
              </div>

              <template v-if="shelvingJob.assignLocation">
                <div
                  class="form-group q-mb-md"
                >
                  <label class="form-group-label">
                    Module
                  </label>
                  <SelectInput
                    v-model="shelvingJob.module_id"
                    :options="renderBuildingModules"
                    option-value="id"
                    option-label="id"
                    :placeholder="'Select Module'"
                    :disabled="renderBuildingModules.length == 0"
                    @update:model-value="handleShelvingJobFormChange('Module')"
                  />
                </div>

                <div class="row">
                  <div
                    class="col-xs-12 col-sm-6 q-pr-sm-xs q-mb-md"
                  >
                    <div class="form-group">
                      <label class="form-group-label">
                        Aisle
                      </label>
                      <SelectInput
                        v-model="shelvingJob.aisle_id"
                        :options="renderBuildingOrModuleAisles"
                        option-value="id"
                        :option-label="opt => opt.aisle_number?.number"
                        :placeholder="'Select Aisle'"
                        :disabled="renderBuildingOrModuleAisles.length == 0"
                        @update:model-value="handleShelvingJobFormChange('Aisle')"
                      />
                    </div>
                  </div>
                  <div
                    class="col-xs-12 col-sm-6 q-pl-sm-xs q-mb-xs-md q-mb-sm-none"
                  >
                    <div class="form-group">
                      <label class="form-group-label">
                        Side
                      </label>
                      <ToggleButtonInput
                        v-model="shelvingJob.side_id"
                        :options="renderAisleSides"
                        option-value="id"
                        option-label="side_orientation.name"
                        :disabled="!renderAisleSides[0].id"
                        @update:model-value="handleShelvingJobFormChange('Side')"
                      />
                    </div>
                  </div>
                </div>

                <div
                  class="form-group"
                >
                  <label class="form-group-label">
                    Ladder
                  </label>
                  <SelectInput
                    v-model="shelvingJob.ladder_id"
                    :options="renderSideLadders"
                    option-value="id"
                    :option-label="opt => opt.ladder_number?.number"
                    :placeholder="'Select Ladder'"
                    :disabled="renderSideLadders.length == 0"
                    @update:model-value="handleShelvingJobFormChange('Ladder')"
                  />
                </div>
              </template>
            </div>
          </div>
        </q-card-section>
      </template>

      <template #footer-content="{ hideModal }">
        <q-card-section
          v-if="shelvingJob.type !== null"
          class="row no-wrap justify-between items-center q-pt-sm"
        >
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Submit"
            class="text-body1 full-width"
            :loading="appActionIsLoadingData"
            :disabled="!isCreateShelvingjobFormValid"
            @click="submitShelvingJob(); hideModal();"
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
import { onBeforeMount, ref, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { useVerificationStore } from 'src/stores/verification-store'
import { useBuildingStore } from '@/stores/building-store'
import { useShelvingStore } from '@/stores/shelving-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from '@/components/EssentialTable.vue'
import SelectInput from '@/components/SelectInput.vue'
import ToggleButtonInput from '@/components/ToggleButtonInput.vue'
import PopupModal from '@/components/PopupModal.vue'

const router = useRouter()

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const {
  appIsLoadingData,
  appActionIsLoadingData,
  appIsOffline
} = storeToRefs(useGlobalStore())
const { buildings } = storeToRefs(useOptionStore())
const { getVerificationJobList } = useVerificationStore()
const { verificationJobList } = storeToRefs(useVerificationStore())
const {
  getBuildingDetails,
  getModuleDetails,
  getAisleDetails,
  getSideDetails,
  getLadderDetails,
  resetBuildingStore
} = useBuildingStore()
const {
  renderBuildingModules,
  renderBuildingOrModuleAisles,
  renderAisleSides,
  renderSideLadders
} = storeToRefs(useBuildingStore())
const {
  shelvingJobList,
  shelvingJob,
  directToShelfJob
} = storeToRefs(useShelvingStore())
const {
  resetShelvingStore,
  resetShelvingJob,
  getShelvingJobList,
  getShelvingJob,
  postShelvingJob,
  postDirectShelvingJob
} = useShelvingStore()

// Local Data
const shelfTableVisibleColumns = ref([
  'id',
  'containers',
  'status',
  'user_id',
  'create_dt',
  'complete_dt'
])
const shelfTableColumns = ref([
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
  },
  {
    name: 'complete_dt',
    field: row => row.status == 'Completed' ? row.last_transition : '',
    label: 'Completed Date',
    align: 'left',
    sortable: true,
    order: 5
  }
])
const shelfTableFilters =  ref([
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
const showShelvingJobModal = ref(false)
const completedVerificationJobs = ref([])
const isCreateShelvingjobFormValid = computed(() => {
  if (!shelvingJob.value.verification_jobs || !shelvingJob.value.building_id) {
    return false
  } else {
    return true
  }
})

// Logic
const handleAlert = inject('handle-alert')
const formatDateTime = inject('format-date-time')

onBeforeMount(() => {
  resetShelvingStore()
  loadShelvingJobs()

  if (currentScreenSize.value == 'xs') {
    shelfTableVisibleColumns.value = [
      'id',
      'status',
      'user_id',
      'create_dt'
    ]
  }
})

const resetCreateShelfJobModal = () => {
  resetShelvingJob()
  resetBuildingStore()
  showShelvingJobModal.value = false
}
const handleShelvingJobFormChange = async (valueType) => {
  // reset the form depending on the edited form field type
  switch (valueType) {
  case 'Building':
    await getBuildingDetails(shelvingJob.value.building_id)
    shelvingJob.value.module_id = ''
    shelvingJob.value.aisle_id = ''
    shelvingJob.value.side_id = ''
    shelvingJob.value.ladder_id = ''
    return
  case 'Module':
    await getModuleDetails(shelvingJob.value.module_id)
    shelvingJob.value.aisle_id = ''
    shelvingJob.value.side_id = ''
    shelvingJob.value.ladder_id = ''
    return
  case 'Aisle':
    await getAisleDetails(shelvingJob.value.aisle_id)
    shelvingJob.value.side_id = ''
    shelvingJob.value.ladder_id = ''
    return
  case 'Side':
    await getSideDetails(shelvingJob.value.side_id)
    shelvingJob.value.ladder_id = ''
    return
  case 'Ladder':
    await getLadderDetails(shelvingJob.value.ladder_id)
    return
  }
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
const loadShelvingJob = async (jobId) => {
  try {
    appIsLoadingData.value = true
    await getShelvingJob(jobId)

    router.push({
      name: 'shelving',
      params: {
        jobId
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
const submitShelvingJob = async () => {
  try {
    appActionIsLoadingData.value = true

    const payload = {
      status: 'Created',
      building_id: shelvingJob.value.building_id,
      module_id: shelvingJob.value.module_id,
      aisle_id: shelvingJob.value.aisle_id,
      side_id: shelvingJob.value.side_id,
      ladder_id: shelvingJob.value.ladder_id,
      last_transition: new Date(), //TODO Remove once api handles transition data
      run_time: new Date().toLocaleString('en-us', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).split(' ').shift(), //TODO Remove once api handles transition data
      verification_jobs: shelvingJob.value.verification_jobs //TODO: this needs to be changed to allow multiple jobs to be combined on api
    }
    await postShelvingJob(payload)

    // route the user to the shelving job detail page
    router.push({
      name: 'shelving',
      params: {
        jobId: shelvingJob.value.id
      }
    })

    handleAlert({
      type: 'success',
      text: 'A Shelving Job has been successfully created.',
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appActionIsLoadingData.value = false
  }
}
const submitDirectToShelfJob = async () => {
  try {
    appIsLoadingData.value = true
    await postDirectShelvingJob()

    router.push({
      name: 'shelving-dts',
      params: {
        jobId: directToShelfJob.value.id
      }
    })

    handleAlert({
      type: 'success',
      text: 'A Direct Shelving Job has been successfully created.',
      autoClose: true
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

const loadVerificationJobs = async () => {
  try {
    await getVerificationJobList()

    // filter jobs by completed status
    if (verificationJobList.value.length > 0) {
      completedVerificationJobs.value = verificationJobList.value.filter(job => job.status == 'Completed')
    }
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
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