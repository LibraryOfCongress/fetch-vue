import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

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
        return state.picklistJob.requests.some(itm => !itm.scanned_for_retrieval) ? false : true
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
        // this.picklistJobList = [
        //   {
        //     id: 1234567890,
        //     request_items: 3,
        //     status: 'Created',
        //     user: {
        //       name: 'Admin'
        //     },
        //     create_dt: new Date().toISOString()
        //   },
        //   {
        //     id: 1234567899,
        //     request_items: 6,
        //     status: 'New',
        //     user: null,
        //     create_dt: new Date().toISOString()
        //   },
        //   {
        //     id: 1234567891,
        //     request_items: 3,
        //     status: 'Completed',
        //     user: {
        //       first_name: 'Admin'
        //     },
        //     create_dt: new Date().toISOString(),
        //     complete_dt: new Date().toISOString()
        //   }
        // ]
      } catch (error) {
        throw error
      }
    },
    async getPicklistJob (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.picklists}${id}`)
        this.picklistJob = res.data
        // this.picklistJob = {
        //   id,
        //   building: {
        //     name: 'Fort Meade'
        //   },
        //   user: {
        //     first_name: 'Admin'
        //   },
        //   user_id: 1,
        //   create_dt: new Date().toISOString(),
        //   status: 'Created',
        //   requests: [
        //     {
        //       id: 1234567890,
        //       barcode: {
        //         value: 1234567890
        //       },
        //       owner: {
        //         name: 'John Doe'
        //       },
        //       size_class: {
        //         name: 'C High'
        //       },
        //       scanned_for_retrieval: false,
        //       'shelf_position': {
        //         'id': 25949,
        //         'shelf_id': 8650,
        //         'shelf_position_number': {
        //           'number': 2
        //         },
        //         'shelf': {
        //           'id': 8650,
        //           'ladder': {
        //             'id': 4325,
        //             'ladder_number': {
        //               'number': 31
        //             },
        //             'side': {
        //               'id': 114,
        //               'aisle': {
        //                 'id': 24,
        //                 'aisle_number': {
        //                   'number': 4
        //                 },
        //                 'module': {
        //                   'id': 3,
        //                   'module_number': {
        //                     'number': 3
        //                   },
        //                   'building': {
        //                     'id': 1,
        //                     'name': 'Fort Meade'
        //                   }
        //                 },
        //                 'building': null
        //               },
        //               'side_orientation': {
        //                 'id': 2,
        //                 'name': 'Right'
        //               }
        //             }
        //           }
        //         }
        //       }
        //     }
        //   ]
        // }
        this.originalPicklistJob = { ...this.picklistJob }
      } catch (error) {
        throw error
      }
    },
    async postPicklistJob (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.picklists, payload)
        this.picklistJob = res.data
        // this.picklistJob = {
        //   id: 123456789,
        //   building: {
        //     name: 'Fort Meade'
        //   },
        //   user: {
        //     first_name: 'Admin'
        //   },
        //   user_id: 1,
        //   create_dt: new Date().toISOString(),
        //   status: 'Created',
        //   requests: [
        //     {
        //       id: 1234567890,
        //       barcode: {
        //         value: 1234567890
        //       },
        //       owner: {
        //         name: 'John Doe'
        //       },
        //       size_class: {
        //         name: 'C High'
        //       },
        //       scanned_for_retrieval: false,
        //       'shelf_position': {
        //         'id': 25949,
        //         'shelf_id': 8650,
        //         'shelf_position_number': {
        //           'number': 2
        //         },
        //         'shelf': {
        //           'id': 8650,
        //           'ladder': {
        //             'id': 4325,
        //             'ladder_number': {
        //               'number': 31
        //             },
        //             'side': {
        //               'id': 114,
        //               'aisle': {
        //                 'id': 24,
        //                 'aisle_number': {
        //                   'number': 4
        //                 },
        //                 'module': {
        //                   'id': 3,
        //                   'module_number': {
        //                     'number': 3
        //                   },
        //                   'building': {
        //                     'id': 1,
        //                     'name': 'Fort Meade'
        //                   }
        //                 },
        //                 'building': null
        //               },
        //               'side_orientation': {
        //                 'id': 2,
        //                 'name': 'Right'
        //               }
        //             }
        //           }
        //         }
        //       }
        //     }
        //   ]
        // }
        this.originalPicklistJob = { ...this.picklistJob }
      } catch (error) {
        throw error
      }
    },
    async patchPicklistJob (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.picklists}${payload.id}`, payload)
        this.picklistJob = res.data
        // this.picklistJob = {
        //   ...this.picklistJob,
        //   ...payload
        // }
        this.originalPicklistJob = { ...this.picklistJob }
      } catch (error) {
        throw error
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
    async deletePicklistJobItem (itemId) {
      try {
        const res = await this.$api.delete(`${inventoryServiceApi.picklists}${this.picklistJob.id}/remove_request/${itemId}`)
        this.picklistJob = res.data
        // this.picklistJob = {
        //   ...this.picklistJob,
        //   requests: this.picklistJob.requests.filter(itm => itm.id !== itemId)
        // }
        this.originalPicklistJob = { ...this.picklistJob }
      } catch (error) {
        throw error
      }
    }
  }
})
