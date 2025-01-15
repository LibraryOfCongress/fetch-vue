import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useItemManagementStore = defineStore('item-management-store', {
  state: () => ({
    itemDetails: {
      id: null
    },
    itemRequestHistory: [],
    itemRequestHistoryTotal: 0,
    trayDetails: {
      id: null
    },
    shelfDetails: {
      id: null
    }
  }),
  actions: {
    resetItemManagementStore () {
      this.$reset()
    },
    async getItemDetails (barcodeValue) {
      try {
        // since we dont know if the item detail view is a tray item vs non tray item we need to try hitting both item and non tray item detail endpoints
        const [
          resTrayItem,
          resNonTrayItem
        ] = await Promise.all([
          this.$api.get(`${inventoryServiceApi.itemsBarcode}${barcodeValue}`).catch((error) => error.response.status == '404' ? '404' : error),
          this.$api.get(`${inventoryServiceApi.nonTrayItemsBarcode}${barcodeValue}`).catch((error) => error.response.status == '404' ? '404' : error)
        ])

        if (resTrayItem !== '404') {
          this.itemDetails = resTrayItem.data
        } else if (resNonTrayItem !== '404') {
          this.itemDetails = resNonTrayItem.data
        } else {
          return
        }
      } catch (error) {
        throw error
      }
    },
    async getItemRequestHistory (qParams) {
      try {
        const res = await this.$api.get(inventoryServiceApi.requests, {
          params: {
            size: this.apiPageSizeDefault,
            ...qParams
          }
        })
        this.itemRequestHistory = res.data.items

        // keep track of response total for pagination
        this.itemRequestHistoryTotal = res.data.total
      } catch (error) {
        throw error
      }
    }
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
