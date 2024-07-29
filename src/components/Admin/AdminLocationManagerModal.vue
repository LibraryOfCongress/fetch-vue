<template>
  <PopupModal
    ref="locationModal"
    :show-actions="false"
    @reset="emit('hide')"
    aria-label="locationAddOrEditModal"
  >
    <template #header-content="{ hideModal }">
      <q-card-section class="row items-center q-pb-none">
        <h2 class="text-h6 text-bold">
          {{ actionType == 'Add' ? 'Add New' : 'Edit' }} {{ titleCaseLocationType }}
        </h2>

        <q-btn
          icon="close"
          flat
          round
          dense
          class="q-ml-auto"
          @click="hideModal"
          aria-label="closeModal"
        />
      </q-card-section>
    </template>
    <template #main-content>
      <q-card-section class="q-pb-none">
        <div class="row">
          <template
            v-for="field in locationFields"
            :key="field.field"
          >
            <!-- text inputs -->
            <div
              v-if="!field.options"
              class="q-mb-md"
              :class="field.field == 'width' || field.field == 'height' ? 'col-xs-12 col-sm-4' : field.field == 'depth' ? 'col-xs-12 col-sm-4 q-px-sm-sm' : 'col-12'"
            >
              <div class="form-group">
                <label class="form-group-label">
                  {{ field.label }}
                </label>
                <TextInput
                  v-model="locationForm[field.field]"
                  :placeholder="`Enter ${field.label}`"
                  :aria-label="`${field.field}_input`"
                />
              </div>
            </div>
            <!-- select inputs -->
            <div
              v-else
              class="col-12 q-mb-md"
            >
              <div class="form-group">
                <label class="form-group-label">
                  {{ field.label }}
                </label>
                <SelectInput
                  v-model="locationForm[field.field]"
                  :options="field.options"
                  :option-type="field.optionType"
                  option-value="id"
                  :option-label="field.field == 'container_type_id' ? 'type' : 'name'"
                  :placeholder="`Select ${field.label}`"
                  @update:model-value="null"
                  :aria-label="`${field.field}_select`"
                />
              </div>
            </div>
          </template>
        </div>
      </q-card-section>
    </template>

    <template #footer-content="{ hideModal }">
      <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
        <q-btn
          no-caps
          unelevated
          color="accent"
          :label="actionType == 'Add' ? `Add ${titleCaseLocationType}` : `Update ${titleCaseLocationType}`"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          :disable="false"
          @click="actionType == 'Add' ? addNewLocationType() : updateLocationType()"
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
import { ref, computed, onBeforeMount, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { useBuildingStore } from '@/stores/building-store'
import { storeToRefs } from 'pinia'
import SelectInput from '@/components/SelectInput.vue'
import TextInput from '@/components/TextInput.vue'
import PopupModal from '@/components/PopupModal.vue'

const route = useRoute()

// Props
const mainProps = defineProps({
  actionType: {
    type: String,
    required: true
  },
  locationType: {
    type: String,
    required: true
  },
  locationData: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

// Emits
const emit = defineEmits([
  'hide',
  'submit'
])

// Composables

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const {
  owners,
  sizeClass,
  containerTypes
} = storeToRefs(useOptionStore())
const {
  postBuilding,
  patchBuilding,
  postModule,
  patchModule,
  postAisle,
  patchAisle,
  postLadder,
  patchLadder,
  postShelve,
  patchShelve
} = useBuildingStore()

// Local Data
const titleCaseLocationType = computed(() => {
  return mainProps.locationType.replace(mainProps.locationType[0], mainProps.locationType[0].toUpperCase()).slice(0, -1)
})
const locationModal = ref(null)
const locationFields = ref(null)
const locationForm = ref({})

// Logic
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  generateLocationModal()
})

const generateLocationModal = () => {
  // creates the modal fields needed based on the locationType
  switch (mainProps.locationType) {
  case 'buildings':
    locationForm.value = {
      name: mainProps.locationData.name ?? ''
    }
    locationFields.value = [
      {
        field: 'name',
        label: 'Building Name'
      }
    ]
    break
  case 'modules':
    locationForm.value = {
      building_id: route.params.buildingId,
      module_number: mainProps.locationData.module_number ?? ''
    }
    locationFields.value = [
      {
        field: 'module_number',
        label: 'Module Number'
      }
    ]
    break
  case 'aisles':
    locationForm.value = {
      module_id: route.params.moduleId,
      sort_priority: mainProps.locationData.sort_priority ?? null,
      aisle_number: mainProps.locationData.aisle_number?.number ?? ''
    }
    locationFields.value = [
      {
        field: 'aisle_number',
        label: 'Aisle Number'
      },
      {
        field: 'sort_priority',
        label: 'Aisle Priority'
      }
    ]
    break
  case 'ladders':
    locationForm.value = {
      side_id: route.params.sideId,
      sort_priority: mainProps.locationData.sort_priority ?? null,
      ladder_number: mainProps.locationData.ladder_number?.number ?? ''
    }
    locationFields.value = [
      {
        field: 'ladder_number',
        label: 'Ladder Number'
      },
      {
        field: 'sort_priority',
        label: 'Ladder Priority'
      }
    ]
    break
  case 'shelves':
    locationForm.value = {
      ladder_id: route.params.ladderId,
      owner_id: mainProps.locationData.owner?.id ?? null,
      size_class_id: mainProps.locationData.size_class?.id ?? null,
      container_type_id: mainProps.locationData.container_type?.id ?? null,
      width: mainProps.locationData.width ?? '',
      depth: mainProps.locationData.depth ?? '',
      height: mainProps.locationData.height ?? '',
      capacity: mainProps.locationData.capacity ?? '',
      barcode_value: mainProps.locationData.barcode?.value ?? '',
      sort_priority: mainProps.locationData.sort_priority ?? null,
      shelf_number: mainProps.locationData.shelf_number?.number ?? ''
    },
    locationFields.value = [
      {
        field: 'owner_id',
        label: 'Owner',
        options: owners,
        optionType: 'owners'
      },
      {
        field: 'size_class_id',
        label: 'Container Size',
        options: sizeClass,
        optionType: 'sizeClass'
      },
      {
        field: 'container_type_id',
        label: 'Container Type',
        options: containerTypes,
        optionType: 'containerTypes'
      },
      {
        field: 'barcode_value',
        label: 'Shelf Barcode'
      },
      {
        field: 'shelf_number',
        label: 'Shelf Number'
      },
      {
        field: 'sort_priority',
        label: 'Shelf Priority'
      },
      {
        field: 'capacity',
        label: 'Max Capacity'
      },
      {
        field: 'width',
        label: 'Width (in)'
      },
      {
        field: 'depth',
        label: 'Depth (in)'
      },
      {
        field: 'height',
        label: 'Height (in)'
      }
    ]
    break
  default:
    break
  }
}

const addNewLocationType = async () => {
  try {
    appActionIsLoadingData.value = true
    // send api request to add a new location by the locationType
    const payload = locationForm.value
    switch (mainProps.locationType) {
    case 'buildings':
      await postBuilding(payload)
      break
    case 'modules':
      await postModule(payload)
      break
    case 'aisles':
      await postAisle(payload)
      break
    case 'ladders':
      await postLadder(payload)
      break
    case 'shelves':
      await postShelve(payload)
      break
    default:
      break
    }

    handleAlert({
      type: 'success',
      text: `Successfully Added A New ${titleCaseLocationType.value}`,
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
    locationModal.value.hideModal()
  }
}

const updateLocationType = async () => {
  try {
    appActionIsLoadingData.value = true
    // send api request to add a new location by the locationType
    let payload = {
      id: mainProps.locationData.id,
      ...locationForm.value
    }
    switch (mainProps.locationType) {
    case 'buildings':
      await patchBuilding(payload)
      break
    case 'modules':
      await patchModule(payload)
      break
    case 'aisles':
      await patchAisle(payload)
      break
    case 'ladders':
      await patchLadder(payload)
      break
    case 'shelves':
      await patchShelve(payload)
      break
    default:
      break
    }

    handleAlert({
      type: 'success',
      text: `Successfully Updated The ${titleCaseLocationType.value}`,
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
    locationModal.value.hideModal()
  }
}
</script>

<style lang="scss" scoped>
</style>