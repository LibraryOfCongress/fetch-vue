<template>
  <div class="table-component">
    <!-- header section -->
    <div
      class="row"
      :class="headingRowClass !== '' ? headingRowClass : ''"
    >
      <slot name="heading-row" />

      <div
        v-if="!hideTableFilter"
        class="col-auto"
      >
        <q-select
          ref="tableSortFilter"
          outlined
          multiple
          :dense="currentScreenSize == 'xs'"
          :display-value="'Filter'"
          v-model="localTableVisibleColumns"
          :options="localTableColumns.filter(opt => opt.required == null)"
          emit-value
          map-options
          option-value="name"
          option-label="label"
          class="table-component-filter full-width"
          :popup-content-class="$style['filter-menu']"
          @popup-hide="allowTableReorder = false"
        >
          <template
            v-if="!disableTableReorder"
            #before-options
          >
            <q-item>
              <q-item-section>
                <q-item-label>Rearrange Columns</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="allowTableReorder" />
              </q-item-section>
            </q-item>

            <q-space class="divider" />
          </template>

          <template #option="{ itemProps, opt, selected, toggleOption }">
            <q-item
              v-bind="itemProps"
              :style="{'order': opt.order}"
              :draggable="allowTableReorder"
              @dragstart="startDrag($event)"
              @dragend="endDrag($event)"
              @dragover="reorderTableItemDOM($event)"
            >
              <q-item-section
                v-if="allowTableReorder"
                side
              >
                <q-icon
                  name="drag_indicator"
                  color="primary"
                  size="25px"
                />
              </q-item-section>
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

    <!-- main table section -->
    <div class="row">
      <div class="col-grow">
        <q-table
          flat
          :dense="currentScreenSize == 'xs'"
          :rows="tableData"
          :columns="allowTableReorder ? localTableColumns.map(item => ({...item, sortable: false})) : localTableColumns.map(item => ({...item, sortable: item.sortable}))"
          :visible-columns="localTableVisibleColumns"
          :row-key="rowKey"
          :wrap-cells="true"
          :hide-pagination="true"
          :hide-selected-banner="true"
          column-sort-order="ad"
          :selection="enableSelection ? 'multiple' : 'none'"
          v-model:selected="selectedTableData"
          class="table-component-table"
        >
          <template #body-cell="props">
            <q-td
              :props="props"
              @click="emit('selected-table-row', props.row)"
            >
              <slot
                name="table-td"
                :props="props"
                :col-name="props.col.name"
                :value="props.value"
              >
                <span>
                  {{ props.value }}
                </span>
              </slot>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'

// Props
const mainProps = defineProps({
  enableSelection: {
    type: Boolean,
    default: false
  },
  hideTableFilter: {
    type: Boolean,
    default: false
  },
  disableTableReorder: {
    type: Boolean,
    default: false
  },
  tableVisibleColumns: {
    type: Array,
    default () {
      return []
    }
  },
  tableColumns: {
    type: Array,
    default () {
      return []
    },
    required: true
  },
  tableData: {
    type: Array,
    default () {
      return []
    },
    required: true
  },
  headingRowClass: {
    type: String,
    default: ''
  },
  rowKey: {
    type: String,
    default: 'id' // if tableData doesnt include an 'id' param we need to specifiy this
  }
})

// Emits
const emit = defineEmits([
  'selected-table-row',
  'selected-data'
])

// Compasables
const { currentScreenSize } = useCurrentScreenSize()

// Local Data
const localTableVisibleColumns = ref(mainProps.tableVisibleColumns)
const localTableColumns = ref(mainProps.tableColumns)
const allowTableReorder = ref(false)
const draggedItemElement = ref(null)
const selectedTableData = ref([])

// Logic
onMounted(() => {
  // if no tableVisibleColumns prop is passed map the tableColumns so all columns are always visible
  if (mainProps.tableVisibleColumns.length == 0) {
    localTableVisibleColumns.value = mainProps.tableColumns.map(col => col.name)
  }
})

watch(selectedTableData, () => {
  emit('selected-data', selectedTableData.value)
})

const startDrag = (e) => {
  e.target.classList.add('dragging')
  draggedItemElement.value= e.target
}
const endDrag = (e) => {
  e.target.classList.remove('dragging')
  draggedItemElement.value= null

  // get all the child element order values that are in our select filter list
  const filterMenuElements = [...document.querySelector('.q-menu .q-virtual-scroll__content').children].map(el => ({ order: el.style.order }))

  // update the localTableColumn order values to match the filterMenuElements order
  localTableColumns.value = localTableColumns.value.map((item, i) => {
    return {
      ...item,
      order: filterMenuElements[i].order
    }
  })

  // lastly sort the localTableColumn data which will re render the qtable to the new order
  localTableColumns.value = localTableColumns.value.sort((a, b) => a.order - b.order)
}
const reorderTableItemDOM = (e) => {
  e.preventDefault()

  // swap the hovered child elements style order property with the draggedItemElements style order property
  const hoveredItemElement = e.target.closest('.q-virtual-scroll__content .q-item')
  const currentHoveredOrderValue = hoveredItemElement.style.order
  const draggedItemOrderValue = draggedItemElement.value.style.order
  hoveredItemElement.style.order = draggedItemOrderValue
  draggedItemElement.value.style.order = currentHoveredOrderValue
}
</script>

<style lang="scss" scoped>
.table-component {
  position: relative;

  &-filter {
    min-width: 231px;

    @media (max-width: $breakpoint-sm-min) {
      min-width: 100px;
    }

    &-menu {
      background: blue;
      :deep(div.q-virtual-scroll__content) {
        display: flex;
        flex-flow: column nowrap;
      }
    }
  }

  &-table {
    :deep(tbody) {
      & tr {
        cursor: pointer;
      }
    }
  }
}

.set-focus {
  &:hover {
    cursor: pointer;
  }

  &:focus {
    color: $accent;
    background: rgba($accent, .1);
  }

  &:focus-visible {
    outline: none;
  }
}

.dragging {
  opacity: .4;
}
</style>

<style lang="scss" module>
.filter-menu {
  :global(div.q-virtual-scroll__content) {
    display: flex;
    flex-flow: column nowrap;
  }
}
</style>