<template>
  <div class="row">
    <div class="col-auto">
      <div class="breadcrumb">
        <EssentialLink
          :title="'Back'"
          :icon="'chevron_left'"
          :icon-size="'28px'"
          :icon-padding="'0px'"
          @click="router.back"
        />
      </div>
    </div>
    <q-space class="divider" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import EssentialLink from '@/components/EssentialLink.vue'

const router = useRouter()
</script>