import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js'

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
      items: []
    }
  }),
  actions: {
    resetPicklistStore () {
      this.$reset()
    },
    async getPicklistJobList () {
      try {
        // TODO: setup picklist endpoints to get picklist jobs
        // const res = await this.$api.get(inventoryServiceApi.picklist)
        // this.picklistJobList = res.data.items
        this.picklistJobList = [
          {
            id: 1234567890,
            request_items: 3,
            status: 'Created',
            user: {
              name: 'Admin'
            },
            create_dt: new Date().toISOString()
          },
          {
            id: 1234567899,
            request_items: 6,
            status: 'New',
            user: null,
            create_dt: new Date().toISOString()
          },
          {
            id: 1234567891,
            request_items: 3,
            status: 'Completed',
            user: {
              name: 'Admin'
            },
            create_dt: new Date().toISOString(),
            complete_dt: new Date().toISOString()
          }
        ]
      } catch (error) {
        throw error
      }
    },
    async getPicklistJob (id) {
      try {
        // TODO: setup picklist endpoint to get picklist job
        // const res = await this.$api.get(`${inventoryServiceApi.picklist}${id}`)
        // this.picklistJob = res.data
        this.picklistJob = {
          id,
          building: {
            name: 'Fort Meade'
          },
          user: {
            name: 'Admin'
          },
          user_id: 1,
          create_dt: new Date().toISOString(),
          status: 'Created',
          items: [
            {
              id: 1234567890,
              barcode: {
                value: 1234567890
              },
              owner: {
                name: 'John Doe'
              },
              size_class: {
                name: 'C High'
              },
              'shelf_position': {
                'id': 25949,
                'shelf_id': 8650,
                'shelf_position_number': {
                  'number': 2
                },
                'shelf': {
                  'id': 8650,
                  'ladder': {
                    'id': 4325,
                    'ladder_number': {
                      'number': 31
                    },
                    'side': {
                      'id': 114,
                      'aisle': {
                        'id': 24,
                        'aisle_number': {
                          'number': 4
                        },
                        'module': {
                          'id': 3,
                          'module_number': {
                            'number': 3
                          },
                          'building': {
                            'id': 1,
                            'name': 'Fort Meade'
                          }
                        },
                        'building': null
                      },
                      'side_orientation': {
                        'id': 2,
                        'name': 'Right'
                      }
                    }
                  }
                }
              }
            }
          ]
        }
      } catch (error) {
        throw error
      }
    },
    async patchPicklistJob (payload) {
      try {
        // TODO: setup picklist endpoint to update picklist job
        // const res = await this.$api.patch(`${inventoryServiceApi.picklist}${payload.id}`, payload)
        // this.picklistJob = res.data
        this.picklistJob = {
          ...this.picklistJob,
          ...payload
        }
      } catch (error) {
        throw error
      }
    }
  }
})
