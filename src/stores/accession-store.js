import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js';

export const useAccessionStore = defineStore('accession', {
  state: () => ({
    accessionJob: {
      id: null,
      type: null,
      owner: null,
      container_size: null,
      media_type: null
    },
    accessionTray: {
      id: null,
      title: '',
      owner: '',
      container_type: '',
      container_size: '',
      media_type: '',
      items: []
    }
  }),
  actions: {
    resetAccessionStore () {
      this.accessionJob = {
        id: null,
        type: null,
        owner: null,
        container_size: null,
        media_type: null
      }
      this.accessionTray = {
        id: null,
        title: '',
        owner: '',
        container_type: '',
        container_size: '',
        media_type: '',
        items: []
      }
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
          id: 1
        }
      } catch (error) {
        return error
      }
    },
    async getAccessionJob () {
      try {
        // TODO: setup api call to retrieve an accession job
        // const res = await this.$api.get(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.accessionJob = res.data
        this.accessionJob = {
          ...this.accessionJob,
          type: 2,
          id: 1
        }
      } catch (error) {
        return error
      }
    },
    async verifyTrayBarcode (barcode) {
      try {
        // TODO: setup api call to check the scanned barcode and get its tray data
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12, barcode
        // )
        // this.accessionTray = res.data
        console.log('validating tray', barcode)
        this.accessionTray = {
          id: 'CH220987',
          title: 'Tray Title',
          owner: 'Colonel Sanders',
          container_type: 'Trayed',
          container_size: 'C High',
          media_type: 'Vinyl Recording',
          items: [
            {
              id: '00924891289',
              verified: false
            },
            {
              id: '00924891290',
              verified: false
            }
          ]
        }
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
        // this.accessionTray = res.data
        this.accessionTray.items[this.accessionTray.items.findIndex(item => item.barcode == barcode)].verified = true
      } catch (error) {
        return error
      }
    }
  }
})
