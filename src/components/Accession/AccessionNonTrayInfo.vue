<template>
  <div class="col-12 col-lg-4 col-xl-3 accession-container-info">
    <div class="row">
      <div class="col-12 flex no-wrap items-center q-mb-xs-md q-mb-sm-lg">
        <MoreOptionsMenu
          :options="[{ text: 'Edit' }]"
          class="q-mr-sm"
          @click="handleOptionMenu"
        />
        <h1 class="text-h4 text-bold">
          {{ `Job: ${accessionJob.id}` }}
        </h1>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-12 q-mb-xs-md q-mb-sm-none q-mb-lg-lg">
        <BarcodeBox
          :barcode="!accessionContainer.id ? 'Please Scan Non-Tray' : accessionContainer.id"
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
              v-if="!editMode || editMode && !accessionContainer.id"
              :class="accessionContainer.id && accessionContainer.size_class ? 'outline' : ''"
            >
              {{ accessionContainer.size_class?.name }}
            </p>
            <SelectInput
              v-else
              v-model="accessionContainer.size_class_id"
              :options="sizeClass"
              option-type="sizeClass"
              option-value="id"
              option-label="name"
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
            <template v-else>
              <SelectInput
                v-if="!accessionContainer.id"
                v-model="accessionJob.media_type_id"
                :options="mediaTypes"
                option-type="mediaTypes"
                option-value="id"
                option-label="name"
              />
              <SelectInput
                v-else
                v-model="accessionContainer.media_type_id"
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
      <AccessionMobileActionBar
        v-if="currentScreenSize == 'xs' && editMode"
        :edit-mode="editMode"
        @update-tray="!accessionContainer.id ? updateNonTrayJob() : updateNonTrayContainer()"
        @cancel-tray="cancelNonTrayEdits"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, toRaw, inject } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useAccessionStore } from '@/stores/accession-store'
import { useOptionStore } from '@/stores/option-store'
import BarcodeBox from '@/components/BarcodeBox.vue'
import SelectInput from '@/components/SelectInput.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import AccessionMobileActionBar from '@/components/Accession/AccessionMobileActionBar.vue'

const route = useRoute()

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const {
  sizeClass,
  mediaTypes
} = storeToRefs(useOptionStore())
const {
  patchAccessionJob,
  patchAccessionNonTrayItem
  // verifyNonTrayItemBarcode
} = useAccessionStore()
const {
  accessionJob,
  accessionContainer,
  originalAccessionContainer,
  originalAccessionJob
} = storeToRefs(useAccessionStore())

// Local Data
const editMode = ref(false)

// Logic
const handleAlert = inject('handle-alert')

const handleOptionMenu = (option) => {
  if (option.text == 'Edit') {
    editMode.value = true
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
    const payload = {
      id: route.params.jobId,
      media_type_id: accessionJob.value.media_type_id
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
    editMode.value = false
  }
}
const updateNonTrayContainer = async () => {
  try {
    const payload = {
      ...accessionContainer.value
    }

    await patchAccessionNonTrayItem(payload)

    // TODO: need to figure out how to validate non tray items
    // if (!accessionContainer.value.verified) {
    //   await verifyNonTrayItemBarcode(route.params.containerId)
    // }

    handleAlert({
      type: 'success',
      text: 'The non-tray item has been updated.',
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