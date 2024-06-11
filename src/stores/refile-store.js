import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useRefileStore = defineStore('refile-store', {
  state: () => ({
    refileJobList: [],
    refileJob: {
      id: null
    },
    originalRefileJob: {
      id: null
    },
    refileItem: {
      id: null,
      barcode: {
        value: null
      },
      owner: null
    }
  }),
  getters: {
    allItemsRefiled: (state) => {
      if (state.refileJob.id && state.refileJob.status !== 'Created') {
        // if were in a running refile job, we check that items exist and none of the items are pending refile state
        return state.refileJob.refile_items.length == 0 || state.refileJob.refile_items.some(itm => !itm.scanned_for_refile) ? false : true
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
        // TODO setup api endpoint to get refile job list
        // this.refileJobList = []
        this.refileJobList = [
          {
            id: 123,
            items_count: 18,
            shelved_count: 3,
            user: {
              first_name: 'Admin'
            },
            create_dt: new Date().toISOString(),
            last_transition: new Date().toISOString()
          },
          {
            id: 124,
            items_count: 10,
            shelved_count: 4,
            user: {
              first_name: 'Admin'
            },
            create_dt: new Date().toISOString(),
            last_transition: new Date().toISOString()
          }
        ]
      } catch (error) {
        throw error
      }
    },
    async getRefileQueueList () {
      try {
        // TODO setup api endpoint to get refile queue list
        // this.refileJobList = []
        this.refileJobList = [
          {
            barcode: {
              value: 12345678901
            },
            owner: {
              name: 'John Doe'
            },
            module: {
              module_number: 1
            },
            aisle: {
              aisle_number: 56
            },
            container_type: 'Tray',
            size_class: {
              name: 'C High'
            },
            media_type: {
              name: 'Book'
            },
            user: {
              first_name: 'Admin'
            },
            create_dt: new Date().toISOString()
          }
        ]
      } catch (error) {
        throw error
      }
    },
    async getRefileJob (id) {
      try {
        // const res = await this.$api.get(`${inventoryServiceApi.refile}${id}`)
        // this.refileJob = res.data
        this.refileJob = {
          id,
          user: {
            first_name: 'Admin'
          },
          create_dt: new Date().toISOString(),
          status: 'Created',
          refile_items: [
            {
              item: {
                barcode: {
                  value: 12345678901
                },
                owner: {
                  name: 'John Doe'
                },
                size_class: {
                  name: 'C High'
                },
                tray: {
                  barcode: {
                    value: 'RS123456'
                  }
                }
              }
            },
            {
              non_tray_item: {
                barcode: {
                  value: 12345678902
                },
                owner: {
                  name: 'John Doe'
                },
                size_class: {
                  name: 'C Low'
                }
              }
            }
          ]
        }
        this.originalRefileJob = { ...this.refileJob }
      } catch (error) {
        throw error
      }
    },
    async postRefileJob (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.refile, payload)
        this.refileJob = res.data
      } catch (error) {
        throw error
      }
    },
    async postRefileQueueItem (payload) {
      try {
        // TODO figure out endpoint to handle adding items to refile queue
        // const res = await this.$api.post(inventoryServiceApi.refile, payload)
        // this.refileItem = res.data
        this.refileItem = {
          id: 1,
          barcode: {
            value: payload.barcode_value
          },
          owner: {
            name: 'John Doe'
          }
        }
      } catch (error) {
        throw error
      }
    }
  }
})
