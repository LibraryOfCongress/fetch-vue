import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useAccessionStore = defineStore('accession', {
  state: () => ({
    accessionJobList: [],
    accessionJob: {
      id: null,
      trayed: null,
      owner: null,
      owner_id: null,
      media_type: null,
      media_type_id: null,
      non_tray_items: [],
      trays: [],
      status: ''
    },
    accessionContainer: {
      id: null,
      title: '',
      owner: '',
      container_type: '',
      container_size: '',
      media_type: '',
      items: []
    },
    originalAccessionJob: null,
    originalAccessionContainer: null
  }),
  getters: {
    allItemsVerified: (state) => {
      if (state.accessionJob.trayed == false) {
        return state.accessionJob.non_tray_items.length == 0 || state.accessionJob.non_tray_items.some(item => item.verified == false) ? false : true
      } else {
        return state.accessionContainer.items.length == 0 || state.accessionContainer.items.some(item => item.verified == false) ? false : true
      }
    }
  },
  actions: {
    resetAccessionStore () {
      this.$reset()
    },
    resetAccessionContainer () {
      this.accessionContainer = {
        id: null,
        title: '',
        owner: '',
        container_type: '',
        container_size: '',
        media_type: '',
        items: []
      }
    },
    async getAccessionJobList () {
      try {
        const res = await this.$api.get(inventoryServiceApi.accessionJobs)
        this.accessionJobList = res.data.items
      } catch (error) {
        throw error
      }
    },
    async getAccessionJob (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.accessionJobs}${id}`)
        this.accessionJob = { ...res.data }
        this.originalAccessionJob = { ...res.data }
      } catch (error) {
        throw error
      }
    },
    async postAccessionJob (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.accessionJobs, payload)

        this.accessionJob = { ...res.data }
        this.originalAccessionJob = { ...res.data }
      } catch (error) {
        throw error
      }
    },
    async patchAccessionJob (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.accessionJobs}${payload.id}`, payload)
        this.accessionJob = { ...res.data }
        this.originalAccessionJob = { ...res.data }
      } catch (error) {
        throw error
      }
    },
    async getAccessionTray (barcode) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.trays}${barcode}`)
        this.accessionContainer = { ...res.data, items: res.data.items ?? [] }
        this.originalAccessionContainer = { ...res.data, items: res.data.items ?? [] }
      } catch (error) {
        throw error
      }
    },
    async postAccessionTray (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.trays, payload)

        this.accessionContainer = { ...res.data, items: res.data.items ?? [] }
        this.originalAccessionContainer = { ...res.data, items: res.data.items ?? [] }

        // add the new tray to accessionJob trays
        this.accessionJob.trays = [
          ...this.accessionJob.trays,
          res.data
        ]
        this.originalAccessionJob.trays = [
          ...this.originalAccessionJob.trays,
          res.data
        ]
      } catch (error) {
        throw error
      }
    },
    async patchAccessionTray (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.trays}${payload.id}`, payload)
        this.accessionContainer = { ...res.data, items: res.data.items ?? [] }
        this.originalAccessionContainer = { ...res.data, items: res.data.items ?? [] }
      } catch (error) {
        throw error
      }
    },
    async postAccessionTrayItem (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.items, payload)

        this.accessionContainer.items = [
          ...this.accessionContainer.items,
          { ...res.data, verified: true }
        ]
        this.originalAccessionContainer = { ... this.accessionContainer }
      } catch (error) {
        throw error
      }
    },
    async deleteAccessionTrayItem (barcodeList) {
      try {
        await Promise.all(barcodeList.map(barcode => {
          return this.$api.delete(`${inventoryServiceApi.items}${barcode}`)
        }))

        // filter the deleted tray items from the accessionContainer
        const filteredItems = this.accessionContainer.items.filter(b => !barcodeList.includes(b.id))
        this.accessionContainer = {
          ...this.accessionContainer,
          items: filteredItems
        }
        this.originalAccessionContainer = { ...this.accessionContainer }
      } catch (error) {
        throw error
      }
    },
    async verifyTrayItemBarcode (barcode) {
      try {
        // TODO: setup api call to verify the scanned tray item barcode
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12, barcode
        // )
        // this.accessionContainer = res.data
        this.accessionContainer.items[this.accessionContainer.items.findIndex(item => item.id == barcode)].verified = true
      } catch (error) {
        throw error
      }
    },
    async getAccessionNonTrayItem (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.nonTrayItems}${id}`)

        this.accessionContainer = { ...res.data  }
        this.originalAccessionContainer = { ...res.data }
      } catch (error) {
        throw error
      }
    },
    async postAccessionNonTrayItem (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.nonTrayItems, payload)

        // set the item as the container since there is no tray container for non tray jobs
        this.accessionContainer = { ...res.data, verified: true }
        this.originalAccessionContainer = { ...this.accessionContainer }

        // add the new non tray item to accessionJob non tray items
        this.accessionJob.non_tray_items = [
          ...this.accessionJob.non_tray_items,
          res.data
        ]
        this.originalAccessionJob.non_tray_items = [
          ...this.originalAccessionJob.non_tray_items,
          res.data
        ]
      } catch (error) {
        throw error
      }
    },
    async patchAccessionNonTrayItem (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.nonTrayItems}${payload.id}`, payload)

        this.accessionContainer = { ...res.data  }
        this.originalAccessionContainer = { ...res.data }
      } catch (error) {
        throw error
      }
    },
    async deleteAccessionNonTrayItem (barcodeList) {
      try {
        await Promise.all(barcodeList.map(barcode => {
          return this.$api.delete(`${inventoryServiceApi.nonTrayItems}${barcode}`)
        }))

        // filter the deleted non tray items from the accessionJob
        this.accessionJob = {
          ...this.accessionJob,
          non_tray_items: this.accessionJob.non_tray_items.filter(b => !barcodeList.includes(b.id) )
        }
        this.originalAccessionJob = { ...this.accessionJob }
      } catch (error) {
        throw error
      }
    },
    async verifyNonTrayItemBarcode (barcode) {
      try {
        // TODO: setup api call to verify the scanned nontray item barcode
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12, barcode
        this.accessionJob.non_tray_items[this.accessionJob.non_tray_items.findIndex(item => item.id == barcode)].verified = true
        this.originalAccessionJob = { ...this.accessionJob }
      } catch (error) {
        throw error
      }
    }
  }
})
