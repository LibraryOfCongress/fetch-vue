<template>
  <div class="shelving-job">
    <div class="row justify-between q-mt-xs-lg q-mt-md-xl q-mx-md">
      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            id="jobNumber"
            class="shelving-job-details-label text-h4 text-bold"
          >
            Job Number:
          </label>
          <p class="shelving-job-number-box text-h4 q-pa-md">
            {{ shelvingJob.id }}
          </p>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-2">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="shelving-job-details-label text-h6 text-bold"
          >
            Building:
          </label>
          <p class="text-body1">
            {{ shelvingJob.building?.name }}
          </p>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-2">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="shelving-job-details-label text-h6 text-bold"
          >
            Assigned User:
          </label>
          <p class="text-body1">
            {{ shelvingJob.assigned_user?.name }}
          </p>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-2">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-lg">
          <label
            class="shelving-job-details-label text-h6 text-bold"
          >
            Date Created:
          </label>
          <p class="text-body1">
            {{ shelvingJob.create_dt }}
          </p>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-auto">
        <div class="shelving-job-details q-mb-xs-md q-mb-sm-md q-mb-md-none q-mr-sm-none q-mr-md-sm">
          <label
            class="shelving-job-details-label text-h6 text-bold"
          >
            Status:
          </label>
          <p
            class="text-body1"
            :class="shelvingJob.status == 'In Progress' ? 'outline text-highlight-yellow' : null"
          >
            {{ shelvingJob.status }}
          </p>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-2">
        <div class="shelving-job-details-action">
          <q-btn
            no-caps
            unelevated
            color="positive"
            :label="'Execute Shelving'"
            class="text-body1"
            @click="null"
          />
        </div>
      </div>
    </div>

    <q-space class="divider q-my-xs-lg q-my-md-xl" />

    <div class="row">
      <div class="col-grow">
        <EssentialTable
          :table-columns="shelfTableColumns"
          :filter-options="shelfTableFilters"
          :table-data="shelvingJob.containers"
          :hide-table-rearrange="true"
          :disable-table-reorder="true"
          :heading-row-class="'q-mb-lg'"
          :heading-filter-class="'q-ml-auto'"
        >
          <template #heading-row>
            <div
              class="col-xs-5 col-sm-auto q-mr-auto q-pl-xs-md"
            >
              <label class="text-h4 text-bold">
                Containers in Job:
              </label>
            </div>
          </template>

          <template #table-td="{ colName, props }">
            <span
              v-if="colName == 'actions'"
            >
              <MoreOptionsMenu
                :options="[{ text: 'Edit Location' }]"
                class=""
                @click="handleOptionMenu($event, props.row)"
              />
            </span>
          </template>
        </EssentialTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useShelvingStore } from '@/stores/shelving-store'
import { storeToRefs } from 'pinia'
import MoreOptionsMenu from 'src/components/MoreOptionsMenu.vue'
import EssentialTable from 'src/components/EssentialTable.vue'

// // Compasables
// const { TemplateComposable } = useTemplateComposable()

// // Store Data
const { shelvingJob } = storeToRefs(useShelvingStore())

// Local Data
const shelfTableColumns = ref([
  {
    name: 'actions',
    field: 'actions',
    label: '',
    align: 'center',
    sortable: false,
    required: true
  },
  {
    name: 'barcode',
    field: row => row.barcode.value,
    label: 'Barcode',
    align: 'left',
    sortable: true,
    order: 1
  },
  {
    name: 'owner',
    field: row => row.owner.name,
    label: 'Owner',
    align: 'left',
    sortable: true,
    order: 2
  },
  {
    name: 'size_class',
    field: row => row.size_class.name,
    label: 'Size Class',
    align: 'left',
    sortable: true,
    order: 3
  },
  {
    name: 'module',
    field: 'module',
    label: 'Module',
    align: 'left',
    sortable: true,
    order: 4
  },
  {
    name: 'aisle',
    field: 'aisle',
    label: 'Aisle',
    align: 'left',
    sortable: true,
    order: 5
  },
  {
    name: 'side',
    field: 'side',
    label: 'Side',
    align: 'left',
    sortable: true,
    order: 6
  },
  {
    name: 'ladder',
    field: 'ladder',
    label: 'Ladder',
    align: 'left',
    sortable: true,
    order: 7
  },
  {
    name: 'shelf',
    field: 'shelf_id',
    label: 'Shelf',
    align: 'left',
    sortable: true,
    order: 8
  },
  {
    name: 'shelf_position',
    field: 'shelf_position_id',
    label: 'Shelf Position',
    align: 'left',
    sortable: true,
    order: 9
  }
])
const shelfTableFilters = ref([
  {
    field: row => row.size_class.name,
    options: [
      {
        text: 'A High',
        value: false
      },
      {
        text: 'B Low',
        value: false
      },
      {
        text: 'C High',
        value: false
      }
    ]
  },
  {
    field: row => row.owner.name,
    options: [
      {
        text: 'John Doe',
        value: false
      },
      {
        text: 'George Washington',
        value: false
      }
    ]
  }
])

// Logic
const handleOptionMenu = (action, rowData) => {
  console.log(action, rowData)
}
</script>

<style lang="scss" scoped>
.shelving-job {
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
    justify-content: center;

    &-action {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
    }
  }
}
</style>