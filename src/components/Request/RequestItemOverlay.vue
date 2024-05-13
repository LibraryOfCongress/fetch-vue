<template>
  <q-dialog
    v-model="showItemOverlay"
    :position="'right'"
    full-height
    :class="$style.requestOverlay"
    @hide="emit('close')"
    aria-label="itemDetailOverlay"
  >
    <q-card class="request-item-content">
      <q-card-section
        v-if="currentScreenSize !== 'xs'"
        class="row items-center justify-end q-pb-none"
      >
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          aria-label="closeOverlay"
        />
      </q-card-section>

      <q-card-section>
        <BarcodeBox
          :barcode="itemData.barcode.value"
        />
      </q-card-section>

      <q-card-section class="column q-pt-xs-none q-pt-sm-md">
        <h1
          v-if="itemData.title"
          class="text-h4 q-mb-xs-sm q-mb-sm-md"
        >
          {{ itemData.title }}
        </h1>

        <div class="request-item-details">
          <label class="request-item-details-label">
            Barcode:
          </label>
          <p class="request-item-details-text">
            {{ itemData.barcode.value }}
          </p>
        </div>

        <div class="request-item-details">
          <label class="request-item-details-label">
            Media Type:
          </label>
          <p class="request-item-details-text outline">
            {{ itemData.media_type.name }}
          </p>
        </div>

        <div
          class="request-item-details"
        >
          <label class="request-item-details-label">
            Size Class:
          </label>
          <p class="request-item-details-text outline">
            {{ itemData.size_class.name }}
          </p>
        </div>

        <div
          class="request-item-details"
        >
          <label class="request-item-details-label">
            Volume:
          </label>
          <p class="request-item-details-text">
            {{ itemData.volume }}
          </p>
        </div>

        <div class="request-item-details">
          <label class="request-item-details-label">
            Dimensions:
          </label>
          <p class="request-item-details-text">
            {{ itemData.dimensions }}
          </p>
        </div>

        <div
          class="request-item-details"
        >
          <label class="request-item-details-label">
            Condition:
          </label>
          <p class="request-item-details-text text-highlight-red">
            {{ itemData.condition }}
          </p>
        </div>
      </q-card-section>

      <q-card-section class="column q-pt-none">
        <h1 class="text-h4 q-mb-xs-sm q-mb-sm-md">
          Owner
        </h1>

        <div class="request-item-details">
          <p class="request-item-details-text outline">
            {{ itemData.owner.name }}
          </p>
        </div>
      </q-card-section>

      <q-card-section class="column q-pt-none">
        <h1 class="text-h4 q-mb-xs-sm q-mb-sm-md">
          Dates
        </h1>

        <div class="request-item-details">
          <label class="request-item-details-label">
            Accession Date:
          </label>
          <p class="request-item-details-text">
            {{ formatDateTime(itemData.accession_dt).date }}
          </p>
        </div>

        <div
          class="request-item-details"
        >
          <label class="request-item-details-label">
            Withdrawal Date:
          </label>
          <p class="request-item-details-text">
            {{ formatDateTime(itemData.withdrawal_dt).date }}
          </p>
        </div>

        <div
          class="request-item-details"
        >
          <label class="request-item-details-label">
            Arrival Date:
          </label>
          <p class="request-item-details-text">
            {{ formatDateTime(itemData.arrival_dt).date }}
          </p>
        </div>
      </q-card-section>

      <q-card-section
        class="column q-pt-none"
      >
        <h1 class="text-h4 q-mb-xs-sm q-mb-sm-md">
          Location
        </h1>

        <div class="request-item-details">
          <p class="request-item-details-text text-highlight q-mr-sm">
            {{ itemData.status }}
          </p>
          <p class="request-item-details-text outline q-mr-sm">
            {{ itemData.building.name }}
          </p>
          <p class="request-item-details-text outline">
            {{ itemData.item_location }}
          </p>
        </div>
      </q-card-section>

      <q-card-section
        v-if="currentScreenSize == 'xs'"
        class="row items-center q-pt-sm"
      >
        <q-btn
          no-caps
          unelevated
          class="text-body1 full-width"
          color="primary"
          label="Close"
          v-close-popup
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, inject } from 'vue'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import BarcodeBox from '@/components/BarcodeBox.vue'

// Props
defineProps({
  itemData: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close'])

// Compasables
const { currentScreenSize } = useCurrentScreenSize()

// Local Data
const showItemOverlay = ref(true)

// Logic
const formatDateTime = inject('format-date-time')
</script>

<style lang="scss" scoped>
.request-item {
  &-content {
    width: 600px;

    @media (max-width: $breakpoint-sm-min) {
      width: 100vw;
      border-radius: 0;
    }
  }

  &-details {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;
    margin-bottom: .5rem;

    @media (max-width: $breakpoint-sm-min) {
      margin-bottom: 5px;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &-label {
      margin-right: 4px;
    }
  }
}
</style>

<style lang="scss" module>
.requestOverlay {
  :global(.q-dialog__inner) {
    padding: 0;
  }
}
</style>