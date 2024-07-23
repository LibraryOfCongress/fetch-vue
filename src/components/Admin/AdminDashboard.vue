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
          <template
            v-for="link in adminLinkList"
            :key="link.title"
          >
            <EssentialLink
              v-if="link.link"
              v-bind="link"
              icon-right="chevron_right"
              icon-right-size="28px"
              class="text-h6 text-bold q-px-xs-none q-px-sm-sm"
            />
            <q-expansion-item
              v-else
              class="admin-dashboard-expansion"
              header-class="text-h6 text-bold q-px-xs-none q-px-sm-sm"
              :label="link.title"
            >
              <EssentialLink
                v-for="sublink in link.sublinks"
                :key="sublink.title"
                :title="sublink.title"
                icon-right="chevron_right"
                icon-right-size="28px"
                class="text-h6 text-bold q-px-sm-lg q-pr-xs-sm q-pr-sm-lg"
                @click="sublink.title == 'Buildings' ? router.push({ name: 'admin-manage-buildings' }) : showLocationManageRouteModal = sublink.title"
              />
            </q-expansion-item>
          </template>
        </q-list>
      </div>
    </div>
  </div>

  <!-- routing modal whenever user selects any nested building field ex: modules, aisles ect-->
  <AdminLocationManagerRouting
    v-if="showLocationManageRouteModal !== null"
    :location-title="showLocationManageRouteModal"
    @hide="showLocationManageRouteModal = null; resetBuildingStore();"
  />
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useBuildingStore } from '@/stores/building-store'
import EssentialLink from '@/components/EssentialLink.vue'
import AdminLocationManagerRouting from '@/components/Admin/AdminLocationManagerRouting.vue'

const router = useRouter()

// Store Data
const { resetBuildingStore } = useBuildingStore()

// Local Data
const adminLinkList = ref([
  {
    title: 'Buildings',
    link: '/admin/buildings/'
  },
  {
    title: 'Groups & Permissions',
    link: '/admin/groups/'
  },
  {
    title: 'Location Manager',
    sublinks: [
      {
        title: 'Buildings'
      },
      {
        title: 'Modules'
      },
      {
        title: 'Aisles'
      },
      {
        title: 'Ladders'
      },
      {
        title: 'Shelves'
      }
    ]
  }
])
const showLocationManageRouteModal = ref(null)

// Logic
onBeforeMount(() => {
  resetBuildingStore()
})
</script>

<style lang="scss" scoped>
.admin-dashboard {
  &-expansion {
    :deep(.q-icon) {
      font-size: 28px;
      color: $color-black;
    }
  }
}
</style>