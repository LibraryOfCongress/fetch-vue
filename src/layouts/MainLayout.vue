<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="test">
          Fetch App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
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
            @click="showOfflineBanner = !showOfflineBanner"
          />
        </template>
      </q-banner>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="main-wrapper">
      <router-view />
    </q-page-container>

    <!-- pwa install banner -->
    <q-banner
      v-if="showAppInstallBanner"
      class="install-banner bg-primary text-white"
      rounded
      :inline-actions="currentScreenSize < 500 ? false : true"
    >
      Would you like to install the FETCH app?
      <template #action>
        <q-btn
          flat
          color="white"
          label="Yes"
          @click="installApp"
        />
        <q-btn
          flat
          color="white"
          label="Later"
          @click="showAppInstallBanner = !showAppInstallBanner"
        />
        <q-btn
          flat
          color="white"
          label="Never"
          @click="neverShowAppInstallBanner"
        />
      </template>
    </q-banner>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import EssentialLink from '@/components/EssentialLink.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink
  },
  data() {
    return {
      essentialLinks: [
        {
          title: 'Docs',
          caption: 'quasar.dev',
          icon: 'school',
          link: 'https://quasar.dev'
        },
        {
          title: 'Github',
          caption: 'github.com/quasarframework',
          icon: 'code',
          link: 'https://github.com/quasarframework'
        },
        {
          title: 'Discord Chat Channel',
          caption: 'chat.quasar.dev',
          icon: 'chat',
          link: 'https://chat.quasar.dev'
        },
        {
          title: 'Forum',
          caption: 'forum.quasar.dev',
          icon: 'record_voice_over',
          link: 'https://forum.quasar.dev'
        },
        {
          title: 'Twitter',
          caption: '@quasarframework',
          icon: 'rss_feed',
          link: 'https://twitter.quasar.dev'
        },
        {
          title: 'Facebook',
          caption: '@QuasarFramework',
          icon: 'public',
          link: 'https://facebook.quasar.dev'
        },
        {
          title: 'Quasar Awesome',
          caption: 'Community Quasar projects',
          icon: 'favorite',
          link: 'https://awesome.quasar.dev'
        }
      ],
      leftDrawerOpen: false,
      appInstallPrompt: null,
      showAppInstallBanner: false,
      showOfflineBanner: false,
      currentScreenSize: window.innerWidth
    }
  },
  mounted() {
    if (!this.$q.localStorage.getItem('hideAppInstallation')) {
      // this event only gets fired on devices that support pwa installs
      window.addEventListener('beforeinstallprompt', (event) => {
        this.appInstallPrompt = event
        this.showAppInstallBanner = true
      })
    }

    window.addEventListener('offline', () => {
      this.showOfflineBanner = true
    })
    window.addEventListener('online', () => {
      this.showOfflineBanner = false
    })
  },
  methods: {
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    installApp() {
      this.showAppInstallBanner = false
      this.appInstallPrompt.prompt()
      this.appInstallPrompt.userChoice.then(result => {
        if (result.outcome == 'accepted') {
          this.neverShowAppInstallBanner()
        }
      })
    },
    neverShowAppInstallBanner() {
      this.showAppInstallBanner = false
      this.$q.localStorage.set('hideAppInstallation', true)
    }
  }
})
</script>

<style lang="scss" scoped>
.main-wrapper {
  position: relative;
}
.install-banner {
  position: absolute;
  left: 50%;
  bottom: .5rem;
  width: 98%;
  transform: translateX(-50%);
  z-index: 10000;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2), 0 3px 5px rgba(0, 0, 0, 0.24);
}
</style>
