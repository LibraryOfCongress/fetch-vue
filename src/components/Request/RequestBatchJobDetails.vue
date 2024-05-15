<template>
  <div class="request-job">
    <div class="row justify-between q-pt-xs-md q-pt-md-xl q-mx-xs-sm q-mx-sm-md">
      <div class="col-xs-12 col-md-12 col-lg-3">
        <div class="request-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-lg-lg">
          <label
            id="requestJobId"
            class="request-job-details-label text-h4 text-bold q-mb-xs"
          >
            Request List:
          </label>
          <p class="request-job-number-box text-h4 q-pa-md">
            {{ requestBatchJob.id }}
          </p>
        </div>
      </div>

      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="request-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="request-job-details-label-2 text-h6 text-bold"
          >
            Import Source:
          </label>
          <p class="text-body1">
            {{ requestBatchJob.import_source }}
          </p>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="request-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="request-job-details-label-2 text-h6 text-bold"
          >
            Uploaded By:
          </label>
          <p class="text-body1">
            {{ requestBatchJob.uploaded_by }}
          </p>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="request-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="request-job-details-label-2 text-h6 text-bold"
          >
            # of Requests
          </label>
          <p class="text-body1">
            {{ requestBatchJob.request_count }}
          </p>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="request-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="request-job-details-label-2 text-h6 text-bold"
          >
            Date Imported:
          </label>
          <p class="text-body1">
            {{ formatDateTime(requestBatchJob.import_dt).date }}
          </p>
        </div>
      </div>
    </div>

    <q-space class="divider q-my-xs-lg q-my-md-xl" />

    <div class="row q-mb-xs-xl q-mb-sm-none">
      <div class="col-grow q-mb-xs-md q-mb-sm-none">
        <EssentialTable
          ref="requestTableComponent"
          :table-columns="requestTableColumns"
          :table-visible-columns="requestTableVisibleColumns"
          :filter-options="requestTableFilters"
          :table-data="requestBatchJob.items"
          :enable-table-reorder="false"
          :enable-selection="showCreatePickList || showAddPickList"
          :heading-row-class="'q-mb-lg q-px-xs-sm q-px-sm-md'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
          @selected-table-row="selectedRequestItem = $event"
          @selected-data="selectedRequestItems = $event"
        >
          <template #heading-row>
            <div
              class="col-xs-7 col-sm-5 q-mb-md-sm"
              :class="currentScreenSize == 'sm' || currentScreenSize == 'xs' ? '' : 'self-center'"
            >
              <label class="text-h4 text-bold">
                Items in List:
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
                  <q-list class="text-no-wrap">
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
                  </q-list>
                </q-menu>
              </q-btn>
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
                  @click="showCreatePickList ? createPickListJob() : updatePickListJob()"
                />
                <q-btn
                  no-caps
                  outline
                  label="Cancel"
                  class="btn-no-wrap text-body1 q-ml-xs full-height"
                  @click="showCreatePickList = false; showAddPickList = false; clearTableSelection();"
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
              @button-one-click="showCreatePickList ? createPickListJob() : updatePickListJob()"
              :button-two-color="'black'"
              :button-two-label="'Cancel'"
              :button-two-outline="true"
              @button-two-click="showCreatePickList = false; showAddPickList = false; clearTableSelection();"
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
              :class="value == 'Completed' || value == 'New' ? 'text-highlight' : value == 'Paused' || value == 'Running' ? 'text-highlight-yellow' : null "
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
      v-if="selectedRequestItem"
      :item-data="selectedRequestItem"
      @close="selectedRequestItem = null"
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
import MobileActionBar from '@/components/MobileActionBar.vue'
import RequestItemOverlay from '@/components/Request/RequestItemOverlay.vue'

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const { requestBatchJob } = storeToRefs(useRequestStore())

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
    field: row => getItemLocation(row),
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
const showCreatePickList = ref(false)
const showAddPickList = ref(false)
const selectedRequestItems = ref([])
const selectedRequestItem = ref(null)

// Logic
const handleAlert = inject('handle-alert')
const formatDateTime = inject('format-date-time')
const getItemLocation = inject('get-item-location')

onBeforeMount(() => {
  if (currentScreenSize.value == 'xs') {
    requestTableVisibleColumns.value = [
      'id',
      'request_type',
      'barcode',
      'requestor_name'
    ]
  }
})

const clearTableSelection = () => {
  requestTableComponent.value.clearSelectedData()
  selectedRequestItems.value = []
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
const updatePickListJob = async () => {
  try {
    appActionIsLoadingData.value = true
    // TODO: setup api call to update and existing pick list job using the selected pick list items
    // await patchRequestJob()
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
.request-job {
  position: relative;

  &-number-box {
    background-color: $secondary;
    color: $color-white;
    text-align: center;
    border-radius: 3px;
    width: 100%;
  }

  &-details {
    position: relative;
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: flex-start;

    &-label {
      &-2 {
        margin-top: 2.25rem;

        @media (max-width: $breakpoint-sm-max) {
          margin-top: 0;
        }
      }
    }
  }
}
</style>