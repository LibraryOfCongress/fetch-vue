<template>
  <InfoDisplayLayout class="refile-job">
    <template #number-box-content>
      <div class="flex q-mb-xs">
        <MoreOptionsMenu
          :options="[{ text: 'Edit', disabled: appIsOffline || editJob || refileJob.status == 'Paused' || refileJob.status == 'Completed' }]"
          class="q-mr-xs"
          @click="handleOptionMenu"
        />
        <label
          id="refileJobId"
          class="info-display-details-label text-h4"
        >
          Refile Job #:
        </label>
      </div>
      <p class="info-display-number-box text-h4">
        {{ refileJob.id }}
      </p>
    </template>

    <template #details-content>
      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="info-display-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="info-display-details-label-2 text-h6"
          >
            Assigned User:
          </label>
          <p
            v-if="!editJob"
            class="text-body1"
          >
            {{ refileJob.user?.first_name }}
          </p>
          <SelectInput
            v-else
            v-model="refileJob.user_id"
            :options="users"
            option-type="users"
            option-value="id"
            option-label="first_name"
            aria-label="user"
          />
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="info-display-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="info-display-details-label-2 text-h6"
          >
            # of Items:
          </label>
          <p class="text-body1">
            {{ refileJob.refile_items.length }}
          </p>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="info-display-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="info-display-details-label-2 text-h6"
          >
            Date Created
          </label>
          <p class="text-body1">
            {{ formatDateTime(refileJob.create_dt).date }}
          </p>
        </div>
      </div>
      <div class="col-xs-6 col-sm-auto col-md-auto q-mr-auto">
        <div class="info-display-details q-mb-xs-none q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-sm">
          <label
            class="info-display-details-label-2 text-h6"
          >
            Status
          </label>
          <p
            class="text-body1 text-center outline"
            :class="refileJob.status == 'Completed' || refileJob.status == 'Created' ? 'text-highlight' : refileJob.status == 'Paused' || refileJob.status == 'Running' ? 'text-highlight-warning' : refileJob.status == 'New' ? 'text-highlight-accent' : null "
          >
            {{ refileJob.status }}
          </p>
        </div>
      </div>

      <div
        v-if="currentScreenSize !== 'xs'"
        class="col-sm-12 col-md-12 col-lg-3 q-ml-auto"
      >
        <div
          v-if="editJob"
          class="info-display-details-action q-mt-sm-sm q-mt-md-md"
        >
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Save Edits"
            class="btn-no-wrap text-body1 q-mr-sm"
            :loading="appActionIsLoadingData"
            @click="updateRefileJob"
          />
          <q-btn
            no-caps
            unelevated
            outline
            color="accent"
            label="Cancel"
            class="btn-no-wrap text-body1"
            @click="cancelRefileJobEdits"
          />
        </div>
        <div
          v-else-if="refileJob.status !== 'Completed'"
          class="info-display-details-action q-mt-sm-sm q-mt-md-md"
        >
          <q-btn
            v-if="refileJob.status !== 'Created'"
            no-caps
            unelevated
            outline
            color="accent"
            :icon="refileJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
            :label="refileJob.status == 'Paused' ? 'Resume Job' : 'Pause Job'"
            class="btn-no-wrap text-body1 q-mr-sm"
            :disabled="appPendingSync"
            @click="refileJob.status == 'Paused' ? updateRefileJobStatus('Running') : updateRefileJobStatus('Paused')"
          />
          <q-btn
            no-caps
            unelevated
            color="positive"
            :label="refileJob.status == 'Created' ? 'Execute Refile Job' : 'Complete Job'"
            class="btn-no-wrap text-body1"
            :disabled="appIsOffline || appPendingSync || refileJob.status == 'Paused' || !allItemsRefiled"
            :loading="appActionIsLoadingData"
            @click="refileJob.status == 'Created' ? executeRefileJob() : showCompleteJobModal = true"
          />
        </div>
      </div>
      <MobileActionBar
        v-else-if="currentScreenSize == 'xs' && editJob"
        button-one-color="accent"
        :button-one-label="'Save Edits'"
        :button-one-outline="false"
        :button-one-loading="appActionIsLoadingData"
        @button-one-click="updateRefileJob"
        button-two-color="accent"
        :button-two-label="'Cancel'"
        :button-two-outline="true"
        @button-two-click="cancelRefileJobEdits"
      />
      <MobileActionBar
        v-else-if="refileJob.status !== 'Completed'"
        button-one-color="accent"
        :button-one-icon="refileJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
        :button-one-label="refileJob.status == 'Paused' ? 'Resume Job' : 'Pause Job'"
        :button-one-outline="true"
        :button-one-disabled="appPendingSync || refileJob.status == 'Created'"
        @button-one-click="refileJob.status == 'Paused' ? updateRefileJobStatus('Running') : updateRefileJobStatus('Paused')"
        button-two-color="positive"
        :button-two-label="refileJob.status == 'Created' ? 'Execute Refile Job' : 'Complete Job'"
        :button-two-outline="false"
        :button-two-disabled="appIsOffline || appPendingSync || refileJob.status == 'Paused' || !allItemsRefiled"
        :button-two-loading="appActionIsLoadingData"
        @button-two-click="refileJob.status == 'Created' ? executeRefileJob() : showCompleteJobModal = true"
      />
    </template>

    <template #table-content>
      <EssentialTable
        :table-columns="itemTableColumns"
        :table-visible-columns="itemTableVisibleColumns"
        :filter-options="itemTableFilters"
        :table-data="refileJob.refile_items"
        :enable-table-reorder="false"
        :enable-selection="false"
        :heading-row-class="'q-mb-lg q-px-xs-sm q-px-sm-md'"
        :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
        :highlight-row-class="'bg-color-green-light'"
        :highlight-row-key="'scanned_for_refile'"
        :highlight-row-value="true"
        @selected-table-row="loadRefileItem($event.id)"
      >
        <template #heading-row>
          <div class="col-xs-7 col-sm-5 q-mb-md-sm">
            <label class="text-h4 text-bold">
              Items in Job:
            </label>
          </div>
        </template>

        <template #table-td="{ colName, props, value }">
          <span
            v-if="colName == 'actions'"
          >
            <MoreOptionsMenu
              :options="[{ text: 'Revert Item to Queue', disabled: props.row.scanned_for_refile || refileJob.status == 'Paused' || refileJob.status == 'Completed' }]"
              class=""
              @click="handleOptionMenu($event, props.row)"
            />
          </span>
          <span
            v-else-if="colName == 'scanned_for_refile'"
            class="text-bold text-nowrap"
            :class="value == true ? 'text-positive' : ''"
          >
            {{ value == true ? 'Refiled' : '' }}
            <q-icon
              v-if="value == true"
              name="mdi-check-circle"
              color="positive"
              size="25px"
              class="text-bold q-ml-xs"
            />
          </span>
        </template>
      </EssentialTable>
    </template>
  </InfoDisplayLayout>

  <!-- complete job modal -->
  <PopupModal
    v-if="showCompleteJobModal"
    :title="'Confirm'"
    text="Are you sure you want to complete the job?"
    :show-actions="false"
    @reset="showCompleteJobModal = false"
    aria-label="confirmationModal"
  >
    <template #footer-content="{ hideModal }">
      <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
        <q-btn
          no-caps
          unelevated
          color="accent"
          label="Complete"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          @click="completeRefileJob(); hideModal();"
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

  <!-- refile item detail modal -->
  <RefileItemDetailModal
    v-if="showRefileItemDetailModal"
    @hide="showRefileItemDetailModal = false"
  />
</template>

<script setup>
import { onBeforeMount, onMounted, ref, inject, toRaw, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { useUserStore } from '@/stores/user-store'
import { useRefileStore } from '@/stores/refile-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import { useIndexDbHandler } from '@/composables/useIndexDbHandler.js'
import InfoDisplayLayout from '@/components/InfoDisplayLayout.vue'
import EssentialTable from '@/components/EssentialTable.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import SelectInput from '@/components/SelectInput.vue'
import PopupModal from '@/components/PopupModal.vue'
import RefileItemDetailModal from '@/components/Refile/RefileItemDetailModal.vue'

const router = useRouter()

// Composables
const { currentScreenSize } = useCurrentScreenSize()
const { compiledBarCode } = useBarcodeScanHandler()
const {
  addDataToIndexDb,
  getDataInIndexDb,
  deleteDataInIndexDb
} = useIndexDbHandler()

// Store Data
const {
  appIsLoadingData,
  appActionIsLoadingData,
  appPendingSync,
  appIsOffline
} = storeToRefs(useGlobalStore())
const { userData } = storeToRefs(useUserStore())
const { users } = storeToRefs(useOptionStore())
const {
  patchRefileJob,
  deleteRefileJobItem,
  getRefileJobItem
} = useRefileStore()
const {
  refileJob,
  originalRefileJob,
  allItemsRefiled,
  refileItem
} = storeToRefs(useRefileStore())

// Local Data
const editJob = ref(false)
const itemTableVisibleColumns = ref([
  'actions',
  'item_location',
  'tray_barcode',
  'barcode',
  'owner',
  'size_class',
  'scanned_for_refile'
])
const itemTableColumns = ref([
  {
    name: 'actions',
    field: 'actions',
    label: '',
    align: 'center',
    sortable: false,
    required: true
  },
  {
    name: 'item_location',
    field: row => row.item ? getItemLocation(row.item.tray) : getItemLocation(row.non_tray_item),
    label: 'Item Location',
    align: 'left',
    sortable: true
  },
  {
    name: 'tray_barcode',
    field: row => row.item?.tray?.barcode?.value,
    label: 'Tray Barcode',
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
    name: 'owner',
    field: row => row.item ? row.item?.owner?.name : row.non_tray_item?.owner?.name,
    label: 'Owner',
    align: 'left',
    sortable: true
  },
  {
    name: 'size_class',
    field: row => row.item ? row.item?.size_class?.name : row.non_tray_item?.size_class?.name,
    label: 'Size Class',
    align: 'left',
    sortable: true
  },
  {
    name: 'scanned_for_refile',
    field: 'scanned_for_refile',
    label: '',
    align: 'center',
    sortable: false,
    required: true,
    headerStyle: 'max-width: 200px'
  }
])
const itemTableFilters =  ref([
  {
    field: row => row.item ? row.item.size_class.name : row.non_tray_item.size_class.name,
    options: [
      {
        text: 'C High',
        value: false
      },
      {
        text: 'C Low',
        value: false
      }
    ]
  }
])
const showCompleteJobModal = ref(false)
const showRefileItemDetailModal = ref(false)

// Logic
const handleAlert = inject('handle-alert')
const formatDateTime = inject('format-date-time')
const getItemLocation = inject('get-item-location')

onBeforeMount(() => {
  if (currentScreenSize.value == 'xs') {
    itemTableVisibleColumns.value = [
      'actions',
      'item_location',
      'tray_barcode',
      'barcode',
      'scanned_for_refile'
    ]
  }
})

onMounted(async () => {
  // when user is online and loads a job we store the current refile job data and original in indexdb for reference offline
  if (!appIsOffline.value) {
    addDataToIndexDb('refileStore', 'refileJob', JSON.parse(JSON.stringify(refileJob.value)))
    addDataToIndexDb('refileStore', 'originalRefileJob', JSON.parse(JSON.stringify(originalRefileJob.value)))
  } else {
    // get saved refile job data if were offline and page was reloaded/refreshed
    const res = await getDataInIndexDb('refileStore')
    refileJob.value = res.data.refileJob
    originalRefileJob.value = res.data.originalRefileJob
  }
})

watch(compiledBarCode, (barcode) => {
  if (barcode !== '' && refileJob.value.status == 'Running' && !refileItem.value.id) {
    // only allow scans if the job is in a running state and there is no active refileItem set in state
    triggerItemScan(barcode)
  }
})
const triggerItemScan = (barcode_value) => {
  // check if the scanned barcode is in the item data and that the barcode hasnt been refiled already
  if (!refileJob.value.refile_items.some(itm => itm.item ? itm.item.barcode.value == barcode_value : itm.non_tray_item.barcode.value == barcode_value)) {
    handleAlert({
      type: 'error',
      text: 'The scanned item does not exist in this refile job. Please try again.',
      autoClose: true
    })
    return
  } else if (refileJob.value.refile_items.some(itm => itm.item ? itm.item.barcode.value == barcode_value && itm.scanned_for_refile : itm.non_tray_item.barcode.value == barcode_value && itm.scanned_for_refile)) {
    handleAlert({
      type: 'error',
      text: 'The scanned item has already been marked as refiled.',
      autoClose: true
    })
    return
  } else {
    // load the scanned request item by id of the scanned item barcode
    loadRefileItem(refileJob.value.refile_items.find(itm => itm.item ? itm.item.barcode.value == barcode_value : itm.non_tray_item.barcode.value == barcode_value)?.id)
  }
}

const handleOptionMenu = async (action, rowData) => {
  switch (action.text) {
  case 'Edit':
    editJob.value = true
    return
  case 'Revert Item to Queue':
    removeRefileItem(rowData.id)
    return
  }
}

const cancelRefileJobEdits = () => {
  refileJob.value = { ...toRaw(originalRefileJob.value) }
  editJob.value = false
}
const executeRefileJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: refileJob.value.id,
      status: 'Running',
      user_id: refileJob.value.user_id ? refileJob.value.user_id : userData.value.id,
      run_timestamp: new Date().toISOString()
    }
    await patchRefileJob(payload)

    // store the current refile job data in indexdb for reference offline whenever job is executed
    addDataToIndexDb('refileStore', 'refileJob', JSON.parse(JSON.stringify(refileJob.value)))
    addDataToIndexDb('refileStore', 'originalRefileJob', JSON.parse(JSON.stringify(originalRefileJob.value)))

    handleAlert({
      type: 'success',
      text: 'Refile Job Successfully Started',
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
const updateRefileJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: refileJob.value.id,
      user_id: refileJob.value.user_id,
      run_timestamp: new Date().toISOString()
    }
    await patchRefileJob(payload)

    handleAlert({
      type: 'success',
      text: 'The job has been updated.',
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
    editJob.value = false
  }
}
const updateRefileJobStatus = async (status) => {
  try {
    const payload = {
      id: refileJob.value.id,
      status,
      run_timestamp: new Date().toISOString()
    }
    await patchRefileJob(payload)

    if (appIsOffline.value) {
      // when offline we update the status directly
      refileJob.value.status = payload.status
      originalRefileJob.value.status = payload.status
    }

    // store the current refile job data in indexdb for reference offline whenever job is executed
    addDataToIndexDb('refileStore', 'refileJob', JSON.parse(JSON.stringify(refileJob.value)))
    addDataToIndexDb('refileStore', 'originalRefileJob', JSON.parse(JSON.stringify(originalRefileJob.value)))

    handleAlert({
      type: 'success',
      text: `Job Status has been updated to: ${status}`,
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  }
}
const completeRefileJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: refileJob.value.id,
      status: 'Completed',
      run_timestamp: new Date().toISOString()
    }
    await patchRefileJob(payload)

    handleAlert({
      type: 'success',
      text: 'The Refile Job has been completed.',
      autoClose: true
    })

    router.push({
      name: 'refile',
      params: {
        jobId: null
      }
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appActionIsLoadingData.value = false
    deleteDataInIndexDb('refileStore', 'refileJob')
    deleteDataInIndexDb('refileStore', 'originalRefileJob')
  }
}
const loadRefileItem = (itemId) => {
  // since we already have all the items data we just need to set the refileItem from the refileJob items directly
  getRefileJobItem(itemId)
  showRefileItemDetailModal.value = true
}
const removeRefileItem = async (itemId) => {
  try {
    appIsLoadingData.value = true
    await deleteRefileJobItem(itemId)

    if (appIsOffline.value) {
      // when offline we remove the refile item directly
      refileJob.value.refile_items = refileJob.value.refile_items.filter(r => r.id !== itemId)
      originalRefileJob.value.refile_items = originalRefileJob.value.refile_items.filter(r => r.id !== itemId)
    }

    // store the current refile job data in indexdb for reference offline whenever job is executed
    addDataToIndexDb('refileStore', 'refileJob', JSON.parse(JSON.stringify(refileJob.value)))
    addDataToIndexDb('refileStore', 'originalRefileJob', JSON.parse(JSON.stringify(originalRefileJob.value)))

    handleAlert({
      type: 'success',
      text: 'The item has been sent back to the refile queue.',
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
</script>

<style lang="scss" scoped>
</style>