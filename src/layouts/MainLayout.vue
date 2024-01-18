<template>
  <q-layout
    ref="main"
    class="main"
    view="lHh Lpr lFf"
  >
    <NavigationBar />

    <q-page-container class="main-content">
      <router-view />

      <!-- global alert component -->
      <transition-group
        name="alert-notification"
        tag="div"
        class="alert-notification"
        :style="calculateAlertContainerWidth"
      >
        <AlertPopup
          v-for="(item, i) in alerts"
          :key="i"
          :alert-type="item.type"
          :alert-text="item.text"
          :persistent="item.persistent"
          :auto-close="item.autoClose"
          @reset="clearAlerts()"
        />
      </transition-group>
    </q-page-container>

    <!-- pwa install banner -->
    <q-banner
      v-if="showAppInstallBanner"
      class="install-banner bg-primary text-white"
      rounded
      :inline-actions="currentScreenSize == 'xs' ? false : true"
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

<script setup>
import { onMounted, ref, provide, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useAlertPopup } from '@/composables/useAlertPopup'
import AlertPopup from '@/components/AlertPopup.vue'
import NavigationBar from '@/components/NavigationBar.vue'

// Composables
const $q = useQuasar()
const { currentScreenSize } = useCurrentScreenSize()
const { alerts, handleAlert, clearAlerts } = useAlertPopup()
provide('handle-alert', handleAlert) // handleAlert is globally accessible via provide/inject

// Local Data
const appInstallPrompt = ref(null)
const showAppInstallBanner = ref(false)
const main = ref(null)
const calculateAlertContainerWidth = computed(() => {
  // get the offset of the main qlayout prop and assign the calculated width for the alerts container
  if (main.value) {
    return `width: calc(100% - ${main.value.$.provides._q_l_.left.offset}px);`
  } else {
    return `width: calc(100% - ${300}px);`
  }
})

// Logic
onMounted(() => {
  if (!$q.localStorage.getItem('hideAppInstallation')) {
    // this event only gets fired on devices that support pwa installs
    window.addEventListener('beforeinstallprompt', (event) => {
      appInstallPrompt.value = event
      showAppInstallBanner.value = true
    })
  }
})
const installApp = () => {
  showAppInstallBanner.value = false
  appInstallPrompt.value.prompt()
  appInstallPrompt.value.userChoice.then(result => {
    if (result.outcome == 'accepted') {
      neverShowAppInstallBanner()
    }
  })
}
const neverShowAppInstallBanner = () => {
  showAppInstallBanner.value = false
  $q.localStorage.set('hideAppInstallation', true)
}
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
  z-index: 100000;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2), 0 3px 5px rgba(0, 0, 0, 0.24);
}

.alert-notification {
  position: absolute;
  top: 50px;
  display: flex;
  flex-direction: column-reverse;
  gap: 0.8rem;

  &-enter-active {
    animation: alert-fade-in 0.5s ease-in-out;
  }

  &-leave-active {
    animation: alert-fade-in 0.5s ease-in-out reverse;
  }
}

@keyframes alert-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
