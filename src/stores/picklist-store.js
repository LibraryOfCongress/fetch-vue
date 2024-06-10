import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'
import { useGlobalStore } from './global-store'
const globalStore = useGlobalStore()

export const usePicklistStore = defineStore('picklist-store', {
  state: () => ({
    picklistJobList: [],
    picklistJob: {
      id: null,
      building: null,
      user: null,
      user_id: null,
      create_dt: null,
      status: null,
      requests: []
    },
    originalPicklistJob: null
  }),
  getters: {
    allItemsRetrieved: (state) => {
      if (state.picklistJob.id && state.picklistJob.status !== 'Created') {
        // when a picklist job is active we can keep track of if all requested items have been pulled/retrieved
        return state.picklistJob.requests.length == 0 || state.picklistJob.requests.some(itm => !itm.scanned_for_retrieval) ? false : true
      } else {
        return true
      }
    }
  },
  actions: {
    resetPicklistStore () {
      this.$reset()
    },
    async getPicklistJobList () {
      try {
        const res = await this.$api.get(inventoryServiceApi.picklists)
        this.picklistJobList = res.data.items
      } catch (error) {
        throw error
      }
    },
    async getPicklistJob (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.picklists}${id}`)
        this.picklistJob = res.data
        this.originalPicklistJob = { ...this.picklistJob }
      } catch (error) {
        throw error
      }
    },
    async postPicklistJob (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.picklists, payload)
        this.picklistJob = res.data
        this.originalPicklistJob = { ...this.picklistJob }
      } catch (error) {
        throw error
      }
    },
    async patchPicklistJob (payload) {
      try {
        if (globalStore.appIsOffline) {
          // this will only occur when user is pausing/resuming when offline
          navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.picklists}${payload.id}` })
        }
        const res = await this.$api.patch(`${inventoryServiceApi.picklists}${payload.id}`, payload)
        this.picklistJob = res.data
        this.originalPicklistJob = { ...this.picklistJob }
      } catch (error) {
        if (globalStore.appIsOffline) {
          return
        } else {
          throw error
        }
      }
    },
    async patchPicklistJobItem (payload) {
      try {
        // used to add request items to a picklist
        const res = await this.$api.patch(`${inventoryServiceApi.picklists}${payload.id}/add_request`, payload)
        this.picklistJob = res.data
        this.originalPicklistJob = { ...this.picklistJob }
      } catch (error) {
        throw error
      }
    },
    async patchPicklistJobItemScanned (payload) {
      try {
        if (globalStore.appIsOffline) {
          // this will only occur when user is scanning when offline
          navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.picklists}${payload.id}/update_request/${payload.request_id}` })
        }
        // updates a request item and marks it as retrieved
        const res = await this.$api.patch(`${inventoryServiceApi.picklists}${payload.id}/update_request/${payload.request_id}`, payload)
        this.picklistJob = res.data
        this.originalPicklistJob = { ...this.picklistJob }
      } catch (error) {
        if (globalStore.appIsOffline) {
          return
        } else {
          throw error
        }
      }
    },
    async deletePicklistJobItem (itemId) {
      try {
        if (globalStore.appIsOffline) {
          // this will only occur when user reverts to queue when offline
          navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.picklists}${this.picklistJob.id}/remove_request/${itemId}` })
        }
        const res = await this.$api.delete(`${inventoryServiceApi.picklists}${this.picklistJob.id}/remove_request/${itemId}`)
        this.picklistJob = res.data
        this.originalPicklistJob = { ...this.picklistJob }
      } catch (error) {
        if (globalStore.appIsOffline) {
          return
        } else {
          throw error
        }
      }
    }
  }
})
