import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js'

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
        // TODO: setup endpoint to handle internal login
        // const res = await this.$api.post(inventoryServiceApi.users, payload)
        // this.userData = res.data
        this.userData = {
          id: 1,
          username: payload.username,
          first_name: 'Admin',
          last_name: 'User'
        }
        localStorage.setItem('user', JSON.stringify(this.userData))
      } catch (error) {
        throw error
      }
    },
    async patchLogout () {
      try {
        // TODO: setup endpoint to handle internal logout
        // const res = await this.$api.post(inventoryServiceApi.users, payload)
        // this.userData = res.data
        this.resetUserStore()
      } catch (error) {
        throw error
      }
    }
  }
})
