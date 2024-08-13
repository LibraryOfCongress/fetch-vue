import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'
import { jwtDecode } from 'jwt-decode'

export const useUserStore = defineStore('user-store', {
  state: () => ({
    userData: JSON.parse(localStorage.getItem('user')) || {
      user_id: null,
      username: '',
      first_name: '',
      last_name: '',
      permissions: []
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
          // assign token for internal login since there is no longer a route query token redirect
          this.userData.token = res.data.detail
        } else {
          // sso login will pass the direct user data as the payload from a decoded jwt
          this.userData = payload
        }

        // set user credentials in local storage
        localStorage.setItem('user', JSON.stringify(this.userData))

        await this.getUserPermissions()
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
    },
    async getUserPermissions () {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.users}${this.userData.user_id}/permissions`)
        this.userData.permissions = res.data.permissions
        // update user credentials in local storage
        localStorage.setItem('user', JSON.stringify(this.userData))
      } catch (error) {
        if (error.response?.status == '404') {
          this.userData.permissions = []
          // update user credentials in local storage
          localStorage.setItem('user', JSON.stringify(this.userData))
        } else {
          throw error
        }
      }
    }
  }
})
