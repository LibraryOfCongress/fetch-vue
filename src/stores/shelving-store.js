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
    originalShelvingJob: null,
    directToShelfJob: {
      shelf_id: null,
      barcode: {
        value: ''
      },
      user: {
        name: ''
      },
      user_id: null,
      create_dt: new Date().toLocaleDateString(),
      containers : []
    },
    shelvingJobContainer: {
      item_id: null,
      barcode: {
        value: ''
      },
      module_id: null,
      aisle_id: null,
      side_id: null,
      ladder_id: null,
      shelf_id: null,
      shelf_position_id: null,
      verified: false
    }
  }),
  getters: {
    allContainersShelved: (state) => {
      if (state.shelvingJob.status !== 'Created') {
        return state.shelvingJob.containers.some(c => !c.verified) ? false : true
      } else {
        return true
      }
    }
  },
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
    resetShelvingJobContainer () {
      this.shelvingJobContainer = {
        item_id: null,
        barcode: {
          value: ''
        },
        module_id: null,
        aisle_id: null,
        side_id: null,
        ladder_id: null,
        shelf_id: null,
        shelf_position_id: null,
        verified: false
      }
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
              building_id: 1,
              size_class_id: 2,
              module_id: 3,
              aisle_id: 56,
              side_id: 'left',
              ladder_id: 12,
              shelf_id: 7,
              shelf_position_id: 6
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
              building_id: 1,
              size_class_id: 2,
              module_id: 3,
              aisle_id: 56,
              side_id: 'left',
              ladder_id: 12,
              shelf_id: 7,
              shelf_position_id: 6
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
              building_id: 1,
              size_class_id: 2,
              module_id: 3,
              aisle_id: 56,
              side_id: 'left',
              ladder_id: 12,
              shelf_id: 7,
              shelf_position_id: 6
            }
          ]
        }
      } catch (error) {
        throw error
      }
    },
    getShelvingJobContainer (barcode_value) {
      // find the container with the matching barcode_value and set the data as the shelvingJobContainer
      this.shelvingJobContainer = this.shelvingJob.containers.find(container => container.barcode.value == barcode_value)
    },
    async patchShelvingJobContainer (payload) {
      try {
        // TODO wire up shelving job container detail endpoint to patch data
        // const res = await this.$api.patch(`${inventoryServiceApi.shelvingJobs}${payload.item_id}`, payload)
        // this.shelvingJobContainer = res.data
        this.shelvingJobContainer = {
          ...this.shelvingJobContainer,
          ...payload
        }

        // update the container at the shelving job level as well
        // this.shelvingJob.containers[this.shelvingJob.containers.findIndex(container => container.item_id == payload.item_id)] = res.data
        // TODO: replace and uncomment ^ once api is wired up
        this.shelvingJob.containers[this.shelvingJob.containers.findIndex(container => container.item_id == payload.item_id)] = this.shelvingJobContainer
        this.originalShelvingJob = { ...this.shelvingJob }
      } catch (error) {
        throw error
      }
    }
  }
})
