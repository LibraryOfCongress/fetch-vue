import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useRefileStore = defineStore('refile-store', {
  state: () => ({
    refileJobList: [],
    refileJob: {
      id: null,
      items: [],
      non_tray_items: []
    },
    originalRefileJob: null,
    refileItem: {
      id: null,
      barcode: {
        value: null
      },
      owner: null
    }
  }),
  getters: {
    refileJobItems: (state) => {
      let itemList = []
      if (state.refileJob.id) {
        itemList = itemList.concat(state.refileJob.items, state.refileJob.non_tray_items)
      }
      // return the list sorted alphnumerically
      return itemList.sort(new Intl.Collator('en', { numeric:true, sensitivity:'accent' }).compare)
    },
    allItemsRefiled: (state) => {
      if (state.refileJob.id && state.refileJob.status !== 'Created') {
        // if were in a running refile job, we check that items exist and none of the items are pending refile state
        return state.refileJobItems.length == 0 || state.refileJobItems.some(itm => itm.status == 'Out') ? false : true
      } else {
        return true
      }
    }
  },
  actions: {
    resetRefileStore () {
      this.$reset()
    },
    resetRefileItem () {
      this.refileItem = {
        id: null,
        barcode: {
          value: null
        },
        owner: null
      }
    },
    async getRefileJobList () {
      try {
        const res = await this.$api.get(inventoryServiceApi.refileJobs)
        this.refileJobList = res.data.items
      } catch (error) {
        throw error
      }
    },
    async getRefileQueueList (paramsObj) {
      try {
        const res = await this.$api.get(inventoryServiceApi.refileQueue, { params: paramsObj })
        this.refileJobList = res.data.items
      } catch (error) {
        throw error
      }
    },
    async getRefileJob (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.refileJobs}${id}`)
        this.refileJob = res.data
        this.originalRefileJob = { ...this.refileJob }
      } catch (error) {
        throw error
      }
    },
    async postRefileJob (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.refileJobs, payload)
        this.refileJob = res.data
        this.originalRefileJob = { ...this.refileJob }
      } catch (error) {
        throw error
      }
    },
    async patchRefileJob (payload) {
      try {
        // if (globalStore.appIsOffline) {
        //   // this will only occur when user is pausing/resuming when offline
        //   navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.picklists}${payload.id}` })
        // }
        const res = await this.$api.patch(`${inventoryServiceApi.refileJobs}${payload.id}`, payload)
        this.refileJob = res.data
        this.originalRefileJob = { ...this.refileJob }
      } catch (error) {
        throw error
        // if (globalStore.appIsOffline) {
        //   return
        // } else {
        //   throw error
        // }
      }
    },
    getRefileJobItem (barcode_value) {
      // find the item with the matching barcode_value and set the data as the refileItem
      this.refileItem = this.refileJobItems.find(itm => itm.barcode.value == barcode_value)
    },
    async postRefileJobItem (payload) {
      try {
        // used to add queue items to a refile Job
        const res = await this.$api.post(`${inventoryServiceApi.refileJobs}${payload.id}/add_items`, payload)
        this.refileJob = res.data
        this.originalRefileJob = { ...this.refileJob }
      } catch (error) {
        throw error
      }
    },
    async deleteRefileJobItems (payload) {
      try {
        // if (globalStore.appIsOffline) {
        //   // this will only occur when user reverts to queue when offline
        //   navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.picklists}${this.picklistJob.id}/remove_request/${itemId}` })
        // }
        const res = await this.$api.delete(`${inventoryServiceApi.refileJobs}${this.refileJob.id}/remove_items`, { data: payload })
        this.refileJob = res.data
        this.originalRefileJob = { ...this.refileJob }
      } catch (error) {
        throw error
        // if (globalStore.appIsOffline) {
        //   return
        // } else {
        //   throw error
        // }
      }
    },
    async patchRefileJobTrayItemScanned (payload) {
      try {
        // if (globalStore.appIsOffline) {
        //   // this will only occur when user is scanning when offline
        //   navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.picklists}${payload.id}/update_request/${payload.request_id}` })
        // }
        // updates a refile job item and marks it as refiled
        const res = await this.$api.patch(`${inventoryServiceApi.refileJobs}${payload.job_id}/update_item/${payload.item_id}`, payload)
        this.refileJob = res.data
        this.originalRefileJob = { ...this.refileJob }
      } catch (error) {
        throw error
        // if (globalStore.appIsOffline) {
        //   return
        // } else {
        //   throw error
        // }
      }
    },
    async patchRefileJobNonTrayItemScanned (payload) {
      try {
        // if (globalStore.appIsOffline) {
        //   // this will only occur when user is scanning when offline
        //   navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.picklists}${payload.id}/update_request/${payload.request_id}` })
        // }
        // updates a refile job non tray item and marks it as refiled
        const res = await this.$api.patch(`${inventoryServiceApi.refileJobs}${payload.job_id}/update_non_tray_items/${payload.non_tray_item_id}`, payload)
        this.refileJob = res.data
        this.originalRefileJob = { ...this.refileJob }
      } catch (error) {
        throw error
        // if (globalStore.appIsOffline) {
        //   return
        // } else {
        //   throw error
        // }
      }
    },
    async postRefileQueueItem (payload) {
      try {
        const res = await this.$api.patch(inventoryServiceApi.refileQueue, payload)
        // items can only be addded individually to the queue using this endpoint so we need to check which item type was added and return it as the refileItem
        this.refileItem = res.data.items && res.data.items.length > 0 ? res.data.items[0] : res.data.non_tray_items[0]
      } catch (error) {
        throw error
      }
    }
  }
})
