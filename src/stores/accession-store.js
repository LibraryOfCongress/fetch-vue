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
    accessionTray: {
      id: null,
      title: '',
      owner: '',
      container_type: '',
      container_size: '',
      media_type: '',
      items: []
    },
    originalAccessionTray: null
  }),
  getters: {
    allTrayItemsVerified: (state) => state.accessionTray.items.some(item => item.verified == false) ? false : true
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
        // this.accessionTray = res.data
        this.accessionTray = {
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
        this.originalAccessionTray = { ...this.accessionTray }
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
        // this.accessionTray = res.data
        this.accessionTray = {
          ...this.accessionTray
        }
        this.originalAccessionTray = { ...this.accessionTray }
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
