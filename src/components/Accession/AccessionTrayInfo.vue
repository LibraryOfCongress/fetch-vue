<template>
  <div class="col-12 col-lg-4 col-xl-3 accession-container-info">
    <div class="row">
      <div class="col-12">
        <h1 class="text-h4 text-bold q-mb-xs-md q-mb-sm-lg">
          {{ `Job: ${accessionJob.id}` }}
        </h1>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-12 q-mb-xs-md q-mb-sm-none q-mb-lg-lg">
        <BarcodeBox
          :barcode="!accessionContainer.id ? 'Please Scan Tray' : accessionContainer.id"
          class="q-mb-md-xl q-mb-lg-none"
        />
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-12">
        <div class="accession-container-info-details q-mb-xs-sm q-mb-lg-lg">
          <label class="text-h6 q-mb-xs">
            Owner
          </label>
          <p
            class="outline"
          >
            {{ accessionJob.owner }}
          </p>
        </div>

        <div class="accession-container-info-details q-mb-xs-sm q-mb-lg-lg">
          <label class="text-h6 q-mb-xs">
            Container Type
          </label>
          <p>
            Trayed
          </p>
        </div>

        <div class="accession-container-info-details q-mb-xs-sm q-mb-lg-lg">
          <label class="text-h6 q-mb-xs">
            Container Size
            <q-btn
              v-if="accessionContainer.id"
              no-caps
              flat
              icon="mdi-square-edit-outline"
              color="accent"
              label="Edit"
              class="btn-no-wrap text-caption"
              @click="editContainerSize = true"
            />
          </label>
          <p
            v-if="!editContainerSize"
            :class="accessionContainer.id ? 'outline' : ''"
          >
            {{ accessionContainer.container_size }}
          </p>
          <SelectInput
            v-else
            v-model="accessionContainer.container_size"
            :options="containerOptions"
            option-value="name"
            option-label="name"
          />
        </div>

        <div class="accession-container-info-details">
          <label class="text-h6 q-mb-xs">
            Media Type
            <q-btn
              no-caps
              flat
              icon="mdi-square-edit-outline"
              color="accent"
              label="Edit"
              class="btn-no-wrap text-caption"
              @click="editMediaType = true"
            />
          </label>
          <p
            v-if="!editMediaType"
            class="outline text-highlight"
          >
            {{ !accessionContainer.id ? accessionJob.media_type : accessionContainer.media_type }}
          </p>
          <template v-else>
            <SelectInput
              v-if="!accessionContainer.id"
              v-model="accessionJob.media_type"
              :options="mediaOptions"
              option-value="name"
              option-label="name"
            />
            <SelectInput
              v-else
              v-model="accessionContainer.media_type"
              :options="mediaOptions"
              option-value="name"
              option-label="name"
            />
          </template>
        </div>

        <div
          v-if="editContainerSize || editMediaType"
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
              @click="!accessionContainer.id ? updateTrayJob() : updateTrayContainer()"
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
              @click="cancelTrayEdits"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRaw, inject } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccessionStore } from '@/stores/accession-store'
import { useOptionStore } from '@/stores/option-store'
import BarcodeBox from '@/components/BarcodeBox.vue'
import SelectInput from '@/components/SelectInput.vue'

const route = useRoute()

// Store Data
const { containerOptions, mediaOptions } = useOptionStore()
const {
  patchAccessionJob,
  patchAccessionTray
} = useAccessionStore()
const {
  accessionJob,
  accessionContainer,
  originalAccessionContainer,
  originalAccessionJob
} = storeToRefs(useAccessionStore())

// Local Data
const editContainerSize = ref(false)
const editMediaType = ref(false)

// Logic
const handleAlert = inject('handle-alert')

const cancelTrayEdits = () => {
  if (!route.params.containerId) {
    accessionJob.value = { ...toRaw(originalAccessionJob.value) }
  } else {
    accessionContainer.value = { ...toRaw(originalAccessionContainer.value) }
  }

  editContainerSize.value = false
  editMediaType.value = false
}

const updateTrayJob = async () => {
  try {
    await patchAccessionJob()

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
    editContainerSize.value = false
    editMediaType.value = false
  }
}
const updateTrayContainer = async () => {
  try {
    await patchAccessionTray()

    handleAlert({
      type: 'success',
      text: 'The tray has been updated.',
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    editContainerSize.value = false
    editMediaType.value = false
  }
}
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
        padding-left: 0rem;
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