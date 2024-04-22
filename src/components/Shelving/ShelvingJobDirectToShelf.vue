<template>
  <div class="shelving-job">
    <div class="row justify-between q-mt-xs-md q-mt-md-xl q-mx-xs-sm q-mx-sm-md">
      <div class="col-xs-12 col-md-12 col-lg-3">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-lg-lg">
          <label
            id="jobNumber"
            class="shelving-job-details-label text-h4 text-bold"
          >
            Shelf Number:
          </label>
          <p class="shelving-job-number-box text-h4 q-pa-md">
            {{ !directToShelfJob.shelf_barcode.value ? 'Please Scan Shelf' : directToShelfJob.shelf_barcode.value }}
          </p>
        </div>
      </div>

      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="shelving-job-details q-mb-xs-none q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="shelving-job-details-label-2 text-h6 text-bold"
          >
            Owner:
          </label>
          <p class="text-body1">
            {{ directToShelfJob.owner.name }}
          </p>
        </div>
      </div>

      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="shelving-job-details q-mb-xs-none q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="shelving-job-details-label-2 text-h6 text-bold"
          >
            Size Class:
          </label>
          <p
            class="text-body1"
            :class="directToShelfJob.size_class.name ? 'outline' : null"
          >
            {{ directToShelfJob.size_class.name }}
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
          <p class="text-body1">
            {{ !directToShelfJob.user.name ? userData.name : directToShelfJob.user.name }}
          </p>
        </div>
      </div>

      <div class="col-xs-6 col-sm-grow">
        <div class="shelving-job-details q-mb-xs-none q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-sm">
          <label
            class="shelving-job-details-label-2 text-h6 text-bold"
          >
            Date Created:
          </label>
          <p class="text-body1">
            {{ formatDateTime(directToShelfJob.create_dt).date }}
          </p>
        </div>
      </div>

      <div
        v-if="currentScreenSize !== 'xs'"
        class="col-sm-12 col-md-12 col-lg-3 q-ml-auto"
      >
        <div class="shelving-job-details-action q-mt-sm-sm q-mt-md-md">
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Scan New Shelf"
            :disabled="!directToShelfJob.shelf_barcode.value"
            class="btn-no-wrap text-body1 q-mr-sm"
            @click="clearShelfDetails()"
          />
          <q-btn
            no-caps
            unelevated
            color="positive"
            label="Complete Job"
            class="btn-no-wrap text-body1"
            :disabled="!allContainersShelved"
            :loading="appActionIsLoadingData"
            @click="completeDirectToShelfJob()"
          />
        </div>
      </div>
      <MobileActionBar
        v-else
        button-one-color="accent"
        button-one-label="Scan New Shelf"
        :button-one-outline="false"
        :button-one-disabled="!directToShelfJob.shelf_barcode.value"
        @button-one-click="null"
        button-two-color="positive"
        button-two-label="Complete Job"
        :button-two-outline="false"
        :button-two-disabled="!allContainersShelved"
        :button-two-loading="appActionIsLoadingData"
        @button-two-click="completeDirectToShelfJob()"
      />
    </div>

    <q-space class="divider q-my-xs-lg q-my-md-xl" />

    <div
      class="row"
    >
      <div class="col-grow">
        <EssentialTable
          :table-columns="shelfTableColumns"
          :table-visible-columns="shelfTableVisibleColumns"
          :table-data="directToShelfJob.containers"
          :heading-row-class="'q-mb-lg q-px-xs-sm q-px-sm-md'"
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

          <template #table-td="{ colName, value }">
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

    <!-- dts scan container modal -->
    <PopupModal
      v-if="showScanContainerModal"
      title="Container Location"
      @reset="showScanContainerModal = false"
    >
      <template #main-content>
        <q-card-section class="row q-pb-sm">
          <div class="col-12">
            <BarcodeBox
              :barcode="shelvingJobContainer.barcode.value"
              :min-height="'5rem'"
            />
          </div>
        </q-card-section>

        <q-card-section class="row q-pb-sm">
          <div
            class="form-group"
          >
            <label class="form-group-label">
              Shelf Position
            </label>
            <TextInput
              v-model="shelvingJobContainer.shelf_position_number"
              placeholder="Enter Shelf Postion"
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
            class="text-body1 full-width"
            :loading="appActionIsLoadingData"
            :disabled="!shelvingJobContainer.shelf_position_number"
            @click="assignContainerLocation(); hideModal();"
          />

          <q-space class="q-mx-xs" />

          <q-btn
            outline
            no-caps
            label="Cancel"
            class="text-body1 full-width"
            @click="resetShelvingJobContainer(); hideModal();"
          />
        </q-card-section>
      </template>
    </PopupModal>
  </div>
</template>

<script setup>
import { ref, inject, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global-store'
import { useUserStore } from '@/stores/user-store'
import { useShelvingStore } from '@/stores/shelving-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import EssentialTable from '@/components/EssentialTable.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'
import PopupModal from '@/components/PopupModal.vue'
import BarcodeBox from '@/components/BarcodeBox.vue'
import TextInput from '@/components/TextInput.vue'

const router = useRouter()

// Compasables
const { currentScreenSize } = useCurrentScreenSize()
const { compiledBarCode } = useBarcodeScanHandler()

// // Store Data
const {
  appIsLoadingData,
  appActionIsLoadingData,
  appIsOffline
} = storeToRefs(useGlobalStore())
const { userData } = storeToRefs(useUserStore())
const {
  getShelfByBarcode,
  patchDirectShelvingJob,
  resetShelvingJobContainer
} = useShelvingStore()
const {
  directToShelfJob,
  shelvingJobContainer,
  allContainersShelved
} = storeToRefs(useShelvingStore())

// Local Data
const shelfTableColumns = ref([
  {
    name: 'barcode',
    field: row => row.barcode.value,
    label: 'Barcode',
    align: 'left',
    sortable: true
  },
  {
    name: 'owner',
    field: row => row.owner.name,
    label: 'Owner',
    align: 'left',
    sortable: true
  },
  {
    name: 'size_class',
    field: row => row.size_class.name,
    label: 'Size Class',
    align: 'left',
    sortable: true
  },
  {
    name: 'module',
    field: 'module_id',
    label: 'Module',
    align: 'left',
    sortable: true
  },
  {
    name: 'aisle',
    field: 'aisle_id',
    label: 'Aisle',
    align: 'left',
    sortable: true
  },
  {
    name: 'side',
    field: 'side',
    label: 'Side',
    align: 'left',
    sortable: true
  },
  {
    name: 'ladder',
    field: 'ladder_id',
    label: 'Ladder',
    align: 'left',
    sortable: true
  },
  {
    name: 'shelf',
    field: row => row.shelf_barcode.value,
    label: 'Shelf',
    align: 'left',
    sortable: true
  },
  {
    name: 'shelf_position',
    field: 'shelf_position_number',
    label: 'Shelf Position',
    align: 'left',
    sortable: true
  },
  {
    name: 'verified',
    field: 'verified',
    label: '',
    align: 'right',
    sortable: false,
    required: true
  }
])
const shelfTableVisibleColumns = ref([
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
const showScanContainerModal = ref(false)

// Logic
const formatDateTime = inject('format-date-time')
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  if (currentScreenSize.value == 'xs') {
    shelfTableVisibleColumns.value = [
      'barcode',
      'shelf',
      'shelf_position',
      'verified'
    ]
  }
})

watch(compiledBarCode, (barcode) => {
  if (barcode !== '' && !directToShelfJob.value.shelf_barcode.value) {
    // user is scanning a shelf barcode
    triggerShelfScan(barcode)
  } else if (barcode !== '' && !shelvingJobContainer.value.barcode.value) {
    // user has a shelf scanned and is scanning containers to place on a shelf
    triggerContainerScan(barcode)
  }
})
const triggerShelfScan = async (barcode_value) => {
  try {
    appIsLoadingData.value = true

    // if user is online send a get request to get the scanned shelfs data
    if (!appIsOffline.value) {
      await getShelfByBarcode(barcode_value)
    } else {
      // else if offline assign the shelf barcode directly to the job
      directToShelfJob.value.shelf_barcode.value = barcode_value
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
const triggerContainerScan = (barcode_value) => {
  // check if the scanned barcode is in the containers data and that the barcode hasnt been shelved already
  if (directToShelfJob.value.containers.some(c => c.barcode.value == barcode_value && c.verified)) {
    handleAlert({
      type: 'error',
      text: 'The scanned container has already been marked as shelved.',
      autoClose: true
    })
    return
  } else {
    shelvingJobContainer.value.barcode.value = barcode_value
    showScanContainerModal.value = true
  }
}
const assignContainerLocation = async () => {
  try {
    appActionIsLoadingData.value = true

    // if user is online send a patch request to add the container to the dts job
    if (!appIsOffline.value) {
      const payload = {
        container_barcode: shelvingJobContainer.value.barcode.value,
        shelf_barcode_value: directToShelfJob.value.shelf_barcode.value,
        shelf_position_number: shelvingJobContainer.value.shelf_position_number
      }
      await patchDirectShelvingJob(payload)
    }
    // TODO: move this into an else block once patchDirectShelvingJob is wired to an endpoint
    // else if offline assign the shelve directly to the directToShelf containers
    directToShelfJob.value.containers = [
      ...directToShelfJob.value.containers,
      {
        ...shelvingJobContainer.value,
        shelf_barcode: {
          value: directToShelfJob.value.shelf_barcode.value
        },
        verified: true
      }
    ]

    handleAlert({
      type: 'success',
      text: 'The container has been updated.',
      autoClose: true
    })
    resetShelvingJobContainer()
    showScanContainerModal.value = false
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
const completeDirectToShelfJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: directToShelfJob.value.id,
      status: 'Completed'
    }
    await patchDirectShelvingJob(payload)

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

const clearShelfDetails = () => {
  // clears out any scanned shelf data from the directToShelf data
  directToShelfJob.value.shelf_barcode.value = ''
  directToShelfJob.value.owner.id = null
  directToShelfJob.value.owner.name = ''
  directToShelfJob.value.size_class_id = null
  directToShelfJob.value.size_class.name = ''
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