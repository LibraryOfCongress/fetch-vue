import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useBarcodeStore = defineStore('barcode-store', {
  state: () => ({
    barcodeDetails: {
      id: null,
      type_id: null,
      value: null
    }
  }),
  actions: {
    resetBarcodeStore () {
      this.$reset()
    },
    async verifyBarcode (barcode) {
      try {
        this.resetBarcodeStore()

        // check if the scanned barcode exists in the system
        await this.getBarcodeDetails(barcode)
        if (this.barcodeDetails.id) {
          return
        } else {
          // if the barcode doesnt exist add it
          await this.postBarcode(barcode)
          return
        }
      } catch (error) {
        return error
      }
    },
    async postBarcode (barcode) {
      try {
        const res = await this.$api.post(inventoryServiceApi.barcodes, {
          type_id: 1, //TODO figure out how barcode types work
          value: barcode
        })

        this.barcodeDetails = res.data
      } catch (error) {
        return error
      }
    },
    async getBarcodeDetails (barcode) {
      try {
        //TODO: update this once we change the barcode get endpoint to accept a barcode value instead of uuid
        const res = await this.$api.get(`${inventoryServiceApi.barcodes}`)

        if (res.data.items.some(b => b.value == barcode)) {
          this.barcodeDetails = res.data.items.find(b => b.value == barcode)
        }
      } catch (error) {
        return error
      }
    }
  }
})
