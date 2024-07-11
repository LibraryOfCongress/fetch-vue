<template>
  <div class="search-bar">
    <q-btn
      dense
      no-caps
      unelevated
      icon-right="arrow_drop_down"
      :label="searchType"
      class="search-bar-menu text-body2"
    >
      <q-menu>
        <q-list>
          <q-item
            v-for="obj in searchTypes"
            :key="obj.name"
            clickable
            v-close-popup
            @click="searchType = obj.name"
            role="menuitem"
          >
            <q-item-section>
              <q-item-label>
                <span>
                  {{ obj.name }}
                </span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-input
      class="search-bar-input"
      dense
      dark
      borderless
      v-model="searchText"
      :placeholder="mainProps.placeholder"
      aria-label="SearchBar"
    >
      <template #append>
        <q-icon
          v-if="searchText === ''"
          name="search"
          @click="$event.target.closest('div.q-field__control').querySelector('input').focus()"
        />
        <q-icon
          v-else
          name="clear"
          role="img"
          aria-label="clearSearch"
          class="cursor-pointer"
          @click="searchText = ''"
        />
      </template>
    </q-input>
    <q-btn
      v-if="currentScreenSize !== 'xs'"
      dense
      no-caps
      flat
      color="white"
      label="Advanced Search"
      class="search-bar-advanced btn-no-wrap text-body2"
      @click="null"
    />
    <q-btn
      v-else
      dense
      no-caps
      flat
      color="white"
      icon="tune"
      class="search-bar-advanced btn-no-wrap text-body2"
      @click="null"
      aria-label="advancedSearch"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'

const route = useRoute()

// Props
const mainProps = defineProps({
  placeholder: {
    type: String,
    default: ''
  }
})

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Local Data
const searchText = ref('')
const searchType = ref('Item')
const searchTypes = ref([
  {
    name: 'Item'
  },
  {
    name: 'Tray'
  },
  {
    name: 'Shelf'
  },
  {
    name: 'Accession'
  },
  {
    name: 'Verification'
  },
  {
    name: 'Shelving'
  },
  {
    name: 'Request'
  },
  {
    name: 'Picklist'
  },
  {
    name: 'Refile'
  },
  {
    name: 'Withdraw'
  }
])

// Logic
onMounted(() => {
  setSearchType()
})
watch(route, () => {
  setSearchType()
})

const setSearchType = () => {
  // set the search type based on matching route if search type for that route exists
  const routeMatchingSearchType = searchTypes.value.find(typ => route.name.includes(typ.name.toLowerCase()) )?.name
  if (routeMatchingSearchType) {
    searchType.value = routeMatchingSearchType
  }
}
</script>

<style lang="scss" scoped>
.search-bar {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  height: 40px;
  background-color: rgba(255,255,255, .2);
  border-radius: 3px;
  overflow: hidden;

  @media (max-width: $breakpoint-sm-min) {
    height: 32px;
  }

  &-menu {
    min-width: 110px;
    min-height: 100%;
    border-right: 2px solid $secondary;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    :deep(.q-btn__content) {
      flex-wrap: nowrap;
    }

    @media (max-width: $breakpoint-sm-min) {
      min-width: initial;
    }
  }

  &-input {
    width: 100%;
    padding: 0 10px;

    @media (max-width: $breakpoint-sm-min) {
      :deep(.q-field__control) {
        height: 100%;
      }

      :deep(.q-field__marginal) {
        height: 100%;
      }
    }
  }

  &-advanced {
    padding-left: 8px;
    padding-right: 8px;
    border-left: 2px solid $secondary;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
