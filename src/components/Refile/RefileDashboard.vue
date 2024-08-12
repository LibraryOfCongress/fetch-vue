<template>
  <div class="refile-dashboard">
    <div class="row q-mb-xs-xl q-mb-sm-none">
      <div class="col-grow q-mb-xs-md q-mb-sm-none">
        <EssentialTable
          ref="refileTableComponent"
          :table-columns="refileDisplayType == 'refile_job' ? refileTableColumns : queueTableColumns"
          :table-visible-columns="refileDisplayType == 'refile_job' ? refileTableVisibleColumns : queueTableVisibleColumns"
          :filter-options="refileDisplayType == 'refile_job' ? refileTableFilters : queueTableFilters"
          :table-data="refileJobList"
          :row-key="refileDisplayType == 'refile_job' ? 'id' : 'barcode_value'"
          :enable-table-reorder="false"
          :enable-selection="showCreateRefileJob || showAddRefileJob"
          :heading-row-class="'q-mb-xs-md q-mb-md-xl'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
          @selected-table-row="refileDisplayType == 'refile_job' ? loadRefileJob($event.id) : null"
          @selected-data="selectedRefileItems = $event"
        >
          <template #heading-row>
            <div
              class="col-sm-5 col-md-12 q-mb-md-sm"
              :class="currentScreenSize == 'sm' || currentScreenSize == 'xs' ? '' : 'self-center'"
            >
              <label class="text-h4 text-bold">
                Refile
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
                :disabled="false"
              >
                <q-menu>
                  <q-list>
                    <q-item
                      v-if="checkUserPermission('can_add_refile_item_to_queue')"
                      clickable
                      v-close-popup
                      @click="handleOptionMenu('Queue')"
                      role="menuitem"
                    >
                      <q-item-section>
                        <q-item-label>
                          <span class="text-nowrap">
                            Add Item to Queue
                          </span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      v-if="checkUserPermission('can_add_to_refile_job')"
                      clickable
                      v-close-popup
                      @click="handleOptionMenu('Add')"
                      role="menuitem"
                    >
                      <q-item-section>
                        <q-item-label>
                          <span class="text-nowrap">
                            Add Item to Refile Job
                          </span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      v-if="checkUserPermission('can_create_refile_job')"
                      clickable
                      v-close-popup
                      @click="handleOptionMenu('Create')"
                      role="menuitem"
                    >
                      <q-item-section>
                        <q-item-label>
                          <span class="text-nowrap">
                            Create Refile Job
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
                v-model="refileDisplayType"
                :options="[
                  {label: 'Refile Job', value: 'refile_job'},
                  {label: 'Refile Queue', value: 'refile_queue'}
                ]"
                @update:model-value="loadRefileJobs"
                class="text-no-wrap"
              />
            </div>

            <div
              v-if="(showCreateRefileJob || showAddRefileJob) && currentScreenSize !== 'xs'"
              class="col-12 order-2 flex"
            >
              <div class="q-ml-auto q-mt-md">
                <q-btn
                  no-caps
                  unelevated
                  :color="showCreateRefileJob ? 'accent' : 'positive'"
                  :label="`(${selectedRefileItems.length}) ${showCreateRefileJob ? 'Create Refile Job' : 'Add To Refile Job'}`"
                  class="btn-no-wrap text-body1 q-mr-xs full-height"
                  :disabled="selectedRefileItems.length == 0"
                  :loading="appActionIsLoadingData"
                  @click="showCreateRefileJob ? createRefileJob() : updateRefileJob()"
                />
                <q-btn
                  no-caps
                  outline
                  label="Cancel"
                  class="btn-no-wrap text-body1 q-ml-xs full-height"
                  @click="resetRefileJobForm(); getRefileQueueList();"
                />
              </div>
            </div>
            <MobileActionBar
              v-else-if="(showCreateRefileJob || showAddRefileJob) && currentScreenSize == 'xs'"
              :button-one-color="showCreateRefileJob ? 'accent' : 'positive'"
              :button-one-label="`(${selectedRefileItems.length}) ${showCreateRefileJob ? 'Create Refile Job' : 'Add To Refile Job'}`"
              :button-one-outline="false"
              :button-one-loading="appActionIsLoadingData"
              :button-one-disabled="selectedRefileItems.length == 0"
              @button-one-click="showCreateRefileJob ? createRefileJob() : updateRefileJob()"
              :button-two-color="'black'"
              :button-two-label="'Cancel'"
              :button-two-outline="true"
              @button-two-click="resetRefileJobForm(); loadRefileJobs();"
            />
          </template>

          <template #table-td="{ colName, value }">
            <span
              v-if="colName == 'size_class'"
              class="outline text-nowrap"
              :class="'outline'"
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
            <span v-else-if="colName == 'last_transition'">
              {{ formatDateTime(value).date }}
            </span>
          </template>
        </EssentialTable>
      </div>
    </div>
  </div>

  <!-- Add Item to Refile Queue Modal-->
  <RefileAddQueueItem
    v-if="showAddItemToQueue"
    @hide="showAddItemToQueue = false; loadRefileJobs();"
  />

  <!-- Create/Add To Refile Modal -->
  <PopupModal
    v-if="showRefileJobModal"
    :show-actions="false"
    @reset="showRefileJobModal = null"
    aria-label="refileJobModal"
  >
    <template #header-content="{ hideModal }">
      <q-card-section class="row items-center justify-between q-pb-none no-wrap">
        <h2 class="text-h6">
          {{ showRefileJobModal == 'Create' ? 'Filter Queue By Building' : 'Filter Queue & Select Refile Job' }}
        </h2>

        <q-btn
          icon="close"
          flat
          round
          dense
          aria-label="Close"
          @click="filterRefileByBuilding = null; addToRefileJob = null; hideModal();"
        />
      </q-card-section>
    </template>

    <template #main-content>
      <q-card-section class="column no-wrap items-center">
        <div class="form-group">
          <label class="form-group-label">
            Building
          </label>
          <SelectInput
            v-model="filterRefileByBuilding"
            :options="buildings"
            option-type="buildings"
            option-value="id"
            option-label="name"
            :placeholder="'Select Building'"
            aria-label="building"
          />
        </div>

        <div
          v-if="showRefileJobModal == 'Add'"
          class="form-group q-mt-md"
        >
          <label class="form-group-label">
            Add To Refile Job
          </label>
          <SelectInput
            v-model="addToRefileJob"
            :options="refileJobs"
            option-type="refileJobs"
            option-value="id"
            option-label="id"
            :placeholder="'Select Refile Job'"
            aria-label="refileJobSelect"
          />
        </div>
      </q-card-section>
    </template>

    <template #footer-content="{ hideModal }">
      <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
        <q-btn
          no-caps
          unelevated
          color="accent"
          label="Submit"
          class="text-body1 full-width text-nowrap"
          :disabled="showRefileJobModal == 'Create' ? !filterRefileByBuilding : (!filterRefileByBuilding || !addToRefileJob)"
          @click="loadRefileQueueByBuilding(); hideModal();"
        />

        <q-space class="q-mx-xs" />

        <q-btn
          outline
          no-caps
          label="Cancel"
          class="text-body1 full-width"
          @click="filterRefileByBuilding = null; addToRefileJob = null; hideModal();"
        />
      </q-card-section>
    </template>
  </PopupModal>
</template>

<script setup>
import { onBeforeMount, ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { useRefileStore } from '@/stores/refile-store'
import { useUserStore } from '@/stores/user-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { usePermissionHandler } from '@/composables/usePermissionHandler.js'
import RefileAddQueueItem from '@/components/Refile/RefileAddQueueItem.vue'
import EssentialTable from '@/components/EssentialTable.vue'
import ToggleButtonInput from '@/components/ToggleButtonInput.vue'
import PopupModal from '@/components/PopupModal.vue'
import SelectInput from '@/components/SelectInput.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'

const router = useRouter()

// Composables
const { currentScreenSize } = useCurrentScreenSize()
const { checkUserPermission } = usePermissionHandler()

// Store Data
const { appIsLoadingData, appActionIsLoadingData } = storeToRefs(useGlobalStore())
const { buildings, refileJobs } = storeToRefs(useOptionStore())
const {
  resetRefileStore,
  getRefileJobList,
  getRefileQueueList,
  getRefileJob,
  postRefileJob,
  postRefileJobItem
} = useRefileStore()
const { refileJobList, refileJob } = storeToRefs(useRefileStore())
const { userData } = storeToRefs(useUserStore())

// Local Data
const refileTableComponent = ref(null)
const refileTableVisibleColumns = ref([
  'id',
  'items_count',
  'shelved_count',
  'user',
  'create_dt',
  'last_transition'
])
const refileTableColumns = ref([
  {
    name: 'id',
    field: 'id',
    label: 'Job ID #',
    align: 'left',
    sortable: true
  },
  {
    name: 'items_count',
    field: row => (row.item_count + row.non_tray_item_count),
    label: '# of Items',
    align: 'left',
    sortable: true
  },
  {
    name: 'shelved_count',
    field: row => (row.item_shelved_refiled_count + row.non_tray_item_shelved_refiled_count),
    label: '# of Items Shelved',
    align: 'left',
    sortable: true
  },
  {
    name: 'user',
    field: row => row.assigned_user?.first_name,
    label: 'Assigned User',
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
    name: 'last_transition',
    field: 'last_transition',
    label: 'Last Updated',
    align: 'left',
    sortable: true
  }
])
const refileTableFilters =  ref([
  {
    field: row => row.assigned_user.first_name,
    options: [
      {
        text: 'User 1',
        value: false
      },
      {
        text: 'User 2',
        value: false
      }
    ]
  }
])
const queueTableVisibleColumns = ref([
  'item_location',
  'container_type',
  'media_type',
  'barcode',
  'owner',
  'size_class',
  'create_dt'
])
const queueTableColumns = ref([
  {
    name: 'item_location',
    field: row => `${row.module_number}-${row.aisle_number}-${row.side_orientation == 'Right' ? 'R' : row.side_orientation == 'Left' ? 'L' : row.side_orientation}-${row.ladder_number}-${row.shelf_number}-${row.shelf_position_number}`,
    label: 'Item Location',
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
    name: 'media_type',
    field: row => row.media_type,
    label: 'Media Type',
    align: 'left',
    sortable: true
  },
  {
    name: 'barcode',
    field: row => row.barcode_value,
    label: 'Item Barcode',
    align: 'left',
    sortable: true
  },
  {
    name: 'owner',
    field: row => row.owner,
    label: 'Owner',
    align: 'left',
    sortable: true
  },
  {
    name: 'size_class',
    field: row => row.size_class,
    label: 'Container Size',
    align: 'left',
    sortable: true
  },
  {
    name: 'scanned_for_refile_queue_dt',
    field: 'scanned_for_refile_queue_dt',
    label: 'Date Added',
    align: 'left',
    sortable: true
  }
])
const queueTableFilters =  ref([
  {
    field: 'container_type',
    options: [
      {
        text: 'Tray',
        value: false
      },
      {
        text: 'Non Tray',
        value: false
      }
    ]
  }
])
const refileDisplayType = ref('refile_job')
const showAddItemToQueue = ref(false)
const showCreateRefileJob = ref(false)
const showAddRefileJob = ref(false)
const showRefileJobModal = ref(null)
const selectedRefileItems = ref([])
const filterRefileByBuilding = ref(null)
const addToRefileJob = ref(null)

// Logic
const handleAlert = inject('handle-alert')
const formatDateTime = inject('format-date-time')

onBeforeMount(() => {
  resetRefileStore()
  loadRefileJobs()

  if (currentScreenSize.value == 'xs') {
    refileTableVisibleColumns.value = [
      'id',
      'items_count',
      'shelved_count',
      'user'
    ]
    queueTableVisibleColumns.value = [
      'item_location',
      'barcode'
    ]
  }
})

const handleOptionMenu = (opt) => {
  if (opt == 'Queue') {
    showAddItemToQueue.value = true
    if (refileDisplayType.value !== 'refile_queue') {
      refileDisplayType.value = 'refile_queue'
      loadRefileJobs()
    }
  } else if (opt == 'Add') {
    showRefileJobModal.value = 'Add'
  } else if (opt == 'Create') {
    showRefileJobModal.value = 'Create'
  }
}
const clearTableSelection = () => {
  refileTableComponent.value.clearSelectedData()
  selectedRefileItems.value = []
}
const resetRefileJobForm = () => {
  showCreateRefileJob.value = false
  showAddRefileJob.value = false
  showRefileJobModal.value = null
  filterRefileByBuilding.value = null
  addToRefileJob.value = null
  clearTableSelection()
}

const loadRefileJobs = async () => {
  try {
    appIsLoadingData.value = true
    if (refileDisplayType.value == 'refile_job') {
      await getRefileJobList({ user_id: checkUserPermission('can_view_all_refile_jobs') ? null : userData.value.user_id })
    } else {
      await getRefileQueueList()
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
const loadRefileQueueByBuilding = async () => {
  // this function only gets called during the creation/add refile job process
  try {
    refileDisplayType.value = 'refile_queue'
    appIsLoadingData.value = true
    await getRefileQueueList({ building_id: filterRefileByBuilding.value })

    // display next step in refile job creation
    if (showRefileJobModal.value == 'Create') {
      showCreateRefileJob.value = true
    } else {
      showAddRefileJob.value = true
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
const loadRefileJob = async (id) => {
  try {
    appIsLoadingData.value = true
    await getRefileJob(id)

    router.push({
      name: 'refile',
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
const createRefileJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      barcode_values: selectedRefileItems.value.map(item => item.barcode_value)
    }
    await postRefileJob(payload)

    // display an alert with the created refile job id so you can click that and link directly to the new job if needed
    handleAlert({
      type: 'success',
      text: `Successfully created Refile Job #: <a href='/refile/${refileJob.value.id}' tabindex='0'>${refileJob.value.id}</a>`,
      autoClose: false
    })
    loadRefileJobs()
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appActionIsLoadingData.value = false
    resetRefileJobForm()
  }
}
const updateRefileJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: addToRefileJob.value,
      barcode_values: selectedRefileItems.value.map(item => item.barcode_value)
    }
    await postRefileJobItem(payload)

    // display an alert with the updated refilet job id so you can click that and link directly to the job if needed
    handleAlert({
      type: 'success',
      text: `Successfully added items to Refile Job #: <a href='/refile/${refileJob.value.id}' tabindex='0'>${refileJob.value.id}</a>`,
      autoClose: false
    })
    loadRefileJobs()
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appActionIsLoadingData.value = false
    resetRefileJobForm()
  }
}
</script>

<style lang="scss" scoped>
</style>