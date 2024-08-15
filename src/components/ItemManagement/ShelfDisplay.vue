<template>
  <div class="shelf">
    <div class="row">
      <div class="col">
        <h1 class="text-h4 text-bold q-mb-lg">
          {{ shelfData.title }}
        </h1>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-sm-4 col-md-3 q-pr-xl q-pr-xs-none q-pr-sm-md q-pb-xs-sm q-pb-sm-none">
        <BarcodeBox
          :barcode="shelfData.id"
          class="q-py-xs-md"
        />
      </div>
      <div class="col-xs-6 col-sm-4 col-md-3">
        <div class="column no-wrap">
          <div class="shelf-details">
            <label class="shelf-details-label text-h6">
              Facility
            </label>
            <p class="shelf-details-text outline">
              {{ shelfData.facility }}
            </p>
          </div>

          <div class="shelf-details">
            <label class="shelf-details-label text-h6">
              Shelf Location
            </label>
            <p class="shelf-details-text">
              {{ shelfData.shelf_location }}
            </p>
          </div>

          <div class="shelf-details">
            <label class="shelf-details-label text-h6">
              Media Type
            </label>
            <p class="shelf-details-text text-highlight">
              {{ shelfData.media_type }}
            </p>
          </div>

          <div class="shelf-details">
            <label class="shelf-details-label text-h6">
              Container Type
            </label>
            <p class="shelf-details-text outline">
              {{ shelfData.container_type }}
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="currentScreenSize !== 'xs' && currentScreenSize !== 'sm'"
        class="col-sm-3 col-md-3"
      >
        <div class="column no-wrap">
          <div class="shelf-details">
            <label class="shelf-details-label text-h6">
              Accession Date
            </label>
            <p class="shelf-details-text">
              {{ shelfData.accession_date }}
            </p>
          </div>

          <div class="shelf-details">
            <label class="shelf-details-label text-h6">
              Item Count
            </label>
            <p class="shelf-details-text outline">
              {{ shelfData.items.length }}
            </p>
          </div>

          <div class="shelf-details">
            <label class="shelf-details-label text-h6">
              # of Items Out
            </label>
            <p class="shelf-details-text outline">
              {{ shelfData.items_out_count }}
            </p>
          </div>

          <div class="shelf-details">
            <label class="shelf-details-label text-h6">
              Delete Count
            </label>
            <p class="shelf-details-text outline">
              {{ shelfData.items_delete_count }}
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
          :table-data="shelfData.items"
          :hide-table-rearrange="true"
          :heading-row-class="'q-mb-lg'"
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
import BarcodeBox from '@/components/BarcodeBox.vue'

export default defineComponent({
  name: 'NonTrayDisplay',
  props: {
    shelfData: {
      type: Object,
      required: true
    }
  },
  emits: ['selected-item'],
  components: {
    EssentialTable,
    BarcodeBox
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
          required: this.currentScreenSize !== 'xs' ? true : false
        },
        {
          name: 'accession_date',
          field: 'accession_date',
          label: 'Accession Date',
          align: 'left',
          sortable: true,
          required: this.currentScreenSize !== 'xs' ? true : false
        },
        {
          name: 'subcollection',
          field: 'subcollection',
          label: 'Subcollection',
          align: 'left',
          sortable: true,
          required: this.currentScreenSize !== 'xs' ? true : false
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
.shelf {
  &-details {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>
