import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js';

export const useVerificationStore = defineStore('verification', {
  state: () => ({
    verificationJob: {
      id: null,
      type: null,
      owner: null,
      container_size: null,
      media_type: null,
      status: ''
    },
    originalVerificationJob: null,
    verificationContainer: {
      id: null,
      title: '',
      owner: '',
      container_type: '',
      container_size: '',
      media_type: '',
      items: []
    },
    originalVerificationContainer: null
  }),
  getters: {
    allItemsVerified: (state) => {
      if (state.verificationJob.type == 1) {
        return state.verificationJob.items.length == 0 || state.verificationJob.items.some(item => item.verified == false) ? false : true
      } else {
        return state.verificationContainer.items.length == 0 || state.verificationContainer.items.some(item => item.verified == false) ? false : true
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
        title: '',
        owner: '',
        container_type: '',
        container_size: '',
        media_type: '',
        items: []
      }
    },
    async getVerificationJobList () {
      try {
        // TODO: setup api call to retrieve all the verification jobs
        // const res = await this.$api.get(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        const res = {
          data: [
            {
              id: 1234567891,
              type: 1,
              owner: 'John Doe',
              container_size: 'B Low',
              media_type: 'Vinyl Recording',
              status: 'Paused'
            },
            {
              id: 1234567892,
              type: 2,
              owner: 'John Doe',
              container_size: 'A High',
              media_type: 'Vinyl Recording',
              status: 'Running'
            },
            {
              id: 1234567893,
              type: 1,
              owner: 'John Doe',
              container_size: 'B High',
              media_type: 'Vinyl Recording',
              status: 'In Queue'
            },
            {
              id: 1234567894,
              type: 2,
              owner: 'John Doe',
              container_size: 'A Low',
              media_type: 'Vinyl Recording',
              status: 'In Queue'
            }
          ]
        }
        return res
      } catch (error) {
        return error
      }
    },
    async getVerificationJob (id) {
      try {
        // TODO: setup api call to retrieve an verification job
        // const res = await this.$api.get(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.verificationJob = res.data
        if (id == 1234567892 || id == 1234567894) {
          this.verificationJob = {
            ...this.verificationJob,
            status: 'Running',
            type: 2,
            id,
            trays: [
              {
                id: 'CH220989',
                status: 'Not Started'
              },
              {
                id: 'CH220990',
                status: 'Not Started'
              }
            ]
          }
        } else {
          this.verificationJob = {
            ...this.verificationJob,
            owner: 'John Doe',
            container_size: 'B Low',
            container_type: 'Non-Trayed',
            media_type: 'Vinyl Recording',
            status: 'Running',
            type: 1,
            id,
            items: [
              {
                id: '00924891234',
                verified: false
              },
              {
                id: '00924891235',
                verified: false
              },
              {
                id: '00924891236',
                verified: false
              }
            ]
          }
        }
        this.originalVerificationJob = { ...this.verificationJob }
      } catch (error) {
        return error
      }
    },
    async patchVerificationJob (payload) {
      try {
        // TODO: setup api call to update an verification job
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.verificationJob = res.data
        this.verificationJob = {
          ...this.verificationJob,
          ...payload
        }
        this.originalVerificationJob = { ...this.verificationJob }
      } catch (error) {
        return error
      }
    },
    async getVerificationTray (barcode) {
      try {
        // TODO: setup api call to check the scanned barcode and get its tray data
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12, barcode
        // )
        // this.verificationContainer = res.data
        this.verificationContainer = {
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
        this.originalVerificationContainer = { ...this.verificationContainer }
      } catch (error) {
        return error
      }
    },
    async patchVerificationTray () {
      try {
        // TODO: setup api call to update an verification tray
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.verificationContainer = res.data
        this.verificationContainer = {
          ...this.verificationContainer
        }
        this.originalVerificationContainer = { ...this.verificationContainer }
      } catch (error) {
        return error
      }
    },
    async deleteVerificationTrayItem (barcodeList) {
      try {
        // TODO: setup api call to delete item in an verification tray
        // const res = await this.$api.delete(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.verificationContainer = res.data
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
    async getVerificationNonTray (barcode) {
      try {
        // TODO: setup api call to verify the scanned nontray item barcode and get its data to display
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12, barcode
        // )
        // this.verificationContainer = res.data
        this.verificationContainer = {
          id: barcode,
          title: 'Non Tray Title',
          owner: 'Colonel Sanders',
          container_type: 'Non-Trayed',
          container_size: 'B High',
          media_type: 'Vinyl Recording'
        }
        this.originalVerificationContainer = { ...this.verificationContainer }
      } catch (error) {
        return error
      }
    },
    async patchVerificationNonTray () {
      try {
        // TODO: setup api call to update an verification nontray
        // const res = await this.$api.patch(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.verificationContainer = res.data
        this.verificationContainer = {
          ...this.verificationContainer
        }
        this.originalVerificationContainer = { ...this.verificationContainer }
      } catch (error) {
        return error
      }
    },
    async deleteVerificationNonTrayItem (barcodeList) {
      try {
        // TODO: setup api call to delete item in an verification nontray
        // const res = await this.$api.delete(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.verificationContainer = res.data
        this.verificationJob = {
          ...this.verificationJob,
          items: this.verificationJob.items.filter(b => !barcodeList.includes(b.id) )
        }
        this.originalVerificationJob = { ...this.verificationJob }
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
        // this.verificationContainer = res.data
        this.verificationContainer.items[this.verificationContainer.items.findIndex(item => item.id == barcode)].verified = true
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
        // this.verificationContainer = res.data
        this.verificationJob.items[this.verificationJob.items.findIndex(item => item.id == barcode)].verified = true
      } catch (error) {
        return error
      }
    }
  }
})
