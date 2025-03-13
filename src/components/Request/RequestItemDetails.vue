<template>
  <div class="request">
    <div class="row">
      <div class="col">
        <h1 class="text-h4 text-bold q-mb-xs-md q-mb-sm-lg">
          Request Item: {{ requestJob.id }}
        </h1>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-lg-4 q-pr-xs-none q-pr-lg-md q-pb-xs-md q-pb-lg-none">
        <BarcodeBox
          :barcode="requestJob.item ? requestJob.item.barcode.value : requestJob.non_tray_item.barcode.value"
          :class="renderRequestItemStatus == 'In' ? 'bg-color-green-light text-positive' : 'bg-color-pink text-negative'"
          class="q-py-xs-sm q-py-sm-md"
        />
      </div>
      <template v-if="currentScreenSize !== 'xs'">
        <div class="col-sm-4 col-lg-3">
          <div class="column no-wrap">
            <div class="request-details">
              <label class="request-details-label text-h6">
                Item Barcode
              </label>
              <EssentialLink
                :title="requestJob.item ? requestJob.item.barcode.value : requestJob.non_tray_item.barcode.value"
                @click="routeToItemDetail(requestJob.item ? requestJob.item.barcode.value : requestJob.non_tray_item.barcode.value)"
                dense
                class="request-details-text q-pa-none"
              />
            </div>

            <div class="request-details">
              <label class="request-details-label text-h6">
                Request ID
              </label>
              <p class="request-details-text">
                {{ requestJob.id }}
              </p>
            </div>

            <div class="request-details">
              <label class="request-details-label text-h6">
                External Request ID
              </label>
              <p class="request-details-text">
                {{ requestJob.external_request_id }}
              </p>
            </div>

            <div class="request-details">
              <label class="request-details-label text-h6">
                Request Status
              </label>
              <p
                class="request-details-text outline"
                :class="renderRequestStatus == 'Completed' ? 'text-highlight' : renderRequestStatus == 'Requested' || renderRequestStatus == 'PickList' ? 'text-highlight-warning' : 'text-highlight-negative'"
              >
                {{ renderRequestStatus }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="col-sm-4 col-lg-3"
        >
          <div class="column no-wrap">
            <div class="request-details">
              <label class="request-details-label text-h6">
                Request Type
              </label>
              <p
                class="request-details-text"
              >
                {{ requestJob.request_type ? requestJob.request_type.type : '' }}
              </p>
            </div>

            <div class="request-details">
              <label class="request-details-label text-h6">
                Priority
              </label>
              <p
                class="request-details-text"
                :class="requestJob.priority ? 'outline' : null"
              >
                {{ requestJob.priority ? requestJob.priority.value : '' }}
              </p>
            </div>

            <div class="request-details">
              <label class="request-details-label text-h6">
                Requested Date
              </label>
              <p class="request-details-text">
                {{ formatDateTime(requestJob.create_dt).date }}
              </p>
            </div>

            <div class="request-details">
              <label class="request-details-label text-h6">
                Requestor Name
              </label>
              <p class="request-details-text">
                {{ requestJob.requestor_name }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 col-lg-2">
          <div class="column no-wrap">
            <div class="request-details">
              <label class="request-details-label text-h6">
                Delivery Location:
              </label>
              <p class="request-details-text">
                {{ requestJob.delivery_location ? requestJob.delivery_location.name : '' }}
              </p>
            </div>
          </div>
        </div>
      </template>
      <!-- <template v-else>
        <div class="col-12 q-pb-sm">
          <div class="request-details">
            <label class="request-details-label">
              Tray Barcode:
            </label>
            <EssentialLink
              :title="itemDetails.tray ? itemDetails.tray.barcode.value : 'N/A'"
              @click="routeToItemDetail(itemDetails.tray.barcode.value)"
              :disabled="!itemDetails.tray"
              dense
              class="request-details-text q-pa-none"
            />
          </div>
          <div class="request-details">
            <label class="request-details-label">
              Shelf Barcode:
            </label>
            <EssentialLink
              :title="renderShelfBarcode()"
              @click="() => (console.log('pending shelf detail page'))"
              :disabled="!renderShelfBarcode()"
              dense
              class="request-details-text q-pa-none"
            />
          </div>
          <div class="request-details">
            <label class="request-details-label">
              Media Type:
            </label>
            <p class="request-details-text outline">
              {{ itemDetails.media_type.name }}
            </p>
          </div>
          <div class="request-details">
            <label class="request-details-label">
              Size Class:
            </label>
            <p class="request-details-text">
              {{ itemDetails.size_class.name }}
            </p>
          </div>
          <div class="request-details">
            <label class="request-details-label">
              Status:
            </label>
            <p
              class="request-details-text outline"
              :class="itemDetails.status == 'Out' ? 'text-highlight-negative' : 'text-highlight'"
            >
              {{ itemDetails.status }}
            </p>
          </div>
          <div class="request-details">
            <label class="request-details-label">
              Owner:
            </label>
            <p class="request-details-text outline">
              {{ itemDetails.owner?.name ? itemDetails.owner?.name : "" }}
            </p>
          </div>
        </div>
        <div class="col-12 q-pb-sm">
          <h1 class="text-h4 q-mb-xs-sm q-mb-sm-md">
            Dates
          </h1>

          <div class="request-details">
            <label class="request-details-label">
              Accession Date:
            </label>
            <p class="request-details-text">
              {{ formatDateTime(itemDetails.accession_dt).date }}
            </p>
          </div>
          <div class="request-details">
            <label class="request-details-label">
              Shelved Date:
            </label>
            <p class="request-details-text">
              {{ formatDateTime(itemDetails.tray ? itemDetails.tray.shelving_job?.update_dt : itemDetails.shelving_job?.update_dt).date }}
            </p>
          </div>
          <div class="request-details">
            <label class="request-details-label">
              Last Requested Date:
            </label>
            <p class="request-details-text">
              {{ formatDateTime(itemDetails.last_requested_dt).date }}
            </p>
          </div>
          <div class="request-details">
            <label class="request-details-label">
              Last Refile Date:
            </label>
            <p class="request-details-text">
              {{ formatDateTime(itemDetails.last_refiled_dt).date }}
            </p>
          </div>
          <div class="request-details">
            <label class="request-details-label">
              Withdrawal Date:
            </label>
            <p class="request-details-text">
              {{ formatDateTime(itemDetails.withdrawal_dt).date }}
            </p>
          </div>
        </div>
        <div class="col-12 q-pb-sm">
          <h1 class="text-h4 q-mb-xs-sm q-mb-sm-md">
            Item Location
          </h1>

          <div class="request-details">
            <p
              v-if="renderItemBuilding()"
              class="request-details-text outline q-mr-sm"
            >
              {{ renderItemBuilding() }}
            </p>
            <p class="request-details-text outline">
              {{ getItemLocation(itemDetails.tray ?? itemDetails) }}
            </p>
          </div>
        </div>
      </template> -->
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useRequestStore } from '@/stores/request-store'
import { storeToRefs } from 'pinia'
import BarcodeBox from '@/components/BarcodeBox.vue'
import EssentialLink from '@/components/EssentialLink.vue'

const router = useRouter()

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { requestJob } = storeToRefs(useRequestStore())

// Local Data
const renderRequestItemStatus = computed(() => {
  if (requestJob.value.item && requestJob.value.item.status == 'Out') {
    return 'Out'
  } else {
    return 'In'
  }
})
const renderRequestStatus = computed(() => {
  if (requestJob.value.scanned_for_retrieval) {
    return 'Completed'
  } else if (requestJob.value.scanned_for_pick_list) {
    return 'PickList'
  } else {
    return 'Requested'
  }
})

// Logic
const formatDateTime = inject('format-date-time')

const routeToItemDetail = (barcode) => {
  router.push({
    name: 'record-management-items',
    params: {
      barcode
    }
  })
}
</script>

<style lang="scss" scoped>
.request {
  &-details {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;

    @media (max-width: $breakpoint-sm-min) {
      margin-bottom: 8px;
    }

    &-label {
      width: 100%;

      @media (max-width: $breakpoint-sm-min) {
        width: initial;
        margin-right: 4px;
      }
    }

    &-text {
      min-width: 1px;
      min-height: 28px; // this offsets any text with outline/highlight classes

      @media (max-width: $breakpoint-sm-min) {
        min-height: initial;
      }
    }
  }
}
</style>
