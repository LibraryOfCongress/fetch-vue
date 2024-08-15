import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useSearchStore = defineStore('search-store', {
  state: () => ({
    searchResults: []
  }),
  actions: {
    resetSearchStore () {
      this.$reset()
    },
    async getExactSearchResult (searchInput, searchType) {
      try {
        if (searchType == 'Item' || searchType == 'Tray') {
          // exact searches for item/tray types will load the item-managment ui by the item/trays barcode value
          this.searchResults = ['No results found...']
          console.log('getting search results for item/tray barcode', searchInput, searchType)
        } else if (searchType == 'Shelf') {
          // exact search for shelf type will load the shelf detail page (need to figure out what that is, is it the admin shelf view?)
          this.searchResults = ['No results found...']
          console.log('getting search results for shelf by barcode', searchInput, searchType)
        } else {
          // exact searches for job types will load the direct job by job number
          let jobEndpoint = `${searchType.toLowerCase()}Jobs`
          if (searchType == 'Accession') {
            jobEndpoint = 'accessionJobsWorkflow'
          } else if (searchType == 'Verification') {
            jobEndpoint = 'verificationJobsWorkflow'
          } else if (searchType == 'Request') {
            jobEndpoint = 'requests'
          } else if (searchType == 'Picklist') {
            jobEndpoint = 'picklists'
          }

          const res = await this.$api.get(`${inventoryServiceApi[jobEndpoint]}${searchInput}`)
          this.searchResults = [`${searchType} Job #: ${searchType == 'Accession' || searchType == 'Verification' ? res.data.workflow_id : res.data.id} ${res.data.status ? `- ${res.data.status}` : ''}`]
          return res
        }
      } catch (error) {
        if (error.response.status == '404') {
          this.searchResults = ['No results found...']
        } else {
          throw error
        }
      }
    },
    async getAdvancedSearchResults (paramsObj, searchType) {
      try {
        // TODO need to figure out how exact search will be sent to api
        // TODO need to figure out how advance search will be sent to api
        if (searchType == 'Tray') {
          const res = await this.$api.get(inventoryServiceApi.trays, { params: paramsObj })
          this.searchResults = res.data.items
        } else {
          this.searchResults = []
        }
      } catch (error) {
        throw error
      }
    }
  }
})
