<template>
  <q-dialog
    v-model="showItemOverlay"
    :position="'right'"
    full-height
    :class="$style.overlay"
  >
    <q-card class="item-content">
      <q-card-section
        v-if="currentScreenSize > 600"
        class="row items-center justify-end q-pb-none"
      >
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>

      <q-card-section>
        <div class="item-barcode text-h4">
          {{ itemData.id }}
        </div>
      </q-card-section>

      <q-card-section class="column q-pt-xs-none q-pt-sm-md">
        <h1 class="text-h4 q-mb-xs-sm q-mb-sm-md">
          {{ itemData.title }}
        </h1>

        <div class="item-details">
          <label class="item-details-label">
            Barcode:
          </label>
          <p class="item-details-text">
            {{ itemData.id }}
          </p>
        </div>

        <div class="item-details">
          <label class="item-details-label">
            Media Type:
          </label>
          <p class="item-details-text outline">
            {{ itemData.media_type }}
          </p>
        </div>

        <div class="item-details">
          <label class="item-details-label">
            Size Class:
          </label>
          <p class="item-details-text outline">
            {{ itemData.size }}
          </p>
        </div>

        <div class="item-details">
          <label class="item-details-label">
            Volume:
          </label>
          <p class="item-details-text">
            {{ itemData.volume }}
          </p>
        </div>

        <div class="item-details">
          <label class="item-details-label">
            Dimensions:
          </label>
          <p class="item-details-text">
            {{ itemData.dimensions }}
          </p>
        </div>

        <div class="item-details">
          <label class="item-details-label">
            Condition:
          </label>
          <p class="item-details-text text-highlight-red">
            {{ itemData.condition }}
          </p>
        </div>
      </q-card-section>

      <q-card-section class="column q-pt-none">
        <h1 class="text-h4 q-mb-xs-sm q-mb-sm-md">
          Owner
        </h1>

        <div class="item-details">
          <p class="item-details-text outline">
            {{ itemData.owner }}
          </p>
        </div>
      </q-card-section>

      <q-card-section class="column q-pt-none">
        <h1 class="text-h4 q-mb-xs-sm q-mb-sm-md">
          Dates
        </h1>

        <div class="item-details">
          <label class="item-details-label">
            Accession Date:
          </label>
          <p class="item-details-text">
            {{ itemData.accession_date }}
          </p>
        </div>

        <div class="item-details">
          <label class="item-details-label">
            Withdrawal Date:
          </label>
          <p class="item-details-text">
            {{ itemData.withdraw_date }}
          </p>
        </div>

        <div class="item-details">
          <label class="item-details-label">
            Arrival Date:
          </label>
          <p class="item-details-text">
            {{ itemData.arrival_date }}
          </p>
        </div>
      </q-card-section>

      <q-card-section class="column q-pt-none">
        <h1 class="text-h4 q-mb-xs-sm q-mb-sm-md">
          Location
        </h1>

        <div class="item-details">
          <p class="item-details-text text-highlight q-mr-sm">
            In
          </p>
          <p class="item-details-text outline q-mr-sm">
            {{ facility }}
          </p>
          <p class="item-details-text outline">
            {{ itemData.temp_location }}
          </p>
        </div>
      </q-card-section>

      <q-card-section
        v-if="currentScreenSize <= 600"
        class="row items-center q-pt-sm"
      >
        <q-btn
          class="full-width"
          color="primary"
          label="Close"
          v-close-popup
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'

export default defineComponent({
  name: 'ItemDataOverlay',
  props: {
    itemData: {
      type: Object,
      required: true
    },
    facility: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  setup () {
    const { currentScreenSize } = useCurrentScreenSize()
    return {
      currentScreenSize
    }
  },
  data () {
    return {
      showItemOverlay: true
    }
  },
  watch: {
    showItemOverlay () {
      if (this.showItemOverlay == false) {
        setTimeout(() => {
          // we wait for the vue transition for v-close-popup then fire off the close emit to parent
          this.$emit('close')
        }, 200)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.item {
  &-content {
    width: 600px;

    @media (max-width: $breakpoint-sm-min) {
      width: 100vw;
      border-radius: 0;
    }
  }

  &-barcode {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 18rem;
    background-color: $secondary;
    color: $color-white;
    border-radius: 3px;

    @media (max-width: $breakpoint-sm-min) {
      height: 5rem;
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
.overlay {
  :global(.q-dialog__inner) {
    padding: 0;
  }
}
</style>
