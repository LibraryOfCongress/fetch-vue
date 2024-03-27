import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useShelvingStore = defineStore('shelving-store', {
  state: () => ({
    shelvingJobList: [],
    shelvingJob: {
      id: null,
      building: null,
      assigned_user: null,
      assigned_user_id: null,
      create_dt: null,
      status: '',
      containers: []
    }
  }),
  actions: {
    resetShelvingStore () {
      this.$reset()
    },
    async getShelvingJobList () {
      try {
        const res = await this.$api.get(inventoryServiceApi.shelvingJobs)
        this.shelvingJobList = res.data.items
      } catch (error) {
        throw error
      }
    },
    async getShelvingJob () {
      try {
        // TODO wire up shelving job detail endpoint
        // const res = await this.$api.get(inventoryServiceApi.shelvingJobs)
        // this.shelvingJobList = res.data.items
        this.shelvingJob = {
          id: 123456789,
          building: {
            name: 'Fort Meade'
          },
          assigned_user: {
            name: 'User1'
          },
          assigned_user_id: 1,
          create_dt: new Date().toLocaleDateString(),
          status: 'In Progress',
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
              size_class_id: 2,
              module: 6,
              aisle: 56,
              side: 'Left',
              ladder: '12A',
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
              module: null,
              aisle: null,
              side: null,
              ladder: null,
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
