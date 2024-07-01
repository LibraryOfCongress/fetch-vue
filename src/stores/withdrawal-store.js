import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'
// import { useGlobalStore } from './global-store'
// const globalStore = useGlobalStore()

export const useWithdrawalStore = defineStore('withdrawal-store', {
  state: () => ({
    withdrawJobList: [],
    withdrawJob: {
      id: null,
      item_count: 0,
      create_dt: null,
      last_transition: null,
      status: null,
      items: [],
      non_tray_items: [],
      trays: []
    },
    originalWithdrawJob: null
  }),
  getters: {
    withdrawJobItems: (state) => {
      let itemList = []
      if (state.withdrawJob.id) {
        itemList = itemList.concat(state.withdrawJob.items, state.withdrawJob.non_tray_items, state.withdrawJob.trays)
      }
      // return the list sorted alphnumerically
      return itemList.sort(new Intl.Collator('en', { numeric:true, sensitivity:'accent' }).compare)
    }
  },
  actions: {
    resetWithdrawStore () {
      this.$reset()
    },
    resetWithdrawJob () {
      this.withdrawJob = {
        id: null,
        items_count: 0,
        create_dt: null,
        last_transition: null,
        status: null,
        items: [],
        non_tray_items: [],
        trays: []
      }
      this.originalWithdrawJob = null
    },
    async getWithdrawJobList () {
      try {
        // TODO: wire up api to get job list
        // const res = await this.$api.get(inventoryServiceApi.withdrawJobs)
        // this.withdrawJobList = res.data.items
        this.withdrawJobList = [
          {
            id: 1,
            item_count: 2,
            create_dt: new Date().toISOString(),
            last_transition: null,
            status: 'Created'
          }
        ]
      } catch (error) {
        throw error
      }
    },
    async getWithdrawJob (id) {
      try {
        // TODO: wire up api to get job endpoint
        // const res = await this.$api.get(`${inventoryServiceApi.withdrawJobs}${id}`)
        // this.withdrawJob = res.data
        this.withdrawJob = {
          id,
          create_dt: new Date().toISOString(),
          last_transition: null,
          status: 'Created',
          items: [
            {
              id: 1,
              barcode: {
                value: 12345678901
              },
              tray: {
                barcode: {
                  value: 'RS123456'
                },
                shelf_position: {
                  shelf: {
                    barcode: {
                      value: 1122334456
                    }
                  }
                }
              },
              owner: {
                name: 'John Doe'
              },
              status: 'Out'
            }
          ],
          non_tray_items: [
            {
              id: 2,
              barcode: {
                value: 12345678902
              },
              owner: {
                name: 'John Doe'
              },
              status: 'Out',
              shelf_position: {
                shelf: {
                  barcode: {
                    value: 1122334455
                  }
                }
              }
            }
          ],
          trays: []
        }
        this.originalWithdrawJob = { ...this.withdrawJob }
      } catch (error) {
        throw error
      }
    },
    async postWithdrawJob () {
      try {
        // TODO: wire up api to create job
        // const res = await this.$api.post(inventoryServiceApi.withdrawJobs, payload)
        // this.withdrawJob = res.data
        this.withdrawJob = {
          id: 1,
          create_dt: new Date().toISOString(),
          last_transition: null,
          status: 'Created',
          items: [
            {
              id: 1,
              barcode: {
                value: 12345678901
              },
              tray: {
                barcode: {
                  value: 'RS123456'
                }
              },
              owner: {
                name: 'John Doe'
              },
              status: 'Out'
            }
          ],
          non_tray_items: [
            {
              id: 2,
              barcode: {
                value: 12345678902
              },
              owner: {
                name: 'John Doe'
              },
              status: 'Out'
            }
          ],
          trays: []
        }
        this.originalWithdrawJob = { ...this.withdrawJob }
      } catch (error) {
        throw error
      }
    },
    async patchWithdrawJob (payload) {
      try {
        // if (globalStore.appIsOffline) {
        //   // this will only occur when user is pausing/resuming when offline
        //   navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.withdrawJobs}${payload.id}` })
        // }
        const res = await this.$api.patch(`${inventoryServiceApi.withdrawJobs}${payload.id}`, payload)
        this.withdrawJob = res.data
        this.originalWithdrawJob = { ...this.withdrawJob }
      } catch (error) {
        throw error
        // if (globalStore.appIsOffline) {
        //   return
        // } else {
        //   throw error
        // }
      }
    },
    async deleteWithdrawJob (jobId) {
      try {
        await this.$api.delete(`${inventoryServiceApi.withdrawJobs}${jobId}`)
        this.resetWithdrawStore()
      } catch (error) {
        throw error
      }
    },
    async deleteWithdrawJobItems (payload) {
      try {
        // if (globalStore.appIsOffline) {
        //   // this will only occur when user reverts to queue when offline
        //   navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.refileJobs}${this.refileJob.id}/remove_items` })
        // }
        const res = await this.$api.delete(`${inventoryServiceApi.withdrawJobs}${this.withdrawJob.id}/remove_items`, { data: payload })
        this.withdrawJob = res.data
        this.originalWithdrawJob = { ...this.withdrawJob }
      } catch (error) {
        throw error
        // if (globalStore.appIsOffline) {
        //   return
        // } else {
        //   throw error
        // }
      }
    }
  }
})
