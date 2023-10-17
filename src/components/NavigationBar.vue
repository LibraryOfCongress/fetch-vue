<template>
  <div class="nav">
    <!-- main nav -->
    <q-header elevated>
      <q-toolbar class="bg-primary justify-between">
        <q-btn
          color="secondary"
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
            color="accent"
            class="text-primary"
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
            @click="showOfflineBanner = !showOfflineBanner"
          />
        </template>
      </q-banner>
    </q-header>

    <!-- side nav -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-color-gray-light"
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
              color="accent"
              size="120px"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-primary text-bold">
              FETCH LOGO
            </q-item-label>
          </q-item-section>
        </q-item>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          class="justify-center"
        />
      </q-list>
    </q-drawer>

    <!-- bottom nav (mobile only) -->
    <q-footer
      v-if="currentScreenSize <= 600"
      elevated
      class="bg-grey-8 text-white"
    >
      <q-toolbar class="bg-primary justify-between">
        <q-item
          v-for="(link, i) in mobileNavLinks"
          :key="i"
          clickable
          tag="a"
          :to="link.link"
          class="column items-center text-secondary"
        >
          <q-item-section>
            <q-icon
              :name="link.icon"
              size="20px"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
          </q-item-section>
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
  setup() {
    const { currentScreenSize } = useCurrentScreenSize()
    return {
      currentScreenSize
    }
  },
  data() {
    return {
      essentialLinks: [
        {
          title: 'Placeholder Link 1',
          icon: 'link',
          link: '/'
        },
        {
          title: 'Placeholder Link 2',
          icon: 'link',
          link: '/'
        },
        {
          title: 'Placeholder Link 3',
          icon: 'link',
          link: '/'
        },
        {
          title: 'Placeholder Link 4',
          icon: 'link',
          link: '/'
        },
        {
          title: 'Placeholder Link 5',
          icon: 'link',
          link: '/'
        },
        {
          title: 'Placeholder Link 6',
          icon: 'link',
          link: '/'
        },
        {
          title: 'Placeholder Link 7',
          icon: 'link',
          link: '/'
        },
      ],
      mobileNavLinks: [
        {
          title: 'Link 1',
          icon: 'link',
          link: '/'
        },
        {
          title: 'Link 2',
          icon: 'link',
          link: '/'
        },
        {
          title: 'Link 3',
          icon: 'link',
          link: '/'
        },
        {
          title: 'Link 4',
          icon: 'link',
          link: '/'
        }
      ],
      leftDrawerOpen: false,
      showOfflineBanner: false
    }
  },
  mounted() {
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
}
</style>
