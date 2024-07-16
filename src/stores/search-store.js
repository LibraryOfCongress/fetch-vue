import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js'

export const useSearchStore = defineStore('search-store', {
  state: () => ({
    searchResults: []
  }),
  actions: {
    resetSearchStore () {
      this.$reset()
    },
    async getSearchResults (paramsObj, searchType) {
      try {
        // TODO need to figure out how exact search will be sent to api
        // TODO need to figure out how advance search will be sent to api
        // const res = await this.$api.get(inventoryServiceApi.search, { params: paramsObj })
        // this.searchResults = res.data
        this.searchResults = []
        console.log('getting search results', paramsObj, searchType)
      } catch (error) {
        throw error
      }
    }
  }
})
