<template>
  <div class="request-dashboard">
    <div class="row q-mb-xs-xl q-mb-sm-none">
      <div class="col-grow q-mb-xs-md q-mb-sm-none">
        <EssentialTable
          ref="requestTableComponent"
          :table-columns="requestTableColumns"
          :table-visible-columns="requestTableVisibleColumns"
          :filter-options="requestTableFilters"
          :table-data="requestJobList"
          :enable-table-reorder="false"
          :enable-selection="showCreatePickList"
          :heading-row-class="'q-mb-xs-md q-mb-md-xl'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
          @selected-table-row="loadRequestJob($event.id)"
          @selected-data="selectedRequestItems = $event"
        >
          <template #heading-row>
            <div
              class="col-sm-5 col-md-12 col-lg-auto q-mb-md-sm q-mb-lg-none"
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
                :disabled="showCreatePickList"
              >
                <q-menu>
                  <q-list>
                    <q-item
                      clickable
                      v-close-popup
                      @click="null"
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
                      @click="null"
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
                      @click="null"
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
              class="col-xs-12 col-sm-auto col-md-auto col-lg-12 q-mt-lg-sm q-mb-xs-md q-mb-sm-none"
              :class="currentScreenSize == 'lg' || currentScreenSize == 'xl' ? 'order-2' : ''"
            >
              <div class="row">
                <div class="col-xs-12 col-sm-auto">
                  <ToggleButtonInput
                    v-model="requestDisplayType"
                    :options="[
                      {label: 'Request View', value: 'request_view'},
                      {label: 'Batch View', value: 'batch_view'}
                    ]"
                    @update:model-value="updateTableView()"
                    class="text-no-wrap"
                  />
                </div>

                <div
                  v-if="showCreatePickList && currentScreenSize !== 'xs'"
                  class="col-auto q-ml-auto"
                >
                  <q-btn
                    no-caps
                    unelevated
                    color="accent"
                    :label="`(${selectedRequestItems.length}) Create Pick List`"
                    class="btn-no-wrap text-body1 q-mr-xs full-height"
                    :disabled="selectedRequestItems.length == 0"
                    :loading="appActionIsLoadingData"
                    @click="createPickListJob()"
                  />
                  <q-btn
                    no-caps
                    outline
                    label="Cancel"
                    class="btn-no-wrap text-body1 q-ml-xs full-height"
                    @click="showCreatePickList = false; clearTableSelection();"
                  />
                </div>
                <MobileActionBar
                  v-else-if="showCreatePickList && currentScreenSize == 'xs'"
                  button-one-color="accent"
                  :button-one-label="`(${selectedRequestItems.length}) Create Pick List`"
                  :button-one-outline="false"
                  :button-one-loading="appActionIsLoadingData"
                  :button-one-disabled="selectedRequestItems.length == 0"
                  @button-one-click="createPickListJob()"
                  :button-two-label="'Cancel'"
                  :button-two-outline="true"
                  @button-two-click="showCreatePickList = false; clearTableSelection();"
                />
              </div>
            </div>
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
              :class="value == 'Created' || value == 'Completed' ? 'text-highlight' : value == 'Paused' || value == 'Running' ? 'text-highlight-yellow' : null"
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
          </template>
        </EssentialTable>
      </div>
    </div>

    <!-- Request Item Overlay-->
    <RequestItemOverlay
      v-if="requestJob.id"
      :item-data="requestJob"
      @close="resetRequestJob()"
    />
  </div>
</template>

<script setup>
import { onBeforeMount, ref, inject } from 'vue'
import { useGlobalStore } from '@/stores/global-store'
import { useRequestStore } from '@/stores/request-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from '@/components/EssentialTable.vue'
import ToggleButtonInput from '@/components/ToggleButtonInput.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'
import RequestItemOverlay from '@/components/Request/RequestItemOverlay.vue'

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appIsLoadingData, appActionIsLoadingData } = storeToRefs(useGlobalStore())
const {
  getRequestJobList,
  getRequestJob,
  resetRequestJob
} = useRequestStore()
const { requestJobList, requestJob } = storeToRefs(useRequestStore())

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
    field: 'type',
    label: 'Request Type',
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
    field: 'status',
    label: 'Status',
    align: 'left',
    sortable: true
  },
  {
    name: 'priority',
    field: 'priority',
    label: 'Priority',
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
    name: 'item_location',
    field: 'item_location',
    label: 'Item Location',
    align: 'left',
    sortable: true
  },
  {
    name: 'delivery_location',
    field: 'delivery_location',
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
const requestDisplayType = ref('request_view')
const showCreatePickList = ref(false)
const selectedRequestItems = ref([])

// Logic
const handleAlert = inject('handle-alert')
const formatDateTime = inject('format-date-time')

onBeforeMount(() => {
  loadRequestJobs()

  if (currentScreenSize.value == 'xs') {
    requestTableVisibleColumns.value = [
      'id',
      'request_type',
      'barcode',
      'requestor_name'
    ]
  }
})

const updateTableView = () => {
  //TODO send api request to get batch view jobs/request view jobs or just filter our requestJobList once api is setup
  console.log('switching table view')
}
const clearTableSelection = () => {
  requestTableComponent.value.clearSelectedData()
  selectedRequestItems.value = []
}

const loadRequestJobs = async () => {
  try {
    appIsLoadingData.value = true
    await getRequestJobList()
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
    await getRequestJob(id)

    //display the item overlay
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
    // TODO: setup api call to create the pick list job using the selected pick list items
    // await postRequestJob()
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
</script>

<style lang="scss" scoped>
</style>