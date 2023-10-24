<template>
  <q-input
    class="search-input"
    dark
    outlined
    color="secondary"
    dense
    v-model="searchText"
    :placeholder="placeholder"
  >
    <template #append>
      <q-icon
        v-if="searchText === ''"
        name="search"
        @click="$event.target.closest('div.q-field__control').querySelector('input').focus()"
      />
      <q-icon
        v-else
        name="clear"
        class="cursor-pointer"
        @click="searchText = ''"
      />
    </template>
  </q-input>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchInput',
  props: {
    placeholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      searchText: ''
    };
  }
});
</script>

<style lang="scss" scoped>
.search-input {
  :deep(.q-field__control) {
    &::before {
      border-color: transparent;
      background-color: rgba(255,255,255, .2);
    }
  }
}
</style>
