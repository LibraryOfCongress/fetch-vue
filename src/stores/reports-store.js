import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useReportsStore = defineStore('reports-store', {
  state: () => ({
    reportData: []
  }),
  actions: {
    resetReportsStore () {
      this.$reset()
    },
    async getReport (paramsObj, reportType) {
      try {
        // TODO setup endpoints to handle generating a report using the user selected params
        if (reportType == 'Item Accession') {
          //REMOVE: Temp solution until reports are figured out
          let itemData = []
          const res = this.$api.get(inventoryServiceApi.items, { params: { ...paramsObj, size: 100 } })
          const res2 = this.$api.get(inventoryServiceApi.nonTrayItems, { params: { ...paramsObj, size: 100 } })
          Promise.all([
            res,
            res2
          ]).then(values => {
            itemData = itemData.concat(values[0].data.items, values[1].data.items)
            console.log(itemData)
            if (itemData.length == 0) {
              this.reportData = []
            } else {
              this.reportData = [
                {
                  owner: {
                    name: paramsObj.owner_id && itemData.length > 0 ? itemData[0].owner.name : 'All'
                  },
                  media_type: {
                    name: paramsObj.media_type_id && itemData.length > 0 ? itemData[0].media_type.name : 'All'
                  },
                  size_class: {
                    name: paramsObj.size_class_id && itemData.length > 0 ? itemData[0].size_class.name : 'All'
                  },
                  total_count: values[0].data.total + values[1].data.total
                }
              ]
            }
          })
        } else {
          this.reportData = []
        }
      } catch (error) {
        throw error
      }
    }
  }
})
