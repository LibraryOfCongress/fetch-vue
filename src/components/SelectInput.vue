<template>
  <q-select
    :dense="currentScreenSize <= 600"
    outlined
    :model-value="modelValue"
    @update:model-value="updateModelValue"
    :options="localOptions"
    :option-value="optionValue"
    :option-label="optionLabel"
    emit-value
    map-options
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    @filter="filterOptions"
    class="custom-select full-width"
    :placeholder="placeholder"
  />
</template>

<script setup>
import { ref } from 'vue'
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
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Compasables
const { currentScreenSize } = useCurrentScreenSize()

// Local Data
const localOptions = ref(mainProps.options)

// Logic
const updateModelValue = (value) => {
  emit('update:modelValue', value)
}
const filterOptions = (val, update) => {
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
}
</style>