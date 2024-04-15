<template>
  <q-btn-toggle
    :model-value="modelValue"
    @update:model-value="updateModelValue"
    spread
    no-caps
    unelevated
    :toggle-color="toggleColor"
    :color="activeTextColor"
    :text-color="textColor"
    class="custom-toggle"
    :style="[ currentScreenSize == 'xs' ? 'height:40px;' : 'height:56px;' ]"
    :options="mainProps.options"
  />
</template>

<script setup>
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'

// Props
const mainProps = defineProps({
  modelValue: undefined,
  options: {
    type: Array,
    default () {
      return [
        { label: 'Yes', value: true },
        { label: 'No', value: false }
      ]
    }
  },
  toggleColor: {
    type: String,
    default: 'accent'
  },
  activeTextColor: {
    type: String,
    default: 'white'
  },
  textColor: {
    type: String,
    default: 'black'
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
.custom-toggle {
  border: 1px solid $accent;
  width: 100%;
  overflow: auto;

  button[aria-pressed=true] {
    border-radius: 0;
  }
}
</style>