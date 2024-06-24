import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useUserStore = defineStore('user-store', {
  state: () => ({
    userData: JSON.parse(localStorage.getItem('user')) || {
      id: null,
      username: '',
      first_name: '',
      last_name: ''
    }
  }),
  actions: {
    resetUserStore () {
      localStorage.removeItem('user')
      this.$reset()
    },
    async patchLogin (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.authLegacyLogin, payload)
        this.userData = res.data
        localStorage.setItem('user', JSON.stringify(this.userData))
      } catch (error) {
        throw error
      }
    },
    async patchLogout () {
      try {
        const res = await this.$api.post(inventoryServiceApi.authSsoLogout)
        this.userData = res.data
        this.resetUserStore()
      } catch (error) {
        throw error
      }
    }
  }
})
