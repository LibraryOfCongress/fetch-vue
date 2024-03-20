<template>
  <div
    class="col-12 col-lg-4 col-xl-3 verification-container-info"
  >
    <div class="row">
      <div class="col-12 flex no-wrap items-center q-mb-xs-md q-mb-sm-lg">
        <MoreOptionsMenu
          :options="currentScreenSize !== 'xs' ? [{ text: 'Edit' }] : [{ text: 'Edit' }, { text: 'Print Job' }]"
          class="q-mr-sm"
          @click="handleOptionMenu"
        />
        <h1 class="text-h4 text-bold">
          {{ `Job: ${verificationJob.id}` }}
        </h1>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-12 q-mb-xs-md q-mb-sm-none q-mb-lg-lg">
        <BarcodeBox
          :barcode="!verificationContainer.id ? 'Please Scan Tray' : verificationContainer.id"
          class="q-mb-md-xl q-mb-lg-none"
        />
      </div>

      <div
        class="col-xs-12 col-sm-6 col-md-6 col-lg-12"
      >
        <div class="row">
          <div class="col-xs-6 col-sm-12 q-mb-xs-sm q-mb-lg-lg verification-container-info-details">
            <label class="text-h6 q-mb-xs">
              Owner
            </label>
            <p
              v-if="!editMode"
              class="outline"
            >
              {{ verificationJob.owner?.name }}
            </p>
            <SelectInput
              v-else-if="editMode && verificationContainer.id == null"
              v-model="verificationJob.owner_id"
              :options="owners"
              option-type="owners"
              option-value="id"
              option-label="name"
            />
          </div>

          <div class="col-xs-6 col-sm-12 verification-container-info-details">
            <label class="text-h6 q-mb-xs">
              Container Type
            </label>
            <p
              class="q-my-auto"
            >
              Trayed
            </p>
          </div>

          <div
            v-if="verificationContainer.id"
            class="col-xs-6 col-sm-12 q-mb-xs-none q-mb-sm-sm q-mb-lg-lg verification-container-info-details"
          >
            <label class="text-h6 q-mb-xs">
              Container Size
            </label>
            <p
              v-if="!editMode"
              class="outline"
            >
              {{ verificationContainer.size_class?.name }}
            </p>
            <SelectInput
              v-else
              v-model="verificationContainer.size_class_id"
              :options="sizeClass"
              option-type="sizeClass"
              option-value="id"
              option-label="name"
            />
          </div>

          <div class="col-xs-6 col-sm-12 q-mb-xs-sm q-mb-lg-lg verification-container-info-details">
            <label class="text-h6 q-mb-xs">
              Media Type
            </label>
            <p
              v-if="!editMode"
              class="outline text-highlight"
            >
              {{ !verificationContainer.id ? verificationJob.media_type?.name : verificationContainer.media_type?.name }}
            </p>
            <template v-else>
              <SelectInput
                v-if="!verificationContainer.id"
                v-model="verificationJob.media_type_id"
                :options="mediaTypes"
                option-type="mediaTypes"
                option-value="id"
                option-label="name"
              />
              <SelectInput
                v-else
                v-model="verificationContainer.media_type_id"
                :options="mediaTypes"
                option-type="mediaTypes"
                option-value="id"
                option-label="name"
              />
            </template>
          </div>
        </div>

        <div
          v-if="currentScreenSize !== 'xs' && editMode"
          class="row q-pl-sm-md q-pl-lg-none q-mt-md-sm"
        >
          <q-space class="divider q-my-sm" />

          <div class="col-6 q-pr-xs-xs">
            <q-btn
              no-caps
              unelevated
              color="accent"
              label="Save Edits"
              class="full-width text-body1"
              @click="!verificationContainer.id ? updateTrayJob() : updateTrayContainer()"
              :disabled="verificationJob.status == 'Paused'"
            />
          </div>
          <div class="col-6 q-pl-xs-xs">
            <q-btn
              no-caps
              unelevated
              outline
              color="accent"
              label="Cancel"
              class="full-width text-body1"
              @click="cancelTrayEdit()"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- mobile compressed container info -->
    <VerificationMobileInfo
      v-if="currentScreenSize == 'xs'"
      @handle-option-menu="handleOptionMenu"
    />
  </div>
</template>

<script setup>
import { ref, toRaw, watch, inject } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useVerificationStore } from '@/stores/verification-store'
import { useOptionStore } from '@/stores/option-store'
import { useBarcodeStore } from '@/stores/barcode-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import BarcodeBox from '@/components/BarcodeBox.vue'
import SelectInput from '@/components/SelectInput.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import VerificationMobileInfo from '@/components/Verification/VerificationMobileInfo.vue'

const router = useRouter()

// Composables
const { compiledBarCode } = useBarcodeScanHandler()
const { verifyBarcode } = useBarcodeStore()
const { barcodeDetails } = storeToRefs(useBarcodeStore())
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const {
  owners,
  sizeClass,
  mediaTypes
} = storeToRefs(useOptionStore())
const {
  patchVerificationJob,
  postVerificationTray,
  patchVerificationTray
} = useVerificationStore()
const {
  verificationJob,
  verificationContainer,
  originalVerificationContainer,
  originalVerificationJob
} = storeToRefs(useVerificationStore())

// Local Data
const editMode = ref(false)

// Logic
const handleAlert = inject('handle-alert')

watch(compiledBarCode, (barcode_value) => {
  if (barcode_value !== '' && !verificationContainer.value.id) {
    handleTrayScan(barcode_value)
  }
})
const handleTrayScan = async (barcode_value) => {
  try {
    //check if the barcode is in the system otherwise create it
    await verifyBarcode(barcode_value)

    // example barcode for tray: 'CH220987'
    // if the scanned tray exists in the verificationJob load the tray details
    if (verificationJob.value.trays && verificationJob.value.trays.some(tray => tray.barcode_id == barcodeDetails.value.id)) {
      // getVerificationTray(verificationJob.value.trays.find(tray => tray.barcode_id == barcodeDetails.value.id).id)

      //TODO: Temp till get tray works
      verificationContainer.value = {
        ...verificationJob.value.trays.find(tray => tray.barcode_id == barcodeDetails.value.id),
        items: []
      }
      originalVerificationContainer.value = {
        ...verificationJob.value.trays.find(tray => tray.barcode_id == barcodeDetails.value.id),
        items: []
      }
    } else {
      // if the scanned tray barcode doesnt exist create the scanned tray using the scanned barcodes uuid
      const generateSizeClass = sizeClass.value.find(size => size.short_name == barcode_value.slice(0, 2))?.id
      if (!generateSizeClass) {
        handleAlert({
          type: 'error',
          text: `The tray can not be added, the container size ${barcode_value.slice(0, 2)} doesnt exist in the system. Please add it and try again.`,
          autoClose: true
        })
        return
      }

      //TODO: need to figure out what payload info is needed to add a new tray at the verification job level
      const payload = {
        barcode_id: barcodeDetails.value.id,
        owner_id: verificationJob.value.owner_id,
        media_type_id: verificationJob.value.media_type_id,
        scanned_for_accession: false,
        size_class_id: generateSizeClass
      }
      await postVerificationTray(payload)
    }

    // set the scanned tray as the container id in the route
    router.push({
      name: 'verification-container',
      params: {
        jobId: verificationJob.value.id,
        containerId: verificationContainer.value.id
      }
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  }
}

const handleOptionMenu = (option) => {
  if (option.text == 'Edit') {
    editMode.value = true
  } else if (option.text == 'Print Job') {
    //TODO: emit to the main container to print the batch sheet?
    // batchSheetComponent.value.printBatchReport()
  }
}

const cancelTrayEdit = () => {
  if (!verificationContainer.id) {
    verificationJob.value = { ...toRaw(originalVerificationJob.value) }
  } else {
    verificationContainer.value = { ...toRaw(originalVerificationContainer.value) }
  }

  editMode.value = false
}
const updateTrayJob = async () => {
  try {
    const payload = {
      id: verificationJob.value.id,
      owner_id: verificationJob.value.owner_id,
      media_type_id: verificationJob.value.media_type_id
    }

    await patchVerificationJob(payload)

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
    editMode.value = false
  }
}
const updateTrayContainer = async () => {
  try {
    const payload = {
      ...verificationContainer.value
    }
    await patchVerificationTray(payload)

    handleAlert({
      type: 'success',
      text: 'Verification Container Has Been Updated',
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    editMode.value = false
  }
}
</script>

<style lang="scss" scoped>
.verification-container {
  width: 100%;
  height: auto;

  &-info {
    border-right: 1px solid;
    border-color: $secondary;
    padding: 3rem;
    transition: all .4s ease-in-out;

    @media (max-width: $breakpoint-md-max) {
      border-right: none;
      padding: 1.5rem;
      padding-bottom: 0;
    }

    @media (max-width: $breakpoint-sm-min) {
      padding: 1rem;
      padding-bottom: 0;
    }

    &-details {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;

      @media (max-width: $breakpoint-md-max) {
        align-items: flex-start;
        padding-left: 1rem;
      }

      @media (max-width: $breakpoint-sm-min) {
        align-items: flex-start;

        &:nth-child(odd) {
          padding-left: 0;
          padding-right: 4px;
        }

        &:nth-child(even) {
          padding-left: 4px;
          padding-right: 0;
        }
      }

      & label {
        position: relative;

        .q-btn {
          position: absolute;
          padding: .4rem;
        }
      }
    }
  }
}
</style>