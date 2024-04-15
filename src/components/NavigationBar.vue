<template>
  <div class="nav">
    <!-- main nav -->
    <q-header elevated>
      <q-toolbar class="bg-secondary justify-between">
        <q-btn
          color="white"
          flat
          dense
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <div class="nav-search">
          <SearchInput placeholder="Search" />
        </div>

        <div>
          <q-avatar
            rounded
            size="md"
            icon="person"
            color="secondary"
            class="text-white"
            font-size="25px"
          />
        </div>
      </q-toolbar>

      <!-- offline banner -->
      <q-banner
        v-if="showOfflineBanner"
        class="offline-banner bg-color-gray-light text-color-black"
        inline-actions
        dense
      >
        <q-icon
          name="signal_wifi_off"
          color="negative"
          size="25px"
          class="q-mr-sm"
        />
        You are in offline mode.
      </q-banner>

      <!-- online banner if user has pending api requests -->
      <q-banner
        v-if="showOnlineBanner"
        class="offline-banner bg-color-gray-light text-color-black"
        inline-actions
        dense
      >
        <q-icon
          name="wifi"
          color="positive"
          size="25px"
          class="q-mr-sm"
        />
        You are back online! There are pending requests to be sent.
        <template #action>
          <q-btn
            unelevated
            :loading="syncInProgress == 'In Progress'"
            color="positive"
            :label="syncInProgress == 'Complete' ? 'Sync Completed' : 'Send Requests'"
            class="text-body1"
            @click="triggerBackgroundSync"
          >
            <template #loading>
              <q-spinner-bars
                color="white"
                size="1rem"
              />
            </template>
          </q-btn>
        </template>
      </q-banner>
    </q-header>

    <!-- side nav -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="bg-primary"
    >
      <q-list class="nav-list">
        <q-item
          class="q-mb-lg align-center"
          clickable
          tag="a"
          :to="'/'"
        >
          <q-item-section>
            <q-icon
              name="image"
              color="secondary"
              size="120px"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-secondary text-bold">
              FETCH LOGO
            </q-item-label>
          </q-item-section>
        </q-item>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          :icon-size="'28px'"
          class="nav-list-link text-white"
          :class="isActiveLink(link) ? 'nav-active' : ''"
        />

        <!-- admin level link -->
        <EssentialLink
          v-bind="adminLink"
          :icon-size="'28px'"
          class="nav-list-link-admin text-white"
          :class="isActiveLink(adminLink) ? 'nav-active' : ''"
        />
      </q-list>
    </q-drawer>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { useBackgroundSyncHandler } from '@/composables/useBackgroundSyncHandler.js'
import EssentialLink from '@/components/EssentialLink.vue'
import SearchInput from '@/components/SearchInput.vue'

const route = useRoute()

// Composables
const { bgSyncData, syncInProgress, triggerBackgroundSync } = useBackgroundSyncHandler()

// Store Data
const { appIsOffline } = storeToRefs(useGlobalStore())

// Local Data
const essentialLinks = ref([
  {
    title: 'Accession',
    icon: 'mdi-barcode-scan',
    link: '/accession'
  },
  {
    title: 'Verification',
    icon: 'done_all',
    link: '/verification'
  },
  {
    title: 'Shelving',
    icon: 'subject',
    link: '/shelving'
  },
  {
    title: 'Request',
    icon: 'manage_search',
    link: '/'
  },
  {
    title: 'Refile',
    icon: 'list',
    link: '/test'
  }
])
const adminLink = ref({
  title: 'Admin',
  icon: 'mdi-shield-account',
  link: '/admin'
})
const leftDrawerOpen = ref(false)
const showOfflineBanner = ref(false)
const showOnlineBanner = ref(false)

// Logic
onMounted(() => {
  window.addEventListener('offline', () => {
    showOnlineBanner.value = false
    showOfflineBanner.value = true

    // set offline state in store
    appIsOffline.value = true
  })
  window.addEventListener('online', () => {
    showOfflineBanner.value = false
    appIsOffline.value = false
  })

  if ('serviceWorker' in navigator) {
    // listen for messages from the serviceworker scripts
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data.message == 'pending sync') {
      // show online banner only if we have requests pending in queue
        showOnlineBanner.value = true
      } else if (event.data.message == 'sync complete') {
      // when user triggers an offline sync, we need to wait for the syncComplete message from the serviceworker queue
        syncInProgress.value = 'Complete'

        setTimeout(() => {
          showOnlineBanner.value = false
          syncInProgress.value = ''
        }, 3000)
      }
    })
  }
})

// watch the bgSyncData and if we detect any requests that are still pending display the online banner
watch(bgSyncData, () => {
  if (bgSyncData.value.length > 0 && navigator.onLine) {
    showOnlineBanner.value = true
  }
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const isActiveLink = (linkObj) => {
  if (linkObj.link !== '/' && route.path.includes(linkObj.link)) {
    return true
  } else {
    return false
  }
}
</script>

<style lang="scss" scoped>
.nav {
  position: relative;

  &-active {
    background-color: $accent;
  }

  &-search {
    width: 50%;

    @media (max-width: $breakpoint-sm-min) {
      width: 75%;
    }
  }

  &-list {
    position: relative;
    height: 100%;

    &-link {
      &-admin {
        position: absolute;
        bottom: 0px;
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>
