<template>
  <div class="picklist-dashboard">
    <div class="row q-mb-xs-xl q-mb-sm-none">
      <div class="col-grow q-mb-xs-md q-mb-sm-none">
        <EssentialTable
          :table-columns="picklistTableColumns"
          :table-visible-columns="picklistTableVisibleColumns"
          :filter-options="picklistTableFilters"
          :table-data="picklistJobList"
          :enable-table-reorder="false"
          :enable-selection="false"
          :heading-row-class="'q-mb-xs-md q-mb-md-xl'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
          :enable-pagination="true"
          :pagination-total="picklistJobListTotal"
          :pagination-loading="appIsLoadingData"
          @update-pagination="loadPicklistJobs($event)"
          @selected-table-row="loadPicklistJob($event.id)"
        >
          <template #heading-row>
            <div
              class="col-xs-12 col-sm-5 col-md-12 col-lg-auto q-mb-xs-sm q-mb-sm-none"
              :class="currentScreenSize == 'xs' ? '' : 'self-center'"
            >
              <h1 class="text-h4 text-bold">
                Pick List Jobs
              </h1>
            </div>
          </template>

          <template #table-td="{ colName, value }">
            <span
              v-if="colName == 'request_count'"
              class="outline text-nowrap"
            >
              {{ value }} Items
            </span>
            <span
              v-else-if="colName == 'status'"
              class="outline text-nowrap"
              :class="value == 'Completed' || value == 'Created' ? 'text-highlight' : value == 'Paused' || value == 'Running' ? 'text-highlight-warning' : value == 'New' ? 'text-highlight-accent' : null "
            >
              {{ value }}
            </span>
            <span v-else-if="colName == 'create_dt'">
              {{ formatDateTime(value).date }}
            </span>
            <span v-else-if="colName == 'complete_dt'">
              {{ formatDateTime(value).date }}
            </span>
          </template>
        </EssentialTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global-store'
import { usePicklistStore } from '@/stores/picklist-store'
import { useUserStore } from '@/stores/user-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { usePermissionHandler } from '@/composables/usePermissionHandler.js'
import EssentialTable from '@/components/EssentialTable.vue'

const router = useRouter()

// Composables
const { currentScreenSize } = useCurrentScreenSize()
const { checkUserPermission } = usePermissionHandler()

// Store Data
const { appIsLoadingData } = storeToRefs(useGlobalStore())
const {
  resetPicklistStore,
  getPicklistJobList,
  getPicklistJob
} = usePicklistStore()
const { picklistJobList, picklistJobListTotal } = storeToRefs(usePicklistStore())
const { userData } = storeToRefs(useUserStore())

// Local Data
const picklistTableVisibleColumns = ref([
  'id',
  'building',
  'request_count',
  'status',
  'user',
  'create_dt',
  'complete_dt'
])
const picklistTableColumns = ref([
  {
    name: 'id',
    field: 'id',
    label: 'Job Number',
    align: 'left',
    sortable: true
  },
  {
    name: 'building',
    field: row => row.building?.name,
    label: 'Building',
    align: 'left',
    sortable: true
  },
  {
    name: 'request_count',
    field: 'request_count',
    label: '# of Items in Job',
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
    name: 'user',
    field: row => row.user ? `${row.user.first_name} ${row.user.last_name}` : '',
    label: 'Assigned User',
    align: 'left',
    sortable: true
  },
  {
    name: 'create_dt',
    field: 'create_dt',
    label: 'Date Added',
    align: 'left',
    sortable: true
  },
  {
    name: 'complete_dt',
    field: 'last_transition',
    label: 'Last Updated',
    align: 'left',
    sortable: true
  }
])
const picklistTableFilters =  ref([
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
      },
      {
        text: 'Completed',
        value: false
      }
    ]
  }
])

// Logic
const handleAlert = inject('handle-alert')
const formatDateTime = inject('format-date-time')

onBeforeMount(() => {
  resetPicklistStore()
  loadPicklistJobs()

  if (currentScreenSize.value == 'xs') {
    picklistTableVisibleColumns.value = [
      'id',
      'status',
      'assigned_user',
      'create_dt'
    ]
  }
})

const loadPicklistJobs = async (qParams) => {
  try {
    appIsLoadingData.value = true
    await getPicklistJobList({ ...qParams, queue: true, user_id: checkUserPermission('can_view_all_picklist_jobs') ? null : userData.value.user_id })
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
const loadPicklistJob = async (id) => {
  try {
    appIsLoadingData.value = true
    await getPicklistJob(id)
    router.push({
      name: 'picklist',
      params: {
        jobId: id
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
