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
    async getBarcodeDetails (barcode) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.barcodesValue}${barcode}`)
        this.barcodeDetails = res.data
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
    async patchBarcode (barcode_id, barcode_value) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.barcodes}${barcode_id}`, {
          value: barcode_value
        })

        this.barcodeDetails = res.data
      } catch (error) {
        return error
      }
    },
    async deleteBarcode (barcode_id) {
      try {
        const res = await this.$api.delete(`${inventoryServiceApi.barcodes}${barcode_id}`)

        this.barcodeDetails = res.data
      } catch (error) {
        return error
      }
    }
  }
})
