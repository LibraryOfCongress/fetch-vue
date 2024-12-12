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
        if (reportType == 'Item Accession') {
          const res = await this.$api.get(inventoryServiceApi.reportingAccessionItems, { params: { size: this.apiPageSizeDefault, ...paramsObj },
            paramsSerializer: function handleQuery (query) {
              // this will process param arrays as multiple entries in get request query params
              // ex: owner_id: [1,2] => owner_id=1&owner_id=2
              return Object.entries(query).map(([
                key,
                value
              ]) => Array.isArray(value) ? `${key}=${value.join('&' + key + '=')}` : `${key}=${value}`).join('&')
            }
          })
          this.reportData = res.data.items


          //REMOVE: Temp solution until reports are figured out
          // let itemData = []
          // const res = this.$api.get(inventoryServiceApi.items, { params: { size: this.apiPageSizeDefault, ...paramsObj } })
          // const res2 = this.$api.get(inventoryServiceApi.nonTrayItems, { params: { size: this.apiPageSizeDefault, ...paramsObj } })
          // Promise.all([
          //   res,
          //   res2
          // ]).then(values => {
          //   itemData = itemData.concat(values[0].data.items, values[1].data.items)
          //   console.log(itemData)
          //   if (itemData.length == 0) {
          //     this.reportData = []
          //   } else {
          //     this.reportData = [
          //       {
          //         owner: {
          //           name: paramsObj.owner_id && itemData.length > 0 ? itemData[0].owner.name : 'All'
          //         },
          //         media_type: {
          //           name: paramsObj.media_type_id && itemData.length > 0 ? itemData[0].media_type.name : 'All'
          //         },
          //         size_class: {
          //           name: paramsObj.size_class_id && itemData.length > 0 ? itemData[0].size_class.name : 'All'
          //         },
          //         total_count: values[0].data.total + values[1].data.total
          //       }
          //     ]
          //   }
          // })
        } else {
          this.reportData = []
        }
      } catch (error) {
        throw error
      }
    }
  }
})
