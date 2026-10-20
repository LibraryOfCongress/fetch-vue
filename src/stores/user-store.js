import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

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

  // ======================================================================
  // ================== START: ADD THIS NEW GETTERS SECTION ===============
  // ======================================================================
  getters: {
    /**
     * Whether the user may edit tray / non-tray item details.
     * Editing an item or tray (PATCH) is gated on the backend by accession OR
     * verification access (see the v1.05 permission model), so the UI mirrors
     * that: anyone who can accession or verify can edit item/tray details.
     * @param {object} state The store's state.
     * @returns {boolean} True if the user has the permission, otherwise false.
     */
    canEditTray: (state) => {
      return state.userData.permissions.includes('can_access_accession') ||
        state.userData.permissions.includes('can_access_verification') ||
        state.userData.permissions.includes('can_edit_tray')
    },
    canEditNonTrayItem: (state) => {
      return state.userData.permissions.includes('can_access_accession') ||
        state.userData.permissions.includes('can_access_verification') ||
        state.userData.permissions.includes('can_edit_non_tray_item')
    }
  },
  // ======================================================================
  // =================== END: ADD THIS NEW GETTERS SECTION ================
  // ======================================================================

  actions: {
    resetUserStore () {
      localStorage.removeItem('user')
      this.$reset()
    },
    async patchLogin (payload, type) {
      try {
        if (type == 'Internal') {
          // Internal login sets the HttpOnly cookie directly from the backend response now
          await this.$api.post(inventoryServiceApi.authLegacyLogin, payload)
        }

        // At this point, whether Internal or SSO, the browser should have the HttpOnly cookie.
        // We verify the session by fetching the current user profile.
        // Wait, FETCH2 doesn't have an `/auth/me` endpoint. We need to construct a robust way to get the user ID.
        // The most secure approach if we don't have the ID is to hit an endpoint that returns the profile.
        // Let's assume there is an `/auth/me` or `/users/me` being added, or we have to add it.
        // For now, if the backend expects us to know the ID, we need the backend to return basic profile info
        // on login, or we create a `/users/me` endpoint.

        // CRITICAL: FETCH2 backend `/users/{id}` requires an ID.
        // We will add `/auth/me` to the backend to return the current user profile without needing the ID.
        const profileRes = await this.$api.get('/auth/me')
        this.userData = {
          ...this.userData,
          ...profileRes.data
        }

        // resave user credentials in local storage with the merged profile data (safe, non-sensitive)
        localStorage.setItem('user', JSON.stringify(this.userData))

        await this.getUserPermissions()
      } catch (error) {
        throw error
      }
    },
    async patchLogout (reauthenticate = false) {
      try {
        // Ping backend to delete the HttpOnly cookie
        try {
          await this.$api.post('/auth/sso/logout/')
        } catch (logoutError) {
          console.warn('Backend logout ping failed (session may already be expired)', logoutError)
        }

        this.resetUserStore()

        if (reauthenticate) {
          // On a 401 timeout, auto re-authenticate and preserve the user's current
          // route so they return to the page they were on. Real deployments
          // (dev/stage/prod) are all SSO/SAML: relay to the SSO login with a
          // preserve_route param so the backend brings the user back. Only local
          // dev uses legacy login, so there we just return home.
          //
          // We key off the runtime hostname, NOT process.env.VITE_ENV: every
          // non-local build bakes VITE_ENV='local' (the web Containerfiles don't
          // pass ENVIRONMENT to `quasar build`), so the old isSamlEnv gate was
          // false in every deployed environment and skipped SSO re-auth entirely —
          // dumping timed-out users on the home page instead of restoring them.
          const host = window.location.hostname
          const isLocalDev = host === 'localhost' || host === '127.0.0.1'

          if (!isLocalDev) {
            const baseUrl = process.env.VITE_INV_SERVCE_API.replace(/\/+$/, '')
            const preserveRoute = encodeURIComponent(this.router.currentRoute._value.fullPath)
            window.location.replace(`${baseUrl}${inventoryServiceApi.authSsoLogin}?preserve_route=${preserveRoute}`)
          } else {
            // local dev uses legacy login; just return home
            this.router.push('/')
          }
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
    },
    async updateUserProfile (id, payload) {
      try {
        // Self-service settings (e.g. default building) go through /users/me,
        // which is authenticated-only. The admin PATCH /users/{id} requires
        // can_manage_groups_and_permissions and must not gate personal prefs.
        const res = await this.$api.patch(inventoryServiceApi.usersMe, payload)
        this.userData = {
          ...this.userData,
          ...res.data
        }
        localStorage.setItem('user', JSON.stringify(this.userData))
        return res.data
      } catch (error) {
        throw error
      }
    }
  }
})