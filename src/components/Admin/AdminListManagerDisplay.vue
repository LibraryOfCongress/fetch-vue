<template>
  <div class="admin-list-manager q-pa-xs-sm q-pa-sm-lg">
    <div class="row q-mb-xs-xl q-mb-sm-none">
      <div class="col-grow q-mb-xs-md q-mb-sm-none">
        <EssentialTable
          :table-columns="listTableColumns"
          :table-visible-columns="listTableVisibleColumns"
          :filter-options="listTableFilters"
          :table-data="listData"
          :enable-table-reorder="false"
          :heading-row-class="'q-mb-xs-md q-mb-md-lg'"
          :heading-filter-class="currentScreenSize == 'xs' ? 'col-xs-6 q-mr-auto' : 'q-ml-auto'"
          :heading-rearrange-class="'q-mr-xs-auto q-mr-sm-none q-ml-sm-auto'"
        >
          <template #heading-row>
            <div
              class="col-xs-12 col-lg-auto q-mr-auto q-pb-xs-sm q-pb-lg-none"
              :class="currentScreenSize == 'xs' ? '' : 'self-center'"
            >
              <h1 class="text-h4 text-bold">
                {{ renderTableTitle }}
              </h1>
            </div>

            <div
              class="col-xs-5 col-sm-auto flex justify-end"
              :class="'order-1'"
            >
              <q-btn
                no-caps
                unelevated
                icon="add"
                color="accent"
                :label="renderTableAction"
                class="btn-no-wrap text-body1 q-ml-sm"
                @click="showListInputModal.type = 'Add'"
              />
            </div>
          </template>

          <template #table-td="{ colName, props }">
            <span
              v-if="colName == 'actions'"
            >
              <MoreOptionsMenu
                :options="renderTableOptionsMenu"
                class=""
                @click="handleOptionMenu(props.row)"
              />
            </span>
          </template>
        </EssentialTable>
      </div>
    </div>
  </div>

  <!-- add/editlist property modal -->
  <!-- <AdminLocationManagerModal
    v-if="showListInputModal.type !== ''"
    :location-type="listType"
    :action-type="showListInputModal.type"
    :location-data="showListInputModal.locationData"
    @hide="showListInputModal.type = ''; showListInputModal.locationData = {}"
  /> -->
</template>

<script setup>
import { onBeforeMount, ref, inject, computed } from 'vue'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from 'src/components/EssentialTable.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
// import AdminLocationManagerModal from '@/components/Admin/AdminLocationManagerModal.vue'

// Props
const mainProps = defineProps({
  listType: {
    type: String,
    required: true
  }
})

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appIsLoadingData } = storeToRefs(useGlobalStore())
const { getOptions } = useOptionStore()
const {
  owners,
  mediaType,
  sizeClass
} = storeToRefs(useOptionStore())

// Local Data
const listData = computed(() => {
  let tableData = []
  switch (mainProps.listType) {
  case 'owners':
    tableData = owners.value
    break
  case 'media-type':
    tableData = mediaType.value
    break
  case 'size-class':
    tableData = sizeClass.value
    break
  default:
    break
  }
  return tableData
})
const listTableVisibleColumns = ref([])
const listTableColumns = ref([])
const listTableFilters =  ref([])
const renderTableTitle = computed(() => {
  let title = ''
  if (mainProps.listType == 'owners') {
    title = 'Owners'
  } else if (mainProps.listType == 'media-type') {
    title = 'Media Type'
  } else {
    title = 'Size Class'
  }
  return title
})
const renderTableAction = computed(() => {
  let actionText = ''
  if (mainProps.listType == 'owners') {
    actionText = 'Add Owner'
  } else if (mainProps.listType == 'media-type') {
    actionText = 'Add Media Type'
  } else {
    actionText = 'Add Size Class'
  }
  return actionText
})
const renderTableOptionsMenu = computed(() => {
  let options = []
  if (mainProps.listType == 'owners') {
    options = [{ text: 'Edit Owner' }]
  } else if (mainProps.listType == 'media-type') {
    options = [{ text: 'Edit Media Type' }]
  } else {
    options = [
      { text: 'Edit Size Class' },
      { text: 'Delete Size Class', optionClass: 'text-negative', disabled: false } // TODO need to figure out how we can disable deleting of a size class if it is in use
    ]
  }
  return options
})
const showListInputModal = ref({
  type: '',
  listType: mainProps.listType,
  listData: {}
})


// Logic
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  loadListData()
  generateListTableInfo()
})

const handleOptionMenu = async (rowData, option) => {
  // load any options info that will be needed in our modal popup
  // if (mainProps.listType == 'shelves' && (owners.value.length == 0 || sizeClass.value.length == 0)) {
  //   appIsLoadingData.value = true
  //   await Promise.all([
  //     getOptions('owners'),
  //     getOptions('sizeClass'),
  //     getOptions('containerTypes')
  //   ])
  //   appIsLoadingData.value = false
  // }

  showListInputModal.value.listData = rowData
  showListInputModal.value.type = option
}

const generateListTableInfo = () => {
  // creates the report table fields needed based on the selected list type
  switch (mainProps.listType) {
  case 'size-class':
    listTableColumns.value = [
      {
        name: 'actions',
        field: 'actions',
        label: '',
        align: 'center',
        sortable: false,
        required: true
      },
      {
        name: 'name',
        field: 'name',
        label: 'Full Name',
        align: 'left',
        sortable: true
      },
      {
        name: 'short_name',
        field: 'short_name',
        label: 'Short Name',
        align: 'left',
        sortable: true
      },
      {
        name: 'width',
        field: 'width',
        label: 'Width',
        align: 'left',
        sortable: true
      },
      {
        name: 'depth',
        field: 'depth',
        label: 'Depth',
        align: 'left',
        sortable: true
      },
      {
        name: 'height',
        field: 'height',
        label: 'Height',
        align: 'left',
        sortable: true
      },
      {
        name: 'owner',
        field: row => row.owner?.name,
        label: 'Owner',
        align: 'left',
        sortable: true
      }
    ]
    listTableVisibleColumns.value = [
      'actions',
      'name',
      'short_name',
      'width',
      'depth',
      'height',
      'owner'
    ]
    break
  default:
    break
  }
}

const loadListData = async () => {
  try {
    appIsLoadingData.value = true
    if (mainProps.listType == 'owners') {
      await getOptions('owners')
    } else if (mainProps.listType == 'media-type') {
      await getOptions('mediaType')
    } else {
      await getOptions('sizeClass')
    }
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appIsLoadingData.value = false
  }
}
</script>

<style lang="scss" scoped>
</style>