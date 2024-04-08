import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useShelvingStore = defineStore('shelving-store', {
  state: () => ({
    shelvingJobList: [],
    shelvingJob: {
      type: null,
      assignLocation: false,
      id: null,
      aisle_id: null,
      user: {
        name: ''
      },
      user_id: null,
      building_id: null,
      building: null,
      create_dt: null,
      containers: [],
      ladder_id: null,
      module_id: null,
      side_id: 'left',
      status: '',
      verification_job_id: null
    },
    originalShelvingJob: null
  }),
  actions: {
    resetShelvingStore () {
      this.$reset()
    },
    resetShelvingJob () {
      this.shelvingJob = {
        type: null,
        assignLocation: false,
        id: null,
        aisle_id: null,
        user: {
          name: ''
        },
        user_id: null,
        building_id: null,
        building: null,
        create_dt: null,
        containers: [],
        ladder_id: null,
        module_id: null,
        side_id: 'left',
        status: '',
        verification_job_id: null
      }
      this.originalShelvingJob = null
    },
    async getShelvingJobList () {
      try {
        const res = await this.$api.get(inventoryServiceApi.shelvingJobs)
        this.shelvingJobList = res.data.items
      } catch (error) {
        throw error
      }
    },
    async getShelvingJob (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.shelvingJobs}${id}`)
        this.shelvingJob = {
          //TODO: remove the hardcoded data once shelving job endpoint returns the correct data
          id,
          building: {
            name: 'Fort Meade'
          },
          user: {
            name: 'User1'
          },
          user_id: 1,
          create_dt: new Date().toLocaleDateString(),
          status: 'Ready For Shelving',
          containers: [
            {
              item_id: 1,
              barcode: {
                value: 'DH120987'
              },
              owner: {
                name: 'John Doe'
              },
              owner_id: 1,
              size_class: {
                name: 'C High'
              },
              building_id: 1,
              size_class_id: 2,
              module_id: 3,
              aisle_id: 56,
              side_id: 'left',
              ladder_id: 12,
              shelf_id: 7,
              shelf_position_id: 5
            },
            {
              item_id: 2,
              barcode: {
                value: 'DH120999'
              },
              owner: {
                name: 'Harry Potter'
              },
              owner_id: 1,
              size_class: {
                name: 'C Low'
              },
              size_class_id: 2,
              module_id: null,
              aisle_id: null,
              side_id: null,
              ladder_id: null,
              shelf_id: null,
              shelf_position_id: null
            }
          ],
          ...res.data
        }
        this.originalShelvingJob = { ...this.shelvingJob }
      } catch (error) {
        throw error
      }
    },
    async postShelvingJob (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.shelvingJobs, payload)
        this.shelvingJob = {
          // TODO remove hardcoded data once shelving data from api is correct
          building: {
            name: 'Fort Meade'
          },
          user: {
            name: 'User1'
          },
          user_id: 1,
          create_dt: new Date().toLocaleDateString(),
          status: payload.status,
          containers: [
            {
              item_id: 1,
              barcode: {
                value: 'DH120987'
              },
              owner: {
                name: 'John Doe'
              },
              owner_id: 1,
              size_class: {
                name: 'C High'
              },
              building_id: 1,
              size_class_id: 2,
              module_id: 3,
              aisle_id: 56,
              side_id: 'left',
              ladder_id: 12,
              shelf_id: 7,
              shelf_position_id: 5
            },
            {
              item_id: 2,
              barcode: {
                value: 'DH120999'
              },
              owner: {
                name: 'Harry Potter'
              },
              owner_id: 1,
              size_class: {
                name: 'C Low'
              },
              size_class_id: 2,
              module_id: null,
              aisle_id: null,
              side_id: null,
              ladder_id: null,
              shelf_id: null,
              shelf_position_id: null
            }
          ],
          ...res.data
        }
        this.originalShelvingJob = { ...this.shelvingJob }
      } catch (error) {
        throw error
      }
    },
    async patchShelvingJob (payload) {
      try {
        // TODO wire up shelving job detail endpoint to patch data
        // const res = await this.$api.patch(`${inventoryServiceApi.shelvingJobs}${payload.id}`, payload)
        // this.shelvingJob = res.data
        // this.originalShelvingJob = { ...res.data }
        this.shelvingJob = {
          id: payload.id,
          building: {
            name: 'Fort Meade'
          },
          user: {
            name: 'User1'
          },
          user_id: 1,
          create_dt: new Date().toLocaleDateString(),
          status: payload.status,
          containers: [
            {
              item_id: 1,
              barcode: {
                value: 'DH120987'
              },
              owner: {
                name: 'John Doe'
              },
              owner_id: 1,
              size_class: {
                name: 'C High'
              },
              building_id: 1,
              size_class_id: 2,
              module_id: 3,
              aisle_id: 56,
              side_id: 'left',
              ladder_id: 12,
              shelf_id: 7,
              shelf_position_id: 5
            },
            {
              item_id: 2,
              barcode: {
                value: 'DH120999'
              },
              owner: {
                name: 'Harry Potter'
              },
              owner_id: 1,
              size_class: {
                name: 'C Low'
              },
              size_class_id: 2,
              module_id: null,
              aisle_id: null,
              side_id: null,
              ladder_id: null,
              shelf_id: null,
              shelf_position_id: null
            }
          ]
        }
      } catch (error) {
        throw error
      }
    }
  }
})
