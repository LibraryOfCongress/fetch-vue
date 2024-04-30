import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js'

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
    async getRequestJobList () {
      try {
        // TODO setup api endpoint to get request job list
        // const res = await this.$api.get(inventoryServiceApi.shelvingJobs)
        // this.requestJobList = res.data.items
        this.requestJobList = [
          {
            id: 'RID-1234567',
            barcode: {
              value: 'RS123456'
            },
            create_dt: new Date().toISOString(),
            delivery_location: 'Capitol Hill',
            external_request_id: '09123456',
            item_location: '57L120401',
            media_type: {
              name: 'Record Storage'
            },
            priority: 'Low',
            requestor_name: 'John Doe',
            status: 'On Hold',
            type: 'General Delivery'
          }
        ]
      } catch (error) {
        throw error
      }
    },
    async getRequestJob (id) {
      try {
        // TODO setup api endpoint to get request job details
        // const res = await this.$api.get(`${inventoryServiceApi.shelvingJobs}${id}`)
        // this.requestJob = res.data
        this.requestJob = {
          id,
          accession_dt: new Date().toISOString(),
          arrival_dt: new Date().toISOString(),
          barcode: {
            value: 'RS123456'
          },
          building: {
            name: 'Fort Meade'
          },
          create_dt: new Date().toISOString(),
          condition: 'Do Not Send',
          delivery_location: 'Capitol Hill',
          dimensions: '11.5" x 8.5 in.',
          external_request_id: '09123456',
          item_location: '57L120401',
          media_type: {
            name: 'Record Storage'
          },
          owner: {
            name: 'John Doe'
          },
          priority: 'Low',
          requestor_name: 'John Doe',
          status: 'On Hold',
          size_class: {
            name: 'RS'
          },
          title: 'Some Book Title',
          type: 'General Delivery',
          volume: 1,
          withdrawal_dt: new Date().toISOString()
        }
      } catch (error) {
        throw error
      }
    }
    // async postRequestJob (payload) {
    //   try {
    //     const res = await this.$api.post(inventoryServiceApi.shelvingJobs, payload, { params: qParams })
    //     this.requestJob = res.data
    //   } catch (error) {
    //     throw error
    //   }
    // },
  }
})
