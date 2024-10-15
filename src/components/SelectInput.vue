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

    <template #option="{ itemProps, opt, selected, toggleOption }">
      <slot
        name="option"
        :item-props="itemProps"
        :opt="opt"
        :selected="selected"
        :toggle-option="toggleOption"
      >
        <q-item v-bind="itemProps">
          <q-item-section>
            <span>{{ renderLabel(opt) }}</span>
          </q-item-section>
        </q-item>
      </slot>
    </template>
  </q-select>
</template>

<script setup>
import { ref, watch, inject } from 'vue'
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
    type: null,
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
const getNestedKeyPath = inject('get-nested-key-path')

watch(() => mainProps.options, (updatedOptions) => {
  localOptions.value = updatedOptions
})

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
    if (mainProps.optionLabel.toString().includes('.')) {
      // if we pass in a arrow function label we convert it to read as a property key
      // ex opt => opt.barcode.value we only need 'barcode.value' from that function
      const paramPath = mainProps.optionLabel.toString().split('.').slice(1).join('.')
      localOptions.value = mainProps.options.filter(opt => {
        return getNestedKeyPath(opt, paramPath).toString().toLowerCase().indexOf(val.toLowerCase()) > -1
      })
    } else {
      // filter all passed in options based on user input value
      if (mainProps.optionLabel !== '') {
        localOptions.value = mainProps.options.filter(opt => opt[mainProps.optionLabel]?.toString().toLowerCase().indexOf(val.toLowerCase()) > -1)
      } else {
        localOptions.value = mainProps.options.filter(opt => opt.toString().toLowerCase().indexOf(val.toLowerCase()) > -1)
      }
    }
  })
}
const renderLabel = (opt) => {
  if (mainProps.optionLabel.toString().includes('.')) {
    // if we pass in a arrow function label we convert it to read as a property key
    // ex opt => opt.barcode.value we only need 'barcode.value' from that function
    const paramPath = mainProps.optionLabel.toString().split('.').slice(1).join('.')
    return getNestedKeyPath(opt, paramPath)
  } else {
    return opt[mainProps.optionLabel]
  }
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

    .q-chip__icon {
      margin-top: -3px;
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