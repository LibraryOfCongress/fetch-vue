<template>
  <div class="table-component">
    <!-- header section -->
    <div class="row q-mb-lg">
      <slot name="heading-row" />

      <div
        v-if="!hideTableFilter"
        class="col-auto"
      >
        <q-select
          ref="tableSortFilter"
          outlined
          multiple
          :dense="currentScreenSize <= 600"
          :display-value="'Filter'"
          v-model="localTableVisibleColumns"
          :options="tableFilterOptions.filter(opt => opt.required == null)"
          emit-value
          map-options
          option-value="name"
          option-label="label"
          class="table-component-filter full-width"
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

    <!-- main table section -->
    <div class="row">
      <div class="col-grow">
        <q-table
          flat
          :dense="currentScreenSize <= 600"
          :rows="tableData"
          :columns="allowTableReorder ? localTableColumns.map(item => ({...item, sortable: false})) : localTableColumns.map(item => ({...item, sortable: true}))"
          :visible-columns="localTableVisibleColumns"
          row-key="name"
          :wrap-cells="true"
          :hide-pagination="true"
          column-sort-order="ad"
          class="table-component-table"
        >
          <template
            v-if="allowTableReorder"
            #header-cell="props"
          >
            <q-th
              :id="`thead_${props.col.name}`"
              :props="props"
              @click="setTableFocus($event)"
              @keyup="changeTableOrder(props, $event.key)"
              tabindex="-1"
              class="set-focus"
            >
              <q-icon
                name="arrow_left"
                color="primary"
                size="25px"
                @click="changeTableOrder(props, 'ArrowLeft')"
              />
              {{ props.col.label }}
              <q-icon
                name="arrow_right"
                color="primary"
                size="25px"
                @click="changeTableOrder(props, 'ArrowRight')"
              />
            </q-th>
          </template>
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
import { ref, onMounted, nextTick } from 'vue'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'

// Props
const mainProps = defineProps({
  hideTableFilter: {
    type: Boolean,
    default: false
  },
  disableTableReorder: {
    type: Boolean,
    default: false
  },
  tableFilterOptions: {
    type: Array,
    default () {
      return []
    }
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
  }
})

// Emits
const emit = defineEmits(['selected-table-row'])

// Compasables
const { currentScreenSize } = useCurrentScreenSize()

// Local Data
const localTableVisibleColumns = ref(mainProps.tableVisibleColumns)
const localTableColumns = ref(mainProps.tableColumns)
const allowTableReorder = ref(false)

// Logic
onMounted(() => {
  // if no tableVisibleColumns prop is passed map the tableColumns so all columns are always visible
  if (mainProps.tableVisibleColumns.length == 0) {
    localTableVisibleColumns.value = mainProps.tableColumns.map(col => col.name)
  }
})

const setTableFocus = (e) => {
  e.target.focus()
}

const changeTableOrder = async (tableItem, direction) => {
  const tableItemIndex = localTableColumns.value.findIndex(item => item.label == tableItem.col.label)

  if (direction == 'ArrowRight') {
    localTableColumns.value.splice(tableItemIndex, 1)
    localTableColumns.value.splice((tableItemIndex == localTableVisibleColumns.value.length - 1 ? 0 : tableItemIndex + 1), 0, tableItem.col)

    // set focus to the current items index in the dom to handle any other keyboard direction changes
    const newTableItemIndex = localTableColumns.value.findIndex(item => item.label == tableItem.col.label)
    await nextTick()
    document.querySelector(`#thead_${localTableColumns.value[newTableItemIndex].name}`).focus()
  } else if (direction == 'ArrowLeft') {
    localTableColumns.value.splice(tableItemIndex, 1)
    localTableColumns.value.splice((tableItemIndex == 0 ? localTableVisibleColumns.value.length - 1 : tableItemIndex - 1), 0, tableItem.col)

    const newTableItemIndex = localTableColumns.value.findIndex(item => item.label == tableItem.col.label)
    await nextTick()
    document.querySelector(`#thead_${localTableColumns.value[newTableItemIndex].name}`).focus()
  }
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
</style>