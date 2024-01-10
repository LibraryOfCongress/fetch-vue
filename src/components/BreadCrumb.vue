<template>
  <div class="breadcrumb row items-center">
    <div class="col-auto">
      <div class="breadcrumb-list">
        <EssentialLink
          :title="'Back'"
          :icon="'chevron_left'"
          :icon-size="'28px'"
          :icon-padding="'0px'"
          @click="router.back"
        />
      </div>
    </div>

    <slot name="actions" />

    <q-space class="divider" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import EssentialLink from '@/components/EssentialLink.vue'

const router = useRouter()
</script>

<style lang="scss" scoped>
.breadcrumb {
  position: sticky;
  top: 50px; // this offsets the main nav
  background-color: $color-white;
  z-index: 2000;
}
</style>