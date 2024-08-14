<template>
  <div class="item">
    <div class="row">
      <div class="col">
        <h1 class="text-h4 text-bold q-mb-xs-sm q-mb-sm-lg">
          {{ itemData.title }}
        </h1>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-lg-3 q-pr-xs-none q-pr-lg-md q-pb-xs-md q-pb-lg-none">
        <BarcodeBox
          :barcode="itemData.id"
          class="q-py-xs-sm q-py-sm-md"
        />
      </div>
      <template v-if="currentScreenSize !== 'xs'">
        <div class="col-sm-4 col-lg-3">
          <div class="column no-wrap">
            <div class="item-details">
              <label class="item-details-label text-h6">
                Media Type
              </label>
              <p class="item-details-text text-highlight outline">
                {{ itemData.media_type }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Size Class
              </label>
              <p class="item-details-text text-highlight outline">
                {{ itemData.size_class }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Volume
              </label>
              <p class="item-details-text outline">
                {{ itemData.volume }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Container Type
              </label>
              <p class="item-details-text outline">
                {{ itemData.container_type }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="col-sm-4 col-lg-3"
        >
          <div class="column no-wrap">
            <div class="item-details">
              <label class="item-details-label text-h6">
                Owner
              </label>
              <p class="item-details-text">
                {{ itemData.owner }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Subcollection
              </label>
              <p class="item-details-text">
                {{ itemData.subcollection }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Dimensions
              </label>
              <p class="item-details-text outline">
                {{ itemData.dimensions }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Condition
              </label>
              <p class="item-details-text outline">
                {{ itemData.condition }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 col-lg-3">
          <div class="column no-wrap">
            <div class="item-details">
              <label class="item-details-label text-h6">
                Accession Date
              </label>
              <p class="item-details-text outline">
                {{ itemData.accession_date }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Withdrawal Date
              </label>
              <p class="item-details-text outline">
                {{ itemData.withdraw_date }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Arrival Date
              </label>
              <p class="item-details-text outline">
                {{ itemData.arrival_date }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Location
              </label>
              <p class="item-details-text text-highlight outline q-mr-sm">
                {{ itemData.status }}
              </p>
              <p class="item-details-text outline q-mr-sm">
                {{ itemData.building }}
              </p>
              <p class="item-details-text outline">
                {{ itemData.location }}
              </p>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="col-12 q-pb-sm">
          <div class="item-details">
            <label class="item-details-label">
              Media Type:
            </label>
            <p class="item-details-text outline">
              {{ itemData.media_type }}
            </p>
          </div>

          <div
            v-if="itemData.size"
            class="item-details"
          >
            <label class="item-details-label">
              Size Class:
            </label>
            <p class="item-details-text outline">
              {{ itemData.size }}
            </p>
          </div>

          <div
            v-if="itemData.volume"
            class="item-details"
          >
            <label class="item-details-label">
              Volume:
            </label>
            <p class="item-details-text">
              {{ itemData.volume }}
            </p>
          </div>

          <div
            v-if="itemData.container_type"
            class="item-details"
          >
            <label class="item-details-label">
              Container Type:
            </label>
            <p class="item-details-text outline">
              {{ itemData.container_type }}
            </p>
          </div>

          <div
            v-if="itemData.subcollection"
            class="item-details"
          >
            <label class="item-details-label">
              Subcollection:
            </label>
            <p class="item-details-text">
              {{ itemData.subcollection }}
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

          <div
            v-if="itemData.condition"
            class="item-details"
          >
            <label class="item-details-label">
              Condition:
            </label>
            <p class="item-details-text text-highlight-negative">
              {{ itemData.condition }}
            </p>
          </div>
        </div>
        <div class="col-12 q-pb-sm">
          <h1 class="text-h4 q-mb-xs-sm q-mb-sm-md">
            Owner
          </h1>

          <div class="item-details">
            <p class="item-details-text outline">
              {{ itemData.owner }}
            </p>
          </div>
        </div>
        <div class="col-12 q-pb-sm">
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

          <div
            v-if="itemData.withdraw_date"
            class="item-details"
          >
            <label class="item-details-label">
              Withdrawal Date:
            </label>
            <p class="item-details-text">
              {{ itemData.withdraw_date }}
            </p>
          </div>

          <div
            v-if="itemData.arrival_date"
            class="item-details"
          >
            <label class="item-details-label">
              Arrival Date:
            </label>
            <p class="item-details-text">
              {{ itemData.arrival_date }}
            </p>
          </div>
        </div>
        <div class="col-12">
          <h1 class="text-h4 q-mb-xs-sm q-mb-sm-md">
            Location
          </h1>

          <div class="item-details">
            <p class="item-details-text text-highlight q-mr-sm">
              {{ itemData.status }}
            </p>
            <p class="item-details-text outline q-mr-sm">
              {{ itemData.building }}
            </p>
            <p class="item-details-text outline">
              {{ itemData.location }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import BarcodeBox from '@/components/BarcodeBox.vue'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
// Props
defineProps({
  itemData: {
    type: Object,
    required: true
  }
})

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
// const { templateAction } = useTemplateStore()
// const { templateState } = storeToRefs(useTemplateStore())

// Local Data
// const templateData = ref(null)

// Logic
// const handleHeaderOffset = inject('handle-offset')
// const templateFunction = (value) => {
//   return value
// }
</script>

<style lang="scss" scoped>
.item {
  &-details {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;

    @media (max-width: $breakpoint-sm-min) {
      margin-bottom: 5px;
    }

    &-label {
      width: 100%;

      @media (max-width: $breakpoint-sm-min) {
        width: initial;
        margin-right: 4px;
      }
    }
  }
}
</style>
