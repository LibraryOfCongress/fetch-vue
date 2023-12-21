<template>
  <div class="verification-container">
    <!-- jobs in progress list -->
    <div class="row">
      <div class="col">
        <h1 class="text-h4 text-bold q-mb-lg">
          Jobs In Progress
        </h1>
      </div>
    </div>

    <div class="row">
      <div
        v-if="jobsInProgress.length == 0"
        class="col-auto"
      >
        <p class="text-h6">
          No jobs currently in progress...
        </p>
      </div>
      <template v-else>
        <div
          v-for="job in jobsInProgress"
          :key="job.id"
          class="col-auto q-pa-xs-xs q-pa-lg-sm q-pa-xl-md"
        >
          <q-card
            flat
            bordered
            class="verification-card"
            @click="loadVerificationJob(job.id)"
          >
            <q-card-section class="q-pa-none">
              <div class="verification-card-barcode text-h4">
                {{ job.id }}
              </div>
            </q-card-section>

            <q-card-section class="q-py-md q-px-md">
              <div class="verification-card-details q-mb-xs">
                <label class="text-body1">Job #:</label>
                <p class="text-body1">
                  {{ job.id }}
                </p>
              </div>

              <div class="verification-card-details q-mb-xs">
                <p class="text-body1 text-secondary">
                  {{ job.type == 1 ? 'Non-Trayed' : 'Trayed' }}
                </p>
              </div>

              <div class="verification-card-details">
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

    <!-- jobs in queue list -->
    <div class="row q-mt-xl">
      <div class="col">
        <h1 class="text-h4 text-bold q-mb-lg">
          Jobs In Queue
        </h1>
      </div>
    </div>

    <div class="row">
      <div
        v-if="jobsInQueue.length == 0"
        class="col-auto"
      >
        <p class="text-h6">
          No jobs currently in queue...
        </p>
      </div>
      <template v-else>
        <div
          v-for="job in jobsInQueue"
          :key="job.id"
          class="col-auto q-pa-xs-xs q-pa-lg-sm q-pa-xl-md"
        >
          <q-card
            flat
            bordered
            class="verification-card"
            @click="loadVerificationJob(job.id)"
          >
            <q-card-section class="q-pa-none">
              <div class="verification-card-barcode text-h4">
                {{ job.id }}
              </div>
            </q-card-section>

            <q-card-section class="q-py-md q-px-md">
              <div class="verification-card-details q-mb-xs">
                <label class="text-body1">Job #:</label>
                <p class="text-body1">
                  {{ job.id }}
                </p>
              </div>

              <div class="verification-card-details q-mb-xs">
                <p class="text-body1 text-secondary">
                  {{ job.type == 1 ? 'Non-Trayed' : 'Trayed' }}
                </p>
              </div>

              <div class="verification-card-details">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVerificationStore } from 'src/stores/verification-store'

const router = useRouter()

// Store Data
const verificationStore = useVerificationStore()

// Local Data
const jobsInProgress = ref([])
const jobsInQueue = ref([])

// Logic
onMounted(() => {
  loadVerificationJobs()
})

const loadVerificationJobs = async () => {
  try {
    const res = await verificationStore.getVerificationJobList()

    // filter jobs by status
    if (res.data) {
      jobsInProgress.value = res.data.filter(job => job.status !== 'In Queue')
      jobsInQueue.value = res.data.filter(job => job.status == 'In Queue')
    }
  } catch (error) {
    // TODO: replace error with popup alert
    console.log(error)
  }
}
const loadVerificationJob = async (jobId) => {
  try {
    await verificationStore.getVerificationJob(jobId)

    router.push({
      name: 'verification',
      params: {
        jobId
      }
    })
  } catch (error) {
    // TODO: replace error with popup alert
    console.log(error)
  }
}
</script>

<style lang="scss" scoped>
.verification {
  &-card {
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    min-width: 250px;
    padding: 0;
    border-color: $secondary;
    border-radius: 4px;
    transition: 0.3s ease;

    @media (max-width: $breakpoint-sm-min) {
      min-width: 164px;
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