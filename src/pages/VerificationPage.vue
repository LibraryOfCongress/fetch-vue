<template>
  <q-page
    :padding="!route.params.jobId"
    class="verification column no-wrap"
  >
    <BreadCrumb v-if="route.params.jobId">
      <template #actions>
        <div
          v-if="currentScreenSize == 'xs' && verificationJob.type == 1"
          class="col-auto q-ml-auto q-mr-sm"
        >
          <q-btn
            no-caps
            unelevated
            color="accent"
            :label="isLastItemToBeScanned ? 'Verifiy Item' : verificationContainer.id == null ? 'Scan Item' : 'Next Item'"
            class="text-body1"
            :disabled="verificationJob.status == 'Paused' || allItemsVerified"
            @click="isLastItemToBeScanned ? verificationContainerComponent.validateItemBarcode(verificationContainer.id) : verificationContainerComponent.showScanOverlay = !verificationContainerComponent.showScanOverlay"
          />
        </div>
      </template>
    </BreadCrumb>

    <VerificationInit v-if="!route.params.jobId" />

    <VerificationContainerDisplay
      v-if="route.params.jobId"
      ref="verificationContainerComponent"
    />
  </q-page>
</template>

<script setup>
import { onBeforeMount, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useVerificationStore } from 'src/stores/verification-store'
import BreadCrumb from '@/components/BreadCrumb.vue'
import VerificationInit from '@/components/Verification/VerificationInit.vue'
import VerificationContainerDisplay from '@/components/Verification/VerificationContainerDisplay.vue'

const route = useRoute()

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { getVerificationJob, getVerificationTray } = useVerificationStore()
const { verificationJob, verificationContainer, allItemsVerified } = storeToRefs(useVerificationStore())

// Local Data
const verificationContainerComponent = ref(null)
const isLastItemToBeScanned = computed(() => {
  if (verificationJob.value.type == 2) {
    return false
  } else {
    const itemsToBeScanned = verificationJob.value.items.filter(item => item.verified == false)
    return itemsToBeScanned.length == 1 ? true : false
  }
})

onBeforeMount( async () => {
  // if there is an id in the url we need to load that job
  if (route.params.jobId) {
    await getVerificationJob(route.params.jobId)
  }

  if (route.params.containerId) {
    await getVerificationTray(route.params.containerId)
  }
})
</script>
