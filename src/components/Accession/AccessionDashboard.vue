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
      <div class="col-xs-12 col-sm-auto q-pa-xs-xs q-pa-lg-sm q-pa-xl-md">
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

    <div class="row q-mt-xl">
      <div class="col">
        <h1 class="text-h4 text-bold q-mb-xs-md q-mb-sm-lg">
          Jobs In Progress
        </h1>
      </div>
    </div>

    <div class="row">
      <div
        v-if="accessionJobList.length == 0"
        class="col-auto"
      >
        <p class="text-h6">
          No jobs currently in progress...
        </p>
      </div>
      <template v-else>
        <div
          v-for="job in accessionJobList"
          :key="job.id"
          class="col-xs-12 col-sm-auto q-pa-xs-xs q-pa-lg-sm q-pa-xl-md"
        >
          <q-card
            flat
            bordered
            class="accession-card"
            @click="loadAccessionJob(job.id)"
          >
            <q-card-section class="q-pa-none">
              <div class="accession-card-barcode text-h4">
                {{ job.id }}
              </div>
            </q-card-section>

            <q-card-section class="q-py-md q-px-md">
              <div class="accession-card-details q-mb-xs">
                <label class="text-body1">Job #:</label>
                <p class="text-body1">
                  {{ job.id }}
                </p>
              </div>

              <div class="accession-card-details q-mb-xs">
                <p class="text-body1 text-secondary">
                  {{ job.trayed ? 'Trayed' : 'Non-Trayed' }}
                </p>
              </div>

              <div class="accession-card-details">
                <label class="text-body1">Status:</label>
                <p
                  class="text-body1 outline"
                  :class="[ job.status == 'Paused' ? 'text-highlight-yellow' : 'text-highlight' ]"
                >
                  {{ job.status }}
                </p>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
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
            v-if="accessionJob.trayed == null"
            class="text-h6"
          >
            Start New Accession
          </h2>
          <q-btn
            v-else
            icon="chevron_left"
            name="back"
            label="Back"
            no-caps
            flat
            dense
            class="text-body1"
            @click="accessionJob.trayed = null"
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
          v-if="accessionJob.trayed == null"
          class="column no-wrap items-center"
        >
          <q-btn
            outline
            no-caps
            padding="14px md"
            label="Non-Tray Accession"
            class="accession-modal-btn full-width text-body1 q-mb-md"
            @click="accessionJob.trayed = false"
          />

          <q-btn
            outline
            no-caps
            padding="14px md"
            label="Trayed Accession"
            class="accession-modal-btn full-width text-body1"
            @click="accessionJob.trayed = true"
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
                :options="owners"
                option-type="owners"
                option-value="id"
                option-label="name"
                :placeholder="'Select Owner'"
              />
            </div>

            <div
              v-if="!accessionJob.trayed"
              class="form-group q-mb-md"
            >
              <label class="form-group-label">
                Container Size (Optional)
              </label>
              <SelectInput
                v-model="accessionJob.size_class"
                :options="sizeClass"
                option-type="sizeClass"
                option-value="id"
                option-label="name"
                :placeholder="'Select Size Class'"
              />
            </div>

            <div class="form-group">
              <label class="form-group-label">
                Media Type (Optional)
              </label>
              <SelectInput
                v-model="accessionJob.media_type"
                :options="mediaTypes"
                option-type="mediaTypes"
                option-value="id"
                option-label="name"
                :placeholder="'Select Media Type'"
              />
            </div>
          </q-card-section>
        </template>
      </template>

      <template #footer-content>
        <q-card-section
          v-if="accessionJob.trayed !== null"
          class="row no-wrap justify-between items-center q-pt-sm"
        >
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Submit"
            class="text-body1 full-width"
            :disable="!canSubmitAccessionJob"
            :loading="appActionIsLoadingData"
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
import { useGlobalStore } from '@/stores/global-store'
import { useAccessionStore } from 'src/stores/accession-store'
import { useOptionStore } from 'src/stores/option-store'
import SelectInput from '@/components/SelectInput.vue'
import PopupModal from '@/components/PopupModal.vue'

const router = useRouter()

// Store Data
const { appIsLoadingData, appActionIsLoadingData } = storeToRefs(useGlobalStore())
const { resetAccessionStore, postAccessionJob, getAccessionJobList, getAccessionJob } = useAccessionStore()
const { accessionJob, accessionJobList } = storeToRefs(useAccessionStore())
const { owners, mediaTypes, sizeClass } = storeToRefs(useOptionStore())

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
  loadAccessionJobs()
})

const loadAccessionJobs = async () => {
  try {
    appIsLoadingData.value = true
    await getAccessionJobList()
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
const loadAccessionJob = async (jobId) => {
  try {
    appIsLoadingData.value = true
    await getAccessionJob(jobId)

    router.push({
      name: 'accession',
      params: {
        jobId
      }
    })
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

const reset = () => {
  resetAccessionStore()
  showAccessionModal.value = false
}
const startAccessionProcess = () => {
  resetAccessionStore()
  showAccessionModal.value = !showAccessionModal.value
}
const submitAccessionJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const currentDate = new Date()
    const payload = {
      last_transition: currentDate,
      size_class_id: accessionJob.trayed ? undefined : accessionJob.value.size_class,
      media_type_id: accessionJob.value.media_type,
      owner_id: accessionJob.value.owner,
      run_time: currentDate.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).split(' ').shift(),
      status: 'Running',
      trayed: accessionJob.value.trayed
    }

    await postAccessionJob(payload)

    router.push({
      name: 'accession',
      params: {
        jobId: accessionJob.value.id
      }
    })

    handleAlert({
      type: 'success',
      text: 'An Accession Job has successfully been created.',
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
    showAccessionModal.value = false
  }
}
</script>

<style lang="scss" scoped>
.accession {
  &-btn {
    position: relative;
    display: flex;
    min-width: 250px;
    width: 100%;
    min-height: 240px;
    padding: 0;
    border: 1px dashed $color-black;
    border-width: 2px;
    border-radius: 4px;
    transition: 0.3s ease;

    @media (max-width: $breakpoint-sm-min) {
      min-height: 120px;

      :deep(.q-icon) {
        position: absolute;
        top: 25px;
      }
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
        width: 9rem;
        line-height: normal;
      }
    }
  }

  &-card {
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    min-width: 250px;
    min-height: 240px;
    padding: 0;
    border-color: $secondary;
    border-radius: 4px;
    transition: 0.3s ease;

    @media (max-width: $breakpoint-sm-min) {
      flex-flow: row nowrap;
      min-height: initial;

      .q-card__section {
        width: 50%;
      }
    }

    &:hover:not(:disabled) {
      color: $accent;
      border-color: $accent;
      cursor: pointer;
    }

    &-barcode {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 2.5rem .5rem;
      background-color: $secondary;
      color: $color-white;

      @media (max-width: $breakpoint-sm-min) {
        padding: 1rem .75rem;
        word-break: break-word;
      }
    }

    &-details {
      display: flex;
      flex-flow: row wrap;
      width: 100%;

      label {
        margin-right: .5rem;
      }
    }
  }
}
</style>