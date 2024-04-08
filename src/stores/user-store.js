import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js'

export const useUserStore = defineStore('user-store', {
  state: () => ({
    userData: {
      id: null,
      name: null
    }
  }),
  actions: {
    resetUserStore () {
      this.$reset()
    }
  }
})
