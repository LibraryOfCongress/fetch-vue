import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js'

export const useUserStore = defineStore('user-store', {
  state: () => ({
    userData: JSON.parse(localStorage.getItem('user')) || {
      id: null,
      user_id: null,
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
    async patchLogin (payload, type) {
      try {
        if (type == 'Internal') {
          // TODO uncomment once internal login api is ready for testing
          // const res = await this.$api.post(inventoryServiceApi.authLegacyLogin, payload)
          // this.userData = res.data
          this.userData = {
            id: 1,
            user_id: 'Admin',
            username: payload.username,
            email: 'admin@email.com',
            first_name: 'Admin',
            last_name: 'User'
          }
        } else {
          // sso login will pass the direct user data as the payload from a decoded jwt
          this.userData = {
            id: 1,
            ...payload
          }
        }

        // set user credentials in local storage
        localStorage.setItem('user', JSON.stringify(this.userData))
      } catch (error) {
        throw error
      }
    },
    async patchLogout () {
      try {
        // TODO uncomment once api is ready for testing
        // const res = await this.$api.post(inventoryServiceApi.authSsoLogout)
        // this.userData = res.data
        this.resetUserStore()
      } catch (error) {
        throw error
      }
    }
  }
})
