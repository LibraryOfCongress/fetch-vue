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

<script>
import { defineComponent } from 'vue'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import EssentialLink from '@/components/EssentialLink.vue'
import SearchInput from '@/components/SearchInput.vue'

export default defineComponent({
  name: 'NavigationBar',
  components: {
    EssentialLink,
    SearchInput
  },
  setup () {
    const { currentScreenSize } = useCurrentScreenSize()
    return {
      currentScreenSize
    }
  },
  data () {
    return {
      essentialLinks: [
        {
          title: 'Accession',
          icon: 'mdi-barcode-scan',
          link: '/accession'
        },
        {
          title: 'Verfication',
          icon: 'done_all',
          link: '/'
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
      ],
      mobileNavLinks: [
        {
          title: 'Accession',
          icon: 'mdi-barcode-scan',
          link: '/accession'
        },
        {
          title: 'Verfication',
          icon: 'done_all',
          link: '/'
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
      ],
      leftDrawerOpen: false,
      showOfflineBanner: false
    }
  },
  mounted () {
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
    }
  }
})
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
