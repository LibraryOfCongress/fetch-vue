import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useReportsStore = defineStore('reports-store', {
  state: () => ({
    reportDataTotal: 0,
    reportData: [],
    reportQueryParams: {}
  }),
  actions: {
    resetReportsStore () {
      this.$reset()
    },
    async getReport (paramsObj, reportType) {
      try {
        this.reportData = []
        if (reportType == 'Item Accession') {
          const res = await this.$api.get(inventoryServiceApi.reportingAccessionItems, { params: { size: this.apiPageSizeDefault, ...paramsObj } })
          this.reportData = res.data.items

          // keep track of response total for pagination
          this.reportDataTotal = res.data.total

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
        } else if (reportType == 'Shelving Job Discrepancy') {
          const res = await this.$api.get(inventoryServiceApi.reportingShelvingDiscrepancy, { params: { ...paramsObj, size: 100 } } )
          this.reportData = res.data.items

          // keep track of response total for pagination
          this.reportDataTotal = res.data.total
        }

        // Remember the query params for download
        this.reportQueryParams = paramsObj
      } catch (error) {
        throw error
      }
    },
    async downloadReport (reportType) {
      try {
        if (reportType == 'Shelving Job Discrepancy') {
          const res = await this.$api.get(`${inventoryServiceApi.reportingShelvingDiscrepancy}download`, {
            params: { ...this.reportQueryParams },
            responseType: 'blob'
          })

          const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }))

          // Get the current date and time and format as YYYY_MM_DD_HH_MM_SS
          const formattedDate = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '_')

          const link = document.createElement('a')
          link.href = url
          link.download = `${reportType}_${formattedDate}.csv`
          document.body.appendChild(link)
          link.click()

          link.remove()
          window.URL.revokeObjectURL(url)
        }
      } catch (error) {
        throw error
      }
    }
  }
})
