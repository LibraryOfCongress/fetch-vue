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
        let incomingToken = null
        if (type == 'Internal') {
          const res = await this.$api.post(inventoryServiceApi.authLegacyLogin, payload)
          incomingToken = res.data.detail
          this.userData = jwtDecode(res.data.detail)
        } else {
          // sso login will pass the direct user data as the payload from a decoded jwt
          this.userData = payload
        }

        // append token to userData object
        let localStorageUser = this.userData
        localStorageUser.token = incomingToken


        // set user credentials in local storage
        // localStorage.setItem('user', JSON.stringify(this.userData))
        localStorage.setItem('user', JSON.stringify(localStorageUser))
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
