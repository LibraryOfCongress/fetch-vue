import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useBarcodeStore = defineStore('barcode-store', {
  state: () => ({
    barcodeScanAllowed: false,
    barcodeInputDelay: .25,
    barcodeDetails: {
      id: null,
      type_id: null,
      value: null
    }
  }),
  actions: {
    resetBarcodeStore () {
      this.barcodeDetails = {
        id: null,
        type_id: null,
        value: null
      }
    },
    async verifyBarcode (barcode, type) {
      try {
        this.resetBarcodeStore()

        // check if the scanned barcode exists in the system
        await this.getBarcodeDetails(barcode)
        if (this.barcodeDetails.id) {
          return
        }
      } catch (error) {
        if (error.response?.status == 404) {
          // if the barcode doesnt exist add it
          await this.postBarcode(barcode, type)
          return
        }
        throw error
      }
    },
    async getBarcodeDetails (barcode) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.barcodesValue}${barcode}`)
        this.barcodeDetails = res.data
      } catch (error) {
        throw error
      }
    },
    async postBarcode (barcode, type) {
      try {
        const res = await this.$api.post(inventoryServiceApi.barcodes, {
          type,
          value: barcode
        })

        this.barcodeDetails = res.data
      } catch (error) {
        throw error
      }
    },
    async patchBarcode (barcode_id, barcode_value) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.barcodes}${barcode_id}`, {
          value: barcode_value
        })

        this.barcodeDetails = res.data
      } catch (error) {
        throw error
      }
    },
    async deleteBarcode (barcode_id) {
      try {
        const res = await this.$api.delete(`${inventoryServiceApi.barcodes}${barcode_id}`)

        this.barcodeDetails = res.data
      } catch (error) {
        throw error
      }
    }
  }
})
