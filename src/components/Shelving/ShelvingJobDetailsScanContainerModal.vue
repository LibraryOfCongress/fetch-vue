<template>
  <PopupModal
    @reset="emit('hide')"
  >
    <template #header-content="{ hideModal }">
      <q-card-section class="row items-center q-pb-none">
        <h2
          v-if="!selectNewLocation"
          class="text-h6 text-bold"
        >
          Place Container
        </h2>
        <template v-else>
          <q-btn
            icon="chevron_left"
            name="back"
            no-caps
            flat
            dense
            class="text-body1"
            @click="selectNewLocation = false"
          />
          <h2 class="text-h6 text-bold q-ml-xs">
            New Location
          </h2>
        </template>

        <q-btn
          icon="close"
          flat
          round
          dense
          class="q-ml-auto"
          @click="hideModal"
        />
      </q-card-section>
    </template>

    <template #main-content>
      <q-card-section class="row q-pb-sm">
        <div class="col-12">
          <BarcodeBox
            :barcode="shelvingJobContainer.barcode?.value"
            :min-height="'5rem'"
          />
        </div>
      </q-card-section>

      <q-card-section
        v-if="!selectNewLocation"
        class="row q-pb-none"
      >
        <div class="col-6">
          <div class="container-details">
            <label class="text-body1 text-bold">
              Module:
            </label>
            <p class="text-body1">
              {{ shelvingJobContainer.module_id }}
            </p>
          </div>
        </div>
        <div class="col-6">
          <div class="container-details">
            <label class="text-body1 text-bold">
              Aisle:
            </label>
            <p class="text-body1">
              {{ shelvingJobContainer.aisle_id }}
            </p>
          </div>
        </div>
        <div class="col-6">
          <div class="container-details">
            <label class="text-body1 text-bold">
              Ladder:
            </label>
            <p class="text-body1">
              {{ shelvingJobContainer.ladder_id }}
            </p>
          </div>
        </div>
        <div class="col-6">
          <div class="container-details">
            <label class="text-body1 text-bold">
              Side:
            </label>
            <p class="text-body1">
              {{ shelvingJobContainer.side_id }}
            </p>
          </div>
        </div>
        <div class="col-6">
          <div class="container-details">
            <label class="text-body1 text-bold">
              Shelf:
            </label>
            <p class="text-body1">
              {{ shelvingJobContainer.shelf_id }}
            </p>
          </div>
        </div>
        <div class="col-6">
          <div class="container-details">
            <label class="text-body1 text-bold">
              Shelf Position:
            </label>
            <p class="text-body1">
              {{ shelvingJobContainer.shelf_position_id }}
            </p>
          </div>
        </div>
      </q-card-section>
      <q-card-section
        v-else
        class="row q-pb-sm"
      >
        <div
          class="form-group"
        >
          <label class="form-group-label">
            Shelf Position
          </label>
          <TextInput
            v-model="manualShelfPosition"
            placeholder="Enter Shelf Postion"
          />
        </div>
      </q-card-section>
    </template>

    <template #footer-content="{ hideModal }">
      <q-card-section
        v-if="!selectNewLocation"
        class="column no-wrap items-center q-pt-sm"
      >
        <q-space class="divider q-mb-md" />

        <p class="text-body1 text-bold">
          Please scan shelf to verify
        </p>

        <p class="q-mt-xs q-mb-sm text-body1">
          or
        </p>

        <q-btn
          no-caps
          unelevated
          color="accent"
          label="Select New Location"
          class="text-body1 full-width"
          @click="selectNewLocation = true"
        />
      </q-card-section>
      <q-card-section
        v-else
        class="row no-wrap justify-between items-center q-pt-sm"
      >
        <q-btn
          no-caps
          unelevated
          color="accent"
          label="Submit"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          :disabled="!manualShelfPosition"
          @click="updateContainerLocation(); hideModal();"
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
</template>

<script setup>
import { ref, inject, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { useShelvingStore } from '@/stores/shelving-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import PopupModal from '@/components/PopupModal.vue'
import BarcodeBox from '@/components/BarcodeBox.vue'
import TextInput from '@/components/TextInput.vue'

// Emits
const emit = defineEmits(['hide'])

// Compasables
const { compiledBarCode } = useBarcodeScanHandler()

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const { patchShelvingJobContainer, resetShelvingJobContainer } = useShelvingStore()
const { shelvingJobContainer } = storeToRefs(useShelvingStore())

// Local Data
const selectNewLocation = ref(false)
const manualShelfPosition = ref('')

// Logic
const handleAlert = inject('handle-alert')

watch(compiledBarCode, (barcode) => {
  if (barcode !== '') {
    triggerShelfScan(barcode)
  }
})
const triggerShelfScan = (barcode_value) => {
  if (selectNewLocation.value == false) {
    if (barcode_value == shelvingJobContainer.value.shelf_position_id) {
      updateContainerLocation(barcode_value)
    } else {
      handleAlert({
        type: 'error',
        text: 'The scanned shelf barcode does not match. Please try again!',
        autoClose: true
      })
    }
  } else {
    manualShelfPosition.value = barcode_value
  }
}

const updateContainerLocation = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      item_id: shelvingJobContainer.value.item_id,
      shelf_position_id: manualShelfPosition.value !== '' ? manualShelfPosition.value : shelvingJobContainer.value.shelf_position_id,
      verified: true
    }
    await patchShelvingJobContainer(payload)

    handleAlert({
      type: 'success',
      text: 'The container has been updated.',
      autoClose: true
    })
    resetShelvingJobContainer()
    emit('hide')
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