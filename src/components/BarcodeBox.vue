<template>
  <div
    class="barcode text-h4 text-center"
    :style="[ `min-height:${minHeight};`]"
  >
    {{ barcode }}
  </div>
</template>

<script setup>
defineProps({
  barcode: {
    type: String,
    default: ''
  },
  minHeight: {
    type: String,
    default: '18rem'
  }
})
</script>

<style lang="scss" scoped>
.barcode {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: $secondary;
  color: $color-white;
  border-radius: 3px;

  @media (max-width: $breakpoint-sm-min) {
    min-height: 5rem;
  }
}
</style>