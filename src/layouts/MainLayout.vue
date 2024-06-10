<template>
  <q-layout
    ref="main"
    class="main"
    view="lHh Lpr lFf"
  >
    <NavigationBar />

    <q-page-container class="main-content">
      <BreadCrumb
        v-if="route.name !== 'home'"
        ref="breadCrumbComponent"
      />

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
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useAlertPopup } from '@/composables/useAlertPopup'
import AlertPopup from '@/components/AlertPopup.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import BreadCrumb from '@/components/BreadCrumb.vue'

const route = useRoute()

// Composables
const $q = useQuasar()
const { currentScreenSize } = useCurrentScreenSize()
const { alerts, handleAlert, clearAlerts } = useAlertPopup()

// Local Data
const breadCrumbComponent = ref(null)
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

  // trigger a service worker / app content check every 8 hours
  if ('serviceWorker' in navigator) {
    setInterval(() => {
      checkForServiceWorkerUpdates()
    }, 28800000)
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
const checkForServiceWorkerUpdates = () => {
  navigator.serviceWorker.getRegistrations().then(async (registrations) => {
    for (let registration of registrations) {
      // update the service workers and get latest content
      await registration.update()
    }
  })
}

// Global Functions
provide('handle-alert', handleAlert) // handleAlert is globally accessible via provide/inject
const handlePageOffset = () => {
  // this is the global function will use to control the q-page components min-height generation
  // this is needed since we are adding breadcrumbs to all pages which the q-page components default offset only checks for the navigation bar

  // NavigationBar component height = 50px
  let headerOffset = 50

  // NavigationBar component height + BreadCrumb component height (dynamic) = offest
  if (route.name !== 'home') {
    // default element height on desktop is 49px
    let breadCrumbElementHeight = 49
    if (breadCrumbComponent.value) {
      breadCrumbElementHeight = breadCrumbComponent.value.$el.clientHeight
    }
    headerOffset = 50 + breadCrumbElementHeight
  }

  return { minHeight: `calc(100vh - ${headerOffset}px)` }
}
provide('handle-page-offset', handlePageOffset) // handlePageOffset is globally accessible via provide/inject
const getNestedKeyPath = (obj, path) => {
  if (typeof path === 'string') {
    path = path.replace('?', '').split('.')
  }

  if (path.length === 0) {
    return obj
  }
  return getNestedKeyPath(obj[path[0]], path.slice(1))
}
provide('get-nested-key-path', getNestedKeyPath)
const formatDateTime = (dateTime) => {
  if (!dateTime) {
    return {
      date: '',
      time: '',
      dateTime: ''
    }
  }
  const localTimeFormat = new Date(dateTime).toLocaleString()
  const splitDateTime = localTimeFormat.split(',')
  return {
    date: splitDateTime[0],
    time: splitDateTime[1],
    dateTime: localTimeFormat
  }
}
provide('format-date-time', formatDateTime)
const getItemLocation = (itemData) => {
  let module = ''
  let aisle = ''
  let side = ''
  let ladder = ''
  let shelf = ''
  let shelfPosition = ''
  if (itemData && itemData.shelf_position) {
    module = itemData.shelf_position.shelf.ladder.side.aisle.module?.module_number.number
    aisle = itemData.shelf_position.shelf.ladder.side.aisle.aisle_number?.number
    side = itemData.shelf_position.shelf.ladder.side.side_orientation?.name
    ladder = itemData.shelf_position.shelf.ladder.ladder_number?.number
    shelf = itemData.shelf_position.shelf.shelf_number?.number
    shelfPosition = itemData.shelf_position.shelf_position_number?.number
  }

  return `${module}-${aisle}-${side == 'Right' ? 'R' : side == 'Left' ? 'L' : side}-${ladder}-${shelf}-${shelfPosition}`.replace('undefined-', '')
}
provide('get-item-location', getItemLocation)
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
  z-index: 7000;

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
