<template>
  <div class="request-dashboard">
    <div class="row q-mb-xs-xl q-mb-sm-none">
      <div class="col-grow q-mb-xs-md q-mb-sm-none">
        <EssentialTable
          ref="requestTableComponent"
          :table-columns="requestDisplayType == 'request_view' ? requestTableColumns : requestBatchTableColumns"
          :table-visible-columns="requestDisplayType == 'request_view' ? requestTableVisibleColumns : requestBatchTableVisibleColumns"
          :filter-options="requestDisplayType == 'request_view' ? requestTableFilters : requestBatchTableFilters"
          :table-data="requestJobList"
          :enable-table-reorder="false"
          :enable-selection="showCreatePickList || showAddPickList"
          :heading-row-class="'q-mb-xs-md q-mb-md-xl'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
          @selected-table-row="loadRequestJob($event.id)"
          @selected-data="selectedRequestItems = $event"
        >
          <template #heading-row>
            <div
              class="col-sm-5 col-md-12 q-mb-md-sm"
              :class="currentScreenSize == 'sm' || currentScreenSize == 'xs' ? '' : 'self-center'"
            >
              <label class="text-h4 text-bold">
                Requests
              </label>
            </div>

            <div
              class="col-xs-grow col-sm-7 col-md-auto flex"
              :class="currentScreenSize == 'sm' || currentScreenSize == 'xs' ? 'justify-end q-mb-md' : 'order-1'"
            >
              <q-btn
                no-caps
                unelevated
                icon-right="arrow_drop_down"
                color="accent"
                label="Create"
                class="text-body1 q-ml-xs-none q-ml-sm-sm"
                :disabled="showCreatePickList || showAddPickList"
              >
                <q-menu>
                  <q-list>
                    <q-item
                      clickable
                      v-close-popup
                      @click="showAddPickList = true"
                      role="menuitem"
                    >
                      <q-item-section>
                        <q-item-label>
                          <span>
                            Add to Pick List
                          </span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="showCreatePickList = true"
                      role="menuitem"
                    >
                      <q-item-section>
                        <q-item-label>
                          <span>
                            Create a Pick List
                          </span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="showCreateRequestByType = 'manual'"
                      role="menuitem"
                    >
                      <q-item-section>
                        <q-item-label>
                          <span>
                            Create Manual Requests
                          </span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="showCreateRequestByType = 'bulk'"
                      role="menuitem"
                    >
                      <q-item-section>
                        <q-item-label>
                          <span class="text-no-wrap">
                            Import Requests from File
                          </span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <div
              class="col-xs-12 col-sm-auto col-md-auto q-mb-xs-md q-mb-sm-none"
            >
              <ToggleButtonInput
                v-model="requestDisplayType"
                :options="[
                  {label: 'Request View', value: 'request_view'},
                  {label: 'Batch View', value: 'batch_view'}
                ]"
                @update:model-value="clearTableSelection(); loadRequestJobs();"
                class="text-no-wrap"
              />
            </div>

            <div
              v-if="(showCreatePickList || showAddPickList) && currentScreenSize !== 'xs'"
              class="col-12 order-2 flex"
            >
              <div class="request-dashboard-actions q-ml-auto q-mt-md">
                <q-btn
                  no-caps
                  unelevated
                  :color="showCreatePickList ? 'accent' : 'positive'"
                  :label="`(${selectedRequestItems.length}) ${showCreatePickList ? 'Create Pick List' : 'Add To Pick List'}`"
                  class="btn-no-wrap text-body1 q-mr-xs full-height"
                  :disabled="selectedRequestItems.length == 0"
                  :loading="appActionIsLoadingData"
                  @click="showCreatePickList ? createPickListJob() : showAddPickListModal = true"
                />
                <q-btn
                  no-caps
                  outline
                  label="Cancel"
                  class="btn-no-wrap text-body1 q-ml-xs full-height"
                  @click="resetPickListForm"
                />
              </div>
            </div>
            <MobileActionBar
              v-else-if="(showCreatePickList || showAddPickList) && currentScreenSize == 'xs'"
              :button-one-color="showCreatePickList ? 'accent' : 'positive'"
              :button-one-label="`(${selectedRequestItems.length}) ${showCreatePickList ? 'Create Pick List' : 'Add To Pick List'}`"
              :button-one-outline="false"
              :button-one-loading="appActionIsLoadingData"
              :button-one-disabled="selectedRequestItems.length == 0"
              @button-one-click="showCreatePickList ? createPickListJob() : showAddPickListModal = true"
              :button-two-color="'black'"
              :button-two-label="'Cancel'"
              :button-two-outline="true"
              @button-two-click="resetPickListForm"
            />
          </template>

          <template #table-td="{ colName, value }">
            <span
              v-if="colName == 'request_type'"
              class="outline text-nowrap"
              :class="'text-highlight'"
            >
              {{ value }}
            </span>
            <span
              v-else-if="colName == 'status'"
              class="outline text-nowrap"
              :class="value == 'Completed' || value == 'New' ? 'text-highlight' : value == 'Paused' || value == 'Running' ? 'text-highlight-warning' : null "
            >
              {{ value }}
            </span>
            <span
              v-else-if="colName == 'media_type'"
              class="outline text-nowrap"
              :class="'text-highlight'"
            >
              {{ value }}
            </span>
            <span v-else-if="colName == 'create_dt'">
              {{ formatDateTime(value).date }}
            </span>
            <span v-else-if="colName == 'import_dt'">
              {{ formatDateTime(value).date }}
            </span>
          </template>
        </EssentialTable>
      </div>
    </div>

    <!-- Request Item Overlay-->
    <RequestItemOverlay
      v-if="requestJob.id && requestDisplayType == 'request_view'"
      :item-data="requestJob"
      @close="resetRequestJob()"
    />

    <!-- Request Creation Modal -->
    <RequestCreateModal
      v-if="showCreateRequestByType"
      :type="showCreateRequestByType"
      @hide="showCreateRequestByType = null"
    />

    <!-- Add To Picklist Modal -->
    <PopupModal
      v-if="showAddPickListModal"
      :show-actions="false"
      @reset="resetPickListForm"
      aria-label="AddToPicklistJobModal"
    >
      <template #header-content="{ hideModal }">
        <q-card-section class="row items-center justify-between q-pb-none">
          <h2 class="text-h6">
            Select Pick List
          </h2>

          <q-btn
            icon="close"
            flat
            round
            dense
            aria-label="Close"
            @click="hideModal"
          />
        </q-card-section>
      </template>

      <template #main-content>
        <q-card-section class="column no-wrap items-center">
          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Pick List Jobs
            </label>
            <SelectInput
              v-model="addToPickListJob"
              :options="[]"
              option-type="picklist"
              option-value="id"
              option-label="name"
              :placeholder="'Select Pick List Job'"
              aria-label="picklistJobSelect"
            />
          </div>
        </q-card-section>
      </template>

      <template #footer-content="{ hideModal }">
        <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
          <q-btn
            no-caps
            unelevated
            color="positive"
            label="Add To Pick List"
            class="text-body1 full-width text-nowrap"
            :disabled="!addToPickListJob"
            :loading="appActionIsLoadingData"
            @click="updatePickListJob(); hideModal();"
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
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global-store'
import { useRequestStore } from '@/stores/request-store'
import { usePicklistStore } from '@/stores/picklist-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from '@/components/EssentialTable.vue'
import ToggleButtonInput from '@/components/ToggleButtonInput.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'
import RequestItemOverlay from '@/components/Request/RequestItemOverlay.vue'
import RequestCreateModal from '@/components/Request/RequestCreateModal.vue'
import PopupModal from '@/components/PopupModal.vue'
import SelectInput from '@/components/SelectInput.vue'

const router = useRouter()

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appIsLoadingData, appActionIsLoadingData } = storeToRefs(useGlobalStore())
const {
  resetRequestJob,
  resetRequestStore,
  getRequestJobList,
  getRequestJob,
  getRequestBatchJob
} = useRequestStore()
const { requestJobList, requestJob } = storeToRefs(useRequestStore())
const {
  postPicklistJob
} = usePicklistStore()
const { picklistJob } = storeToRefs(usePicklistStore())

// Local Data
const requestTableComponent = ref(null)
const requestTableVisibleColumns = ref([
  'id',
  'request_type',
  'barcode',
  'external_request_id',
  'requestor_name',
  'status',
  'priority',
  'media_type',
  'item_location',
  'delivery_location',
  'create_dt'
])
const requestTableColumns = ref([
  {
    name: 'id',
    field: 'id',
    label: 'Request ID #',
    align: 'left',
    sortable: true
  },
  {
    name: 'request_type',
    field: row => row.request_type?.type,
    label: 'Request Type',
    align: 'left',
    sortable: true
  },
  {
    name: 'barcode',
    field: row => row.item ? row.item?.barcode?.value : row.non_tray_item?.barcode?.value,
    label: 'Barcode',
    align: 'left',
    sortable: true
  },
  {
    name: 'external_request_id',
    field: 'external_request_id',
    label: 'External Request ID',
    align: 'left',
    sortable: true
  },
  {
    name: 'requestor_name',
    field: 'requestor_name',
    label: 'Requestor Name',
    align: 'left',
    sortable: true
  },
  {
    name: 'status',
    field: row => row.item ? row.item?.status : row.non_tray_item?.status,
    label: 'Status',
    align: 'left',
    sortable: true
  },
  {
    name: 'priority',
    field: row => row.priority?.value,
    label: 'Priority',
    align: 'left',
    sortable: true
  },
  {
    name: 'media_type',
    field: row => row.item ? row.item?.media_type?.name : row.non_tray_item?.media_type?.name,
    label: 'Media Type',
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
    name: 'delivery_location',
    field: row => row.delivery_location?.name,
    label: 'Delivery Location',
    align: 'left',
    sortable: true
  },
  {
    name: 'create_dt',
    field: 'create_dt',
    label: 'Date Created',
    align: 'left',
    sortable: true
  }
])
const requestTableFilters =  ref([
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
        text: 'On Hold',
        value: false
      },
      {
        text: 'Completed',
        value: false
      }
    ]
  }
])
const requestBatchTableVisibleColumns = ref([
  'import_source',
  'request_count',
  'status',
  'uploaded_by',
  'import_dt'
])
const requestBatchTableColumns = ref([
  {
    name: 'import_source',
    field: 'import_source',
    label: 'Import Source',
    align: 'left',
    sortable: true
  },
  {
    name: 'request_count',
    field: 'request_count',
    label: '# of Requests',
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
    name: 'uploaded_by',
    field: 'uploaded_by',
    label: 'Uploaded By',
    align: 'left',
    sortable: true
  },
  {
    name: 'import_dt',
    field: 'import_dt',
    label: 'Date Imported',
    align: 'left',
    sortable: true
  }
])
const requestBatchTableFilters =  ref([
  {
    field: 'status',
    options: [
      {
        text: 'Created',
        value: false
      },
      {
        text: 'Pick List',
        value: false
      },
      {
        text: 'On Hold',
        value: false
      },
      {
        text: 'Completed',
        value: false
      }
    ]
  }
])
const requestDisplayType = ref('request_view')
const showCreatePickList = ref(false)
const showAddPickList = ref(false)
const showAddPickListModal = ref(false)
const addToPickListJob = ref(null)
const selectedRequestItems = ref([])
const showCreateRequestByType = ref(null)

// Logic
const handleAlert = inject('handle-alert')
const formatDateTime = inject('format-date-time')
const getItemLocation = inject('get-item-location')

onBeforeMount(() => {
  resetRequestStore()
  loadRequestJobs()

  if (currentScreenSize.value == 'xs') {
    requestTableVisibleColumns.value = [
      'id',
      'request_type',
      'barcode',
      'requestor_name'
    ]
    requestBatchTableVisibleColumns.value = [
      'import_source',
      'request_count',
      'status',
      'import_dt'
    ]
  }
})

const clearTableSelection = () => {
  requestTableComponent.value.clearSelectedData()
  selectedRequestItems.value = []
}

const resetPickListForm = () => {
  showCreatePickList.value = false
  showAddPickList.value = false
  showAddPickListModal.value = false
  clearTableSelection()
}

const loadRequestJobs = async () => {
  try {
    appIsLoadingData.value = true
    await getRequestJobList(requestDisplayType.value)
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
const loadRequestJob = async (id) => {
  try {
    appIsLoadingData.value = true

    if (requestDisplayType.value == 'batch_view') {
      await getRequestBatchJob(id)
      router.push({
        name: 'request',
        params: {
          jobId: id
        }
      })
    } else {
      await getRequestJob(id)
    }
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
const createPickListJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      request_item_ids: selectedRequestItems.value.map(item => item.id)
    }
    await postPicklistJob(payload)

    // display an alert with the created picklist job id so you can click that and link directly to the new job if needed
    handleAlert({
      type: 'success',
      text: `Successfully created Pick List #: <a href='/picklist/${picklistJob.value.id}' tabindex='0'>${picklistJob.value.id}</a>`,
      autoClose: false
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appActionIsLoadingData.value = false
    resetPickListForm()
  }
}
const updatePickListJob = async () => {
  try {
    appActionIsLoadingData.value = true
    // TODO: setup api call to update and existing pick list job using the selected pick list items
    const payload = {
      id: addToPickListJob.value,
      request_item_ids: selectedRequestItems.value.map(item => item.id)
    }
    console.log(payload)
    // await patchPicklistJob()

    // display an alert with the updated picklist job id so you can click that and link directly to the job if needed
    handleAlert({
      type: 'success',
      text: `Successfully added items to Pick List #: <a href='/picklist/${picklistJob.value.id}' tabindex='0'>${picklistJob.value.id}</a>`,
      autoClose: false
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appActionIsLoadingData.value = false
    resetPickListForm()
  }
}
</script>

<style lang="scss" scoped>
</style>