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
        if (searchType == 'Item') {
          // exact searches for item/tray items types will load the item-managment ui for the item barcode value
          const [
            resTrayItem,
            resNonTrayItem
          ] = await Promise.all([
            this.$api.get(`${inventoryServiceApi.itemsBarcode}${searchInput}`).catch((error) => error.response.status == '404' ? '404' : error),
            this.$api.get(`${inventoryServiceApi.nonTrayItemsBarcode}${searchInput}`).catch((error) => error.response.status == '404' ? '404' : error)
          ])

          if (resTrayItem !== '404') {
            this.searchResults = [`Tray-Item: ${searchInput} - ${resTrayItem.data.status}`]
            return resTrayItem
          } else if (resNonTrayItem !== '404') {
            this.searchResults = [`Non-Tray: ${searchInput} - ${resNonTrayItem.data.status}`]
            return resNonTrayItem
          } else {
            this.searchResults = ['No results found...']
          }
        } else if (searchType == 'Tray') {
          // exact search for shelf type will load the item-managment ui for the tray barcode value
          const res = await this.$api.get(`${inventoryServiceApi.traysBarcode}${searchInput}`)
          this.searchResults = [`Tray: ${searchInput}`]
          return res
        } else if (searchType == 'Shelf') {
          // exact search for shelf type will load the item-managment ui for the shelf barcode value
          const res = await this.$api.get(`${inventoryServiceApi.shelvesBarcode}${searchInput}`)
          this.searchResults = [`Shelf: ${searchInput}`]
          return res
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
        if (searchType == 'Item') {
          const res = await this.$api.get(inventoryServiceApi.items, { params: { size: this.apiPageSizeDefault, ...paramsObj } })
          this.searchResults = res.data.items
        } else if (searchType == 'Tray') {
          const res = await this.$api.get(inventoryServiceApi.trays, { params: { size: this.apiPageSizeDefault, ...paramsObj } })
          this.searchResults = res.data.items
        } else if (searchType == 'Shelf') {
          const res = await this.$api.get(inventoryServiceApi.shelves, { params: { size: this.apiPageSizeDefault, ...paramsObj } })
          this.searchResults = res.data.items
        } else {
          // job related advanced searches
          let jobEndpoint = `${searchType.toLowerCase()}Jobs`
          if (searchType == 'Request') {
            jobEndpoint = 'requests'
          } else if (searchType == 'Picklist') {
            jobEndpoint = 'picklists'
          }

          const res = await this.$api.get(inventoryServiceApi[jobEndpoint], { params: { size: this.apiPageSizeDefault, ...paramsObj } })
          this.searchResults = res.data.items
        }
      } catch (error) {
        throw error
      }
    }
  }
})
