<template>
  <PopupModal
    ref="listModal"
    :show-actions="false"
    @reset="emit('hide')"
    aria-label="listOptionAddOrEditModal"
  >
    <template #header-content="{ hideModal }">
      <q-card-section class="row items-center q-pb-none">
        <h2 class="text-h6 text-bold">
          {{ actionType == 'Add' ? 'Add New' : 'Edit' }} {{ titleCaseListType }}
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
            v-for="field in inputFields"
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
                  <span
                    v-if="field.required"
                    class="text-caption text-negative"
                  >
                    (Required)
                  </span>
                </label>
                <TextInput
                  v-model="inputForm[field.field]"
                  :placeholder="`Enter ${field.label}`"
                  :disabled="field.disabled"
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
                  <span
                    v-if="field.required"
                    class="text-caption text-negative"
                  >
                    (Required)
                  </span>
                </label>
                <SelectInput
                  v-model="inputForm[field.field]"
                  :multiple="field.allowMultiple"
                  :use-chips="field.allowMultiple"
                  :hide-selected="false"
                  :options="field.options"
                  :option-type="field.optionType"
                  option-value="id"
                  :option-label="field.field == 'container_type_id' ? 'type' : 'name'"
                  :placeholder="`Select ${field.label}`"
                  :disabled="field.disabled"
                  @update:model-value="listType == 'shelf-type' ? updateShelfTypeSizeClass($event) : null"
                  :aria-label="`${field.field}Select`"
                />
              </div>
            </div>
          </template>

          <!-- custom shelf type max capacity inputs -->
          <q-expansion-item
            v-if="inputForm.size_classes && inputForm.size_classes.length > 0"
            class="col-12 q-mb-md"
            header-class="text-body1 q-px-xs-none q-px-sm-sm underline"
            label="Max Capacity"
          >
            <template
              v-for="sc in inputForm.size_classes"
              :key="sc.id"
            >
              <div class="row items-center q-my-md">
                <label class="col-grow">
                  {{ sc.name }}
                </label>
                <div class="col-4">
                  <TextInput
                    v-model="sc.max_capacity"
                    placeholder="Enter Capacity"
                    :aria-label="`shelf_type_max_capacity_input`"
                    type="number"
                  />
                </div>
              </div>
            </template>
          </q-expansion-item>
        </div>
      </q-card-section>
    </template>

    <template #footer-content="{ hideModal }">
      <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
        <q-btn
          no-caps
          unelevated
          color="accent"
          :label="actionType == 'Add' ? `Add ${titleCaseListType}` : `Update ${titleCaseListType}`"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          :disabled="isInputFormValid"
          @click="actionType == 'Add' ? addNewListType() : updateListType()"
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
import { ref, computed, onBeforeMount, inject, toRaw } from 'vue'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
import { storeToRefs } from 'pinia'
import SelectInput from '@/components/SelectInput.vue'
import TextInput from '@/components/TextInput.vue'
import PopupModal from '@/components/PopupModal.vue'

// Props
const mainProps = defineProps({
  actionType: {
    type: String,
    required: true
  },
  listType: {
    type: String,
    required: true
  },
  listData: {
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
  shelfTypes
} = storeToRefs(useOptionStore())
const {
  postSizeClass,
  patchSizeClass,
  deleteSizeClassOwners,
  postShelfType,
  patchShelfType,
  deleteShelfType,
  postMediaType,
  patchMediaType
} = useOptionStore()

// Local Data
const titleCaseListType = computed(() => {
  let title = mainProps.listType.split('-')
  title = title.map(s => s.replace(s[0], s[0].toUpperCase()))
  return title.join(' ')
})
const listModal = ref(null)
const inputFields = ref(null)
const inputForm = ref({})
const inputFormOriginal = ref({})
const isInputFormValid = computed(() => {
  const optionalFields = inputFields.value.flatMap(f => !f.required ? f.field : [] )
  // filter out excess form data if its not included in the fields since we only care about defined fields
  const mainForm = Object.fromEntries(inputFields.value.flatMap(f => f.field).map(mainField => [
    mainField,
    inputForm.value[mainField]
  ]))
  // check the main form fields and see if the required fields have proper values
  return !Object.keys(mainForm).every(key => optionalFields.includes(key) || mainForm[key] !== null && mainForm[key] !== '' && mainForm[key].length !== 0)
})

// Logic
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  generateListModal()
})

const generateListModal = () => {
  // creates the modal fields needed based on the listType
  switch (mainProps.listType) {
  case 'size-class':
    inputForm.value = {
      assigned: mainProps.listData.assigned ?? false,
      name: mainProps.listData.name ?? '',
      short_name: mainProps.listData.short_name ?? '',
      width: mainProps.listData.width ?? '',
      depth: mainProps.listData.depth ?? '',
      height: mainProps.listData.height ?? '',
      owner_ids: mainProps.listData.owners ? mainProps.listData.owners.map(o => o.id) : null
    }
    // create a copy of our input form
    inputFormOriginal.value = { ...toRaw(inputForm.value) }

    inputFields.value = [
      {
        field: 'name',
        label: 'Full Name',
        required: true
      },
      {
        field: 'short_name',
        label: 'Short Name',
        required: true
      },
      {
        field: 'width',
        label: 'Width (in)',
        required: true
      },
      {
        field: 'depth',
        label: 'Depth (in)',
        required: true
      },
      {
        field: 'height',
        label: 'Height (in)',
        required: true
      },
      {
        field: 'owner_ids',
        label: 'Owner(s)',
        options: owners,
        optionType: 'owners',
        required: false,
        allowMultiple: true
      }
    ]
    break
  case 'media-types':
    inputForm.value = {
      name: mainProps.listData.name ?? ''
    }
    // create a copy of our input form
    inputFormOriginal.value = { ...toRaw(inputForm.value) }

    inputFields.value = [
      {
        field: 'name',
        label: 'Name',
        required: true
      }
    ]
    break
  case 'shelf-type': {
    const matchingShelfTypes = shelfTypes.value.filter(s => s.type == mainProps.listData.type)
    inputForm.value = {
      assigned: mainProps.listData.assigned ?? false,
      type: mainProps.listData.type ?? '',
      size_class_ids: matchingShelfTypes.map(s => s.size_class_id) ?? [],
      size_classes: matchingShelfTypes.map(s => ({ ...s.size_class, max_capacity: s.max_capacity, shelf_type_id: s.id })) ?? []
    }
    // create a copy of our input form
    inputFormOriginal.value = { ...toRaw(inputForm.value) }

    inputFields.value = [
      {
        field: 'type',
        label: 'Shelf Type Name',
        required: true
      },
      {
        field: 'size_class_ids',
        label: 'Size Class',
        options: sizeClass,
        optionType: 'sizeClass',
        required: true,
        allowMultiple: true
      }
    ]
    break
  }
  default:
    break
  }
}

const addNewListType = async () => {
  try {
    appActionIsLoadingData.value = true
    // send api request to add a new list option by the listType
    const payload = inputForm.value
    switch (mainProps.listType) {
    case 'size-class':
      await postSizeClass(payload)
      break
    case 'media-types':
      await postMediaType(payload)
      break
    case 'shelf-type':
      // generate an individual shelf type for each size class selection
      await Promise.all(inputForm.value.size_classes.map(sizeClassObj => {
        return postShelfType({
          type: payload.type,
          size_class_id: sizeClassObj.id,
          max_capacity: sizeClassObj.max_capacity
        })
      }))
      break
    default:
      break
    }

    handleAlert({
      type: 'success',
      text: `Successfully Added A New ${titleCaseListType.value}`,
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
    listModal.value.hideModal()
  }
}

const updateListType = async () => {
  try {
    appActionIsLoadingData.value = true
    // send api request to update an existing list option by the listType
    let payload = {
      id: mainProps.listData.id,
      ...inputForm.value
    }
    switch (mainProps.listType) {
    case 'size-class': {
      //check if we removed owner selections and send updates to api
      let removedOwners = []
      removedOwners = inputFormOriginal.value.owner_ids.filter(oid => !inputForm.value.owner_ids.includes(oid))
      if (removedOwners.length > 0) {
        await deleteSizeClassOwners(payload.id, { owner_ids: removedOwners })
      }

      await patchSizeClass(payload)
      break
    }
    case 'media-types':
      await patchMediaType(payload)
      break
    case 'shelf-type': {
      //check if we removed size class selections and send updates delete the corressponding shelf type from the api
      let removedSizeClasses = []
      removedSizeClasses = inputFormOriginal.value.size_classes.filter(oSizeClass => !inputForm.value.size_class_ids.includes(oSizeClass.id))
      if (removedSizeClasses.length > 0) {
        await Promise.all(removedSizeClasses.map(sizeClassObj => {
          return deleteShelfType(sizeClassObj.shelf_type_id)
        }))
      }

      //check if we added new size class selections and create the corressponding shelf type
      let newSizeClasses = []
      newSizeClasses = inputForm.value.size_classes.filter(curSizeClass => !inputFormOriginal.value.size_class_ids.includes(curSizeClass.id))
      if (newSizeClasses.length > 0) {
        await Promise.all(newSizeClasses.map(sizeClassObj => {
          return postShelfType({
            type: payload.type,
            size_class_id: sizeClassObj.id,
            max_capacity: sizeClassObj.max_capacity
          })
        }))
      }

      // generate an individual shelf type update for every current shelf type by size class
      let currentSizeClasses = inputForm.value.size_classes.filter(curSizeClass => inputFormOriginal.value.size_class_ids.includes(curSizeClass.id))
      await Promise.all(currentSizeClasses.map(sizeClassObj => {
        return patchShelfType({
          id: sizeClassObj.shelf_type_id,
          type: payload.type,
          size_class_id: sizeClassObj.id,
          max_capacity: sizeClassObj.max_capacity
        })
      }))
      break
    }
    default:
      break
    }

    handleAlert({
      type: 'success',
      text: `Successfully Updated The ${titleCaseListType.value}`,
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
    listModal.value.hideModal()
  }
}

const updateShelfTypeSizeClass = (sizeClassIdArr) => {
  // custom function for shelf types only
  // when creating/updating a shelf type we need to map the corresponding added/removed user size class input to our input form
  const selectedSizeClasses = sizeClassIdArr.map(id => {
    return { ...sizeClass.value.find(s => s.id == id), max_capacity: 1 }
  })

  // if there are already existing size_classes that match any of the selectedSizeClasses we need to ignore updating them
  if (inputForm.value.size_classes.length > 0) {
    const removedSizeClasses = inputForm.value.size_classes.filter(sizeClassObj => !sizeClassIdArr.includes(sizeClassObj.id))
    const newSizeClasses = selectedSizeClasses.filter(sizeClassObj => !inputForm.value.size_classes.flatMap(s => s.id).includes(sizeClassObj.id))

    // remove the deleted sizeClasses
    if (removedSizeClasses) {
      inputForm.value.size_classes = inputForm.value.size_classes.filter(sizeClassObj => !removedSizeClasses.flatMap(s => s.id).includes(sizeClassObj.id))
    }
    // add the new sizeClasses
    if (newSizeClasses) {
      inputForm.value.size_classes = [
        ...inputForm.value.size_classes,
        ...newSizeClasses
      ]
    }
  } else {
    inputForm.value.size_classes = selectedSizeClasses
  }
}
</script>

<style lang="scss" scoped>
</style>
