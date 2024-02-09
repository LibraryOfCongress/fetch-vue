<template>
  <q-input
    :dense="currentScreenSize == 'xs'"
    outlined
    :model-value="modelValue"
    @update:model-value="updateModelValue"
    :placeholder="placeholder"
    :disable="disabled"
    class="full-width"
  />
</template>

<script setup>
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'

// Props
defineProps({
  modelValue: undefined,
  placeholder: {
    type: String,
    default: ''
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

// Logic
const updateModelValue = (value) => {
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
</style>