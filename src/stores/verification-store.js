import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useVerificationStore = defineStore('verification', {
  state: () => ({
    verificationJobList: [],
    verificationJob: {
      id: null,
      trayed: null,
      owner: null,
      owner_id: null,
      media_type: null,
      media_type_id: null,
      non_tray_items: [],
      size_class: null,
      size_class_id: null,
      trays: [],
      status: ''
    },
    originalVerificationJob: null,
    verificationContainer: {
      id: null,
      owner: '',
      owner_id: null,
      container_type: '',
      size_class: '',
      size_class_id: null,
      media_type: '',
      media_type_id: null,
      items: []
    },
    originalVerificationContainer: null
  }),
  getters: {
    allItemsVerified: (state) => {
      if (state.verificationJob.trayed == false) {
        return state.verificationJob.non_tray_items.length == 0 || state.verificationJob.non_tray_items.some(item => item.verified == false) ? false : true
      } else {
        return state.verificationContainer.items.length == 0 || state.verificationContainer.items.some(item => item.verified == false) ? false : true
      }
    },
    allTraysCompleted: (state) => {
      if (state.verificationJob.trayed && state.verificationJob.trays.length > 0) {
        return state.verificationJob.trays.some(t => t.scanned_for_verification == false || t.collection_verified == false) ? false : true
      } else {
        return true
      }
    }
  },
  actions: {
    resetVerificationStore () {
      this.$reset()
    },
    resetVerificationContainer () {
      this.verificationContainer = {
        id: null,
        owner: '',
        owner_id: null,
        container_type: '',
        size_class: '',
        size_class_id: null,
        media_type: '',
        media_type_id: null,
        items: []
      }
    },
    async getVerificationJobList () {
      try {
        const res = await this.$api.get(inventoryServiceApi.verificationJobs)
        this.verificationJobList = res.data.items
        // const res = {
        //   data: [
        //     {
        //       id: 1234567891,
        //       type: 1,
        //       owner: 'John Doe',
        //       container_size: 'B Low',
        //       media_type: 'Vinyl Recording',
        //       status: 'Paused'
        //     },
        //     {
        //       id: 1234567892,
        //       type: 2,
        //       owner: 'John Doe',
        //       container_size: 'A High',
        //       media_type: 'Vinyl Recording',
        //       status: 'Running'
        //     },
        //     {
        //       id: 1234567893,
        //       type: 1,
        //       owner: 'John Doe',
        //       container_size: 'B High',
        //       media_type: 'Vinyl Recording',
        //       status: 'In Queue'
        //     },
        //     {
        //       id: 1234567894,
        //       type: 2,
        //       owner: 'John Doe',
        //       container_size: 'A Low',
        //       media_type: 'Vinyl Recording',
        //       status: 'In Queue'
        //     }
        //   ]
        // }
        return res
      } catch (error) {
        return error
      }
    },
    async getVerificationJob (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.verificationJobs}${id}`)
        this.verificationJob = res.data
        this.originalVerificationJob = { ...this.verificationJob }
      } catch (error) {
        return error
      }
    },
    async patchVerificationJob (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.verificationJobs}${payload.id}`, payload)
        this.verificationJob = res.data
        this.originalVerificationJob = { ...this.verificationJob }
      } catch (error) {
        return error
      }
    },
    async getVerificationTray (barcode) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.traysBarcode}${barcode}`)
        this.verificationContainer = res.data
        this.originalVerificationContainer = { ...this.verificationContainer }
      } catch (error) {
        return error
      }
    },
    async postVerificationTray (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.trays, payload)

        this.verificationContainer = { ...res.data, items: res.data.items ?? [] }
        this.originalVerificationContainer = { ...this.verificationContainer }

        // add the new tray to verificationJob trays
        this.verificationJob.trays = [
          ...this.verificationJob.trays,
          res.data
        ]
        this.originalVerificationJob.trays = [...this.verificationJob.trays]
      } catch (error) {
        throw error
      }
    },
    async patchVerificationTray (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.trays}${payload.id}`, payload)
        this.verificationContainer = { ...res.data, items: res.data.items ?? [] }
        this.originalVerificationContainer = { ...this.verificationContainer }
      } catch (error) {
        return error
      }
    },
    async postVerificationTrayItem (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.items, payload)

        this.verificationContainer.items = [
          ...this.verificationContainer.items,
          res.data
        ]
        this.originalVerificationContainer = { ... this.verificationContainer }
      } catch (error) {
        throw error
      }
    },
    async patchVerificationTrayItem (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.items}${payload.id}`, payload)

        // remove the old item and replace it with the updated item in verificationContainer items
        const filteredItems = this.verificationContainer.items.filter(item => item.id !== payload.id)
        this.verificationContainer.items = [
          ...filteredItems,
          res.data
        ]
        this.originalVerificationContainer = { ...this.verificationContainer }
      } catch (error) {
        throw error
      }
    },
    async deleteVerificationTrayItem (barcodeList) {
      try {
        await Promise.all(barcodeList.map(barcode => {
          return this.$api.delete(`${inventoryServiceApi.items}${barcode}`)
        }))

        // filter the deleted tray items from the verificationContainer
        const filteredItems = this.verificationContainer.items.filter(b => !barcodeList.includes(b.id))
        this.verificationContainer = {
          ...this.verificationContainer,
          items: filteredItems
        }
        this.originalVerificationContainer = { ...this.verificationContainer }
      } catch (error) {
        return error
      }
    },
    async getVerificationNonTrayItem (barcode) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.nonTrayItemsBarcode}${barcode}`)
        this.verificationContainer = res.data
        this.originalVerificationContainer = { ...this.verificationContainer }
      } catch (error) {
        return error
      }
    },
    async postVerificationNonTrayItem (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.nonTrayItems, payload)

        // set the item as the container since there is no tray container for non tray jobs
        this.verificationContainer = res.data
        this.originalVerificationContainer = { ...this.verificationContainer }

        // add the new non tray item to verificationJob non tray items
        this.verificationJob.non_tray_items = [
          ...this.verificationJob.non_tray_items,
          res.data
        ]
        this.originalverificationJob = { ...this.verificationJob }
      } catch (error) {
        throw error
      }
    },
    async patchVerificationNonTrayItem (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.nonTrayItems}${payload.id}`, payload)
        this.verificationContainer = res.data
        this.originalVerificationContainer = { ...this.verificationContainer }

        // update the non tray item in verificationJob non tray items
        this.verificationJob.non_tray_items[this.verificationJob.non_tray_items.findIndex(item => item.id == payload.id)] = res.data
        this.originalVerificationJob = { ...this.verificationJob }
      } catch (error) {
        return error
      }
    },
    async deleteVerificationNonTrayItem (barcodeList) {
      try {
        await Promise.all(barcodeList.map(barcode => {
          return this.$api.delete(`${inventoryServiceApi.nonTrayItems}${barcode}`)
        }))

        // filter the deleted non tray items from the verificationJob
        this.verificationJob = {
          ...this.verificationJob,
          non_tray_items: this.verificationJob.non_tray_items.filter(b => !barcodeList.includes(b.id) )
        }
        this.originalVerificationJob = { ...this.verificationJob }
      } catch (error) {
        return error
      }
    },
    async verifyTrayItem (id) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.items}${id}`, { verified: true })

        // remove the old item and replace it with the updated item in verificationContainer items
        const filteredItems = this.verificationContainer.items.filter(item => item.id !== id)
        this.verificationContainer.items = [
          ...filteredItems,
          res.data
        ]
        this.originalVerificationContainer = { ...this.verificationContainer }
      } catch (error) {
        return error
      }
    },
    async verifyNonTrayItem (id) {
      try {
        await this.$api.patch(`${inventoryServiceApi.nonTrayItems}${id}`, { verified: true })

        // update the non tray items verified state in the verificationJob data as well
        this.verificationJob.non_tray_items[this.verificationJob.non_tray_items.findIndex(item => item.id == id)].verified = true
      } catch (error) {
        return error
      }
    }
  }
})
