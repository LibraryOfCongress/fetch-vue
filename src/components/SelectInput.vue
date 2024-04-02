<template>
  <q-select
    :dense="currentScreenSize == 'xs'"
    outlined
    :model-value="modelValue"
    @update:model-value="updateModelValue"
    :options="localOptions"
    :option-value="optionValue"
    :option-label="optionLabel"
    :multiple="multiple"
    :use-chips="useChips"
    emit-value
    map-options
    use-input
    :hide-selected="hideSelected"
    fill-input
    input-debounce="500"
    @filter="filterOptions"
    class="custom-select full-width"
    :placeholder="placeholder"
    :disable="disabled"
  >
    <template #no-option>
      <slot name="no-option">
        <q-item>
          <q-item-section>
            No results
          </q-item-section>
        </q-item>
      </slot>
    </template>
  </q-select>
</template>

<script setup>
import { ref } from 'vue'
import { useOptionStore } from 'src/stores/option-store'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'

// Props
const mainProps = defineProps({
  modelValue: undefined,
  options: {
    type: Array,
    default () {
      return []
    },
    required: true
  },
  optionType: {
    type: String,
    default: ''
  },
  optionValue: {
    type: String,
    default: ''
  },
  optionLabel: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  multiple: {
    type: Boolean,
    default: false
  },
  useChips: {
    type: Boolean,
    default: false
  },
  hideSelected: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Compasables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { getOptions } = useOptionStore()

// Local Data
const localOptions = ref(mainProps.options)

// Logic
const updateModelValue = (value) => {
  emit('update:modelValue', value)
}
const filterOptions = async (val, update) => {
  // if there is an optionType then we need to get a list of options from the api based on the optionType passed in
  // the passed in optionType should match an http endpoint
  if (mainProps.optionType !== '') {
    await getOptions(mainProps.optionType)
  }

  update(() => {
    localOptions.value = mainProps.options.filter(opt => opt[mainProps.optionLabel].toString().toLowerCase().indexOf(val.toLowerCase()) > -1)
  })
}
</script>

<style lang="scss" scoped>
.custom-select {
  :deep(.q-placeholder) {
    width: inherit;
  }

  :deep(.q-field__control) {
    &::before {
      border-color: $color-black;
    }
  }

  &.q-field--disabled {
    :deep(.q-field__control) {
      &::before {
        border-color: rgba($color-black, .25);
      }
    }
  }
}
</style>