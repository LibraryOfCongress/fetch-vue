<template>
  <div class="accession-container-mobile-menu">
    <template v-if="editMode">
      <q-btn
        no-caps
        unelevated
        color="accent"
        label="Save Edits"
        class="full-width text-body1"
        @click="emit('updateTray')"
        :disabled="accessionJob.status == 'Paused'"
      />

      <q-space class="q-mx-xs" />

      <q-btn
        no-caps
        unelevated
        outline
        color="accent"
        label="Cancel"
        class="full-width text-body1"
        @click="emit('cancelTray')"
      />
    </template>

    <template v-else>
      <q-btn
        no-caps
        unelevated
        outline
        :icon="accessionJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
        color="accent"
        :label="accessionJob.status !== 'Paused' ? 'Pause Job' : 'Resume Job'"
        class="btn-no-wrap text-body1 full-width"
        @click="accessionJob.status !== 'Paused' ? emit('pauseJob') : emit('resumeJob')"
      />

      <q-space class="q-mx-xs" />

      <q-btn
        no-caps
        unelevated
        icon="check"
        color="positive"
        label="Complete Job"
        class="btn-no-wrap text-body1 full-width"
        :outline="!allItemsVerified || accessionJob.status == 'Paused'"
        :disabled="!allItemsVerified || accessionJob.status == 'Paused'"
        @click="emit('completeJob')"
      />
    </template>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAccessionStore } from '@/stores/accession-store'

//Props
defineProps({
  editMode: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'updateTray',
  'cancelTray',
  'pauseJob',
  'resumeJob',
  'completeJob'
])

// Store Data
const { allItemsVerified, accessionJob } = storeToRefs(useAccessionStore())
</script>

<style lang="scss" scoped>
.accession-container {
  &-mobile-menu {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    padding: 8px;
    background-color: $color-white;
    z-index: 2000;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1), 0 0px 10px rgba(0, 0, 0, 0.12);
    }
  }
}
</style>