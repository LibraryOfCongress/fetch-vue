<template>
  <InfoDisplayLayout class="withdrawal-job">
    <template #number-box-content>
      <div class="flex q-mb-xs no-wrap">
        <MoreOptionsMenu
          :options="[
            { text: 'Edit', disabled: appIsOffline || editJob || withdrawJob.status == 'Paused' || withdrawJob.status == 'Completed' },
            { text: 'Delete Job', optionClass: 'text-negative', disabled: appIsOffline || editJob || withdrawJob.status == 'Completed' || withdrawJobItems.some(itm => itm.status !== 'Out')}
          ]"
          class="q-mr-xs"
          @click="handleOptionMenu"
        />
        <label
          id="withdrawJobId"
          class="info-display-details-label text-h4"
        >
          Withdraw Job:
        </label>
      </div>
      <p class="info-display-number-box text-h4">
        {{ withdrawJob.id }}
      </p>
    </template>

    <template #details-content>
      <div class="col-xs-6 col-sm-6 col-md-grow q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
        <div class="info-display-details">
          <label
            class="info-display-details-label-2 text-h6"
          >
            Assigned User:
          </label>
          <p
            v-if="!editJob"
            class="text-body1"
          >
            {{ withdrawJob.assigned_user?.first_name }}
          </p>
          <SelectInput
            v-else
            v-model="withdrawJob.assigned_user_id"
            :options="users"
            option-type="users"
            option-value="id"
            option-label="first_name"
            aria-label="user"
            class="q-pr-xs-sm q-pr-md-none"
          />
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-grow q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
        <div class="info-display-details">
          <label
            class="info-display-details-label-2 text-h6"
          >
            # of Items:
          </label>
          <p class="text-body1">
            {{ withdrawJobItems.length }}
          </p>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-grow q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
        <div class="info-display-details">
          <label
            class="info-display-details-label-2 text-h6"
          >
            Date Created
          </label>
          <p class="text-body1">
            {{ formatDateTime(withdrawJob.create_dt).date }}
          </p>
        </div>
      </div>
      <div class="col-xs-6 col-sm-auto col-md-auto q-mb-xs-none q-mb-sm-md q-mb-md-none q-mr-sm-auto">
        <div class="info-display-details">
          <label
            class="info-display-details-label-2 text-h6"
          >
            Status
          </label>
          <p
            class="text-body1 text-center outline"
            :class="withdrawJob.status == 'Completed' || withdrawJob.status == 'Created' ? 'text-highlight' : withdrawJob.status == 'Paused' || withdrawJob.status == 'Running' ? 'text-highlight-warning' : null "
          >
            {{ withdrawJob.status }}
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
            @click="updateWithdrawJob"
          />
          <q-btn
            no-caps
            unelevated
            outline
            color="accent"
            label="Cancel"
            class="btn-no-wrap text-body1"
            @click="cancelWithdrawJobEdits"
          />
        </div>
        <div
          v-else-if="withdrawJob.status !== 'Completed'"
          class="info-display-details-action q-mt-sm-sm q-mt-md-md"
        >
          <q-btn
            v-if="withdrawJob.status !== 'Created'"
            no-caps
            unelevated
            outline
            color="accent"
            :icon="withdrawJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
            :label="withdrawJob.status == 'Paused' ? 'Resume Job' : 'Pause Job'"
            class="btn-no-wrap text-body1 q-mr-sm"
            :disabled="appPendingSync"
            @click="withdrawJob.status == 'Paused' ? updateWithdrawJobStatus('Running') : updateWithdrawJobStatus('Paused')"
          />
          <q-btn
            no-caps
            unelevated
            color="positive"
            :label="withdrawJob.status == 'Created' ? 'Withdraw Items' : 'Complete Job'"
            class="btn-no-wrap text-body1"
            :disabled="appIsOffline || appPendingSync || withdrawJob.status == 'Paused' || !allItemsWithdrawn"
            :loading="appActionIsLoadingData"
            @click="withdrawJob.status == 'Created' ? executeWithdrawJob() : showConfirmationModal = 'CompleteJob'"
          />
        </div>
      </div>
      <MobileActionBar
        v-else-if="currentScreenSize == 'xs' && editJob"
        button-one-color="accent"
        :button-one-label="'Save Edits'"
        :button-one-outline="false"
        :button-one-loading="appActionIsLoadingData"
        @button-one-click="updateWithdrawJob"
        button-two-color="accent"
        :button-two-label="'Cancel'"
        :button-two-outline="true"
        @button-two-click="cancelWithdrawJobEdits"
      />
      <MobileActionBar
        v-else-if="withdrawJob.status !== 'Completed'"
        button-one-color="accent"
        :button-one-icon="withdrawJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
        :button-one-label="withdrawJob.status == 'Paused' ? 'Resume Job' : 'Pause Job'"
        :button-one-outline="true"
        :button-one-disabled="appPendingSync || withdrawJob.status == 'Created'"
        @button-one-click="withdrawJob.status == 'Paused' ? updateWithdrawJobStatus('Running') : updateWithdrawJobStatus('Paused')"
        button-two-color="positive"
        :button-two-label="withdrawJob.status == 'Created' ? 'Withdraw Items' : 'Complete Job'"
        :button-two-outline="false"
        :button-two-disabled="appIsOffline || appPendingSync || withdrawJob.status == 'Paused' || !allItemsWithdrawn"
        :button-two-loading="appActionIsLoadingData"
        @button-two-click="withdrawJob.status == 'Created' ? executeWithdrawJob() : showConfirmationModal = 'CompleteJob'"
      />
    </template>

    <template #table-content>
      <EssentialTable
        :table-columns="itemTableColumns"
        :table-visible-columns="itemTableVisibleColumns"
        :filter-options="itemTableFilters"
        :table-data="withdrawJobItems"
        :row-key="'id'"
        :enable-table-reorder="false"
        :enable-selection="false"
        :heading-row-class="'q-mb-lg q-px-xs-sm q-px-sm-md'"
        :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
        :highlight-row-class="'bg-color-green-light'"
        :highlight-row-key="'status'"
        :highlight-row-value="'Withdrawn'"
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
              :options="[{ text: 'Remove Item', disabled: props.row.status == 'Withdrawn' || withdrawJob.status == 'Paused' || withdrawJob.status == 'Completed' }]"
              class=""
              @click="handleOptionMenu($event, props.row)"
            />
          </span>
          <span
            v-else-if="colName == 'status'"
            class="text-nowrap outline"
            :class="value == 'Withdrawn' ? 'text-positive' : 'text-highlight-negative'"
          >
            {{ value == 'Withdrawn' ? 'Withdrawn' : value }}
            <q-icon
              v-if="value == 'Withdrawn'"
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

  <!-- confirmation modal -->
  <PopupModal
    v-if="showConfirmationModal"
    :title="showConfirmationModal == 'CompleteJob' ? 'Confirm' : 'Delete'"
    :text="showConfirmationModal == 'CompleteJob' ? 'Are you sure you want to complete the job?' : 'Are you sure you want to delete the job?'"
    :show-actions="false"
    @reset="showConfirmationModal = null"
    aria-label="confirmationModal"
  >
    <template #footer-content="{ hideModal }">
      <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
        <q-btn
          v-if="showConfirmationModal == 'CompleteJob'"
          no-caps
          unelevated
          color="accent"
          label="Complete"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          @click="completeWithdrawJob(); hideModal();"
        />
        <q-btn
          v-else
          no-caps
          unelevated
          color="negative"
          label="Delete Job"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          @click="cancelWithdrawJob(); hideModal();"
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
</template>

<script setup>
import { onBeforeMount, onMounted, ref, inject, toRaw, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { useUserStore } from '@/stores/user-store'
import { useWithdrawalStore } from '@/stores/withdrawal-store'
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
  patchWithdrawJob,
  deleteWithdrawJob,
  patchWithdrawJobItemScanned,
  deleteWithdrawJobItems
} = useWithdrawalStore()
const {
  withdrawJob,
  originalWithdrawJob,
  withdrawJobItems,
  allItemsWithdrawn
} = storeToRefs(useWithdrawalStore())

// Local Data
const editJob = ref(false)
const itemTableVisibleColumns = ref([
  'actions',
  'shelf_barcode',
  'tray_barcode',
  'barcode',
  'owner',
  'status'
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
    name: 'shelf_barcode',
    field: row => row.tray ? row.tray?.shelf_position?.shelf?.barcode?.value : row.shelf_position?.shelf?.barcode?.value,
    label: 'Shelf Barcode',
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
    name: 'barcode',
    field: row => row.barcode?.value,
    label: 'Barcode',
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
    name: 'status',
    field: 'status',
    label: 'Item Status',
    align: 'left',
    sortable: false
  }
])
const itemTableFilters =  ref([
  {
    field: row => row.owner.name,
    options: [
      {
        text: 'John Doe',
        value: false
      },
      {
        text: 'Abraham Lincoln',
        value: false
      }
    ]
  }
])
const showConfirmationModal = ref(null)

// Logic
const handleAlert = inject('handle-alert')
const formatDateTime = inject('format-date-time')

onBeforeMount(() => {
  if (currentScreenSize.value == 'xs') {
    itemTableVisibleColumns.value = [
      'actions',
      'shelf_barcode',
      'tray_barcode',
      'barcode',
      'status'
    ]
  }
})

onMounted(async () => {
  // when user is online and loads a job we store the current withdraw job data and original in indexdb for reference offline
  if (!appIsOffline.value) {
    addDataToIndexDb('withdrawalStore', 'withdrawJob', JSON.parse(JSON.stringify(withdrawJob.value)))
    addDataToIndexDb('withdrawalStore', 'originalWithdrawJob', JSON.parse(JSON.stringify(originalWithdrawJob.value)))
  } else {
    // get saved withdraw job data if were offline and page was reloaded/refreshed
    const res = await getDataInIndexDb('withdrawalStore')
    withdrawJob.value = res.data.withdrawJob
    originalWithdrawJob.value = res.data.originalWithdrawJob
  }
})

watch(compiledBarCode, (barcode) => {
  if (barcode !== '' && withdrawJob.value.status == 'Running') {
    // only allow scans if the job is in a running state
    triggerItemScan(barcode)
  }
})
const triggerItemScan = (barcode_value) => {
  // check if the scanned barcode is in the item table and that the barcode hasnt been withdrawn already
  if (!withdrawJobItems.value.some(itm => itm.barcode.value == barcode_value)) {
    handleAlert({
      type: 'error',
      text: 'The scanned item does not exist in this withdraw job. Please try again.',
      autoClose: true
    })
    return
  } else if (withdrawJobItems.value.some(itm => itm.barcode.value == barcode_value && itm.status == 'Withdrawn')) {
    handleAlert({
      type: 'error',
      text: 'The scanned item has already been marked as withdrawn.',
      autoClose: true
    })
    return
  } else {
    // set the scanned items status to withdrawn
    updateWithdrawItemScanned(barcode_value)
  }
}

const handleOptionMenu = async (action, rowData) => {
  switch (action.text) {
  case 'Edit':
    editJob.value = true
    return
  case 'Delete Job':
    showConfirmationModal.value = 'DeleteJob'
    return
  case 'Remove Item':
    removeWithdrawItems([rowData.barcode.value])
    return
  }
}

const cancelWithdrawJobEdits = () => {
  withdrawJob.value = { ...toRaw(originalWithdrawJob.value) }
  editJob.value = false
}
const executeWithdrawJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: withdrawJob.value.id,
      status: 'Running',
      assigned_user_id: withdrawJob.value.assigned_user_id ? withdrawJob.value.assigned_user_id : userData.value.id,
      run_timestamp: new Date().toISOString()
    }
    await patchWithdrawJob(payload)

    // store the current withdraw job data in indexdb for reference offline whenever job is executed
    addDataToIndexDb('withdrawalStore', 'withdrawJob', JSON.parse(JSON.stringify(withdrawJob.value)))
    addDataToIndexDb('withdrawalStore', 'originalWithdrawJob', JSON.parse(JSON.stringify(originalWithdrawJob.value)))

    handleAlert({
      type: 'success',
      text: 'Withdraw Job Successfully Started',
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
const updateWithdrawJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: withdrawJob.value.id,
      assigned_user_id: withdrawJob.value.assigned_user_id,
      run_timestamp: new Date().toISOString()
    }
    await patchWithdrawJob(payload)

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
const updateWithdrawJobStatus = async (status) => {
  try {
    const payload = {
      id: withdrawJob.value.id,
      status,
      run_timestamp: new Date().toISOString()
    }
    await patchWithdrawJob(payload)

    if (appIsOffline.value) {
      // when offline we update the status directly
      withdrawJob.value.status = payload.status
      originalWithdrawJob.value.status = payload.status
    }

    // store the current withdraw job data in indexdb for reference offline whenever job is executed
    addDataToIndexDb('withdrawalStore', 'withdrawJob', JSON.parse(JSON.stringify(withdrawJob.value)))
    addDataToIndexDb('withdrawalStore', 'originalWithdrawJob', JSON.parse(JSON.stringify(originalWithdrawJob.value)))

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
const cancelWithdrawJob = async () => {
  try {
    appIsLoadingData.value = true
    await deleteWithdrawJob(withdrawJob.value.id)

    handleAlert({
      type: 'success',
      text: 'The Withdraw Job has been canceled.',
      autoClose: true
    })

    router.push({
      name: 'withdrawal',
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
    appIsLoadingData.value = false
    deleteDataInIndexDb('withdrawalStore', 'withdrawJob')
    deleteDataInIndexDb('withdrawalStore', 'originalWithdrawJob')
  }
}
const completeWithdrawJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: withdrawJob.value.id,
      status: 'Completed',
      run_timestamp: new Date().toISOString()
    }
    await patchWithdrawJob(payload)

    handleAlert({
      type: 'success',
      text: 'The Withdraw Job has been completed.',
      autoClose: true
    })

    router.push({
      name: 'withdrawal',
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
    deleteDataInIndexDb('withdrawalStore', 'withdrawJob')
    deleteDataInIndexDb('withdrawalStore', 'originalWithdrawJob')
  }
}
const updateWithdrawItemScanned = (barcode_value) => {
  // since we already have all the items data we just need to set the withdraw item from the withdrawalJob items directly
  patchWithdrawJobItemScanned(barcode_value)
}
const removeWithdrawItems = async (barcode_values) => {
  try {
    appIsLoadingData.value = true
    const payload = {
      barcode_values
    }
    await deleteWithdrawJobItems(payload)

    if (appIsOffline.value) {
      // when offline we remove the withdraw items directly by filtering out the matching barcodes in either items or nonTrayItems
      withdrawJob.value.items = withdrawJob.value.items.filter(itm => !barcode_values.includes(itm.barcode.value))
      withdrawJob.value.non_tray_items = withdrawJob.value.non_tray_items.filter(itm => !barcode_values.includes(itm.barcode.value))
      originalWithdrawJob.value.items = originalWithdrawJob.value.items.filter(itm => !barcode_values.includes(itm.barcode.value))
      originalWithdrawJob.value.non_tray_items = originalWithdrawJob.value.non_tray_items.filter(itm => !barcode_values.includes(itm.barcode.value))
    }

    // store the current withdraw job data in indexdb for reference offline whenever job is executed
    addDataToIndexDb('withdrawalStore', 'withdrawJob', JSON.parse(JSON.stringify(withdrawJob.value)))
    addDataToIndexDb('withdrawalStore', 'originalWithdrawJob', JSON.parse(JSON.stringify(originalWithdrawJob.value)))

    handleAlert({
      type: 'success',
      text: 'The item has been removed from the job.',
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