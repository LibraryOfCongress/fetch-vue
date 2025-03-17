<template>
  <q-select
    ref="selectInputComponent"
    :dense="currentScreenSize == 'xs'"
    outlined
    :clearable="clearable"
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
    :display-value="multiple ? renderMultiSelectDisplayValues() : undefined"
    :placeholder="placeholder"
    :disable="disabled"
    :loading="loading || scrollLoading"
    @virtual-scroll="loadMoreOptions"
  >
    <template
      v-if="!loading"
      #no-option
    >
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

    <!-- do not expose this slot, it is only use to render our custom chips and conflicts with our other select props -->
    <template
      v-if="useChips"
      #selected-item="scope"
    >
      <q-chip
        removable
        dense
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        class=""
      >
        {{ renderLabel(scope.opt) }}
      </q-chip>
    </template>
  </q-select>
</template>

<script setup>
import { ref, watch, inject, computed } from 'vue'
import { storeToRefs } from 'pinia'
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
  optionQuery: {
    type: Object,
    default () {
      return {
        size: 100
      }
    }
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
  clearable: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
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
const { optionsTotal } = storeToRefs(useOptionStore())

// Local Data
const selectInputComponent = ref(null)
const selectInputFilterValue = ref('')
const localOptions = ref(mainProps.options)
const scrollLoading = ref(false)
const lastOptionsPage = computed(() => {
  // divide total local options by apiPageSizeDefault to get our last page value
  return Math.ceil(optionsTotal.value / 50)
})
const nextOptionsPage = ref(1)

// Logic
const getNestedKeyPath = inject('get-nested-key-path')

watch(() => mainProps.options, (updatedOptions) => {
  localOptions.value = updatedOptions
})

const updateModelValue = (value) => {
  emit('update:modelValue', value)
}
const filterOptions = async (val, update) => {
  // if there is an optionType then we need to get a the intial list of options from the api based on the optionType passed in
  // the passed in optionType should match an http endpoint
  if (mainProps.optionType !== '' && localOptions.value.length == 0) {
    await getOptions(mainProps.optionType, mainProps.optionQuery)
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

    // set the user inputed filter value in state
    selectInputFilterValue.value = val
  })
}
const loadMoreOptions = async ({ to, ref }) => {
  const lastIndex = localOptions.value.length - 1
  // only load more options if were at the bottom of the list, not on the last page and not trying to filter search
  if (!scrollLoading.value && to === lastIndex && nextOptionsPage.value < lastOptionsPage.value && selectInputFilterValue.value == '') {
    scrollLoading.value = true
    await getOptions(mainProps.optionType, {
      ...mainProps.optionQuery,
      page: nextOptionsPage.value + 1
    }, true)

    nextOptionsPage.value++
    // calls and internal qSelect function that handles refreshing the list with the updating options at the last index position
    ref.refresh()
    scrollLoading.value = false
  }
}
const renderLabel = (opt) => {
  if (mainProps.optionLabel.toString().includes('.')) {
    // if we pass in a arrow function label we convert it to read as a property key
    // ex opt => opt.barcode.value we only need 'barcode.value' from that function
    const paramPath = mainProps.optionLabel.toString().split('.').slice(1).join('.')
    return getNestedKeyPath(opt, paramPath)
  } else if (mainProps.optionLabel) {
    return opt[mainProps.optionLabel]
  } else {
    return opt
  }
}
const renderMultiSelectDisplayValues = () => {
  if (mainProps.modelValue && mainProps.modelValue.length >= 5) {
    // if user selects more than 4 values we change the select display value to say the first 4 values + more count message
    // ex (select display if user selected 9 options): A,B,C,D + 5 more
    const multiDisplayLabel = mainProps.modelValue.map(idVal => {
      return renderLabel(mainProps.options.find(opt => opt.id == idVal))
    }).splice(0, 4)

    return `${multiDisplayLabel} + ${mainProps.modelValue.length - 4} more`
  } else if (mainProps.modelValue) {
    // display the single selected value
    const displayLabel = mainProps.modelValue.map(idVal => {
      return renderLabel(mainProps.options.find(opt => opt.id == idVal))
    })
    return displayLabel.toString()
  } else {
    // this is the default value for the displayValue prop on the select input
    return undefined
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