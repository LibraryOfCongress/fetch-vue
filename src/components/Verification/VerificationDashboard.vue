<template>
  <div class="verification-dashboard">
    <div class="row q-mb-xs-xl q-mb-sm-none">
      <div class="col-grow q-mb-xs-md q-mb-sm-none">
        <EssentialTable
          :table-columns="verificationTableColumns"
          :table-visible-columns="verificationTableVisibleColumns"
          :filter-options="verificationTableFilters"
          :table-data="verificationJobList.filter(job => job.status !== 'Completed')"
          :enable-table-reorder="false"
          :heading-row-class="'q-mb-xs-md q-mb-md-lg'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
          @selected-table-row="loadVerificationJob($event.workflow_id)"
        >
          <template #heading-row>
            <div
              class="col-sm-5 col-md-12 col-lg-auto"
              :class="currentScreenSize == 'sm' || currentScreenSize == 'xs' ? '' : 'self-center'"
            >
              <h1 class="text-h4 text-bold">
                Verification Jobs
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
            <span
              v-if="colName == 'trayed'"
              class="text-secondary"
            >
              {{ value == true ? 'Trayed' : 'Non-Trayed' }}
            </span>
          </template>
        </EssentialTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global-store'
import { useVerificationStore } from 'src/stores/verification-store'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from '@/components/EssentialTable.vue'

const router = useRouter()

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appIsLoadingData } = storeToRefs(useGlobalStore())
const {
  resetVerificationStore,
  getVerificationJobList,
  getVerificationJob
} = useVerificationStore()
const { verificationJobList } = storeToRefs(useVerificationStore())


// Local Data
const verificationTableVisibleColumns = ref([
  'id',
  'trayed',
  'status'
])
const verificationTableColumns = ref([
  {
    name: 'id',
    field: 'workflow_id',
    label: 'Job Number',
    align: 'left',
    sortable: true
  },
  {
    name: 'trayed',
    field: 'trayed',
    label: 'Job Type',
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
const verificationTableFilters =  ref([
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
        text: 'Running',
        value: false
      }
    ]
  }
])

// Logic
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  resetVerificationStore()
  loadVerificationJobs()

  if (currentScreenSize.value == 'xs') {
    verificationTableVisibleColumns.value = [
      'id',
      'trayed',
      'status'
    ]
  }
})

const loadVerificationJobs = async () => {
  try {
    appIsLoadingData.value = true
    await getVerificationJobList()
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
const loadVerificationJob = async (workflowId) => {
  try {
    appIsLoadingData.value = true
    await getVerificationJob(workflowId)

    router.push({
      name: 'verification',
      params: {
        jobId: workflowId
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