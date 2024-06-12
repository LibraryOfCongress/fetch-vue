<template>
  <PopupModal
    @reset="resetRefileItem(); emit('hide');"
    aria-label="refileJobItemDetailModal"
  >
    <template #header-content="{ hideModal }">
      <q-card-section class="row items-center q-pb-none">
        <h2
          v-if="refileJob.status !== 'Running' || refileItem.scanned_for_refile"
          class="text-h6 text-bold"
        >
          Item Details
        </h2>
        <h2
          v-else
          class="text-h6 text-bold"
        >
          {{ refileItem.item ? 'Place Tray Item' : 'Place Non-Tray Item' }}
        </h2>

        <q-btn
          icon="close"
          flat
          round
          dense
          class="q-ml-auto"
          @click="hideModal"
          aria-label="closeModal"
        />
      </q-card-section>
    </template>

    <template #main-content>
      <q-card-section class="row q-pb-sm">
        <div class="col-12">
          <BarcodeBox
            v-if="refileJob.status !== 'Running' || refileItem.scanned_for_refile"
            :barcode="refileItem.item ? refileItem.item.barcode.value : refileItem.non_tray_item.barcode.value"
            :min-height="'5rem'"
          />
          <BarcodeBox
            v-else
            :barcode="refileItem.item ? 'Please Scan Tray' : 'Please Scan Shelf'"
            :min-height="'5rem'"
          />
        </div>
      </q-card-section>

      <q-card-section
        class="row q-pb-none"
      >
        <div class="col-6">
          <div class="container-details">
            <label class="text-body1 text-bold">
              Item Barcode:
            </label>
            <p class="text-body1">
              {{ refileItem.item ? refileItem.item.barcode?.value : refileItem.non_tray_item.barcode?.value }}
            </p>
          </div>
        </div>
        <div class="col-6">
          <div
            v-if="refileItem.item"
            class="container-details"
          >
            <label class="text-body1 text-bold">
              Tray Barcode:
            </label>
            <p class="text-body1">
              {{ refileItem.item.tray?.barcode?.value }}
            </p>
          </div>
        </div>
        <div class="col-6">
          <div class="container-details">
            <label class="text-body1 text-bold">
              Module:
            </label>
            <p class="text-body1">
              {{ refileItem.item ? refileItem.item.tray?.shelf_position?.shelf?.ladder?.side?.aisle?.module?.module_number?.number : refileItem.non_tray_item.shelf_position?.shelf?.ladder?.side?.aisle?.module?.module_number?.number }}
            </p>
          </div>
        </div>
        <div class="col-6">
          <div class="container-details">
            <label class="text-body1 text-bold">
              Aisle:
            </label>
            <p class="text-body1">
              {{ refileItem.item ? refileItem.item.tray?.shelf_position?.shelf?.ladder?.side?.aisle?.aisle_number?.number : refileItem.non_tray_item.shelf_position?.shelf?.ladder?.side?.aisle?.aisle_number?.number }}
            </p>
          </div>
        </div>
        <div class="col-6">
          <div class="container-details">
            <label class="text-body1 text-bold">
              Side:
            </label>
            <p class="text-body1">
              {{ refileItem.item ? refileItem.item.tray?.shelf_position?.shelf?.ladder?.side?.side_orientation?.name : refileItem.non_tray_item.shelf_position?.shelf?.ladder?.side?.side_orientation?.name }}
            </p>
          </div>
        </div>
        <div class="col-6">
          <div class="container-details">
            <label class="text-body1 text-bold">
              Ladder:
            </label>
            <p class="text-body1">
              {{ refileItem.item ? refileItem.item.tray?.shelf_position?.shelf?.ladder?.ladder_number?.number : refileItem.non_tray_item.shelf_position?.shelf?.ladder?.ladder_number?.number }}
            </p>
          </div>
        </div>
        <div class="col-6">
          <div class="container-details">
            <label class="text-body1 text-bold">
              Shelf:
            </label>
            <p class="text-body1">
              {{ refileItem.item ? refileItem.item.tray?.shelf_position?.shelf?.shelf_number?.number : refileItem.non_tray_item.shelf_position?.shelf?.shelf_number?.number }}
            </p>
          </div>
        </div>
        <div class="col-6">
          <div class="container-details">
            <label class="text-body1 text-bold">
              Shelf Position:
            </label>
            <p class="text-body1">
              {{ refileItem.item ? refileItem.item.tray?.shelf_position?.shelf_position_number?.number : refileItem.non_tray_item.shelf_position?.shelf_position_number?.number }}
            </p>
          </div>
        </div>
      </q-card-section>
    </template>

    <template #footer-content="{ hideModal }">
      <q-card-section class="column items-center q-pt-sm">
        <q-btn
          no-caps
          unelevated
          outline
          color="accent"
          label="Cancel"
          class="text-body1 full-width"
          @click="hideModal"
        />
      </q-card-section>
    </template>
  </PopupModal>
</template>

<script setup>
import { inject, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRefileStore } from '@/stores/refile-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import { useIndexDbHandler } from '@/composables/useIndexDbHandler.js'
import PopupModal from '@/components/PopupModal.vue'
import BarcodeBox from '@/components/BarcodeBox.vue'

const route = useRoute()

// Emits
const emit = defineEmits(['hide'])

// Compasables
const { compiledBarCode } = useBarcodeScanHandler()
const { addDataToIndexDb } = useIndexDbHandler()

// Store Data
const { patchRefileJobItemScanned, resetRefileItem } = useRefileStore()
const { refileItem, refileJob } = storeToRefs(useRefileStore())

// Local Data

// Logic
const handleAlert = inject('handle-alert')

watch(compiledBarCode, (barcode) => {
  if (barcode !== '' && refileJob.value.status == 'Running' && refileItem.value.item) {
    triggerTrayScan(barcode)
  } else if (barcode !== '' && refileJob.value.status == 'Running' && refileItem.value.non_tray_item) {
    triggerShelfScan(barcode)
  }
})
const triggerTrayScan = (barcode_value) => {
  if (refileItem.value.scanned_for_refile) {
    handleAlert({
      type: 'error',
      text: 'The scanned item has already been marked as refiled.',
      autoClose: true
    })
  } else if (barcode_value == refileItem.value.item.tray.barcode.value && !refileItem.value.scanned_for_refile) {
    updateItemAsRefiled(barcode_value)
  } else {
    handleAlert({
      type: 'error',
      text: `The scanned tray barcode does not match this items tray barcode (${refileItem.value.item.tray.barcode.value}). Please try again!`,
      autoClose: true
    })
  }
}
const triggerShelfScan = (barcode_value) => {
  if (refileItem.value.scanned_for_refile) {
    handleAlert({
      type: 'error',
      text: 'The scanned item has already been marked as refiled.',
      autoClose: true
    })
  } else if (barcode_value == refileItem.value.non_tray_item.shelf_position.shelf.barcode.value && !refileItem.value.scanned_for_refile) {
    updateItemAsRefiled(barcode_value)
  } else {
    handleAlert({
      type: 'error',
      text: `The scanned shelf barcode does not match the non tray items shelf barcode (${refileItem.value.non_tray_item.shelf_position.shelf.barcode.value}). Please try again!`,
      autoClose: true
    })
  }
}

const updateItemAsRefiled = async () => {
  try {
    const payload = {
      job_id: route.params.jobId,
      item_id: refileItem.value.id,
      scanned_for_refile: true
    }
    await patchRefileJobItemScanned(payload)

    // when offline we need to directly update the refile item in the refile job requests
    refileJob.value.refile_items[refileJob.value.refile_items.findIndex(itm => itm.id == payload.item_id)] = { ...refileItem.value, scanned_for_refile: payload.scanned_for_refile }

    // update the stored refileJob since the container will get changed at the job requests level
    addDataToIndexDb('refileStore', 'refileJob', JSON.parse(JSON.stringify(refileJob.value)))

    handleAlert({
      type: 'success',
      text: 'The item has been refiled.',
      autoClose: true
    })
    resetRefileItem()
    emit('hide')
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
.container {
  &-details {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    padding-bottom: 8px;

    label {
      margin-right: .5rem;
    }
  }
}
</style>