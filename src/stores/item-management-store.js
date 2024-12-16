import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js'

export const useItemManagementStore = defineStore('item-management-store', {
  state: () => ({
    itemDetails: {
      id: null
    },
    trayDetails: {
      id: null
    },
    shelfDetails: {
      id: null
    }
  }),
  actions: {
    resetItemManagementStore () {
      this.$reset
    }
    // async getBarcodeDetails (barcode) {
    //   try {
    //     const res = await this.$api.get(`${inventoryServiceApi.barcodesValue}${barcode}`)
    //     this.barcodeDetails = res.data
    //   } catch (error) {
    //     throw error
    //   }
    // },
    // async postBarcode (barcode, type) {
    //   try {
    //     const res = await this.$api.post(inventoryServiceApi.barcodes, {
    //       type,
    //       value: barcode
    //     })

    //     this.barcodeDetails = res.data
    //   } catch (error) {
    //     throw error
    //   }
    // },
    // async patchBarcode (barcode_id, barcode_value) {
    //   try {
    //     const res = await this.$api.patch(`${inventoryServiceApi.barcodes}${barcode_id}`, {
    //       value: barcode_value
    //     })

    //     this.barcodeDetails = res.data
    //   } catch (error) {
    //     throw error
    //   }
    // },
    // async deleteBarcode (barcode_id) {
    //   try {
    //     const res = await this.$api.delete(`${inventoryServiceApi.barcodes}${barcode_id}`)

    //     this.barcodeDetails = res.data
    //   } catch (error) {
    //     throw error
    //   }
    // }
  }
})
