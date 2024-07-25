import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'
import { jwtDecode } from 'jwt-decode'

export const useUserStore = defineStore('user-store', {
  state: () => ({
    userData: JSON.parse(localStorage.getItem('user')) || {
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
          const res = await this.$api.post(inventoryServiceApi.authLegacyLogin, payload)
          this.userData = jwtDecode(res.data.detail)
        } else {
          // sso login will pass the direct user data as the payload from a decoded jwt
          this.userData = payload
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
