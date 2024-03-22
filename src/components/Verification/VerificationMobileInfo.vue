<template>
  <div
    v-if="scrollPosition > 165"
    class="verification-container-info-compressed row"
  >
    <div class="col-12 flex items-center q-mb-xs">
      <MoreOptionsMenu
        :options="[{ text: 'Edit' }, { text: 'Print Job' }]"
        class="q-mr-sm"
        @click="handleOptionInput"
      />
      <h1 class="text-h4 text-bold">
        {{ `Job: ${verificationJob.id}` }}
      </h1>
    </div>
    <div class="col-12 verification-container-info-compressed-list">
      <div class="verification-container-info-details-compressed">
        <label class="text-body1">
          Barcode
        </label>
        <p class="text-body1">
          {{ verificationContainer.id }}
        </p>
      </div>
      <div class="verification-container-info-details-compressed">
        <label class="text-body1">
          Owner
        </label>
        <p class="text-body1">
          {{ verificationJob.owner?.name }}
        </p>
      </div>
      <div class="verification-container-info-details-compressed">
        <label class="text-body1">
          Container Type
        </label>
        <p class="text-body1">
          Trayed
        </p>
      </div>
      <div class="verification-container-info-details-compressed">
        <label class="text-body1">
          Container Size
        </label>
        <p class="text-body1">
          {{ verificationContainer.size_class?.name }}
        </p>
      </div>
      <div class="verification-container-info-details-compressed">
        <label class="text-body1">
          Media Type
        </label>
        <p class="text-body1">
          {{ verificationContainer.media_type?.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useScrollPosition } from '@/composables/useScrollPosition.js'
import { useVerificationStore } from '@/stores/verification-store'
import { storeToRefs } from 'pinia'
// Emits
const emit = defineEmits(['handle-option-menu'])

// Composables
const { scrollPosition, scrollToTop } = useScrollPosition()

// Store Data
const {
  verificationJob,
  verificationContainer
} = storeToRefs(useVerificationStore())

// Logic
const handleOptionInput = (option) => {
  if (scrollPosition.value > 165) {
    scrollToTop()
  }

  emit('handle-option-menu', option)
}
</script>

<style lang="scss" scoped>
.verification-container-info {
  &-compressed {
    position: fixed;
    width: 100%;
    top: 95px;
    z-index: 1000;
    padding: 8px 1rem;
    background-color: $color-white;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1;
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1), 0 0px 10px rgba(0, 0, 0, 0.12);
    }

    &-list {
      overflow: auto;
      white-space: nowrap;
    }
  }

  &-details {
    &-compressed {
      display: inline-flex;
      flex-flow: column nowrap;
      padding: 4px 8px;
      border: 1px solid $color-gray;
      border-radius: 3px;

      &:not(:last-child) {
        margin-right: 5px;
      }
    }
  }
}
</style>