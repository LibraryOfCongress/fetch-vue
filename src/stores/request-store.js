import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useRequestStore = defineStore('request-store', {
  state: () => ({
    requestJobList: [],
    requestJob: {
      id: null,
      accession_dt: null,
      arrival_dt: null,
      barcode: {
        value: null
      },
      building: {
        name: ''
      },
      create_dt: null,
      condition: null,
      delivery_location: null,
      dimensions: null,
      external_request_id: null,
      item_location: null,
      media_type: {
        name: ''
      },
      owner: {
        name: ''
      },
      priority: null,
      requestor_name: null,
      status: null,
      size_class: {
        name: ''
      },
      type: null,
      withdrawal_dt: null
    },
    requestBatchJob: {
      id: null,
      import_source: null,
      request_count: null,
      status: null,
      uploaded_by: null,
      import_dt: null,
      items: []
    }
  }),
  actions: {
    resetRequestStore () {
      this.$reset()
    },
    resetRequestJob () {
      this.requestJob = {
        id: null,
        accession_dt: null,
        arrival_dt: null,
        barcode: {
          value: null
        },
        building: {
          name: ''
        },
        create_dt: null,
        condition: null,
        delivery_location: null,
        dimensions: null,
        external_request_id: null,
        item_location: null,
        media_type: {
          name: ''
        },
        owner: {
          name: ''
        },
        priority: null,
        requestor_name: null,
        status: null,
        size_class: {
          name: ''
        },
        type: null,
        withdrawal_dt: null
      }
    },
    async getRequestJobList (paramsObj) {
      try {
        const res = await this.$api.get(inventoryServiceApi.requests, { params: paramsObj })
        this.requestJobList = res.data.items
      } catch (error) {
        throw error
      }
    },
    async getRequestJob (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.requests}${id}`)
        this.requestJob = res.data
      } catch (error) {
        throw error
      }
    },
    async postRequestJob (payload) {
      try {
        await this.$api.post(inventoryServiceApi.requests, payload)
        // refresh the requestJobList using request view filter since this endpoint only triggers from the request view tab
        await this.getRequestJobList()
      } catch (error) {
        throw error
      }
    },
    async patchRequestJob (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.requests}${payload.id}`, payload)
        this.requestJob = res.data
      } catch (error) {
        throw error
      }
    },
    async getRequestBatchJobList (paramsObj) {
      try {
        // TODO setup api endpoint to get request batch job list
        // this.requestJobList = []
        console.log('filter batch jobs by building', paramsObj)
        this.requestJobList = [
          {
            id: 1,
            import_source: 'Bulk Upload',
            request_count: 2,
            status: 'New',
            uploaded_by: 'User1',
            import_dt: new Date().toISOString()
          }
        ]
      } catch (error) {
        throw error
      }
    },
    async getRequestBatchJob (id) {
      try {
        // TODO setup api endpoint to get request batch job details
        // const res = await this.$api.get(`${inventoryServiceApi.requests}${id}`)
        // this.requestBatchJob  = res.data
        this.requestBatchJob = {
          id,
          import_source: 'Bulk Upload',
          request_count: 2,
          status: 'New',
          uploaded_by: 'User1',
          import_dt: new Date().toISOString(),
          items: [
            {
              'id': 14,
              'request_type_id': 1,
              'item_id': 1,
              'non_tray_item_id': null,
              'delivery_location_id': 1,
              'priority_id': 1,
              'external_request_id': '1234',
              'requestor_name': 'admin',
              'item': {
                'id': 1,
                'title': 'Lord of The Ringss',
                'volume': 'I',
                'condition': 'Good',
                'size_class': {
                  'id': 3,
                  'name': 'Record Storage Box',
                  'short_name': 'RS'
                },
                'owner': {
                  'id': 4,
                  'name': 'Collections & Management'
                },
                'accession_dt': '2024-05-14T20:48:04.953000',
                'withdrawal_dt': '2024-05-14T20:48:04.953000',
                'status': 'In',
                'media_type': {
                  'id': 2,
                  'name': 'Sheet Music'
                },
                'barcode': {
                  'id': 'ca2bbd83-e4b5-44d3-b0b7-b34ef60ee8c4',
                  'value': 'RSBK1',
                  'type_id': 1,
                  'create_dt': '2024-05-14T20:37:41.486897',
                  'update_dt': '2024-05-14T20:37:41.486883'
                },
                'tray': {
                  'id': 1,
                  'barcode': {
                    'id': 'c783c1ff-68d4-45a2-ae5f-833666920440',
                    'value': 'RS1',
                    'type_id': 1,
                    'create_dt': '2024-05-14T20:37:41.486897',
                    'update_dt': '2024-05-14T20:37:41.486883'
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
              },
              'non_tray_item': null,
              'priority': {
                'id': 1,
                'value': 'Low'
              },
              'delivery_location': {
                'id': 1,
                'name': 'Senator Ron McRonderson',
                'address': '1 Imaginary St, Washington D.C. 20001'
              },
              'request_type': {
                'id': 1,
                'type': 'General Delivery'
              },
              'create_dt': '2024-05-14T21:46:36.381890',
              'update_dt': '2024-05-14T21:46:36.381907'
            }
          ]
        }
      } catch (error) {
        throw error
      }
    }
  }
})
