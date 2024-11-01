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
                  @update:model-value="null"
                  :aria-label="`${field.field}Select`"
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
import { ref, computed, onBeforeMount, inject } from 'vue'
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
const { owners } = storeToRefs(useOptionStore())
const {
  postSizeClass,
  patchSizeClass
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
const isInputFormValid = computed(() => {
  const optionalFields = inputFields.value.flatMap(f => !f.required ? f.field : [] )
  return !Object.keys(inputForm.value).every(key => optionalFields.includes(key) || inputForm.value[key] !== null && inputForm.value[key] !== '')
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
      name: mainProps.listData.name ?? '',
      short_name: mainProps.listData.short_name ?? '',
      width: mainProps.listData.width ?? '',
      depth: mainProps.listData.depth ?? '',
      height: mainProps.listData.height ?? '',
      owner_id: mainProps.listData.owner_id ?? null
    }
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
        field: 'owner_id',
        label: 'Owner',
        options: owners,
        optionType: 'owners',
        required: true,
        allowMultiple: true
      }
    ]
    break
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
    case 'size-class':
      await patchSizeClass(payload)
      break
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
</script>

<style lang="scss" scoped>
</style>