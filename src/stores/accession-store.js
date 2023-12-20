import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js';

export const useAccessionStore = defineStore('accession', {
  state: () => ({
    accessionJob: {
      id: null,
      type: null,
      owner: null,
      container_size: null,
      media_type: null,
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
    originalAccessionContainer: null
  }),
  getters: {
    allItemsVerified: (state) => state.accessionContainer.items.some(item => item.verified == false) ? false : true
  },
  actions: {
    resetAccessionStore () {
      this.$reset()
    },
    async postAccessionJob () {
      try {
        // TODO: setup api call to submit an accession job
        // const res = await this.$api.post(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.accessionJob = res.data
        this.accessionJob = {
          ...this.accessionJob,
          status: 'Created',
          id: 1
        }
      } catch (error) {
        return error
      }
    },
    async patchAccessionJob () {
      try {
        // TODO: setup api call to update an accession job
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.accessionJob = res.data
        this.accessionJob = {
          ...this.accessionJob
        }
      } catch (error) {
        return error
      }
    },
    async getAccessionJob (id) {
      try {
        // TODO: setup api call to retrieve an accession job
        // const res = await this.$api.get(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.accessionJob = res.data
        this.accessionJob = {
          ...this.accessionJob,
          status: 'Running', // status from api will match whatever the status is from the job
          type: 2,
          id
        }
      } catch (error) {
        return error
      }
    },
    async getAccessionTray (barcode) {
      try {
        // TODO: setup api call to check the scanned barcode and get its tray data
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12, barcode
        // )
        // this.accessionContainer = res.data
        this.accessionContainer = {
          id: barcode,
          title: 'Tray Title',
          owner: 'Colonel Sanders',
          container_type: 'Trayed',
          container_size: 'C High',
          media_type: 'Vinyl Recording',
          items: [
            {
              id: '00924891289',
              verified: true
            },
            {
              id: '00924891290',
              verified: true
            }
          ]
        }
        this.originalAccessionContainer = { ...this.accessionContainer }
      } catch (error) {
        return error
      }
    },
    async patchAccessionTray () {
      try {
        // TODO: setup api call to update an accession tray
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.accessionContainer = res.data
        this.accessionContainer = {
          ...this.accessionContainer
        }
        this.originalAccessionContainer = { ...this.accessionContainer }
      } catch (error) {
        return error
      }
    },
    async verifyTrayItemBarcode (barcode) {
      try {
        // TODO: setup api call to verify the scanned tray item barcode
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12, barcode
        // )
        // this.accessionContainer = res.data
        this.accessionContainer.items[this.accessionContainer.items.findIndex(item => item.barcode == barcode)].verified = true
      } catch (error) {
        return error
      }
    },
    async getAccessionNonTray (barcode) {
      try {
        // TODO: setup api call to check the scanned barcode and get its nontray data
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12, barcode
        // )
        // this.accessionContainer = res.data
        this.accessionContainer = {
          id: barcode,
          title: 'Non Tray Title',
          owner: 'Colonel Sanders',
          container_type: 'Non-Trayed',
          container_size: 'B Low',
          media_type: 'Vinyl Recording',
          items: [
            {
              id: '00924891289',
              verified: true
            },
            {
              id: '00924891290',
              verified: true
            }
          ]
        }
        this.originalAccessionContainer = { ...this.accessionContainer }
      } catch (error) {
        return error
      }
    },
    async patchAccessionNonTray () {
      try {
        // TODO: setup api call to update an accession nontray
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.accessionContainer = res.data
        this.accessionContainer = {
          ...this.accessionContainer
        }
        this.originalAccessionContainer = { ...this.accessionContainer }
      } catch (error) {
        return error
      }
    },
    async verifyNonTrayItemBarcode (barcode) {
      try {
        // TODO: setup api call to verify the scanned nontray item barcode
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12, barcode
        // )
        // this.accessionContainer = res.data
        this.accessionContainer.items[this.accessionContainer.items.findIndex(item => item.barcode == barcode)].verified = true
      } catch (error) {
        return error
      }
    }
  }
})
