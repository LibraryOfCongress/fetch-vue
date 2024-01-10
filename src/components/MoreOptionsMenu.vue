<template>
  <q-btn
    flat
    icon="more_vert"
    class="more-menu"
  >
    <q-menu>
      <q-list class="more-menu-list">
        <q-item
          v-for="(opt, i) in options"
          :key="i"
          :clickable="!opt.disabled"
          v-close-popup
          @click="emit('click', opt)"
          :class="opt.disabled ? 'disabled' : ''"
        >
          <q-item-section>
            {{ opt.text }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
defineProps({
  options: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['click'])
</script>

<style lang="scss" scoped>
.more-menu {
  padding: 0;

  &-list {
    min-width: 100px;
  }
}
</style>