<template>
  <q-page padding>
    <div class="row justify-between q-my-md">
      <div class="col-xs-12 col-sm-4 col-md-3">
        <div class="shelving-details q-mb-xs-md q-mb-sm-none q-mr-sm-xl">
          <label
            id="aisleSelection"
            for="aisle"
            class="shelving-details-label text-h4 text-bold q-mr-sm"
          >
            Aisle:
          </label>
          <q-select
            id="aisle"
            outlined
            :dense="currentScreenSize <= 600"
            v-model="shelfData.aisle"
            :options="aisleOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            class="full-width"
          />
        </div>
      </div>

      <div class="col-xs-12 col-sm-4 col-md-3">
        <div class="shelving-details q-mb-xs-md q-mb-sm-none q-mr-sm-xl">
          <label
            id="sideSelection"
            for="side"
            class="shelving-details-label text-h4 text-bold q-mr-sm"
          >
            Side:
          </label>
          <q-select
            id="side"
            outlined
            :dense="currentScreenSize <= 600"
            v-model="shelfData.side"
            :options="sideOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            class="full-width"
          />
        </div>
      </div>

      <div class="col-xs-12 col-sm-4 col-md-3">
        <div class="shelving-details q-mb-xs-sm q-mb-sm-none">
          <label
            id="ladderSelection"
            for="ladder"
            class="shelving-details-label text-h4 text-bold q-mr-sm"
          >
            Ladder:
          </label>
          <q-select
            id="ladder"
            outlined
            :dense="currentScreenSize <= 600"
            v-model="shelfData.ladder"
            :options="ladderOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            class="full-width"
          />
        </div>
      </div>
    </div>

    <q-space class="divider q-my-xs-lg q-my-sm-xl" />

    <div class="row items-center q-mb-lg">
      <div class="col-auto q-mr-auto">
        <label class="text-h4 text-bold">
          Shelf:
        </label>
      </div>

      <div class="col-auto mobile-only">
        <!-- mobile only button make sure to modify the desktop one if you change this one -->
        <q-btn
          no-caps
          unelevated
          icon="mdi-plus"
          color="accent"
          label="Add Shelf"
          class="btn-no-wrap text-body1"
          @click="showShelfModal = !showShelfModal"
        />
      </div>

      <div class="col-xs-12 col-sm-6 col-md-4 q-mt-xs-lg q-mt-sm-none">
        <div class="row no-wrap">
          <q-btn
            no-caps
            flat
            color="accent"
            label="Export Report"
            class="btn-no-wrap text-body1 q-mr-sm"
          />

          <q-select
            outlined
            multiple
            :dense="currentScreenSize <= 600"
            :display-value="'Filter'"
            v-model="shelfItemsTableVisibleColumns"
            :options="shelfItemsTableColumns"
            emit-value
            map-options
            option-value="name"
            option-label="label"
            class="full-width"
          >
            <!-- <template #before-options>
              <q-item>
                <q-item-section>
                  <q-item-label>Rearrange Columns</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="allowTableReorder" />
                </q-item-section>
              </q-item>

              <q-space class="divider" />
            </template> -->

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

          <q-btn
            no-caps
            unelevated
            icon="mdi-plus"
            color="accent"
            label="Add Shelf"
            class="btn-no-wrap text-body1 q-ml-sm mobile-hide"
            @click="showShelfModal = !showShelfModal"
          />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-grow">
        <q-table
          flat
          :dense="currentScreenSize <= 600"
          :rows="shelfData.items"
          :columns="shelfItemsTableColumns"
          :visible-columns="shelfItemsTableVisibleColumns"
          row-key="name"
          :wrap-cells="true"
          :hide-pagination="true"
          column-sort-order="ad"
          class="shelving-table"
        >
          <template #body-cell="props">
            <q-td :props="props">
              <span
                v-if="props.col.name == 'vacancy'"
                class="outline"
                :class="props.value > 66 ? 'text-highlight' : props.value < 33 ? 'text-highlight-red' : 'text-highlight-yellow'"
              >
                {{ props.value }}%
              </span>
              <span
                v-else-if="props.col.name == 'available_capacity'"
                class="outline"
                :class="props.value > 66 ? 'text-highlight' : props.value < 33 ? 'text-highlight-red' : 'text-highlight-yellow'"
              >
                {{ props.value }} Containers Left
              </span>
              <span v-else>
                {{ props.value }}
              </span>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Create Shelf Modal -->
    <q-dialog
      :persistent="true"
      v-model="showShelfModal"
    >
      <q-card class="shelving-modal">
        <q-card-section class="row items-center justify-between q-pb-none">
          <h2 class="text-h6">
            Create New Shelf
          </h2>

          <q-btn
            icon="close"
            flat
            round
            dense
            @click="resetModal"
          />
        </q-card-section>

        <q-card-section class="column no-wrap items-center">
          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Owner
            </label>
            <q-select
              :dense="currentScreenSize <= 600"
              outlined
              v-model="newShelf.owner"
              :options="ownerOptions"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              @filter="filterOwners"
              class="full-width"
              placeholder="Select Owner"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Shelf Number
            </label>
            <q-input
              outlined
              placeholder="Enter Shelf Number"
              :dense="currentScreenSize <= 600"
              v-model="newShelf.shelf_number"
              class="full-width"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Shelf Width
            </label>
            <q-input
              outlined
              placeholder="Enter Shelf Width"
              :dense="currentScreenSize <= 600"
              v-model="newShelf.shelf_width"
              class="full-width"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Shelf Height
            </label>
            <q-input
              outlined
              placeholder="Enter Shelf Height"
              :dense="currentScreenSize <= 600"
              v-model="newShelf.shelf_height"
              class="full-width"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Shelf Depth
            </label>
            <q-input
              outlined
              placeholder="Enter Shelf Depth"
              :dense="currentScreenSize <= 600"
              v-model="newShelf.shelf_depthr"
              class="full-width"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Allowed Container Type
            </label>
            <q-select
              :dense="currentScreenSize <= 600"
              outlined
              v-model="newShelf.container_type"
              :options="containerTypeOptions"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              class="full-width"
              :class="newShelf.container_type == null ? 'form-placeholder' : null"
            />
          </div>
        </q-card-section>

        <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Create Shelf"
            class="text-body1 full-width"
            @click="resetModal"
          />

          <q-space class="q-mx-xs" />

          <q-btn
            outline
            no-caps
            label="Cancel"
            class="shelving-modal-btn text-body1 full-width"
            @click="resetModal"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'

export default defineComponent({
  name: 'ShelvingPage',
  data () {
    return {
      shelfData: {
        aisle: null,
        side: null,
        ladder: null,
        items: [
          {
            id: '00924891289',
            shelf_width: '12 ft',
            shelf_height: '3 ft',
            shelf_depth: '22 ft',
            vacancy: 47,
            max_capacity: 15,
            current_capacity: 7,
            available_capacity: 8,
            size_class: 'Trayed'
          },
          {
            id: '00924891290',
            shelf_width: '22.2 ft',
            shelf_height: '3 ft',
            shelf_depth: '22 ft',
            vacancy: 93,
            max_capacity: 60,
            current_capacity: 4,
            available_capacity: 56,
            size_class: 'Trayed'
          },
          {
            id: '00924891291',
            shelf_width: '24 ft',
            shelf_height: '4.4 ft',
            shelf_depth: '22 ft',
            vacancy: 0,
            max_capacity: 100,
            current_capacity: 100,
            available_capacity: 0,
            size_class: 'Non-Trayed'
          }
        ]
      },
      aisleOptions: [
        {
          id: 1,
          name: '56'
        },
        {
          id: 2,
          name: '57'
        },
        {
          id: 3,
          name: '58'
        }
      ],
      sideOptions: [
        {
          id: 1,
          name: 'Left'
        },
        {
          id: 2,
          name: 'Right'
        }
      ],
      ladderOptions: [
        {
          id: 1,
          name: '11A'
        },
        {
          id: 2,
          name: '11B'
        },
        {
          id: 3,
          name: '12A'
        },
        {
          id: 4,
          name: '12B'
        }
      ],
      shelfItemsTableVisibleColumns: [
        'shelf_width',
        'shelf_height',
        'shelf_depth',
        'vacancy',
        'max_capacity',
        'current_capacity',
        'available_capacity',
        'size_class',
        'id'
      ],
      shelfItemsTableColumns: [
        {
          name: 'shelf_width',
          field: 'shelf_width',
          label: 'Shelf Width',
          align: 'left',
          sortable: true
        },
        {
          name: 'shelf_height',
          field: 'shelf_height',
          label: 'Shelf Height',
          align: 'left',
          sortable: true
        },
        {
          name: 'shelf_depth',
          field: 'shelf_depth',
          label: 'Shelf Depth',
          align: 'left',
          sortable: true
        },
        {
          name: 'vacancy',
          field: 'vacancy',
          label: 'Vacancy',
          align: 'left',
          sortable: true
        },
        {
          name: 'max_capacity',
          field: 'max_capacity',
          label: 'Max Capacity',
          align: 'left',
          sortable: true
        },
        {
          name: 'current_capacity',
          field: 'current_capacity',
          label: 'Current Capacity',
          align: 'left',
          sortable: true
        },
        {
          name: 'available_capacity',
          field: 'available_capacity',
          label: 'Available Capacity',
          align: 'left',
          sortable: true
        },
        {
          name: 'size_class',
          field: 'size_class',
          label: 'Size Class',
          align: 'left',
          sortable: true
        },
        {
          name: 'id',
          field: 'id',
          label: 'Shelf Barcode',
          align: 'left',
          sortable: true
        }
      ],
      allowTableReorder: false,
      showShelfModal: false,
      newShelf: {
        owner: null,
        container_type: null,
        shelf_number: '',
        shelf_width: '',
        shelf_height: '',
        shelf_depth: ''
      },
      ownerOptions: [
        {
          id: 1,
          name: 'John Doe'
        },
        {
          id: 2,
          name: 'George Washington'
        }
      ],
      containerTypeOptions: [
        {
          id: null,
          name: 'Select Type',
          disable: true
        }
      ]
    }
  },
  setup () {
    const { currentScreenSize } = useCurrentScreenSize()
    return {
      currentScreenSize
    }
  },
  mounted () {
    if (this.currentScreenSize <= 600) {
      this.shelfItemsTableVisibleColumns = [
        'shelf_width',
        'shelf_height',
        'shelf_depth',
        'vacancy'
      ]
    }
  },
  watch: {
    currentScreenSize (res) {
      if (res <= 600) {
        this.shelfItemsTableVisibleColumns = [
          'shelf_width',
          'shelf_height',
          'shelf_depth',
          'vacancy'
        ]
      } else {
        this.shelfItemsTableVisibleColumns = [
          'shelf_width',
          'shelf_height',
          'shelf_depth',
          'vacancy',
          'max_capacity',
          'current_capacity',
          'available_capacity',
          'size_class',
          'id'
        ]
      }
    }
  },
  methods: {
    resetModal () {
      this.newShelf = {
        owner: null,
        container_type: null,
        shelf_number: '',
        shelf_width: '',
        shelf_height: '',
        shelf_depth: ''
      },
      this.showShelfModal = false
    },
    filterOwners (val, update) {
      update(() => {
        const options = [
          {
            id: 1,
            name: 'John Doe'
          },
          {
            id: 2,
            name: 'George Washington'
          }
        ]
        this.ownerOptions = options.filter(opt => opt.name.toLowerCase().indexOf(val.toLowerCase()) > -1)
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.shelving {
  &-details {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    @media (max-width: $breakpoint-sm-min) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &-table {
    :deep(tbody) {
      & tr {
        cursor: pointer;
      }
    }
  }

  &-modal {
    width: 500px;

    @media (max-width: $breakpoint-sm-min) {
      width: 90vw;
    }

    &-btn {
      transition: .3s ease;

      &:hover {
        color: $accent;
        border-color: $accent;
      }
    }
  }
}
</style>
