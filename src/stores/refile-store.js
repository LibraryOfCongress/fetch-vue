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
              id: 1,
              scanned_for_refile: false,
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
                'tray': {
                  'id': 116,
                  'barcode': {
                    'id': 'f67155f3-7651-4f10-93b9-512bd45abd08',
                    'value': 'EL999999',
                    'type_id': 2,
                    'create_dt': '2024-06-10T13:55:34.519678',
                    'update_dt': '2024-06-10T13:55:34.519651'
                  },
                  'shelf_position': {
                    'id': 121,
                    'shelf_id': 16,
                    'shelf_position_number': {
                      'number': 1
                    },
                    'shelf': {
                      'id': 16,
                      'shelf_number': {
                        'id': 8,
                        'number': 8
                      },
                      'ladder': {
                        'id': 2,
                        'ladder_number': {
                          'number': 2
                        },
                        'side': {
                          'id': 1,
                          'aisle': {
                            'id': 1,
                            'aisle_number': {
                              'number': 1
                            },
                            'module': {
                              'id': 1,
                              'module_number': {
                                'number': 1
                              },
                              'building': {
                                'id': 1,
                                'name': 'Fort Meade'
                              }
                            },
                            'building': null
                          },
                          'side_orientation': {
                            'id': 1,
                            'name': 'Left'
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            {
              id: 2,
              scanned_for_refile: false,
              non_tray_item: {
                barcode: {
                  value: 12345678902
                },
                owner: {
                  name: 'John Doe'
                },
                size_class: {
                  name: 'C Low'
                },
                'shelf_position': {
                  'id': 313,
                  'shelf_id': 40,
                  'shelf_position_number': {
                    'number': 1
                  },
                  'shelf': {
                    'id': 40,
                    'barcode': {
                      'value': 112066
                    },
                    'shelf_number': {
                      'id': 8,
                      'number': 8
                    },
                    'ladder': {
                      'id': 5,
                      'ladder_number': {
                        'number': 5
                      },
                      'side': {
                        'id': 1,
                        'aisle': {
                          'id': 1,
                          'aisle_number': {
                            'number': 1
                          },
                          'module': {
                            'id': 1,
                            'module_number': {
                              'number': 1
                            },
                            'building': {
                              'id': 1,
                              'name': 'Fort Meade'
                            }
                          },
                          'building': null
                        },
                        'side_orientation': {
                          'id': 1,
                          'name': 'Left'
                        }
                      }
                    }
                  }
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
    async patchRefileJob (payload) {
      try {
        // if (globalStore.appIsOffline) {
        //   // this will only occur when user is pausing/resuming when offline
        //   navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.picklists}${payload.id}` })
        // }
        // const res = await this.$api.patch(`${inventoryServiceApi.refile}${payload.id}`, payload)
        // this.refileJob = res.data
        //TODO remove once api is setup
        this.refileJob = {
          ...this.refileJob,
          status: payload.status
        }
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
    getRefileJobItem (itemId) {
      // find the item with the matching id and set the data as the refileItem
      this.refileItem = this.refileJob.refile_items.find(itm => itm.id == itemId)
    },
    async deleteRefileJobItem (itemId) {
      try {
        console.log('delete item', itemId)
        // if (globalStore.appIsOffline) {
        //   // this will only occur when user reverts to queue when offline
        //   navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.picklists}${this.picklistJob.id}/remove_request/${itemId}` })
        // }
        // const res = await this.$api.delete(`${inventoryServiceApi.refile}${this.refileJob.id}/remove_item/${itemId}`)
        // this.refileJob = res.data
        // this.originalRefileJob = { ...this.refileJob }
      } catch (error) {
        throw error
        // if (globalStore.appIsOffline) {
        //   return
        // } else {
        //   throw error
        // }
      }
    },
    async patchRefileJobItemScanned (payload) {
      try {
        // if (globalStore.appIsOffline) {
        //   // this will only occur when user is scanning when offline
        //   navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.picklists}${payload.id}/update_request/${payload.request_id}` })
        // }
        // updates a refile job item and marks it as refiled
        // const res = await this.$api.patch(`${inventoryServiceApi.refile}${payload.job_id}/update_refile/${payload.item_id}`, payload)
        // this.refileJob = res.data
        // this.originalRefileJob = { ...this.refileJob }
        console.log('updating refile item status', payload)
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
