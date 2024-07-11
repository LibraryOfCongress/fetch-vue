import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js'

export const useReportsStore = defineStore('reports-store', {
  state: () => ({
    reportData: []
  }),
  actions: {
    resetReportsStore () {
      this.$reset()
    },
    async getReport (paramsObj) {
      try {
        // TODO setup endpoints to handle generating a report using the user selected params
        // const res = await this.$api.get(inventoryServiceApi.reports, { params: paramsObj })
        // this.reportData = res.data
        this.reportData = []
        console.log('generating report', paramsObj)
      } catch (error) {
        throw error
      }
    }
  }
})
