<template>
  <div class="item">
    <div class="row">
      <div class="col">
        <h1 class="text-h4 text-bold q-mb-xs-md q-mb-sm-lg">
          {{ itemDetails.tray ? 'Tray Item Details' : 'Non-Tray Item Details' }}
        </h1>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-lg-4 q-pr-xs-none q-pr-lg-md q-pb-xs-md q-pb-lg-none">
        <BarcodeBox
          :barcode="itemDetails.barcode.value"
          :class="itemDetails.status == 'Out' ? 'bg-color-pink text-negative' : 'bg-color-green-light text-positive'"
          class="q-py-xs-sm q-py-sm-md"
        />
      </div>
      <template v-if="currentScreenSize !== 'xs'">
        <div class="col-sm-4 col-lg-3">
          <div class="column no-wrap">
            <div class="item-details">
              <label class="item-details-label text-h6">
                Tray Barcode
              </label>
              <EssentialLink
                :title="itemDetails.tray ? itemDetails.tray.barcode.value : 'N/A'"
                @click="routeToTrayDetail(itemDetails.tray.barcode.value)"
                :disabled="!itemDetails.tray"
                dense
                class="item-details-text q-pa-none"
              />
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Shelf Barcode
              </label>
              <EssentialLink
                :title="renderShelfBarcode()"
                @click="routeToShelfDetail()"
                :disabled="!renderShelfBarcode()"
                dense
                class="item-details-text q-pa-none"
              />
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Owner
              </label>
              <p class="item-details-text">
                {{ itemDetails.owner.name }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Status
              </label>
              <p
                class="item-details-text outline"
                :class="itemDetails.status == 'Out' ? 'text-highlight-negative' : 'text-highlight' "
              >
                {{ itemDetails.status }}
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
                Media Type
              </label>
              <p class="item-details-text text-highlight outline">
                {{ itemDetails.media_type.name }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Size Class
              </label>
              <p class="item-details-text text-highlight outline">
                {{ itemDetails.size_class.name }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Accession Date
              </label>
              <p class="item-details-text">
                {{ formatDateTime(itemDetails.accession_dt).date }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Shelved Date:
              </label>
              <p class="item-details-text">
                {{ formatDateTime(itemDetails.tray ? itemDetails.tray.shelving_job?.update_dt : itemDetails.shelving_job?.update_dt).date }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-sm-4 col-lg-2">
          <div class="column no-wrap">
            <div class="item-details">
              <label class="item-details-label text-h6">
                Last Requested Date:
              </label>
              <p class="item-details-text">
                {{ formatDateTime(itemDetails.last_requested_dt).date }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Last Refile Date:
              </label>
              <p class="item-details-text">
                {{ formatDateTime(itemDetails.last_refiled_dt).date }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Withdrawal Date
              </label>
              <p class="item-details-text">
                {{ formatDateTime(itemDetails.withdrawal_dt).date }}
              </p>
            </div>

            <div class="item-details">
              <label class="item-details-label text-h6">
                Location
              </label>
              <p
                v-if="renderItemBuilding()"
                class="item-details-text outline q-mr-sm"
              >
                {{ renderItemBuilding() }}
              </p>
              <p class="item-details-text outline">
                {{ getItemLocation(itemDetails.tray ?? itemDetails) }}
              </p>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="col-12 q-pb-sm">
          <div class="item-details">
            <label class="item-details-label">
              Tray Barcode:
            </label>
            <EssentialLink
              :title="itemDetails.tray ? itemDetails.tray.barcode.value : 'N/A'"
              @click="routeToTrayDetail(itemDetails.tray.barcode.value)"
              :disabled="!itemDetails.tray"
              dense
              class="item-details-text q-pa-none"
            />
          </div>
          <div class="item-details">
            <label class="item-details-label">
              Shelf Barcode:
            </label>
            <EssentialLink
              :title="renderShelfBarcode()"
              @click="() => (console.log('pending shelf detail page'))"
              :disabled="!renderShelfBarcode()"
              dense
              class="item-details-text q-pa-none"
            />
          </div>
          <div class="item-details">
            <label class="item-details-label">
              Media Type:
            </label>
            <p class="item-details-text outline">
              {{ itemDetails.media_type.name }}
            </p>
          </div>
          <div class="item-details">
            <label class="item-details-label">
              Size Class:
            </label>
            <p class="item-details-text">
              {{ itemDetails.size_class.name }}
            </p>
          </div>
          <div class="item-details">
            <label class="item-details-label">
              Status:
            </label>
            <p
              class="item-details-text outline"
              :class="itemDetails.status == 'Out' ? 'text-highlight-negative' : 'text-highlight'"
            >
              {{ itemDetails.status }}
            </p>
          </div>
          <div class="item-details">
            <label class="item-details-label">
              Owner:
            </label>
            <p class="item-details-text outline">
              {{ itemDetails.owner.name }}
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
              {{ formatDateTime(itemDetails.accession_dt).date }}
            </p>
          </div>
          <div class="item-details">
            <label class="item-details-label">
              Shelved Date:
            </label>
            <p class="item-details-text">
              {{ formatDateTime(itemDetails.tray ? itemDetails.tray.shelving_job?.update_dt : itemDetails.shelving_job?.update_dt).date }}
            </p>
          </div>
          <div class="item-details">
            <label class="item-details-label">
              Last Requested Date:
            </label>
            <p class="item-details-text">
              {{ formatDateTime(itemDetails.last_requested_dt).date }}
            </p>
          </div>
          <div class="item-details">
            <label class="item-details-label">
              Last Refile Date:
            </label>
            <p class="item-details-text">
              {{ formatDateTime(itemDetails.last_refiled_dt).date }}
            </p>
          </div>
          <div class="item-details">
            <label class="item-details-label">
              Withdrawal Date:
            </label>
            <p class="item-details-text">
              {{ formatDateTime(itemDetails.withdrawal_dt).date }}
            </p>
          </div>
        </div>
        <div class="col-12 q-pb-sm">
          <h1 class="text-h4 q-mb-xs-sm q-mb-sm-md">
            Item Location
          </h1>

          <div class="item-details">
            <p
              v-if="renderItemBuilding()"
              class="item-details-text outline q-mr-sm"
            >
              {{ renderItemBuilding() }}
            </p>
            <p class="item-details-text outline">
              {{ getItemLocation(itemDetails.tray ?? itemDetails) }}
            </p>
          </div>
        </div>
      </template>
    </div>

    <div class="row q-mt-lg q-mb-xs-xl q-mb-sm-none">
      <div class="col-grow q-mb-xs-md q-mb-sm-none">
        <EssentialTable
          :table-columns="itemTableColumns"
          :table-visible-columns="itemTableVisibleColumns"
          :table-data="itemRequestHistory"
          :heading-row-class="'q-mb-xs-md q-mb-md-lg'"
          :heading-rearrange-class="'q-ml-auto'"
          :enable-pagination="true"
          :pagination-total="itemRequestHistoryTotal"
          :pagination-loading="appIsLoadingData"
          @update-pagination="loadRequestHistory($event)"
          @selected-table-row="null"
        >
          <template #heading-row>
            <div
              class="col-sm-5 col-md-12 col-lg-auto"
              :class="currentScreenSize == 'sm' || currentScreenSize == 'xs' ? '' : 'self-center'"
            >
              <h1 class="text-h4 text-bold">
                Request History
              </h1>
            </div>
          </template>

          <template #table-td="{ colName, value }">
            <span
              v-if="colName == 'create_dt'"
              class=""
            >
              {{ formatDateTime(value).date }}
            </span>
          </template>
        </EssentialTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, ref, watch } from 'vue'
import { useRouter  } from 'vue-router'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useRecordManagementStore } from '@/stores/record-management-store'
import { useGlobalStore } from '@/stores/global-store'
import { storeToRefs } from 'pinia'
import BarcodeBox from '@/components/BarcodeBox.vue'
import EssentialTable from '@/components/EssentialTable.vue'
import EssentialLink from '@/components/EssentialLink.vue'

const router = useRouter()

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { getItemRequestHistory } = useRecordManagementStore()
const {
  itemDetails,
  itemRequestHistory,
  itemRequestHistoryTotal
} = storeToRefs(useRecordManagementStore())
const { appIsLoadingData } = storeToRefs(useGlobalStore())

// Local Data
const itemTableVisibleColumns = ref([
  'id',
  'external_request_id',
  'create_dt'
])
const itemTableColumns = ref([
  {
    name: 'id',
    field: 'id',
    label: 'Request ID',
    align: 'left',
    sortable: true
  },
  {
    name: 'external_request_id',
    field: 'external_request_id',
    label: 'External Request ID',
    align: 'left',
    sortable: true
  },
  {
    name: 'create_dt',
    field: 'create_dt',
    label: 'Request Date',
    align: 'left',
    sortable: true
  }
])

// Logic
const formatDateTime = inject('format-date-time')
const getItemLocation = inject('get-item-location')
const handleAlert = inject('handle-alert')

onMounted(() => {
  loadRequestHistory()
})

// if user changes to another item while in the item display we need to make sure to load that items request history
watch(() => itemDetails.value.barcode, () => {
  loadRequestHistory()
})

const renderShelfBarcode = () => {
  let barcode = ''
  if (itemDetails.value.tray && itemDetails.value.tray.shelf_position) {
    barcode = itemDetails.value.tray.shelf_position.shelf?.barcode.value
  } else if (itemDetails.value.shelf_position) {
    barcode = itemDetails.value.shelf_position.shelf.barcode.value
  }
  return barcode
}
const renderItemBuilding = () => {
  let building = ''
  if (itemDetails.value.tray && itemDetails.value.tray.shelf_position) {
    building = itemDetails.value.tray.shelf_position.location?.split('-')[0]
  } else if (itemDetails.value.shelf_position) {
    building = itemDetails.value.shelf_position.location?.split('-')[0]
  }
  return building
}

const routeToTrayDetail = (barcode) => {
  router.push({
    name: 'record-management-tray',
    params: {
      barcode
    }
  })
}
const routeToShelfDetail = () => {
  router.push({
    name: 'record-management-shelf',
    params: {
      barcode: renderShelfBarcode()
    }
  })
}

const loadRequestHistory = async (qParams) => {
  try {
    appIsLoadingData.value = true
    if (itemDetails.value && itemDetails.value.container_type?.type == 'Non-Tray') {
      await getItemRequestHistory({
        ...qParams,
        non_tray_item_barcode: itemDetails.value.barcode.value
      })
    } else {
      await getItemRequestHistory({
        ...qParams,
        item_barcode: itemDetails.value.barcode.value
      })
    }
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appIsLoadingData.value = false
  }
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
