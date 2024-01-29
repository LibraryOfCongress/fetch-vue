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
        <template #action>
          <q-btn
            flat
            color="black"
            label="Dismiss"
            class="text-body1"
            @click="showOfflineBanner = !showOfflineBanner"
          />
        </template>
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
      <q-list>
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
          class="justify-center text-white"
        />
      </q-list>
    </q-drawer>

    <!-- bottom nav (mobile only) -->
    <q-footer
      v-if="currentScreenSize == 'xs'"
      elevated
      class="text-white"
    >
      <q-toolbar class="nav-bar-bottom bg-primary justify-between">
        <q-item
          v-for="(link, i) in mobileNavLinks"
          :key="i"
          clickable
          tag="a"
          :to="link.link"
          class="column items-center text-white"
        >
          <q-icon
            :name="link.icon"
            size="20px"
          />

          <q-item-label class="text-subcaption q-mt-xs">
            {{ link.title }}
          </q-item-label>
        </q-item>
      </q-toolbar>
    </q-footer>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useBackgroundSyncHandler } from '@/composables/useBackgroundSyncHandler.js'
import EssentialLink from '@/components/EssentialLink.vue'
import SearchInput from '@/components/SearchInput.vue'

// Composables
const { currentScreenSize } = useCurrentScreenSize()
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
    title: 'Verfication',
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
    link: '/'
  }
])
const mobileNavLinks = ref([
  {
    title: 'Accession',
    icon: 'mdi-barcode-scan',
    link: '/accession'
  },
  {
    title: 'Verfication',
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
    link: '/'
  }
])
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

    // display a content update notification whenever the app recieves updates
    navigator.serviceWorker.addEventListener('installed', event => {
      if (event.isUpdate) {
        if (confirm('New content is available!. Click OK to refresh')) {
          window.location.reload()
        }
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
</script>

<style lang="scss" scoped>
.nav {
  position: relative;

  &-search {
    width: 50%;

    @media (max-width: $breakpoint-sm-min) {
      width: 75%;
    }
  }

  &-bar-bottom {
    .q-item {
      padding-left: 12px;
      padding-right: 12px;
    }
  }
}
</style>
