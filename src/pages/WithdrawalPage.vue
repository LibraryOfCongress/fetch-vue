<template>
  <q-page
    :style-fn="handlePageOffset"
    :padding="!route.params.jobId"
    class="withdrawal"
  >
    <LoadingOverlay />

    <WithdrawalDashboard v-if="!route.params.jobId" />
    <WithdrawalJobDetail v-if="route.params.jobId" />
  </q-page>
</template>

<script setup>
import { inject, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useWithdrawalStore } from '@/stores/withdrawal-store'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import WithdrawalDashboard from '@/components/Withdrawal/WithdrawalDashboard.vue'
import WithdrawalJobDetail from '@/components/Withdrawal/WithdrawalJobDetail.vue'

const route = useRoute()

// Store Data
const { getWithdrawJob } = useWithdrawalStore()

// Logic
const handlePageOffset = inject('handle-page-offset')

onBeforeMount( async () => {
  // if there is an id in the url we need to load that withdrawal job directly
  if (route.params.jobId) {
    await getWithdrawJob(route.params.jobId)
  }
})
</script>
<style lang="scss" scoped>
</style>
