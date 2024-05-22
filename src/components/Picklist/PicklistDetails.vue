<template>
  <InfoDisplayLayout class="picklist-job">
    <template #number-box-content>
      <div class="flex q-mb-xs">
        <MoreOptionsMenu
          :options="[{ text: 'Edit', disabled: editJob || picklistJob.status == 'Completed' }]"
          class="q-mr-xs"
          @click="handleOptionMenu"
        />
        <label
          id="picklistJobId"
          class="info-display-details-label text-h4"
        >
          Pick List #:
        </label>
      </div>
      <p class="info-display-number-box text-h4">
        {{ picklistJob.id }}
      </p>
    </template>

    <template #details-content>
      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="info-display-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="info-display-details-label-2 text-h6"
          >
            Building:
          </label>
          <p class="text-body1">
            {{ picklistJob.building.name }}
          </p>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="info-display-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="info-display-details-label-2 text-h6"
          >
            Assigned User:
          </label>
          <p
            v-if="!editJob"
            class="text-body1"
          >
            {{ picklistJob.user?.first_name }}
          </p>
          <SelectInput
            v-else
            v-model="picklistJob.user_id"
            :options="users"
            option-type="users"
            option-value="id"
            option-label="first_name"
            aria-label="user"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  No Users Found
                </q-item-section>
              </q-item>
            </template>
          </SelectInput>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-grow">
        <div class="info-display-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="info-display-details-label-2 text-h6"
          >
            Date Created
          </label>
          <p class="text-body1">
            {{ formatDateTime(picklistJob.create_dt).date }}
          </p>
        </div>
      </div>
      <div class="col-xs-6 col-sm-auto col-md-auto q-mr-auto">
        <div class="info-display-details q-mb-xs-none q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-sm">
          <label
            class="info-display-details-label-2 text-h6"
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
          v-if="editJob"
          class="info-display-details-action q-mt-sm-sm q-mt-md-md"
        >
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Save Edits"
            class="btn-no-wrap text-body1 q-mr-sm"
            :loading="appActionIsLoadingData"
            @click="updatePicklistJob"
          />
          <q-btn
            no-caps
            unelevated
            outline
            color="accent"
            label="Cancel"
            class="btn-no-wrap text-body1"
            @click="cancelPicklistJobEdits"
          />
        </div>
        <div
          v-else-if="picklistJob.status !== 'Completed'"
          class="info-display-details-action q-mt-sm-sm q-mt-md-md"
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
        v-else-if="currentScreenSize == 'xs' && editJob"
        button-one-color="accent"
        :button-one-label="'Save Edits'"
        :button-one-outline="false"
        :button-one-loading="appActionIsLoadingData"
        @button-one-click="updatePicklistJob"
        button-two-color="accent"
        :button-two-label="'Cancel'"
        :button-two-outline="true"
        @button-two-click="cancelPicklistJobEdits"
      />
      <MobileActionBar
        v-else-if="picklistJob.status !== 'Completed'"
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
    </template>

    <template #table-content>
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
    </template>
  </InfoDisplayLayout>
</template>

<script setup>
import { onBeforeMount, ref, inject, toRaw } from 'vue'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { useUserStore } from '@/stores/user-store'
import { usePicklistStore } from '@/stores/picklist-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import InfoDisplayLayout from '@/components/InfoDisplayLayout.vue'
import EssentialTable from '@/components/EssentialTable.vue'
import MobileActionBar from '@/components/MobileActionBar.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import SelectInput from '@/components/SelectInput.vue'

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const { userData } = storeToRefs(useUserStore())
const { users } = storeToRefs(useOptionStore())
const { patchPicklistJob } = usePicklistStore()
const { picklistJob, originalPicklistJob } = storeToRefs(usePicklistStore())

// Local Data
const editJob = ref(false)
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

const handleOptionMenu = async (action) => {
  switch (action.text) {
  case 'Edit':
    editJob.value = true
    return
  }
}

const cancelPicklistJobEdits = () => {
  picklistJob.value = { ...toRaw(originalPicklistJob.value) }
  editJob.value = false
}
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
const updatePicklistJob = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      id: picklistJob.value.id,
      user_id: picklistJob.value.user_id
    }
    await patchPicklistJob(payload)

    handleAlert({
      type: 'success',
      text: 'The job has been updated.',
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
    editJob.value = false
  }
}
</script>

<style lang="scss" scoped>
</style>