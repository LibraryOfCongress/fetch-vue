<template>
  <div class="breadcrumb row items-center">
    <div
      class="col-auto"
      v-for="(breadCrumb, i) in breadcrumbList"
      :key="i"
    >
      <div class="breadcrumb-items">
        <EssentialLink
          :title="breadCrumb.text"
          :icon="currentScreenSize !== 'xs' ? breadCrumb.icon : null"
          :icon-size="'25px'"
          :icon-padding="'0px 4px 0px 0px'"
          @click="router.push(breadCrumb.to)"
          :disabled="!breadCrumb.to"
          :dense="currentScreenSize == 'xs'"
        />

        <q-icon
          v-if="i !== (breadcrumbList.length - 1)"
          name="arrow_right"
          color="primary"
          size="25px"
        />
      </div>
    </div>

    <q-space class="divider" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialLink from '@/components/EssentialLink.vue'

const route = useRoute()
const router = useRouter()

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Local Data
const breadcrumbList = ref([])

// Logic
onMounted(() => {
  generateBreadCrumbs()
})

watch(route, () => {
  // regenerate the breadcrumb list whenever a route change is detected
  generateBreadCrumbs()
})

const generateBreadCrumbs = () => {
  let breadCrumbs = [
    {
      text: 'Home',
      to: '/',
      icon: 'mdi-home'
    }
  ]

  // handle the breadcrumb generation for specific routes and their params
  // this list of routes should match all the routes in the routes.js file
  switch (route.name) {
  case 'accession':
    if (!route.params.jobId) {
      breadCrumbs = [
        ...breadCrumbs,
        { text: 'Accession' }
      ]
    } else {
      breadCrumbs = [
        ...breadCrumbs,
        {
          text: 'Accession',
          to: '/accession'
        },
        { text: `${route.params.jobId}` }
      ]
    }
    break
  case 'accession-container':
    breadCrumbs = [
      ...breadCrumbs,
      {
        text: 'Accession',
        to: '/accession'
      },
      {
        text: route.params.jobId,
        to: `/accession/${route.params.jobId}`
      },
      { text: route.params.containerId }
    ]
    break
  case 'admin':
    breadCrumbs = [
      ...breadCrumbs,
      { text: 'Admin' }
    ]
    break
  case 'admin-building-view':
    breadCrumbs = [
      ...breadCrumbs,
      {
        text: 'Admin',
        to: '/admin'
      },
      { text: route.params.buildingId }
    ]
    break
  case 'item-management':
    if (!route.params.type) {
      breadCrumbs = [
        ...breadCrumbs,
        { text: 'Item Management Tray' }
      ]
    } else {
      breadCrumbs = [
        ...breadCrumbs,
        { text: 'Item Management Non Tray' }
      ]
    }
    break
  case 'verification':
    if (!route.params.jobId) {
      breadCrumbs = [
        ...breadCrumbs,
        { text: 'Verification' }
      ]
    } else {
      breadCrumbs = [
        ...breadCrumbs,
        {
          text: 'Verification',
          to: '/verification'
        },
        { text: `${route.params.jobId}` }
      ]
    }
    break
  case 'verification-container':
    breadCrumbs = [
      ...breadCrumbs,
      {
        text: 'Verification',
        to: '/verification'
      },
      {
        text: route.params.jobId,
        to: `/verification/${route.params.jobId}`
      },
      { text: route.params.containerId }
    ]
    break
  case 'shelving':
    if (!route.params.jobId) {
      breadCrumbs = [
        ...breadCrumbs,
        { text: 'Shelving' }
      ]
    } else {
      breadCrumbs = [
        ...breadCrumbs,
        {
          text: 'Shelving',
          to: '/shelving'
        },
        { text: `${route.params.jobId}` }
      ]
    }
    break
  default:
    break
  }

  breadcrumbList.value = breadCrumbs
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  position: sticky;
  top: 50px; // this offsets the main nav
  background-color: $color-white;
  z-index: 1500;

  &-items {
    display: flex;
    align-items: center;

    :deep(.essential-link.q-item--dense) {
      padding: 2px 3px;
    }
  }
}
</style>