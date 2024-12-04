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

          <template #table-td="{ colName, props, value }">
            <span
              v-if="colName == 'actions'"
            >
              <MoreOptionsMenu
                :options="generateTableOptionsMenu(props.row)"
                class=""
                @click="handleOptionMenu($event, props.row)"
              />
            </span>
            <span
              v-if="listType == 'size-class' && colName == 'owner'"
              class=""
            >
              {{ renderSizeClassOwners(value, props.row.showMoreOwners) }}
              <q-btn
                v-if="value.length > 4"
                dense
                flat
                no-caps
                color="accent"
                :label="props.row.showMoreOwners ? 'Show Less' : 'Show More'"
                class="btn-no-wrap text-body2 q-ml-sm-sm"
                @click="props.row.showMoreOwners = !props.row.showMoreOwners"
              />
            </span>
          </template>
        </EssentialTable>
      </div>
    </div>
  </div>

  <!-- add/editlist property modal -->
  <AdminListManagerModal
    v-if="showListInputModal.type !== ''"
    :list-type="listType"
    :action-type="showListInputModal.type"
    :list-data="showListInputModal.listData"
    @hide="showListInputModal.type = ''; showListInputModal.listData = {}"
  />

  <!-- confirmation modal -->
  <PopupModal
    v-if="showConfirmationModal !== null"
    ref="confirmationModal"
    :title="'Confirm Delete'"
    :text="showConfirmationModal.text"
    :show-actions="false"
    @reset="showConfirmationModal = null"
    aria-label="confirmationModal"
  >
    <template #footer-content="{ hideModal }">
      <q-card-section
        class="row no-wrap justify-between items-center q-pt-sm"
      >
        <q-btn
          no-caps
          unelevated
          color="negative"
          :label="`Delete ${renderTableTitle}`"
          class="btn-no-wrap text-body1 full-width"
          :loading="appActionIsLoadingData"
          @click="deleteListOption(showConfirmationModal.id)"
        />

        <q-space class="q-mx-xs" />

        <q-btn
          outline
          no-caps
          label="Cancel"
          class="text-body1 full-width"
          @click="hideModal"
        />
      </q-card-section>
    </template>
  </PopupModal>
</template>

<script setup>
import { onBeforeMount, ref, inject, computed } from 'vue'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { storeToRefs } from 'pinia'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialTable from 'src/components/EssentialTable.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'
import AdminListManagerModal from '@/components/Admin/AdminListManagerModal.vue'
import PopupModal from '@/components/PopupModal.vue'

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
const {
  appIsLoadingData,
  appActionIsLoadingData
} = storeToRefs(useGlobalStore())
const {
  getOptions,
  deleteSizeClass,
  deleteMediaType
} = useOptionStore()
const {
  owners,
  mediaTypes,
  sizeClass
} = storeToRefs(useOptionStore())

// Local Data
const listData = computed(() => {
  let tableData = []
  switch (mainProps.listType) {
  case 'owners':
    tableData = owners.value
    break
  case 'media-types':
    tableData = mediaTypes.value
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
  } else if (mainProps.listType == 'media-types') {
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
  } else if (mainProps.listType == 'media-types') {
    actionText = 'Add Media Type'
  } else {
    actionText = 'Add Size Class'
  }
  return actionText
})
const showListInputModal = ref({
  type: '',
  listType: mainProps.listType,
  listData: {}
})
const confirmationModal = ref(null)
const showConfirmationModal = ref(null)


// Logic
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  loadListData()
  generateListTableInfo()
})

const renderSizeClassOwners = (rowOwnerArray, showFullList = false) => {
  let ownerList = []
  if (rowOwnerArray) {
    ownerList = rowOwnerArray.map(o => o.name)
  }

  // if we have more than 4 owners display the first 4 and a + # more label
  // if less than 4 just show all 4
  if (ownerList.length > 4 && !showFullList) {
    return `${ownerList.splice(0, 4).join(', ')} + ${rowOwnerArray.length - 4} more`
  } else if (ownerList.length > 4 && showFullList) {
    return ownerList.join(', ')
  } else if (ownerList.length <= 4) {
    return ownerList.join(', ')
  } else {
    return ''
  }
}

const handleOptionMenu = async (option, rowData) => {
  // load any options info that will be needed in our modal popup
  if (mainProps.listType == 'size-class') {
    appIsLoadingData.value = true
    await Promise.all([getOptions('owners')])
    appIsLoadingData.value = false
  } else if (mainProps.listType == 'media-types') {
    appIsLoadingData.value = true
    await Promise.all([getOptions('media-types')])
    appIsLoadingData.value = false
  }

  if (option.text.includes('Edit')) {
    showListInputModal.value.listData = rowData
    showListInputModal.value.type = 'Edit'
  } else {
    showConfirmationModal.value = {
      text: `Are you sure you want to delete '${rowData.name}'?`,
      id: rowData.id
    }
  }
}

const generateTableOptionsMenu = (rowData) => {
  let options = []
  if (mainProps.listType == 'owners') {
    options = [{ text: 'Edit Owner' }]
  } else if (mainProps.listType == 'media-types') {
    options = [
      { text: 'Edit Media Type' },
      { text: 'Delete Media Type', optionClass: 'text-negative', disabled: rowData.assigned }
    ]
  } else {
    options = [
      { text: 'Edit Size Class' },
      { text: 'Delete Size Class', optionClass: 'text-negative', disabled: rowData.assigned }
    ]
  }
  return options
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
        label: 'Width (in)',
        align: 'left',
        sortable: true
      },
      {
        name: 'depth',
        field: 'depth',
        label: 'Depth (in)',
        align: 'left',
        sortable: true
      },
      {
        name: 'height',
        field: 'height',
        label: 'Height (in)',
        align: 'left',
        sortable: true
      },
      {
        name: 'owner',
        field: 'owners',
        label: 'Owner(s)',
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
  case 'media-types':
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
        label: 'Name',
        align: 'left',
        sortable: true
      }
    ]
    listTableVisibleColumns.value = [
      'actions',
      'name'
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
    } else if (mainProps.listType == 'media-types') {
      await getOptions('mediaTypes')
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

const deleteListOption = async (id) => {
  try {
    appActionIsLoadingData.value = true
    if (mainProps.listType == 'size-class') {
      await deleteSizeClass(id)
    } else if (mainProps.listType == 'media-types') {
      await deleteMediaType(id)
    }
    handleAlert({
      type: 'success',
      text: `Successfully Deleted The ${renderTableTitle.value}.`,
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
    confirmationModal.value.hideModal()
  }
}
</script>

<style lang="scss" scoped>
</style>
