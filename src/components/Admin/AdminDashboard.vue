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
                @click="sublink.title == 'Buildings' ? handleLocationManageRoute(sublink.title) : showLocationManageRouteModal = true"
              />
            </q-expansion-item>
          </template>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from '@/components/EssentialLink.vue'

const router = useRouter()

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
const showLocationManageRouteModal = ref(false)

// Logic
const handleLocationManageRoute = (linkTitle) => {
  switch (linkTitle) {
  case 'Buildings':
    router.push({
      name: 'admin-manage-buildings'
    })
    break
  case 'Modules':
    //TOOD need to figure out how we want to generate the specified location routes
    break
  case 'Aisles':
    break
  case 'Ladders':
    break
  case 'Shelves':
    break
  default:
    break
  }
}
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