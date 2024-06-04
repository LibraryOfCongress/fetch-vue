<template>
  <InfoDisplayLayout class="picklist-job">
    <template #number-box-content>
      <div class="flex q-mb-xs">
        <MoreOptionsMenu
          :options="[{ text: 'Edit', disabled: editJob || picklistJob.status == 'Paused' || picklistJob.status == 'Completed' }]"
          class="q-mr-xs"
          @click="handleOptionMenu"
        />
        <label
          id="picklistJobId"
          class="info-display-details-label text-h4"
        >
          Pick List #:
        </label>
      </div>
      <p class="info-display-number-box text-h4">
        {{ picklistJob.id }}
      </p>
    </template>

    <template #details-content>
      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="info-display-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="info-display-details-label-2 text-h6"
          >
            Building:
          </label>
          <p class="text-body1">
            {{ picklistJob.building?.name }}
          </p>
        </div>
      </div>
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
            {{ picklistJob.user?.first_name }}
          </p>
          <SelectInput
            v-else
            v-model="picklistJob.user_id"
            :options="users"
            option-type="users"
            option-value="id"
            option-label="first_name"
            aria-label="user"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  No Users Found
                </q-item-section>
              </q-item>
            </template>
          </SelectInput>
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
            {{ formatDateTime(picklistJob.create_dt).date }}
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
            class="text-body1 outline"
            :class="picklistJob.status == 'Completed' || picklistJob.status == 'Created' ? 'text-highlight' : picklistJob.status == 'Paused' || picklistJob.status == 'Running' ? 'text-highlight-warning' : picklistJob.status == 'New' ? 'text-highlight-accent' : null "
          >
            {{ picklistJob.status }}
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
            @click="updatePicklistJob"
          />
          <q-btn
            no-caps
            unelevated
            outline
            color="accent"
            label="Cancel"
            class="btn-no-wrap text-body1"
            @click="cancelPicklistJobEdits"
          />
        </div>
        <div
          v-else-if="picklistJob.status !== 'Completed'"
          class="info-display-details-action q-mt-sm-sm q-mt-md-md"
        >
          <q-btn
            v-if="picklistJob.status !== 'Created'"
            no-caps
            unelevated
            outline
            color="accent"
            :icon="picklistJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
            :label="picklistJob.status == 'Paused' ? 'Resume Job' : 'Pause Job'"
            class="btn-no-wrap text-body1 q-mr-sm"
            @click="picklistJob.status == 'Paused' ? updatePicklistJobStatus('Running') : updatePicklistJobStatus('Paused')"
          />
          <q-btn
            no-caps
            unelevated
            color="positive"
            :label="picklistJob.status == 'Created' ? 'Retrieve Pick List' : 'Complete Job'"
            class="btn-no-wrap text-body1"
            :disabled="picklistJob.status == 'Paused' || !allItemsRetrieved"
            :loading="appActionIsLoadingData"
            @click="picklistJob.status == 'Created' ? executePicklistJob() : showCompleteJobModal = true"
          />
        </div>
      </div>
      <MobileActionBar
        v-else-if="currentScreenSize == 'xs' && editJob"
        button-one-color="accent"
        :button-one-label="'Save Edits'"
        :button-one-outline="false"
        :button-one-loading="appActionIsLoadingData"
        @button-one-click="updatePicklistJob"
        button-two-color="accent"
        :button-two-label="'Cancel'"
        :button-two-outline="true"
        @button-two-click="cancelPicklistJobEdits"
      />
      <MobileActionBar
        v-else-if="picklistJob.status !== 'Completed'"
        button-one-color="accent"
        :button-one-icon="picklistJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
        :button-one-label="picklistJob.status == 'Paused' ? 'Resume Job' : 'Pause Job'"
        :button-one-outline="true"
        :button-one-disabled="picklistJob.status == 'Created'"
        @button-one-click="picklistJob.status == 'Paused' ? updatePicklistJobStatus('Running') : updatePicklistJobStatus('Paused')"
        button-two-color="positive"
        :button-two-label="picklistJob.status == 'Created' ? 'Retrieve Pick List' : 'Complete Job'"
        :button-two-outline="false"
        :button-two-disabled="picklistJob.status == 'Paused' || !allItemsRetrieved"
        :button-two-loading="appActionIsLoadingData"
        @button-two-click="picklistJob.status == 'Created' ? executePicklistJob() : showCompleteJobModal = true"
      />
    </template>

    <template #table-content>
      <EssentialTable
        :table-columns="itemTableColumns"
        :table-visible-columns="itemTableVisibleColumns"
        :filter-options="itemTableFilters"
        :table-data="picklistJob.requests"
        :enable-table-reorder="false"
        :enable-selection="false"
        :heading-row-class="'q-mb-lg q-px-xs-sm q-px-sm-md'"
        :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
        :highlight-row-class="'bg-color-green-light'"
        :highlight-row-key="'scanned_for_retrieval'"
        :highlight-row-value="true"
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
              :options="[{ text: 'Revert Item to Queue', disabled: props.row.scanned_for_retrieval || picklistJob.status == 'Paused' || picklistJob.status == 'Completed' }]"
              class=""
              @click="handleOptionMenu($event, props.row)"
            />
          </span>
          <span
            v-else-if="colName == 'scanned_for_retrieval'"
            class="text-bold text-nowrap"
            :class="value == true ? 'text-positive' : ''"
          >
            {{ value == true ? 'Retrieved' : '' }}
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
          @click="completePicklistJob(); hideModal();"
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
import { onBeforeMount, ref, inject, toRaw, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { useUserStore } from '@/stores/user-store'
import { usePicklistStore } from '@/stores/picklist-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
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

// Store Data
const { appActionIsLoadingData, appIsLoadingData } = storeToRefs(useGlobalStore())
const { userData } = storeToRefs(useUserStore())
const { users } = storeToRefs(useOptionStore())
const {
  patchPicklistJob,
  patchPicklistJobItemScanned,
  deletePicklistJobItem
} = usePicklistStore()
const {
  picklistJob,
  originalPicklistJob,
  allItemsRetrieved
} = storeToRefs(usePicklistStore())

// Local Data
const editJob = ref(false)
const itemTableVisibleColumns = ref([
  'actions',
  'item_location',
  'barcode',
  'owner',
  'size_class',
  'scanned_for_retrieval'
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
    name: 'scanned_for_retrieval',
    field: 'scanned_for_retrieval',
    label: '',
    align: 'center',
    sortable: false,
    required: true,
    headerStyle: 'width: 200px'
  }
])
const itemTableFilters =  ref([
  {
    field: row => row.size_class.name,
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

// Logic
const handleAlert = inject('handle-alert')
const formatDateTime = inject('format-date-time')
const getItemLocation = inject('get-item-location')

onBeforeMount(() => {
  if (currentScreenSize.value == 'xs') {
    itemTableVisibleColumns.value = [
      'actions',
      'barcode',
      'size_class',
      'item_location',
      'scanned_for_retrieval'
    ]
  }
})

watch(compiledBarCode, (barcode) => {
  if (barcode !== '' && picklistJob.value.status == 'Running') {
    // only allow scans if the picklist job is in a running state
    triggerItemScan(barcode)
  }
})
const triggerItemScan = (barcode_value) => {
  // check if the scanned barcode is in the item data and that the barcode hasnt been retrieved already
  if (!picklistJob.value.requests.some(itm => itm.item ? itm.item.barcode.value == barcode_value : itm.non_tray_item.barcode.value == barcode_value)) {
    handleAlert({
      type: 'error',
      text: 'The scanned item does not exist in this pick list job. Please try again.',
      autoClose: true
    })
    return
  } else if (picklistJob.value.requests.some(itm => itm.item ? itm.item.barcode.value == barcode_value && itm.scanned_for_retrieval : itm.non_tray_item.barcode.value == barcode_value && itm.scanned_for_retrieval)) {
    handleAlert({
      type: 'error',
      text: 'The scanned item has already been marked as retrieved.',
      autoClose: true
    })
    return
  } else {
    // update the scanned request item to retrieved
    updatePicklistItem(barcode_value)
  }
}

const handleOptionMenu = async (action, rowData) => {
  switch (action.text) {
  case 'Edit':
    editJob.value = true
    return
  case 'Revert Item to Queue':
    removePicklistItem(rowData.id)
    return
  }
}

const cancelPicklistJobEdits = () => {
  picklistJob.value = { ...toRaw(originalPicklistJob.value) }
  editJob.value = false
}
const executePicklistJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: picklistJob.value.id,
      status: 'Running',
      user_id: picklistJob.value.user_id ? picklistJob.value.user_id : userData.value.id,
      run_timestamp: new Date().toISOString()
    }
    await patchPicklistJob(payload)

    handleAlert({
      type: 'success',
      text: 'Pick List Job Successfully Started',
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
const updatePicklistJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: picklistJob.value.id,
      user_id: picklistJob.value.user_id,
      run_timestamp: new Date().toISOString()
    }
    await patchPicklistJob(payload)

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
const updatePicklistJobStatus = async (status) => {
  try {
    const payload = {
      id: picklistJob.value.id,
      status,
      run_timestamp: new Date().toISOString()
    }
    await patchPicklistJob(payload)

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
const completePicklistJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: picklistJob.value.id,
      status: 'Completed',
      run_timestamp: new Date().toISOString()
    }
    await patchPicklistJob(payload)

    handleAlert({
      type: 'success',
      text: 'The Pick List Job has been completed.',
      autoClose: true
    })

    router.push({
      name: 'picklist',
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
  }
}
const removePicklistItem = async (itemId) => {
  try {
    appIsLoadingData.value = true
    await deletePicklistJobItem(itemId)
    handleAlert({
      type: 'success',
      text: `${itemId} has been sent back to the request queue.`,
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
const updatePicklistItem = async (barcode_value) => {
  try {
    const pickListItemToUpdate = picklistJob.value.requests.find(itm => itm.item ? itm.item.barcode.value == barcode_value : itm.non_tray_item.barcode.value == barcode_value)
    const payload = {
      id: picklistJob.value.id,
      request_id: pickListItemToUpdate.id,
      scanned_for_retrieval: true,
      run_timestamp: new Date().toISOString()
    }
    await patchPicklistJobItemScanned(payload)

    // update the item directly in the picklist job and set it to retrieved
    pickListItemToUpdate.scanned_for_retrieval = true
    originalPicklistJob.value = { ...toRaw(picklistJob.value) }
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
</style>