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
      sessionStorage.removeItem('token')
      this.$reset()
    },
    async patchLogin (payload, type) {
      try {
        let userToken
        if (type == 'Internal') {
          const res = await this.$api.post(inventoryServiceApi.authLegacyLogin, payload)
          this.userData = jwtDecode(res.data.detail)

          // assign token for internal login since there is no longer a route query token redirect
          userToken = res.data.detail
        } else {
          // sso login will pass the direct user data as the payload from a decoded jwt + the token itself
          this.userData = { ...payload }
          userToken = payload.token

          // remove token from the userData since we store that seperately in session storage
          delete this.userData.token
        }

        // set user credentials in local storage
        localStorage.setItem('user', JSON.stringify(this.userData))
        // set user token in session storate
        sessionStorage.setItem('token', JSON.stringify(userToken))

        await this.getUserPermissions()
      } catch (error) {
        throw error
      }
    },
    async patchLogout (reauthenticate = false) {
      try {
        this.resetUserStore()

        if (reauthenticate) {
          // if the reauthenticate flag is passed (usually occurs when user gets timed-out via 401)
          // we want to auto reauthenticate the user and preserve the users route by sending the user to the sso login with a preserve_route query param
          window.location.replace(`${process.env.VITE_INV_SERVCE_API}${inventoryServiceApi.authSsoLogin}?preserve_route=${this.router.currentRoute._value.fullPath}`)
        }
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
