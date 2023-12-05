<template>
  <div class="non-tray">
    <div class="row">
      <div class="col">
        <h1 class="text-h4 text-bold q-mb-lg">
          {{ nonTrayData.title }}
        </h1>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-sm-4 col-md-3 q-pr-xl q-pr-xs-none q-pr-sm-md q-pb-xs-sm q-pb-sm-none">
        <div class="non-tray-barcode text-h4 q-py-xs-md">
          {{ nonTrayData.id }}
        </div>
      </div>
      <div class="col-xs-6 col-sm-4 col-md-3">
        <div class="column no-wrap">
          <div class="non-tray-details">
            <label class="non-tray-details-label text-h6">
              Facility
            </label>
            <p class="non-tray-details-text outline">
              {{ nonTrayData.facility }}
            </p>
          </div>

          <div class="non-tray-details">
            <label class="non-tray-details-label text-h6">
              Shelf Location
            </label>
            <p class="non-tray-details-text">
              {{ nonTrayData.shelf_location }}
            </p>
          </div>

          <div class="non-tray-details">
            <label class="non-tray-details-label text-h6">
              Media Type
            </label>
            <p class="non-tray-details-text text-highlight">
              {{ nonTrayData.media_type }}
            </p>
          </div>

          <div class="non-tray-details">
            <label class="non-tray-details-label text-h6">
              Container Type
            </label>
            <p class="non-tray-details-text outline">
              {{ nonTrayData.container_type }}
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="currentScreenSize > 1024"
        class="col-sm-3 col-md-3"
      >
        <div class="column no-wrap">
          <div class="non-tray-details">
            <label class="non-tray-details-label text-h6">
              Accession Date
            </label>
            <p class="non-tray-details-text">
              {{ nonTrayData.accession_date }}
            </p>
          </div>

          <div class="non-tray-details">
            <label class="non-tray-details-label text-h6">
              Item Count
            </label>
            <p class="non-tray-details-text outline">
              {{ nonTrayData.items.length }}
            </p>
          </div>

          <div class="non-tray-details">
            <label class="non-tray-details-label text-h6">
              # of Items Out
            </label>
            <p class="non-tray-details-text outline">
              {{ nonTrayData.items_out_count }}
            </p>
          </div>

          <div class="non-tray-details">
            <label class="non-tray-details-label text-h6">
              Delete Count
            </label>
            <p class="non-tray-details-text outline">
              {{ nonTrayData.items_delete_count }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <q-space class="divider q-my-lg" />

    <div class="row">
      <div class="col-grow">
        <EssentialTable
          :table-columns="nonTrayItemsTableColumns"
          :table-visible-columns="nonTrayItemsTableVisibleColumns"
          :table-data="nonTrayData.items"
          :disable-table-reorder="true"
          :hide-table-filter="true"
          @selected-table-row="$emit('selected-item', $event)"
        >
          <template #heading-row>
            <div class="col-auto self-center q-mr-auto">
              <h2 class="text-h4 text-bold">
                Items
              </h2>
            </div>
          </template>

          <template #table-td="{ colName, value }">
            <span
              v-if="colName == 'media_type'"
              class="text-highlight outline"
            >
              {{ value }}
            </span>
            <span
              v-else-if="colName == 'size'"
              class="outline"
            >
              {{ value }}
            </span>
          </template>
        </EssentialTable>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from 'src/components/EssentialTable.vue'

export default defineComponent({
  name: 'NonTrayDisplay',
  props: {
    nonTrayData: {
      type: Object,
      required: true
    }
  },
  emits: ['selected-item'],
  components: {
    EssentialTable
  },
  setup () {
    const { currentScreenSize } = useCurrentScreenSize()
    return {
      currentScreenSize
    }
  },
  data () {
    return {
      nonTrayItemsTableVisibleColumns: [
        'id',
        'media_type',
        'shelf_location'
      ],
      nonTrayItemsTableColumns: [
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
          name: 'shelf_location',
          field: 'shelf_location',
          label: 'Shelf Location',
          align: 'left',
          sortable: true
        },
        {
          name: 'shelf_position',
          field: 'shelf_position',
          label: 'Shelf Position',
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
          name: 'subcollection',
          field: 'subcollection',
          label: 'Subcollection',
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
  }
})
</script>

<style lang="scss" scoped>
.non-tray {
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
