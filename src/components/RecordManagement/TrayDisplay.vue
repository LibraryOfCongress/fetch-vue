<template>
  <div class="tray">
    <div class="row">
      <div class="col">
        <h1 class="text-h4 text-bold q-mb-xs-md q-mb-sm-lg">
          Tray Details
        </h1>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-lg-4 q-pr-xs-none q-pr-lg-md q-pb-xs-md q-pb-lg-none">
        <BarcodeBox
          :barcode="trayDetails.barcode.value"
          :class="trayDetails.status == 'Out' ? 'bg-color-pink text-negative' : 'bg-color-green-light text-positive'"
          class="q-py-xs-sm q-py-sm-md"
        />
      </div>
      <div class="col-xs-6 col-sm-4 col-lg-3">
        <div class="column no-wrap">
          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Shelf Barcode
            </label>
            <EssentialLink
              :title="trayDetails.shelf_position ? trayDetails.shelf_position?.shelf?.barcode?.value : ''"
              @click="() => (console.log('pending shelf detail page'))"
              :disabled="!trayDetails.shelf_position?.shelf?.barcode?.value"
              dense
              class="tray-details-text q-pa-none"
            />
          </div>

          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Owner
            </label>
            <p class="tray-details-text">
              {{ trayDetails.owner.name }}
            </p>
          </div>

          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Media Type
            </label>
            <p class="tray-details-text text-highlight outline">
              {{ trayDetails.media_type.name }}
            </p>
          </div>

          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Size Class
            </label>
            <p class="tray-details-text outline">
              {{ trayDetails.size_class.name }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-xs-6 col-sm-4 col-md-3">
        <div class="column no-wrap q-ml-xs">
          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Accession Date
            </label>
            <p class="tray-details-text">
              {{ formatDateTime(trayDetails.accession_dt).date }}
            </p>
          </div>

          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Shelved Date
            </label>
            <p class="tray-details-text">
              {{ formatDateTime(trayDetails.shelving_job?.update_dt).date }}
            </p>
          </div>

          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Location
            </label>
            <div class="row">
              <p
                v-if="renderTrayBuilding()"
                class="tray-details-text outline q-mr-sm"
              >
                {{ renderTrayBuilding() }}
              </p>
              <p class="tray-details-text outline">
                {{ getItemLocation(trayDetails) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row q-mt-lg q-mb-xs-xl q-mb-sm-none">
      <div class="col-grow q-mb-xs-md q-mb-sm-none">
        <EssentialTable
          :table-columns="itemTableColumns"
          :table-visible-columns="itemTableVisibleColumns"
          :table-data="trayDetails.items"
          :heading-row-class="'q-mb-xs-md q-mb-md-lg'"
          :heading-rearrange-class="'q-ml-auto'"
          @selected-table-row="routeToItemDetail($event)"
        >
          <template #heading-row>
            <div
              class="col-sm-5 col-md-12 col-lg-auto"
              :class="currentScreenSize == 'sm' || currentScreenSize == 'xs' ? '' : 'self-center'"
            >
              <h1 class="text-h4 text-bold">
                Items in Tray
              </h1>
            </div>
          </template>

          <template #table-td="{ colName, value }">
            <span
              v-if="colName == 'status'"
              class="outline text-nowrap"
              :class="value == 'In' ? 'text-highlight' : value == 'Out' ? 'text-highlight-negative' : 'text-highlight-warning'"
            >
              {{ value }}
            </span>
          </template>
        </EssentialTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter  } from 'vue-router'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useRecordManagementStore } from '@/stores/record-management-store'
import { storeToRefs } from 'pinia'
import EssentialTable from 'src/components/EssentialTable.vue'
import BarcodeBox from '@/components/BarcodeBox.vue'
import EssentialLink from '@/components/EssentialLink.vue'

const router = useRouter()

// Compasables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { trayDetails } = storeToRefs(useRecordManagementStore())

// Local Data
const itemTableVisibleColumns = ref([
  'barcode_value',
  'status'
])
const itemTableColumns = ref([
  {
    name: 'barcode_value',
    field: (row) => renderItemBarcodeDisplay(row),
    label: 'Barcode',
    align: 'left',
    sortable: true
  },
  {
    name: 'status',
    field: 'status',
    label: 'Status',
    align: 'left',
    sortable: true
  }
])

// Logic
const formatDateTime = inject('format-date-time')
const getItemLocation = inject('get-item-location')
const renderItemBarcodeDisplay = inject('render-item-barcode-display')

const renderTrayBuilding = () => {
  let building = ''
  if (trayDetails.value && trayDetails.value.shelf_position) {
    building = trayDetails.value.shelf_position.location?.split('-')[0]
  }
  return building
}

const routeToItemDetail = (rowData) => {
  router.push({
    name: 'record-management-items',
    params: {
      barcode: rowData.barcode.value
    }
  })
}
</script>

<style lang="scss" scoped>
.tray {
  &-details {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 1rem;

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
