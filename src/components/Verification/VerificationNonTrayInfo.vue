<template>
  <div
    class="col-12 col-lg-4 col-xl-3 verification-container-info"
  >
    <div class="row">
      <div class="col-12 flex no-wrap items-center q-mb-xs-md q-mb-sm-lg">
        <MoreOptionsMenu
          :options="[{ text: 'Edit', disabled: verificationJob.status == 'Completed' }, { text: 'Print Job' }, { text: 'View History' }]"
          class="q-mr-sm"
          @click="handleOptionMenu"
        />
        <h1 class="text-h4 text-bold">
          {{ `Job: ${verificationJob.workflow_id}` }}
        </h1>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-12 q-mb-xs-md q-mb-sm-none q-mb-lg-lg">
        <BarcodeBox
          :barcode="!verificationContainer.id ? 'Please Scan Non&nbsp;Tray' : verificationContainer.barcode?.value"
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
              aria-label="ownerSelect"
            />
          </div>

          <div class="col-xs-6 col-sm-12 q-mb-xs-none q-mb-sm-sm q-mb-lg-lg verification-container-info-details">
            <label class="text-h6 q-mb-xs">
              Container Type
            </label>
            <p
              class="q-my-auto"
            >
              Non-Tray
            </p>
          </div>

          <div class="col-xs-6 col-sm-12 q-mb-xs-none q-mb-sm-sm q-mb-lg-lg verification-container-info-details">
            <label class="text-h6 q-mb-xs">
              Container Size
            </label>
            <p
              v-if="!editMode"
              :class="verificationJob.size_class || verificationContainer.size_class ? 'outline' : ''"
            >
              {{ !verificationContainer.id ? verificationJob.size_class?.name : verificationContainer.size_class?.name }}
            </p>
            <SelectInput
              v-else-if="!verificationContainer.id"
              v-model="verificationJob.size_class_id"
              :options="sizeClass"
              option-type="sizeClass"
              option-value="id"
              option-label="name"
              aria-label="sizeClassSelect"
            />
            <SelectInput
              v-else
              v-model="verificationContainer.size_class_id"
              :options="sizeClass"
              option-type="sizeClass"
              option-value="id"
              option-label="name"
              aria-label="sizeClassSelect"
            />
          </div>

          <div class="col-xs-6 col-sm-12 verification-container-info-details">
            <label class="text-h6 q-mb-xs">
              Media Type
            </label>
            <p
              v-if="!editMode"
              class="outline text-highlight"
            >
              {{ !verificationContainer.id ? verificationJob.media_type?.name : verificationContainer.media_type?.name }}
            </p>
            <SelectInput
              v-else-if="!verificationContainer.id"
              v-model="verificationJob.media_type_id"
              :options="mediaTypes"
              option-type="mediaTypes"
              option-value="id"
              option-label="name"
              aria-label="mediaTypeSelect"
            />
            <SelectInput
              v-else
              v-model="verificationContainer.media_type_id"
              :options="mediaTypes"
              option-type="mediaTypes"
              option-value="id"
              option-label="name"
              aria-label="mediaTypeSelect"
            />
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
              :loading="appActionIsLoadingData"
              @click="!verificationContainer.id ? updateNonTrayJob() : updateNonTrayItem()"
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
              @click="cancelNonTrayEdit()"
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

    <MobileActionBar
      v-if="currentScreenSize == 'xs' && editMode"
      button-one-color="accent"
      button-one-label="Save Edits"
      :button-one-outline="false"
      :button-one-loading="appActionIsLoadingData"
      @button-one-click="!verificationContainer.id ? updateNonTrayJob() : updateNonTrayContainer()"
      button-two-color="accent"
      button-two-label="Cancel"
      :button-two-outline="true"
      @button-two-click="cancelNonTrayEdit()"
    />

    <!-- audit trail modal -->
    <AuditTrail
      v-if="showAuditTrailModal"
      ref="historyModal"
      @reset="showAuditTrailModal = null"
      :job-type="showAuditTrailModal"
      :job-id="verificationJob.id"
    />
  </div>
</template>

<script setup>
import { ref, toRaw, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { useVerificationStore } from '@/stores/verification-store'
import { useOptionStore } from '@/stores/option-store'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import BarcodeBox from '@/components/BarcodeBox.vue'
import SelectInput from '@/components/SelectInput.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import VerificationMobileInfo from '@/components/Verification/VerificationMobileInfo.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'
import AuditTrail from '@/components/AuditTrail.vue'

// Emits
const emit = defineEmits(['print'])

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const {
  owners,
  sizeClass,
  mediaTypes
} = storeToRefs(useOptionStore())
const {
  patchVerificationJob,
  patchVerificationNonTrayItem
} = useVerificationStore()
const {
  verificationJob,
  verificationContainer,
  originalVerificationContainer,
  originalVerificationJob
} = storeToRefs(useVerificationStore())

// Local Data
const editMode = ref(false)
const historyModal = ref(null)
const showAuditTrailModal = ref(false)

// Logic
const handleAlert = inject('handle-alert')

const handleOptionMenu = (option) => {
  if (option.text == 'Edit') {
    editMode.value = true
  } else if (option.text == 'Print Job') {
    emit('print')
  } else if (option.text == 'View History') {
    showAuditTrailModal.value = 'verification_jobs'
  }
}

const cancelNonTrayEdit = () => {
  if (!verificationContainer.value.id) {
    verificationJob.value = { ...toRaw(originalVerificationJob.value) }
  } else {
    verificationContainer.value = { ...toRaw(originalVerificationContainer.value) }
  }

  editMode.value = false
}
const updateNonTrayJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: verificationJob.value.id,
      owner_id: verificationJob.value.owner_id,
      media_type_id: verificationJob.value.media_type_id,
      size_class_id: verificationJob.value.size_class_id,
      status: 'Running'
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
      persistent: true
    })
  } finally {
    appActionIsLoadingData.value = false
    editMode.value = false
  }
}
const updateNonTrayItem = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: verificationContainer.value.id,
      media_type_id: verificationContainer.value.media_type_id,
      size_class_id: verificationContainer.value.size_class_id,
      scanned_for_verification: true
    }
    await patchVerificationNonTrayItem(payload)

    handleAlert({
      type: 'success',
      text: 'The non-tray item has been updated.',
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      persistent: true
    })
  } finally {
    appActionIsLoadingData.value = false
    editMode.value = false
  }
}

defineExpose({ editMode })
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
