<template>
  <div class="shelving-job">
    <div class="row justify-between q-mt-xs-md q-mt-md-xl q-mx-xs-sm q-mx-sm-md">
      <div class="col-xs-12 col-md-12 col-lg-3">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-lg-lg">
          <div class="flex">
            <MoreOptionsMenu
              :options="[{ text: 'Edit', disabled: appIsOffline || editJob || shelvingJob.status == 'Paused' }, { text: 'Print Job' }]"
              class="q-mr-xs"
              @click="handleOptionMenu"
            />
            <label
              id="jobNumber"
              class="shelving-job-details-label text-h4 text-bold"
            >
              Job Number:
            </label>
          </div>
          <p class="shelving-job-number-box text-h4 q-pa-md">
            {{ shelvingJob.id }}
          </p>
        </div>
      </div>

      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="shelving-job-details-label-2 text-h6 text-bold"
          >
            Building:
          </label>
          <p class="text-body1">
            {{ shelvingJob.building?.name }}
          </p>
        </div>
      </div>

      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="shelving-job-details-label-2 text-h6 text-bold"
          >
            Assigned User:
          </label>
          <p
            v-if="!editJob"
            class="text-body1"
          >
            {{ shelvingJob.user?.name }}
          </p>
          <SelectInput
            v-else
            v-model="shelvingJob.user_id"
            :options="users"
            option-value="id"
            option-label="name"
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
        <div class="shelving-job-details q-mb-xs-none q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="shelving-job-details-label-2 text-h6 text-bold"
          >
            Date Created:
          </label>
          <p class="text-body1">
            {{ formatDateTime(shelvingJob.create_dt).date }}
          </p>
        </div>
      </div>

      <div class="col-xs-6 col-sm-auto col-md-auto q-mr-auto">
        <div class="shelving-job-details q-mb-xs-none q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-sm">
          <label
            class="shelving-job-details-label-2 text-h6 text-bold"
          >
            Status:
          </label>
          <p
            class="text-body1"
            :class="shelvingJob.status == 'Created' || shelvingJob.status == 'Running' ? 'outline text-highlight' : shelvingJob.status == 'Paused' ? 'outline text-highlight-yellow' : null"
          >
            {{ shelvingJob.status }}
          </p>
        </div>
      </div>

      <div
        v-if="currentScreenSize !== 'xs'"
        class="col-sm-12 col-md-12 col-lg-3 q-ml-auto"
      >
        <div
          v-if="editJob"
          class="shelving-job-details-action q-mt-sm-sm q-mt-md-md"
        >
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Save Edits"
            class="btn-no-wrap text-body1 q-mr-sm"
            :loading="appActionIsLoadingData"
            @click="updateShelvingJob"
          />
          <q-btn
            no-caps
            unelevated
            outline
            color="accent"
            label="Cancel"
            class="btn-no-wrap text-body1"
            @click="cancelShelvingJobEdits"
          />
        </div>
        <div
          v-else
          class="shelving-job-details-action q-mt-sm-sm q-mt-md-md"
        >
          <q-btn
            v-if="shelvingJob.status !== 'Created'"
            no-caps
            unelevated
            outline
            color="accent"
            :icon="shelvingJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
            :label="shelvingJob.status == 'Paused' ? 'Resume Job' : 'Pause Job'"
            class="btn-no-wrap text-body1 q-mr-sm"
            @click="shelvingJob.status == 'Paused' ? updateShelvingJobStatus('Running') : updateShelvingJobStatus('Paused')"
          />
          <q-btn
            no-caps
            unelevated
            color="positive"
            :label="shelvingJob.status == 'Created' ? 'Execute Job' : 'Complete Job'"
            class="btn-no-wrap text-body1"
            :disabled="appIsOffline || shelvingJob.status == 'Paused' || !allContainersShelved"
            :loading="appActionIsLoadingData"
            @click="shelvingJob.status == 'Created' ? executeShelvingJob() : completeShelvingJob()"
          />
        </div>
      </div>
      <MobileActionBar
        v-else-if="currentScreenSize == 'xs' && editJob"
        button-one-color="accent"
        :button-one-label="'Save Edits'"
        :button-one-outline="false"
        :button-one-loading="appActionIsLoadingData"
        @button-one-click="updateShelvingJob"
        button-two-color="accent"
        :button-two-label="'Cancel'"
        :button-two-outline="true"
        @button-two-click="cancelShelvingJobEdits"
      />
      <MobileActionBar
        v-else
        button-one-color="accent"
        :button-one-icon="shelvingJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
        :button-one-label="shelvingJob.status == 'Paused' ? 'Resume Job' : 'Pause Job'"
        :button-one-outline="true"
        :button-one-disabled="shelvingJob.status == 'Created'"
        @button-one-click="shelvingJob.status == 'Paused' ? updateShelvingJobStatus('Running') : updateShelvingJobStatus('Paused')"
        button-two-color="positive"
        :button-two-label="shelvingJob.status == 'Created' ? 'Execute Job' : 'Complete Job'"
        :button-two-outline="false"
        :button-two-disabled="appIsOffline || shelvingJob.status == 'Paused' || !allContainersShelved"
        :button-two-loading="appActionIsLoadingData"
        @button-two-click="shelvingJob.status == 'Created' ? executeShelvingJob() : completeShelvingJob()"
      />
    </div>

    <q-space class="divider q-my-xs-lg q-my-md-xl" />

    <div class="row">
      <div class="col-grow">
        <EssentialTable
          :table-columns="shelfTableColumns"
          :table-visible-columns="shelfTableVisibleColumns"
          :filter-options="shelfTableFilters"
          :table-data="shelvingJobContainers"
          :row-key="'barcode.value'"
          :hide-table-rearrange="false"
          :heading-row-class="'q-mb-lg q-px-xs-sm q-px-sm-md'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
        >
          <template #heading-row>
            <div
              class="col-xs-12 col-sm-grow q-mr-auto"
            >
              <label class="text-h4 text-bold">
                Containers in Job:
              </label>
            </div>
          </template>

          <template #table-td="{ colName, props, value }">
            <span
              v-if="colName == 'actions'"
            >
              <MoreOptionsMenu
                :options="[{ text: 'Edit Location', disabled: shelvingJob.status == 'Paused' }]"
                class=""
                @click="handleOptionMenu($event, props.row)"
              />
            </span>
            <span
              v-if="colName == 'verified'"
              class="text-bold text-nowrap"
              :class="value == true ? 'text-positive' : ''"
            >
              {{ value == true ? 'Shelved' : '' }}
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
      </div>
    </div>

    <!-- Edit Location Form Modal -->
    <ShelvingJobDetailsEditLocationModal
      v-if="showShelvingLocationModal"
      ref="locationModalComponent"
      @hide="showShelvingLocationModal = false"
    />

    <!-- scan container note -->
    <PopupModal
      v-if="showScanContainerNote"
      title="Be Aware"
      text="Scan the containers to begin the shelving process. (the process can be done offline)"
      :show-actions="false"
    >
      <template #footer-content="{ hideModal }">
        <q-card-section
          class="row no-wrap justify-between items-center q-pt-sm"
        >
          <q-btn
            outline
            no-caps
            color="accent"
            label="Confirm"
            class="text-body1 full-width"
            @click="hideModal"
          />
        </q-card-section>
      </template>
    </PopupModal>

    <!-- scan container modal -->
    <ShelvingJobDetailsScanContainerModal
      v-if="showScanContainerModal"
      @hide="showScanContainerModal = false"
    />
  </div>

  <!-- print component: shelving job report -->
  <ShelvingBatchSheet
    ref="batchSheetComponent"
    :shelving-job-details="shelvingJob"
  />
</template>

<script setup>
import { ref, inject, onBeforeMount, toRaw, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGlobalStore } from '@/stores/global-store'
import { useUserStore } from '@/stores/user-store'
import { useShelvingStore } from '@/stores/shelving-store'
import { useOptionStore } from '@/stores/option-store'
import { useBuildingStore } from '@/stores/building-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import EssentialTable from '@/components/EssentialTable.vue'
import SelectInput from '@/components/SelectInput.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'
import PopupModal from '@/components/PopupModal.vue'
import ShelvingBatchSheet from '@/components/Shelving/ShelvingBatchSheet.vue'
import ShelvingJobDetailsEditLocationModal from '@/components/Shelving/ShelvingJobDetailsEditLocationModal.vue'
import ShelvingJobDetailsScanContainerModal from '@/components/Shelving/ShelvingJobDetailsScanContainerModal.vue'

const router = useRouter()
const route = useRoute()

// Compasables
const { currentScreenSize } = useCurrentScreenSize()
const { compiledBarCode } = useBarcodeScanHandler()

// // Store Data
const {
  appActionIsLoadingData,
  appIsOffline
} = storeToRefs(useGlobalStore())
const { userData } = storeToRefs(useUserStore())
const {
  getBuildingDetails,
  getModuleDetails,
  getAisleDetails,
  getLadderDetails
} = useBuildingStore()
const {
  patchShelvingJob,
  getShelvingJobContainer
} = useShelvingStore()
const {
  shelvingJob,
  originalShelvingJob,
  shelvingJobContainers,
  shelvingJobContainer,
  allContainersShelved
} = storeToRefs(useShelvingStore())
const { users } = storeToRefs(useOptionStore())

// Local Data
const batchSheetComponent = ref(null)
const locationModalComponent = ref(null)
const editJob = ref(false)
const shelfTableColumns = ref([
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
    field: row => row.barcode.value,
    label: 'Barcode',
    align: 'left',
    sortable: true,
    order: 1
  },
  {
    name: 'owner',
    field: row => row.owner?.name,
    label: 'Owner',
    align: 'left',
    sortable: true,
    order: 2
  },
  {
    name: 'size_class',
    field: row => row.size_class?.name,
    label: 'Size Class',
    align: 'left',
    sortable: true,
    order: 3
  },
  {
    name: 'module',
    field: row => row.shelf_position?.shelf?.ladder?.side?.aisle?.module?.module_number?.number,
    label: 'Module',
    align: 'left',
    sortable: true,
    order: 4
  },
  {
    name: 'aisle',
    field: row => row.shelf_position?.shelf?.ladder?.side?.aisle?.aisle_number?.number,
    label: 'Aisle',
    align: 'left',
    sortable: true,
    order: 5
  },
  {
    name: 'side',
    field: row => row.shelf_position?.shelf?.ladder?.side?.side_orientation?.name,
    label: 'Side',
    align: 'left',
    sortable: true,
    order: 6
  },
  {
    name: 'ladder',
    field: row => row.shelf_position?.shelf?.ladder?.ladder_number?.number,
    label: 'Ladder',
    align: 'left',
    sortable: true,
    order: 7
  },
  {
    name: 'shelf',
    field: row => row.shelf_position?.shelf?.barcode?.value,
    label: 'Shelf',
    align: 'left',
    sortable: true,
    order: 8
  },
  {
    name: 'shelf_position',
    field: row => row.shelf_position?.shelf_position_number?.number,
    label: 'Shelf Position',
    align: 'left',
    sortable: true,
    order: 9
  },
  {
    name: 'verified',
    field: 'verified',
    label: '',
    align: 'center',
    sortable: false,
    required: true,
    order: 10
  }
])
const shelfTableVisibleColumns = ref([
  'actions',
  'barcode',
  'owner',
  'size_class',
  'module',
  'aisle',
  'side',
  'ladder',
  'shelf',
  'shelf_position',
  'verified'
])
const shelfTableFilters = ref([
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
const showShelvingLocationModal = ref(false)
const showScanContainerNote = ref(false)
const showScanContainerModal = ref(false)

// Logic
const formatDateTime = inject('format-date-time')
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  if (currentScreenSize.value == 'xs') {
    shelfTableVisibleColumns.value = [
      'actions',
      'barcode',
      'shelf',
      'shelf_position',
      'verified'
    ]
  }
})

watch(compiledBarCode, (barcode) => {
  if (barcode !== '' && shelvingJob.value.status == 'Running' && !shelvingJobContainer.value.item_id) {
    // only allow scans if the shelving job is in a running state
    triggerContainerScan(barcode)
  }
})
const triggerContainerScan = (barcode_value) => {
  // check if the scanned barcode is in the containers data and that the barcode hasnt been shevled/verified already
  if (!shelvingJobContainers.value.some(c => c.barcode.value == barcode_value)) {
    handleAlert({
      type: 'error',
      text: 'The scanned container does not exist in this shelving job. Please try again.',
      autoClose: true
    })
    return
  } else if (shelvingJobContainers.value.some(c => c.barcode.value == barcode_value && c.verified)) {
    handleAlert({
      type: 'error',
      text: 'The scanned container has already been marked as shelved.',
      autoClose: true
    })
    return
  } else {
    // load the matching containers info directly from the shelvingJob data
    getShelvingJobContainer(barcode_value)
    showScanContainerModal.value = true
  }
}

const handleOptionMenu = async (action, rowData) => {
  // if the rowData contains a building_id we can get the details to populate all the related fields
  if (rowData && rowData.building_id) {
    await Promise.all([
      getBuildingDetails(rowData.building_id),
      getModuleDetails(rowData.module_id),
      getAisleDetails(rowData.aisle_id),
      // getSideDetails(rowData.side_id) //TODO: do we need to get side details in order to get ladders?
      getLadderDetails(rowData.ladder_id)
    ])
  }

  switch (action.text) {
  case 'Edit Location':
    showShelvingLocationModal.value = true
    await nextTick()
    locationModalComponent.value.locationForm.item_id = rowData.id
    locationModalComponent.value.locationForm.owner_id = rowData.owner?.id
    locationModalComponent.value.locationForm.size_class_id = rowData.size_class?.id
    locationModalComponent.value.locationForm.building_id = shelvingJob.value.building_id,
    locationModalComponent.value.locationForm.module_id = rowData.shelf_position?.shelf?.ladder?.side?.aisle?.module?.id
    locationModalComponent.value.locationForm.aisle_id = rowData.shelf_position?.shelf?.ladder?.side?.aisle?.id
    locationModalComponent.value.locationForm.side_id = rowData.shelf_position?.shelf?.ladder?.side?.id
    locationModalComponent.value.locationForm.ladder_id = rowData.shelf_position?.shelf?.ladder?.id
    locationModalComponent.value.locationForm.shelf_id = rowData.shelf_position?.shelf?.id
    locationModalComponent.value.locationForm.shelf_position_id = rowData.shelf_position_id
    return
  case 'Edit':
    editJob.value = true
    return
  case 'Print Job':
    batchSheetComponent.value.printBatchReport()
    return
  }
}

const cancelShelvingJobEdits = () => {
  shelvingJob.value = { ...toRaw(originalShelvingJob.value) }
  editJob.value = false
}
const executeShelvingJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: route.params.jobId,
      status: 'Running',
      user_id: shelvingJob.value.user_id ? shelvingJob.value.user_id : userData.value.id
    }
    await patchShelvingJob(payload)

    handleAlert({
      type: 'success',
      text: 'Shelving Job Successfully Started',
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
    showScanContainerNote.value = true
  }
}
const updateShelvingJobStatus = async (status) => {
  try {
    const payload = {
      id: route.params.jobId,
      status
    }

    await patchShelvingJob(payload)

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
const updateShelvingJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: route.params.jobId,
      user_id: shelvingJob.value.user_id
    }
    await patchShelvingJob(payload)

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
const completeShelvingJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: route.params.jobId,
      status: 'Completed'
    }
    await patchShelvingJob(payload)

    handleAlert({
      type: 'success',
      text: 'The Shelving Job has been completed.',
      autoClose: true
    })

    router.push({
      name: 'shelving',
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
</script>

<style lang="scss" scoped>
.shelving-job {
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
        margin-top: 2rem;

        @media (max-width: $breakpoint-sm-max) {
          margin-top: 0;
        }
      }
    }

    &-action {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
    }
  }
}
</style>