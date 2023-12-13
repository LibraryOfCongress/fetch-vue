<template>
  <q-layout
    class="main"
    view="lHh Lpr lFf"
  >
    <NavigationBar />

    <q-page-container class="main-content">
      <router-view />
    </q-page-container>

    <!-- pwa install banner -->
    <q-banner
      v-if="showAppInstallBanner"
      class="install-banner bg-primary text-white"
      rounded
      :inline-actions="currentScreenSize <= 600 ? false : true"
    >
      Would you like to install the FETCH app?
      <template #action>
        <q-btn
          flat
          color="white"
          label="Yes"
          class="text-body1"
          @click="installApp"
        />
        <q-btn
          flat
          color="white"
          label="Later"
          class="text-body1"
          @click="showAppInstallBanner = !showAppInstallBanner"
        />
        <q-btn
          flat
          color="white"
          label="Never"
          class="text-body1"
          @click="neverShowAppInstallBanner"
        />
      </template>
    </q-banner>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import NavigationBar from '@/components/NavigationBar.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    NavigationBar
  },
  setup () {
    const { currentScreenSize } = useCurrentScreenSize()
    return {
      currentScreenSize
    }
  },
  data () {
    return {
      appInstallPrompt: null,
      showAppInstallBanner: false
    }
  },
  mounted () {
    if (!this.$q.localStorage.getItem('hideAppInstallation')) {
      // this event only gets fired on devices that support pwa installs
      window.addEventListener('beforeinstallprompt', (event) => {
        this.appInstallPrompt = event
        this.showAppInstallBanner = true
      })
    }
  },
  methods: {
    installApp () {
      this.showAppInstallBanner = false
      this.appInstallPrompt.prompt()
      this.appInstallPrompt.userChoice.then(result => {
        if (result.outcome == 'accepted') {
          this.neverShowAppInstallBanner()
        }
      })
    },
    neverShowAppInstallBanner () {
      this.showAppInstallBanner = false
      this.$q.localStorage.set('hideAppInstallation', true)
    }
  }
})
</script>

<style lang="scss" scoped>
.main {
  &-content {
    position: relative;
  }
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
