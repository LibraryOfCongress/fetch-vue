<template>
  <q-item
    clickable
    tag="a"
    :to="link"
    class="essential-link"
  >
    <q-item-section
      v-if="icon"
      avatar
      :style="{'padding': iconPadding}"
    >
      <q-icon
        :name="icon"
        :size="iconSize"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label
        v-if="caption !== ''"
        caption
      >
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    default: ''
  },

  link: {
    type: String,
    default: '#'
  },

  icon: {
    type: String,
    default: ''
  },
  iconSize: {
    type: String,
    default: '24px'
  },
  iconPadding: {
    type: String,
    default: '0px 16px 0px 0px'
  }
})
</script>

<style lang="scss" scoped>
.essential-link {
  :deep(div.q-item__section--avatar) {
    min-width: initial;
  }
}
</style>
