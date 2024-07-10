import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

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
          await this.$api.post(inventoryServiceApi.authLegacyLogin, payload)
        } else {
          // sso login will pass the direct user data as the payload from a decoded jwt
          this.userData = payload
        }

        // set user credentials in local storage
        localStorage.setItem('user', JSON.stringify(this.userData))
      } catch (error) {
        //TODO: REMOVE TEMP Redirect for 404 legacy login token error
        if (error.response.status == 404 && error.response.request.responseURL.includes('?token')) {
          window.location.replace(error.response.request.responseURL)
        } else {
          throw error
        }
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
