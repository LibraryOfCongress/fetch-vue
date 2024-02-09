<template>
  <q-dialog
    v-model="showPopupModal"
    persistent
    @hide="emit('reset')"
  >
    <q-card class="popup-modal">
      <!-- header section -->
      <slot
        name="header-content"
        :hide-modal="hideModal"
      >
        <q-card-section class="row items-center justify-between q-pb-none">
          <h2 class="text-h6">
            {{ title }}
          </h2>

          <q-btn
            icon="close"
            flat
            round
            dense
            @click="showPopupModal = false"
          />
        </q-card-section>
      </slot>

      <!-- main content -->
      <slot
        name="main-content"
        :hide-modal="hideModal"
      >
        <q-card-section>
          <p>{{ text }}</p>
        </q-card-section>
      </slot>

      <!-- footer section -->
      <slot
        name="footer-content"
        :hide-modal="hideModal"
      >
        <q-card-actions
          v-if="showActions"
          class="row no-wrap justify-between items-center"
        >
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Confirm"
            class="popup-modal-btn text-body1 full-width"
            @click="emit('confirm'); showPopupModal = false;"
          />

          <q-space class="q-mx-xs" />

          <q-btn
            outline
            no-caps
            label="Cancel"
            class="popup-modal-btn text-body1 full-width"
            @click="showPopupModal = false"
          />
        </q-card-actions>
      </slot>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

// Props
defineProps({
  title: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits([
  'reset',
  'confirm'
])

// Local Data
const showPopupModal = ref(true)

// Logic
const hideModal = () => {
  showPopupModal.value = false
}
defineExpose({ hideModal })
</script>

<style lang="scss" scoped>
.popup-modal {
    width: 500px;

    @media (max-width: $breakpoint-sm-min) {
      width: 90vw;
    }

    &-btn {
      transition: .3s ease;

      &:hover {
        color: $accent;
        border-color: $accent;
      }
    }
  }
</style>