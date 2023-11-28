<template>
  <div class="tray">
    <div class="row">
      <div class="col">
        <h1 class="text-h4 text-bold q-mb-lg">
          {{ trayData.title }} - {{ trayData.box_number }}
        </h1>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-sm-4 col-md-3 q-pr-xl q-pr-xs-none q-pr-sm-md q-pb-xs-sm q-pb-sm-none">
        <div class="tray-barcode text-h4 q-py-xs-md">
          {{ trayData.id }}
        </div>
      </div>
      <div class="col-xs-6 col-sm-4 col-md-3">
        <div class="column no-wrap">
          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Facility
            </label>
            <p class="tray-details-text outline">
              {{ trayData.facility }}
            </p>
          </div>

          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Shelf Location
            </label>
            <p class="tray-details-text">
              {{ trayData.shelf_location }}
            </p>
          </div>

          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Media Type
            </label>
            <p class="tray-details-text text-highlight">
              {{ trayData.media_type }}
            </p>
          </div>

          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Container Type
            </label>
            <p class="tray-details-text outline">
              {{ trayData.container_type }}
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="currentScreenSize > 1024"
        class="col-sm-3 col-md-3"
      >
        <div class="column no-wrap">
          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Accession Date
            </label>
            <p class="tray-details-text">
              {{ trayData.accession_date }}
            </p>
          </div>

          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Shelved Date
            </label>
            <p class="tray-details-text">
              {{ trayData.shelf_date }}
            </p>
          </div>

          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Withdrawal Date
            </label>
            <p class="tray-details-text">
              {{ trayData.withdraw_date }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-xs-6 col-sm-4 col-md-3">
        <div class="column no-wrap">
          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Item Count
            </label>
            <p class="tray-details-text outline">
              {{ trayData.items.length }}
            </p>
          </div>

          <div class="tray-details">
            <label class="tray-details-label text-h6">
              # of Items Out
            </label>
            <p class="tray-details-text outline">
              {{ trayData.items_out_count }}
            </p>
          </div>

          <div class="tray-details">
            <label class="tray-details-label text-h6">
              Delete Count
            </label>
            <p class="tray-details-text outline">
              {{ trayData.items_delete_count }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <q-space class="divider q-my-lg" />

    <div class="row justify-between items-center q-mb-lg">
      <div class="col-auto">
        <h2 class="text-h4 text-bold">
          Items in Tray
        </h2>
      </div>

      <div class="col-xs-4 col-sm-3 col-md-2">
        <q-select
          outlined
          multiple
          :dense="currentScreenSize <= 600"
          :display-value="currentScreenSize > 600 ? 'Filter Columns' : 'Filter'"
          v-model="trayItemsTableVisibleColumns"
          :options="trayItemsTableColumns.filter(opt => opt.required == null)"
          emit-value
          map-options
          option-value="name"
          option-label="label"
        >
          <template #option="{ itemProps, opt, selected, toggleOption }">
            <q-item v-bind="itemProps">
              <q-item-section>
                <q-item-label>{{ opt.label }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-checkbox
                  :model-value="selected"
                  @update:model-value="toggleOption(opt)"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>

    <div class="row">
      <div class="col-grow">
        <q-table
          flat
          :dense="currentScreenSize <= 600"
          :rows="trayData.items"
          :columns="trayItemsTableColumns"
          :visible-columns="trayItemsTableVisibleColumns"
          row-key="name"
          :wrap-cells="true"
          :hide-pagination="true"
          column-sort-order="ad"
          class="tray-table"
        >
          <template #body-cell="props">
            <q-td
              :props="props"
              @click="$emit('selected-item', props.row)"
            >
              <span
                v-if="props.col.name == 'media_type'"
                class="text-highlight outline"
              >
                {{ props.value }}
              </span>
              <span
                v-else-if="props.col.name == 'size'"
                class="outline"
              >
                {{ props.value }}
              </span>
              <span v-else>
                {{ props.value }}
              </span>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'

export default defineComponent({
  name: 'TrayDisplay',
  props: {
    trayData: {
      type: Object,
      required: true
    }
  },
  emits: ['selected-item'],
  setup () {
    const { currentScreenSize } = useCurrentScreenSize()
    return {
      currentScreenSize
    }
  },
  data () {
    return {
      trayItemsTableVisibleColumns: [
        'id',
        'media_type',
        'size',
        'temp_location',
        'permanent_location'
      ],
      trayItemsTableColumns: [
        {
          name: 'id',
          field: 'id',
          label: 'Barcode',
          align: 'left',
          sortable: true
        },
        {
          name: 'media_type',
          field: 'media_type',
          label: 'Media Type',
          align: 'left',
          sortable: true
        },
        {
          name: 'size',
          field: 'size',
          label: 'Size Class',
          align: 'left',
          sortable: true
        },
        {
          name: 'temp_location',
          field: 'temp_location',
          label: 'Temporary Location',
          align: 'left',
          sortable: true
        },
        {
          name: 'permanent_location',
          field: 'permanent_location',
          label: 'Permanent Location',
          align: 'left',
          sortable: true
        },
        {
          name: 'subcollection',
          field: 'subcollection',
          label: 'Subcollection',
          align: 'left',
          sortable: true,
          required: this.currentScreenSize > 600 ? true : false
        },
        {
          name: 'volume',
          field: 'volume',
          label: 'Volume',
          align: 'left',
          sortable: true,
          required: this.currentScreenSize > 600 ? true : false
        },
        {
          name: 'arrival_date',
          field: 'arrival_date',
          label: 'Arrival Date',
          align: 'left',
          sortable: true,
          required: this.currentScreenSize > 600 ? true : false
        },
        {
          name: 'accession_date',
          field: 'accession_date',
          label: 'Accession Date',
          align: 'left',
          sortable: true,
          required: this.currentScreenSize > 600 ? true : false
        },
        {
          name: 'withdraw_date',
          field: 'withdraw_date',
          label: 'Withdrawal Date',
          align: 'left',
          sortable: true,
          required: this.currentScreenSize > 600 ? true : false
        },
        {
          name: 'container_type',
          field: 'container_type',
          label: 'Container Type',
          align: 'left',
          sortable: true,
          required: true
        }
      ]
    }
  },
  watch: {
    currentScreenSize (res) {
      if (res <= 600) {
        this.trayItemsTableVisibleColumns = [
          'id',
          'media_type',
          'permanent_location'
        ]
      } else {
        this.trayItemsTableVisibleColumns = [
          'id',
          'media_type',
          'size',
          'temp_location',
          'permanent_location'
        ]
      }
    }
  },
  mounted () {
    if (this.currentScreenSize <= 600) {
      this.trayItemsTableVisibleColumns = [
        'id',
        'media_type',
        'permanent_location'
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
.tray {
  &-barcode {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 100px;
    background-color: $secondary;
    color: $color-white;
    border-radius: 3px;
  }

  &-details {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 1rem;
  }

  &-table {
    :deep(tbody) {
      & tr {
        cursor: pointer;
      }
    }
  }
}
</style>
