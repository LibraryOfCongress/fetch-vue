<template>
  <div class="accession-container">
    <div class="row">
      <div class="col">
        <h1 class="text-h4 text-bold q-mb-lg">
          Accession Jobs
        </h1>
      </div>
    </div>

    <div class="row">
      <div class="col-auto q-pa-xs-xs q-pa-lg-sm q-pa-xl-md">
        <q-btn
          class="accession-btn text-h4"
          flat
          icon="add"
          @click="startAccessionProcess"
        >
          <span>Start Accession</span>
        </q-btn>
      </div>
    </div>

    <!-- start accession process modal -->
    <PopupModal
      v-if="showAccessionModal"
      :show-actions="false"
      @reset="reset"
    >
      <template #header-content>
        <q-card-section class="row items-center justify-between q-pb-none">
          <h2
            v-if="!accessionJob.type"
            class="text-h6"
          >
            Start New Accession
          </h2>
          <q-btn
            v-else
            icon="chevron_left"
            label="Back"
            no-caps
            flat
            dense
            class="text-body1"
            @click="accessionJob.type = null"
          />

          <q-btn
            icon="close"
            flat
            round
            dense
            @click="reset"
          />
        </q-card-section>
      </template>

      <template #main-content>
        <!-- first step in accession job process -->
        <q-card-section
          v-if="!accessionJob.type"
          class="column no-wrap items-center"
        >
          <q-btn
            outline
            no-caps
            padding="14px md"
            label="Non-Tray Accession"
            class="accession-modal-btn full-width text-body1 q-mb-md"
            @click="accessionJob.type = 1"
          />

          <q-btn
            outline
            no-caps
            padding="14px md"
            label="Trayed Accession"
            class="accession-modal-btn full-width text-body1"
            @click="accessionJob.type = 2"
          />
        </q-card-section>

        <!-- second step in accession job process -->
        <template v-else>
          <q-card-section class="column no-wrap items-center">
            <div class="form-group q-mb-md">
              <label class="form-group-label">
                Owner (Required)
              </label>
              <SelectInput
                v-model="accessionJob.owner"
                :options="ownerOptions"
                option-value="name"
                option-label="name"
                :placeholder="'Select Owner'"
              />
            </div>

            <div class="form-group">
              <label class="form-group-label">
                Media Type (Optional)
              </label>
              <SelectInput
                v-model="accessionJob.media_type"
                :options="mediaOptions"
                option-value="name"
                option-label="name"
                :placeholder="'Select Media Type'"
              />
            </div>
          </q-card-section>
        </template>
      </template>

      <template #footer-content>
        <q-card-section
          v-if="accessionJob.type !== null"
          class="row no-wrap justify-between items-center q-pt-sm"
        >
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Submit"
            class="text-body1 full-width"
            :disable="!canSubmitAccessionJob"
            @click="submitAccessionJob"
          />

          <q-space class="q-mx-xs" />

          <q-btn
            outline
            no-caps
            label="Cancel"
            class="accession-modal-btn text-body1 full-width"
            @click="reset"
          />
        </q-card-section>
      </template>
    </PopupModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccessionStore } from 'src/stores/accession-store'
import { useOptionStore } from 'src/stores/option-store'
import SelectInput from '@/components/SelectInput.vue'
import PopupModal from '@/components/PopupModal.vue'

const router = useRouter()

// Store Data
const { resetAccessionStore, postAccessionJob } = useAccessionStore()
const { accessionJob } = storeToRefs(useAccessionStore())
const { ownerOptions, mediaOptions } = storeToRefs(useOptionStore())

// Local Data
const showAccessionModal = ref(false)
const canSubmitAccessionJob = computed(() => {
  if (accessionJob.value.owner !== null) {
    return true
  } else {
    return false
  }
})

// Logic
const handleAlert = inject('handle-alert')

onMounted(() => {
  resetAccessionStore()
})

const reset = () => {
  resetAccessionStore()
  showAccessionModal.value = false
}
const startAccessionProcess = () => {
  resetAccessionStore()
  showAccessionModal.value = !showAccessionModal.value
}
const submitAccessionJob = async () => {
  // TODO: send the accessionJob data to api to start the proccess and get an associated job id
  try {
    await postAccessionJob()

    router.push({
      name: 'accession',
      params: {
        jobId: accessionJob.value.id
      }
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    showAccessionModal.value = false
  }
}
</script>

<style lang="scss" scoped>
.accession {
  &-btn {
    position: relative;
    display: flex;
    min-width: 225px;
    width: 100%;
    aspect-ratio: 1 / 1;
    padding: 0;
    border: 1px dashed $color-black;
    border-width: 2px;
    border-radius: 4px;
    transition: 0.3s ease;

    @media (max-width: $breakpoint-sm-min) {
      min-width: 164px;
    }

    &:hover:not(:disabled) {
      color: $accent;
      border-color: $accent;
    }

    & span {
      position: absolute;
      bottom: 15%;
      font-size: 1.25rem;
      text-transform: none;

      @media (max-width: $breakpoint-sm-min) {
        bottom: 12%;
        width: 9rem;
        line-height: normal;
      }
    }
  }
}
</style>