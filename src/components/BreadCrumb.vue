<template>
  <div class="row">
    <div class="col-auto">
      <div class="breadcrumb">
        <EssentialLink
          :link="router.options.history.state.back"
          :title="'Back'"
          :icon="'chevron_left'"
          :icon-size="'28px'"
          :icon-padding="'0px'"
        />
      </div>
    </div>
  </div>

  <q-space class="divider" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import EssentialLink from '@/components/EssentialLink.vue'

const router = useRouter()
</script>