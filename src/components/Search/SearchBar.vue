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

    <div class="row full-width">
      <q-input
        class="search-bar-input"
        dense
        dark
        borderless
        v-model="searchText"
        :placeholder="renderSearchPlaceholder"
        @keyup.enter="executeExactSearch()"
        aria-label="SearchBar"
        type="search"
      >
        <template #append>
          <q-spinner
            v-if="appActionIsLoadingData"
            color="white"
            size="24px"
          />
          <q-icon
            v-else-if="currentScreenSize == 'xs' && !appActionIsLoadingData && searchText === ''"
            name="search"
            @click="$event.target.closest('div.q-field__control').querySelector('input').focus()"
          />
          <q-icon
            v-else-if="!appActionIsLoadingData && searchText !== ''"
            name="clear"
            role="img"
            aria-label="clearSearch"
            class="cursor-pointer"
            @click="searchText = ''"
          />
        </template>
      </q-input>

      <!-- exact search results menu -->
      <div class="col-12">
        <q-menu
          fit
          v-model="showExactSearch"
          :class="$style['search-input-menu']"
        >
          <q-list
            class="search-results-list"
          >
            <q-item
              clickable
              v-close-popup
              @click="exactSearchResponseInfo !== null ? handlingSearchResultRouting() : null"
              role="menuitem"
            >
              <q-item-section>
                {{ searchResults[0] }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </div>

    <template v-if="currentScreenSize !== 'xs'">
      <q-btn
        dense
        no-caps
        flat
        color="white"
        icon="search"
        class="btn-no-wrap text-body2"
        @click="executeExactSearch()"
        aria-label="exactSearchButton"
      />
      <q-btn
        dense
        no-caps
        flat
        color="white"
        label="Advanced Search"
        class="search-bar-advanced btn-no-wrap text-body2"
        @click="showAdvancedSearchModal = true"
        aria-label="advancedSearchButton"
      />
    </template>
    <q-btn
      v-else
      dense
      no-caps
      flat
      color="white"
      icon="tune"
      class="search-bar-advanced btn-no-wrap text-body2"
      @click="showAdvancedSearchModal = true"
      aria-label="advancedSearchButton"
    />
  </div>

  <!-- Generate Advance Search Modal -->
  <SearchAdvancedModal
    v-if="showAdvancedSearchModal"
    :search-type="searchType"
    :search-bar-input="searchText"
    @hide="showAdvancedSearchModal = false"
  />
</template>

<script setup>
import { onMounted, ref, watch, inject, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useGlobalStore } from '@/stores/global-store'
import { useSearchStore } from '@/stores/search-store'
import { useAccessionStore } from '@/stores/accession-store'
import { useVerificationStore } from '@/stores/verification-store'
import { useShelvingStore } from '@/stores/shelving-store'
import { useRequestStore } from '@/stores/request-store'
import { usePicklistStore } from '@/stores/picklist-store'
import { useRefileStore } from '@/stores/refile-store'
import { useWithdrawalStore } from '@/stores/withdrawal-store'
import { storeToRefs } from 'pinia'
import SearchAdvancedModal from '@/components/Search/SearchAdvancedModal.vue'

const route = useRoute()
const router = useRouter()

// Composables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const { getExactSearchResult } = useSearchStore()
const { searchResults } = storeToRefs(useSearchStore())
const { accessionJob } = storeToRefs(useAccessionStore())
const { verificationJob } = storeToRefs(useVerificationStore())
const { shelvingJob } = storeToRefs(useShelvingStore())
const { requestJob } = storeToRefs(useRequestStore())
const { picklistJob } = storeToRefs(usePicklistStore())
const { refileJob } = storeToRefs(useRefileStore())
const { withdrawJob } = storeToRefs(useWithdrawalStore())

// Local Data
const renderSearchPlaceholder = computed(() => {
  let placeholderText = 'Search'
  if (searchType.value == 'Item' || searchType.value == 'Tray' || searchType.value == 'Shelf') {
    placeholderText = `Search ${searchType.value} Barcode`
  } else {
    placeholderText = 'Search Job Number'
  }
  return placeholderText
})
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
const showExactSearch = ref(false)
const showAdvancedSearchModal = ref(false)
const exactSearchResponseInfo = ref(null)

// Logic
const handleAlert = inject('handle-alert')

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

const executeExactSearch = async () => {
  try {
    appActionIsLoadingData.value = true
    const res = await getExactSearchResult(searchText.value, searchType.value)
    if (res) {
      exactSearchResponseInfo.value = res.data
    }
    showExactSearch.value = true
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appActionIsLoadingData.value = false
  }
}
const handlingSearchResultRouting = () => {
  // loads the exact search result route depending on search type
  switch (searchType.value) {
  case 'Item':
    break
  case 'Tray':
    break
  case 'Shelf':
    break
  default:
    router.push({
      name: searchType.value.toLowerCase(),
      params: {
        jobId: searchText.value
      }
    })
    break
  }
  // set the result info in the matching job store
  switch (searchType.value) {
  case 'Item':
    break
  case 'Tray':
    break
  case 'Shelf':
    break
  case 'Accession':
    accessionJob.value = exactSearchResponseInfo.value
    router.push({
      name: searchType.value.toLowerCase(),
      params: {
        jobId: searchText.value
      }
    })
    break
  case 'Verification':
    verificationJob.value = exactSearchResponseInfo.value
    router.push({
      name: searchType.value.toLowerCase(),
      params: {
        jobId: searchText.value
      }
    })
    break
  case 'Shelving':
    shelvingJob.value = exactSearchResponseInfo.value
    router.push({
      name: searchType.value.toLowerCase(),
      params: {
        jobId: searchText.value
      }
    })
    break
  case 'Request':
    requestJob.value = exactSearchResponseInfo.value
    router.push({
      name: searchType.value.toLowerCase(),
      params: {
        jobId: searchText.value
      }
    })
    break
  case 'Picklist':
    picklistJob.value = exactSearchResponseInfo.value
    router.push({
      name: searchType.value.toLowerCase(),
      params: {
        jobId: searchText.value
      }
    })
    break
  case 'Refile':
    refileJob.value = exactSearchResponseInfo.value
    router.push({
      name: searchType.value.toLowerCase(),
      params: {
        jobId: searchText.value
      }
    })
    break
  case 'Withdraw':
    withdrawJob.value = exactSearchResponseInfo.value
    router.push({
      name: searchType.value.toLowerCase(),
      params: {
        jobId: searchText.value
      }
    })
    break
  default:
    break
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
    height: 100%;
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

<style lang="scss" module>
.search-input-menu {
  // forces max width to not expand past the parent width
  max-width: 10px !important;
  @media (max-width: $breakpoint-sm) {
    width: 100%;
    max-width: 100% !important;
    top: 50px !important;
    left: 0 !important;
  }
}
</style>
