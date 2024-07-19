<template>
  <div class="col-12 col-lg-4 col-xl-3 accession-container-info">
    <div class="row">
      <div class="col-12 flex no-wrap items-center q-mb-xs-md q-mb-sm-lg">
        <MoreOptionsMenu
          :options="[
            { text: 'Edit' },
            { text: 'Cancel Job', optionClass: 'text-negative'}
          ]"
          class="q-mr-sm"
          @click="handleOptionMenu"
        />
        <h1 class="text-h4 text-bold">
          {{ `Job: ${accessionJob.id}` }}
        </h1>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-12 q-mb-xs-md q-mb-sm-none q-mb-lg-lg">
        <BarcodeBox
          :barcode="!route.params.containerId ? 'Please Scan Non&nbsp;Tray' : accessionContainer.barcode?.value"
          class="q-mb-md-xl q-mb-lg-none"
        />
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-12">
        <div class="row">
          <div class="accession-container-info-details col-xs-6 col-sm-12 q-mb-xs-sm q-mb-lg-lg">
            <label class="text-h6 q-mb-xs">
              Owner
            </label>
            <p
              class="outline"
            >
              {{ accessionJob.owner?.name }}
            </p>
          </div>

          <div class="accession-container-info-details col-xs-6 col-sm-12 q-mb-xs-sm q-mb-lg-lg">
            <label class="text-h6 q-mb-xs">
              Container Type
            </label>
            <p>
              Non-Tray
            </p>
          </div>

          <div class="accession-container-info-details col-xs-6 col-sm-12 q-mb-xs-sm q-mb-lg-lg">
            <label class="text-h6 q-mb-xs">
              Container Size
            </label>
            <p
              v-if="!editMode"
              :class="accessionJob.size_class || accessionContainer.size_class ? 'outline' : ''"
            >
              {{ !accessionContainer.id ? accessionJob.size_class?.name : accessionContainer.size_class?.name }}
            </p>
            <SelectInput
              v-else-if="!accessionContainer.id"
              v-model="accessionJob.size_class_id"
              :options="sizeClass"
              option-type="sizeClass"
              option-value="id"
              option-label="name"
              aria-label="sizeClass"
            />
            <SelectInput
              v-else
              v-model="accessionContainer.size_class_id"
              :options="sizeClass"
              option-type="sizeClass"
              option-value="id"
              option-label="name"
              aria-label="sizeClass"
            />
          </div>

          <div class="accession-container-info-details col-xs-6 col-sm-12">
            <label class="text-h6 q-mb-xs">
              Media Type
            </label>
            <p
              v-if="!editMode"
              :class="accessionJob.media_type || accessionContainer.media_type ? 'outline text-highlight' : ''"
            >
              {{ !accessionContainer.id ? accessionJob.media_type?.name : accessionContainer.media_type?.name }}
            </p>
            <SelectInput
              v-else-if="!accessionContainer.id"
              v-model="accessionJob.media_type_id"
              :options="mediaTypes"
              option-type="mediaTypes"
              option-value="id"
              option-label="name"
              aria-label="mediaType"
            />
            <SelectInput
              v-else
              v-model="accessionContainer.media_type_id"
              :options="mediaTypes"
              option-type="mediaTypes"
              option-value="id"
              option-label="name"
              aria-label="mediaType"
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
              @click="!accessionContainer.id ? updateNonTrayJob() : updateNonTrayContainer()"
              :disabled="accessionJob.status == 'Paused'"
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
              @click="cancelNonTrayEdits"
            />
          </div>
        </div>
      </div>

      <!-- mobile actions menu -->
      <MobileActionBar
        v-if="currentScreenSize == 'xs' && editMode"
        button-one-color="accent"
        button-one-label="Save Edits"
        :button-one-outline="false"
        :button-one-loading="appActionIsLoadingData"
        @button-one-click="!accessionContainer.id ? updateNonTrayJob() : updateNonTrayContainer()"
        button-two-color="accent"
        button-two-label="Cancel"
        :button-two-outline="true"
        @button-two-click="cancelNonTrayEdits"
      />
    </div>
  </div>

  <!-- confirmation modal -->
  <PopupModal
    v-if="showConfirmationModal"
    ref="confirmationModal"
    :title="'Delete'"
    :text="'Are you sure you want to cancel the accession job?'"
    :show-actions="false"
    @reset="showConfirmationModal = null"
    aria-label="confirmationModal"
  >
    <template #footer-content="{ hideModal }">
      <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
        <q-btn
          no-caps
          unelevated
          color="negative"
          label="Cancel Job"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          @click="cancelAccessionJob()"
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
import { ref, toRaw, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useGlobalStore } from '@/stores/global-store'
import { useAccessionStore } from '@/stores/accession-store'
import { useOptionStore } from '@/stores/option-store'
import BarcodeBox from '@/components/BarcodeBox.vue'
import SelectInput from '@/components/SelectInput.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'
import PopupModal from '@/components/PopupModal.vue'

const route = useRoute()
const router = useRouter()

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const {
  sizeClass,
  mediaTypes
} = storeToRefs(useOptionStore())
const {
  patchAccessionJob,
  deleteAccessionJob,
  patchAccessionNonTrayItem
} = useAccessionStore()
const {
  accessionJob,
  accessionContainer,
  originalAccessionContainer,
  originalAccessionJob
} = storeToRefs(useAccessionStore())

// Local Data
const editMode = ref(false)
const confirmationModal = ref(null)
const showConfirmationModal = ref(false)

// Logic
const handleAlert = inject('handle-alert')

const handleOptionMenu = (option) => {
  if (option.text == 'Edit') {
    editMode.value = true
  } else if (option.text == 'Cancel Job') {
    showConfirmationModal.value = 'CancelJob'
  }
}

const cancelNonTrayEdits = () => {
  if (!route.params.containerId) {
    accessionJob.value = { ...toRaw(originalAccessionJob.value) }
  } else {
    accessionContainer.value = { ...toRaw(originalAccessionContainer.value) }
  }

  editMode.value = false
}
const updateNonTrayJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: route.params.jobId,
      media_type_id: accessionJob.value.media_type_id,
      size_class_id: accessionJob.value.size_class_id
    }

    await patchAccessionJob(payload)

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
    editMode.value = false
  }
}
const cancelAccessionJob = async () => {
  try {
    appActionIsLoadingData.value = true
    await deleteAccessionJob(route.params.jobId)

    handleAlert({
      type: 'success',
      text: 'The Accession Job has been canceled.',
      autoClose: true
    })

    router.push({
      name: 'accession',
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
    appActionIsLoadingData.value = true
    confirmationModal.value.hideModal()
  }
}
const updateNonTrayContainer = async () => {
  try {
    appActionIsLoadingData.value = true
    // by default when updating a container we assume it has already been verified
    let addVerifiedAlert = false
    let itemPayload = {
      id: accessionContainer.value.id,
      media_type_id: accessionContainer.value.media_type_id,
      size_class_id: accessionContainer.value.size_class_id
    }

    // if the item were updating hasnt been verified we can trigger a verified status as long as a media_type and size_class was set
    if (!accessionContainer.value.scanned_for_accession && accessionContainer.value.media_type_id && accessionContainer.value.size_class_id) {
      itemPayload = {
        ...itemPayload,
        scanned_for_accession: true
      }
      addVerifiedAlert = true
    }

    await patchAccessionNonTrayItem(itemPayload)

    if (addVerifiedAlert) {
      handleAlert({
        type: 'success',
        text: 'The non-tray item has been updated and verified.',
        autoClose: true
      })
    } else {
      handleAlert({
        type: 'success',
        text: 'The non-tray item has been updated.',
        autoClose: true
      })
    }
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appActionIsLoadingData.value = false
    editMode.value = false
  }
}

defineExpose({ editMode })
</script>

<style lang="scss" scoped>
.accession-container {
  &-info {
    border-right: 1px solid;
    border-color: $secondary;
    padding: 3rem;

    @media (max-width: $breakpoint-md-max) {
      border-right: none;
      padding: 3rem 1.5rem;
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