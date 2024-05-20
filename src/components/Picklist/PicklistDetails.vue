<template>
  <div class="picklist-job">
    <div class="row justify-between q-pt-xs-md q-pt-md-xl q-mx-xs-sm q-mx-sm-md">
      <div class="col-xs-12 col-md-12 col-lg-3">
        <div class="picklist-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-lg-lg">
          <label
            id="picklistJobId"
            class="picklist-job-details-label text-h4 text-bold q-mb-xs"
          >
            Pick List #:
          </label>
          <p class="picklist-job-number-box text-h4 q-pa-md">
            {{ picklistJob.id }}
          </p>
        </div>
      </div>

      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="picklist-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="picklist-job-details-label-2 text-h6 text-bold"
          >
            Building:
          </label>
          <p class="text-body1">
            {{ picklistJob.building.name }}
          </p>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="picklist-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="picklist-job-details-label-2 text-h6 text-bold"
          >
            Assigned User:
          </label>
          <p class="text-body1">
            {{ picklistJob.user.name }}
          </p>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="picklist-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="picklist-job-details-label-2 text-h6 text-bold"
          >
            Date Created
          </label>
          <p class="text-body1">
            {{ formatDateTime(picklistJob.create_dt).date }}
          </p>
        </div>
      </div>
      <div class="col-xs-6 col-sm-auto col-md-auto q-mr-auto">
        <div class="picklist-job-details q-mb-xs-none q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-sm">
          <label
            class="picklist-job-details-label-2 text-h6 text-bold"
          >
            Status
          </label>
          <p
            class="text-body1 outline"
            :class="picklistJob.status == 'Completed' || picklistJob.status == 'Created' ? 'text-highlight' : picklistJob.status == 'Paused' || picklistJob.status == 'Running' ? 'text-highlight-warning' : picklistJob.status == 'New' ? 'text-highlight-accent' : null "
          >
            {{ picklistJob.status }}
          </p>
        </div>
      </div>

      <div
        v-if="currentScreenSize !== 'xs'"
        class="col-sm-12 col-md-12 col-lg-3 q-ml-auto"
      >
        <div
          class="picklist-job-details-action q-mt-sm-sm q-mt-md-md"
        >
          <q-btn
            no-caps
            unelevated
            color="positive"
            :label="'Retrieve Pick List'"
            class="btn-no-wrap text-body1"
            :disabled="false"
            :loading="appActionIsLoadingData"
            @click="executePicklistJob()"
          />
        </div>
      </div>
      <MobileActionBar
        v-else
        :button-one-color="'accent'"
        :button-one-label="'Cancel'"
        :button-one-outline="true"
        :button-one-disabled="true"
        @button-one-click="null"
        :button-two-color="'positive'"
        :button-two-label="'Retrieve Pick List'"
        :button-two-outline="false"
        @button-two-click="executePicklistJob()"
      />
    </div>

    <q-space class="divider q-my-xs-lg q-my-md-xl" />

    <div class="row q-mb-xs-xl q-mb-sm-none">
      <div class="col-grow q-mb-xs-md q-mb-sm-none">
        <EssentialTable
          :table-columns="itemTableColumns"
          :table-visible-columns="itemTableVisibleColumns"
          :filter-options="itemTableFilters"
          :table-data="picklistJob.items"
          :enable-table-reorder="false"
          :enable-selection="false"
          :heading-row-class="'q-mb-lg q-px-xs-sm q-px-sm-md'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
        >
          <template #heading-row>
            <div class="col-xs-7 col-sm-5 q-mb-md-sm">
              <label class="text-h4 text-bold">
                Items in Job:
              </label>
            </div>
          </template>

          <!-- <template #table-td="{ colName, value }">
            <span
              v-if="colName == 'request_type'"
              class="outline text-nowrap"
              :class="'text-highlight'"
            >
              {{ value }}
            </span>
          </template> -->
        </EssentialTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, inject } from 'vue'
import { useGlobalStore } from '@/stores/global-store'
import { useUserStore } from '@/stores/user-store'
import { usePicklistStore } from '@/stores/picklist-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from '@/components/EssentialTable.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const { userData } = storeToRefs(useUserStore())
const { patchPicklistJob } = usePicklistStore()
const { picklistJob } = storeToRefs(usePicklistStore())

// Local Data
const itemTableVisibleColumns = ref([
  'item_location',
  'barcode',
  'owner',
  'size_class'
])
const itemTableColumns = ref([
  {
    name: 'barcode',
    field: row => row.barcode?.value,
    label: 'Barcode',
    align: 'left',
    sortable: true
  },
  {
    name: 'owner',
    field: row => row.owner?.name,
    label: 'Owner',
    align: 'left',
    sortable: true
  },
  {
    name: 'size_class',
    field: row => row.size_class?.name,
    label: 'Size Class',
    align: 'left',
    sortable: true
  },
  {
    name: 'item_location',
    field: row => getItemLocation(row),
    label: 'Item Location',
    align: 'left',
    sortable: true
  }
])
const itemTableFilters =  ref([
  {
    field: row => row.size_class.name,
    options: [
      {
        text: 'C High',
        value: false
      },
      {
        text: 'C Low',
        value: false
      }
    ]
  }
])

// Logic
const handleAlert = inject('handle-alert')
const formatDateTime = inject('format-date-time')
const getItemLocation = inject('get-item-location')

onBeforeMount(() => {
  if (currentScreenSize.value == 'xs') {
    itemTableVisibleColumns.value = [
      'barcode',
      'size_class',
      'item_location'
    ]
  }
})

const executePicklistJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: picklistJob.value.id,
      status: 'Running',
      user_id: picklistJob.value.user_id ? picklistJob.value.user_id : userData.value.id
    }
    await patchPicklistJob(payload)

    handleAlert({
      type: 'success',
      text: 'Pick List Job Successfully Started',
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appActionIsLoadingData.value = false
  }
}
</script>

<style lang="scss" scoped>
.picklist-job {
  position: relative;

  &-number-box {
    background-color: $secondary;
    color: $color-white;
    text-align: center;
    border-radius: 3px;
    width: 100%;
  }

  &-details {
    position: relative;
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: flex-start;

    &-label {
      &-2 {
        margin-top: 2.25rem;

        @media (max-width: $breakpoint-sm-max) {
          margin-top: 0;
        }
      }
    }

    &-action {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
    }
  }
}
</style>