import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js';

export const useAccessionStore = defineStore('accession', {
  state: () => ({
    accessionJob: {
      id: null,
      type: null,
      owner: null,
      media_type: null,
      items: [],
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
      if (state.accessionJob.type == 1) {
        return state.accessionJob.items.length == 0 || state.accessionJob.items.some(item => item.verified == false) ? false : true
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
    async postAccessionJob () {
      try {
        // TODO: setup api call to submit an accession job
        // const res = await this.$api.post(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.accessionJob = res.data
        // TODO: Remove this type difference once api is setup
        if (this.accessionJob.type == 1) {
          this.accessionJob = {
            ...this.accessionJob,
            status: 'Created',
            id: 1
          }
        } else {
          this.accessionJob = {
            ...this.accessionJob,
            status: 'Created',
            trays: [
              {
                id: 'CH220987',
                collection_verified: false,
                scanned_for_verification: false
              }
            ],
            id: 2
          }
        }
        this.originalAccessionJob = { ...this.accessionJob }
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
        this.originalAccessionJob = { ...this.accessionJob }
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
        // TODO: Remove this once api is setup
        if (id == 1) {
          this.accessionJob = {
            ...this.accessionJob,
            owner: 'John Doe',
            media_type: 'Document',
            status: 'Running', // status from api will match whatever the status is from the job
            type: 1,
            items: [
              {
                id: '00924891289',
                verified: true
              },
              {
                id: '00924891290',
                verified: false
              }
            ],
            id
          }
        } else {
          this.accessionJob = {
            ...this.accessionJob,
            owner: 'John Doe',
            media_type: 'Document',
            trays: [
              {
                id: 'CH220987',
                collection_verified: false,
                scanned_for_verification: false
              }
            ],
            status: 'Running', // status from api will match whatever the status is from the job
            type: 2,
            id
          }
        }
        this.originalAccessionJob = { ...this.accessionJob }
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
        if (barcode == 'CH220987') {
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
        } else {
          this.accessionContainer = {
            id: barcode,
            title: 'Tray Title',
            owner: 'Colonel Sanders',
            container_type: 'Trayed',
            container_size: 'C High',
            media_type: 'Vinyl Recording',
            items: []
          }
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
    async deleteAccessionTrayItem (barcodeList) {
      try {
        // TODO: setup api call to delete item in an accession tray
        // const res = await this.$api.delete(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.accessionContainer = res.data
        const filteredItems = this.accessionContainer.items.filter(b => !barcodeList.includes(b.id))
        this.accessionContainer = {
          ...this.accessionContainer,
          items: filteredItems
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
        this.accessionContainer.items[this.accessionContainer.items.findIndex(item => item.id == barcode)].verified = true
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
          owner: 'Colonel Sanders',
          container_type: 'Non-Trayed',
          container_size: '',
          media_type: this.accessionJob.media_type
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
    async deleteAccessionNonTrayItem (barcodeList) {
      try {
        // TODO: setup api call to delete item in an accession nontray
        // const res = await this.$api.delete(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.accessionContainer = res.data
        this.accessionJob = {
          ...this.accessionJob,
          items: this.accessionJob.items.filter(b => !barcodeList.includes(b.id) )
        }
        this.originalAccessionJob = { ...this.accessionJob }
      } catch (error) {
        return error
      }
    },
    async verifyNonTrayItemBarcode (barcode) {
      try {
        // TODO: setup api call to verify the scanned nontray item barcode
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12, barcode
        this.accessionJob.items[this.accessionJob.items.findIndex(item => item.id == barcode)].verified = true
        this.originalAccessionJob = { ...this.accessionJob }
      } catch (error) {
        return error
      }
    }
  }
})
