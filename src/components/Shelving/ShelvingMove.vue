<template>
  <InfoDisplayLayout class="direct-shelving-job">
    <template #number-box-content>
      <h1
        class="info-display-details-label text-h4 text-bold"
      >
        {{ route.params.type == 'tray-item' ? 'Tray Barcode:' : 'Shelf Number:' }}
      </h1>
      <p class="info-display-number-box text-h4 q-pa-md">
        {{ renderBarcodeDisplay }}
      </p>
    </template>

    <template #details-content>
      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="info-display-details q-mb-xs-none q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="info-display-details-label-2 text-h6 text-bold"
          >
            Owner:
          </label>
          <p class="text-body1">
            {{ moveShelfJob.owner.name }}
          </p>
        </div>
      </div>

      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="info-display-details q-mb-xs-none q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="info-display-details-label-2 text-h6 text-bold"
          >
            Size Class:
          </label>
          <p
            class="text-body1"
            :class="moveShelfJob.size_class.name ? 'outline' : null"
          >
            {{ moveShelfJob.size_class.name }}
          </p>
        </div>
      </div>

      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="info-display-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="info-display-details-label-2 text-h6 text-bold"
          >
            Assigned User:
          </label>
          <p class="text-body1">
            {{ !moveShelfJob.user ? userData.name : moveShelfJob.user.name }}
          </p>
        </div>
      </div>

      <div class="col-xs-6 col-sm-grow">
        <div class="info-display-details q-mb-xs-none q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-sm">
          <label
            class="info-display-details-label-2 text-h6 text-bold"
          >
            Date Transferred:
          </label>
          <p class="text-body1">
            {{ formatDateTime(moveShelfJob.move_dt).date }}
          </p>
        </div>
      </div>

      <div
        v-if="currentScreenSize !== 'xs'"
        class="col-sm-12 col-md-12 col-lg-3 q-ml-auto"
      >
        <div class="info-display-details-action q-mt-sm-sm q-mt-md-md">
          <q-btn
            no-caps
            unelevated
            color="positive"
            label="Complete Transfer"
            class="btn-no-wrap text-body1 q-mr-sm"
            :disabled="appIsOffline || appPendingSync || !checkUserPermission('can_move_trays_and_items_shelving_locations')"
            :loading="appActionIsLoadingData"
            @click="completeMove()"
          />
          <q-btn
            no-caps
            unelevated
            color="negative"
            label="Cancel Transfer"
            :disabled="!checkUserPermission('can_move_trays_and_items_shelving_locations')"
            class="btn-no-wrap text-body1"
            @click="clearMoveDetails()"
          />
          <!-- <q-btn
            no-caps
            unelevated
            color="accent"
            label="Scan New Shelf"
            :disabled="!moveShelfJob.shelf_barcode.value || !checkUserPermission('can_move_trays_and_items_shelving_locations')"
            class="btn-no-wrap text-body1 q-mr-sm"
            @click="clearMoveDetails()"
          /> -->
        </div>
      </div>
      <!-- TODO need to add scan new shelf to mobile actions -->
      <MobileActionBar
        v-else-if="currentScreenSize == 'xs'"
        button-one-color="positive"
        button-one-label="Complete Transfer"
        :button-one-outline="false"
        :button-one-disabled="appIsOffline || appPendingSync || !checkUserPermission('can_move_trays_and_items_shelving_locations')"
        @button-one-click="completeMove()"
        button-two-color="negative"
        button-two-label="Cancel Transfer"
        :button-two-outline="false"
        :button-two-disabled="!checkUserPermission('can_move_trays_and_items_shelving_locations')"
        :button-two-loading="appActionIsLoadingData"
        @button-two-click="clearMoveDetails()"
      />
    </template>

    <template #table-content>
      <EssentialTable
        :table-columns="moveTableColumns"
        :table-visible-columns="moveTableVisibleColumns"
        :table-data="moveShelfJob.containers"
        :heading-row-class="'q-mb-lg q-px-xs-sm q-px-sm-md'"
        :highlight-row-class="'bg-color-green-light'"
        :highlight-row-key="'scanned_for_transfer'"
        :highlight-row-value="true"
      >
        <template #heading-row>
          <div
            class="col-xs-12 col-sm-grow q-mr-auto"
          >
            <h2 class="text-h4 text-bold">
              Transfer:
            </h2>
          </div>
        </template>

        <template #table-td="{ colName, value }">
          <span
            v-if="colName == 'verified'"
            class="text-bold text-nowrap"
            :class="value == true ? 'text-positive' : ''"
          >
            {{ value == true ? 'Transferred' : '' }}
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

  <!-- scan container modal -->
  <PopupModal
    v-if="showScanContainerModal"
    title="Place Container(s)"
    @reset="showScanContainerModal = false; clearScannedContainer();"
    aria-label="scanContainerModal"
  >
    <template #main-content>
      <q-card-section class="row q-pb-sm">
        <div class="col-12">
          <BarcodeBox
            :barcode="scannedContainer.barcode.value"
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
            v-model="scannedContainer.shelf_position_number"
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
          label="Confirm"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          :disabled="!scannedContainer.shelf_position_number"
          @click="verifyTransferContainerLocation(); hideModal();"
        />

        <q-space class="q-mx-xs" />

        <q-btn
          outline
          no-caps
          label="Cancel"
          class="text-body1 full-width"
          @click="clearScannedContainer(); hideModal();"
        />
      </q-card-section>
    </template>
  </PopupModal>
</template>

<script setup>
import { ref, inject, onBeforeMount, onMounted, watch, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGlobalStore } from '@/stores/global-store'
import { useUserStore } from '@/stores/user-store'
import { useShelvingStore } from '@/stores/shelving-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import { usePermissionHandler } from '@/composables/usePermissionHandler.js'
import { useIndexDbHandler } from '@/composables/useIndexDbHandler.js'
import InfoDisplayLayout from '@/components/InfoDisplayLayout.vue'
import EssentialTable from '@/components/EssentialTable.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'
import PopupModal from '@/components/PopupModal.vue'
import BarcodeBox from '@/components/BarcodeBox.vue'
import TextInput from '@/components/TextInput.vue'

const router = useRouter()
const route = useRoute()

// Compasables
const { currentScreenSize } = useCurrentScreenSize()
const { compiledBarCode } = useBarcodeScanHandler()
const {
  addDataToIndexDb,
  getDataInIndexDb,
  deleteDataInIndexDb
} = useIndexDbHandler()
const { checkUserPermission } = usePermissionHandler()

// // Store Data
const {
  appIsLoadingData,
  appActionIsLoadingData,
  appIsOffline,
  appPendingSync
} = storeToRefs(useGlobalStore())
const { userData } = storeToRefs(useUserStore())
const {
  getShelfByBarcode
} = useShelvingStore()
const {
  moveShelfJob
} = storeToRefs(useShelvingStore())

// Local Data
const moveTableColumns = ref([
  {
    name: 'barcode',
    field: row => row.barcode.value,
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
    name: 'size_class',
    field: row => row.size_class?.name,
    label: 'Size Class',
    align: 'left',
    sortable: true
  },
  {
    name: 'location',
    field: row => getItemLocation(row),
    label: 'Item Location',
    align: 'left',
    sortable: true
  },
  {
    name: 'verified',
    field: 'scanned_for_transfer',
    label: '',
    align: 'center',
    sortable: false,
    required: true
  }
])
const moveTableVisibleColumns = ref([
  'barcode',
  'owner',
  'size_class',
  'location',
  'verified'
])
const showScanContainerModal = ref(false)
const scannedContainer = ref({
  barcode: {
    value: null
  },
  shelf_position_number: ''
})
const renderBarcodeDisplay = computed(() => {
  if (moveShelfJob.value.shelf_barcode.value) {
    return moveShelfJob.value.shelf_barcode.value
  } else if (moveShelfJob.value.tray_barcode.value) {
    return moveShelfJob.value.tray_barcode.value
  } else if (route.params.type == 'tray-item') {
    return 'Please Scan Tray'
  } else if (route.params.type == 'tray-non-tray') {
    return 'Please Scan Shelf'
  } else {
    return ''
  }
})

// Logic
const formatDateTime = inject('format-date-time')
const getItemLocation = inject('get-item-location')
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  if (currentScreenSize.value == 'xs') {
    moveTableVisibleColumns.value = [
      'barcode',
      'size_class',
      'location',
      'verified'
    ]
  }
})

onMounted(async () => {
  // when user is online and loads a job we store the current move shelf data in indexdb for reference offline
  if (!appIsOffline.value) {
    await nextTick()
    addDataToIndexDb('shelvingStore', 'moveShelfJob', JSON.parse(JSON.stringify(moveShelfJob.value)))
  } else {
    // get saved move shelf data if were offline and page was reloaded/refreshed
    const res = await getDataInIndexDb('shelvingStore')
    moveShelfJob.value = res.data.moveShelfJob
  }
})

watch(compiledBarCode, (barcode) => {
  if (barcode !== '' && !moveShelfJob.value.shelf_barcode.value) {
    // user is scanning a shelf barcode
    triggerShelfScan(barcode)
  } else if (barcode !== '' && !scannedContainer.value.barcode.value) {
    // user has a shelf scanned and is scanning containers to move to the scanned shelf
    triggerContainerScan(barcode)
  }
})
const triggerShelfScan = async (barcode_value) => {
  try {
    if (!checkUserPermission('can_move_trays_and_items_shelving_locations')) {
      handleAlert({
        type: 'error',
        text: 'Sorry you do not have permission to move trays or items!',
        autoClose: true
      })
      return
    }

    // if user is online send a get request to get the scanned shelfs data
    if (!appIsOffline.value) {
      appIsLoadingData.value = true
      // TODO need to adjust this to assign to our local scanned container data
      await getShelfByBarcode(barcode_value)
    } else {
      // else if offline assign the shelf barcode directly to the job
      moveShelfJob.value.shelf_barcode.value = barcode_value
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
  // check if the scanned barcode is in the containers data and that the barcode hasnt been transferred already
  if (moveShelfJob.containers.value.some(c => c.barcode.value == barcode_value && c.scanned_for_transfer)) {
    handleAlert({
      type: 'error',
      text: 'The scanned container has already been marked as transferred.',
      autoClose: true
    })
    return
  } else {
    scannedContainer.value.barcode.value = barcode_value
    showScanContainerModal.value = true
  }
}
const verifyTransferContainerLocation = async () => {
  try {
    appActionIsLoadingData.value = true

    const payload = {
      container_barcode_value: scannedContainer.value.barcode.value,
      shelf_barcode_value: moveShelfJob.value.shelf_barcode.value,
      shelf_position_number: parseInt(scannedContainer.value.shelf_position_number),
      scanned_for_transfer: true
    }
    console.log('checking if container can be transferred...', payload)
    // TODO setup endpoint function to check if the scanned container is allowed to be transferred to the shelf or tray container
    // await postDirectShelvingJobContainer(payload)

    // if offline allow transfer directly to the moveShelfJob containers
    if (appIsOffline.value) {
      moveShelfJob.value.containers = [
        ...moveShelfJob.value.containers,
        {
          ...scannedContainer.value,
          barcode: {
            value: scannedContainer.value.barcode.value
          },
          shelf_position: {
            location: ` - - - - -${moveShelfJob.value.shelf_barcode.value}-${scannedContainer.value.shelf_position_number}`
          },
          scanned_for_transfer: true
        }
      ]
    }

    // store the current movejob state in indexdb for reference offline whenever job is executed
    addDataToIndexDb('shelvingStore', 'moveShelfJob', JSON.parse(JSON.stringify(moveShelfJob.value)))
    showScanContainerModal.value = false
    clearScannedContainer()
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
const completeMove = async () => {
  try {
    appActionIsLoadingData.value = true
    // TODO need to figure out how we plan to send container information to be transferred
    // const payload = {
    //   id: directToShelfJob.value.id,
    //   status: 'Completed',
    //   run_timestamp: new Date().toISOString()
    // }
    // await patchDirectShelvingJob(payload)

    handleAlert({
      type: 'success',
      text: 'The Containers have been successfully moved.',
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
    deleteDataInIndexDb('shelvingStore', 'moveShelfJob')
    appActionIsLoadingData.value = false
  }
}

const clearMoveDetails = () => {
  // clears out any scanned shelf data from the moveShelfJob data
  moveShelfJob.value = {
    type: '',
    shelf_barcode: {
      value: ''
    },
    tray_barcode: {
      value: ''
    },
    user: {
      first_name: '',
      last_name: ''
    },
    user_id: null,
    owner: {
      name: ''
    },
    size_class: {
      name: ''
    },
    move_dt: '',
    containers: []
  }

  // remove the move job state from indexdb
  deleteDataInIndexDb('shelvingStore', 'moveShelfJob')
}
const clearScannedContainer = () => {
  scannedContainer.value = {
    barcode: {
      value: null
    },
    shelf_position_number: ''
  }
}
</script>

<style lang="scss" scoped>
</style>
