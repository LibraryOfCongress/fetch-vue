<template>
  <div class="admin-dashboard">
    <div class="row q-mb-md">
      <div class="col-auto">
        <h1 class="text-h4 text-bold">
          Admin Dashboard
        </h1>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <q-list>
          <EssentialLink
            v-for="link in adminLinkList"
            :key="link.title"
            v-bind="link"
            icon-right="chevron_right"
            icon-right-size="28px"
            class="text-h6 text-bold q-px-xs-none q-px-sm-sm"
          />
        </q-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from '@/components/EssentialLink.vue'

// Local Data
const adminLinkList = ref([
  {
    title: 'Buildings',
    link: '/admin/buildings/'
  },
  {
    title: 'Groups & Permissions',
    link: '/admin/groups/'
  }
])
</script>

<style lang="scss" scoped>
</style>