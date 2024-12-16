<template>
  <div class="item">
    <div class="row">
      <div class="col">
        <h1 class="text-h4 text-bold q-mb-xs-sm q-mb-sm-lg">
          {{ itemData.item ? itemData.item.title : itemData.non_tray_item.title }}
        </h1>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-lg-3 q-pr-xs-none q-pr-lg-md q-pb-xs-md q-pb-lg-none">
        <BarcodeBox
          :barcode="itemData.item ? itemData.item.barcode.value : itemData.non_tray_item.barcode.value"
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
                {{ itemData.item ? itemData.item.media_type.name : itemData.non_tray_item.media_type.name }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Size Class
              </label>
              <p class="item-details-text text-highlight outline">
                {{ itemData.item ? itemData.item.size_class.name : itemData.non_tray_item.size_class.name }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Volume
              </label>
              <p class="item-details-text outline">
                {{ itemData.item ? itemData.item.volume : itemData.non_tray_item.volume }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Location
              </label>
              <p class="item-details-text text-highlight outline q-mr-sm">
                {{ itemData.item ? itemData.item.status : itemData.non_tray_item.status }}
              </p>
              <p class="item-details-text outline q-mr-sm">
                {{ renderItemBuilding(itemData) }}
              </p>
              <p class="item-details-text outline">
                {{ itemData.item ? getItemLocation(itemData.item.tray) : getItemLocation(itemData.non_tray_item) }}
              </p>
            </div>

            <!-- <div class="item-details">
              <label class="item-details-label text-h6">
                Container Type
              </label>
              <p class="item-details-text outline">
                {{ itemData.container_type }}
              </p>
            </div> -->
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
                {{ itemData.item ? itemData.item.owner.name : itemData.non_tray_item.owner.name }}
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
                {{ itemData.item ? itemData.item.condition : itemData.non_tray_item.condition }}
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
                {{ formatDateTime(itemData.item ? itemData.item.accession_dt : itemData.non_tray_item.accession_dt).date }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Withdrawal Date
              </label>
              <p class="item-details-text outline">
                {{ formatDateTime(itemData.item ? itemData.item.withdrawal_dt : itemData.non_tray_item.withdrawal_dt).date }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Arrival Date
              </label>
              <p class="item-details-text outline">
                <!-- TODO change this once api returns correct arrival date -->
                {{ formatDateTime(itemData.item ? itemData.item.accession_dt : itemData.non_tray_item.accession_dt).date }}
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
              {{ itemData.item ? itemData.item.media_type.name : itemData.non_tray_item.media_type.name }}
            </p>
          </div>

          <div
            class="item-details"
          >
            <label class="item-details-label">
              Size Class:
            </label>
            <p class="item-details-text outline">
              {{ itemData.item ? itemData.item.size_class.name : itemData.non_tray_item.size_class.name }}
            </p>
          </div>

          <div
            class="item-details"
          >
            <label class="item-details-label">
              Volume:
            </label>
            <p class="item-details-text">
              {{ itemData.item ? itemData.item.volume : itemData.non_tray_item.volume }}
            </p>
          </div>

          <!-- <div
            class="item-details"
          >
            <label class="item-details-label">
              Container Type:
            </label>
            <p class="item-details-text outline">
              {{ itemData.container_type }}
            </p>
          </div> -->

          <div class="item-details">
            <label class="item-details-label">
              Dimensions:
            </label>
            <p class="item-details-text">
              {{ itemData.dimensions }}
            </p>
          </div>

          <div
            class="item-details"
          >
            <label class="item-details-label">
              Condition:
            </label>
            <p class="item-details-text text-highlight-negative">
              {{ itemData.item ? itemData.item.condition : itemData.non_tray_item.condition }}
            </p>
          </div>
        </div>
        <div class="col-12 q-pb-sm">
          <h1 class="text-h4 q-mb-xs-sm q-mb-sm-md">
            Owner
          </h1>

          <div class="item-details">
            <p class="item-details-text outline">
              {{ itemData.item ? itemData.item.owner.name : itemData.non_tray_item.owner.name }}
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
              {{ formatDateTime(itemData.item ? itemData.item.accession_dt : itemData.non_tray_item.accession_dt).date }}
            </p>
          </div>

          <div
            class="item-details"
          >
            <label class="item-details-label">
              Withdrawal Date:
            </label>
            <p class="item-details-text">
              {{ formatDateTime(itemData.item ? itemData.item.withdrawal_dt : itemData.non_tray_item.withdrawal_dt).date }}
            </p>
          </div>

          <div
            class="item-details"
          >
            <label class="item-details-label">
              Arrival Date:
            </label>
            <p class="item-details-text">
              <!-- TODO change this once api returns correct arrival date -->
              {{ formatDateTime(itemData.item ? itemData.item.accession_dt : itemData.non_tray_item.accession_dt).date }}
            </p>
          </div>
        </div>
        <div class="col-12">
          <h1 class="text-h4 q-mb-xs-sm q-mb-sm-md">
            Location
          </h1>

          <div class="item-details">
            <p class="item-details-text text-highlight outline q-mr-sm">
              {{ itemData.item ? itemData.item.status : itemData.non_tray_item.status }}
            </p>
            <p class="item-details-text outline q-mr-sm">
              {{ renderItemBuilding(itemData) }}
            </p>
            <p class="item-details-text outline">
              {{ itemData.item ? getItemLocation(itemData.item.tray) : getItemLocation(itemData.non_tray_item) }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
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
const formatDateTime = inject('format-date-time')
const getItemLocation = inject('get-item-location')

const renderItemBuilding = (itemData) => {
  let building = ''
  if (itemData.item && itemData.item.tray.shelf_position) {
    building = itemData.item.tray.shelf_position.location?.split('-')[0]
  } else if (itemData.non_tray_item && itemData.non_tray_item.shelf_position) {
    building = itemData.non_tray_item.shelf_position.location?.split('-')[0]
  }

  return building
}
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
