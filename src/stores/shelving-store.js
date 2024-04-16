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
      id: null,
      barcode: {
        value: ''
      },
      user: {
        name: ''
      },
      user_id: null,
      owner: {
        name: ''
      },
      owner_id: null,
      size_class: {
        name: ''
      },
      size_class_id: null,
      create_dt: new Date().toLocaleDateString(),
      containers : []
    },
    shelvingJobContainer: {
      item_id: null,
      barcode: {
        value: ''
      },
      owner: {
        name: ''
      },
      owner_id: null,
      size_class: {
        name: ''
      },
      size_class_id: null,
      module_id: null,
      aisle_id: null,
      side_id: null,
      ladder_id: null,
      shelf_id: null,
      shelf_barcode: {
        value: ''
      },
      shelf_position_id: null,
      verified: false
    }
  }),
  getters: {
    allContainersShelved: (state) => {
      if (state.shelvingJob.id && state.shelvingJob.status !== 'Created') {
        // if were in a normal shelving job we can check the status to determine if containers need to be verfiied or not
        return state.shelvingJob.containers.some(c => !c.verified) ? false : true
      } else if (state.directToShelfJob.id) {
        // if were in a direct to shelving job we can check if ther is an id or temp id to determine if containers need to be verfiied or not
        return state.directToShelfJob.containers.length == 0 || state.directToShelfJob.containers.some(c => !c.verified) ? false : true
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
        owner: {
          name: ''
        },
        owner_id: null,
        size_class: {
          name: ''
        },
        size_class_id: null,
        module_id: null,
        aisle_id: null,
        side_id: null,
        ladder_id: null,
        shelf_id: null,
        shelf_barcode: {
          value: ''
        },
        shelf_position_id: null,
        verified: false
      }
    },
    async getShelfDetails (barcode_value) {
      try {
        // TODO: setup endpoint to get shelf details by barcode
        // const res = await this.$api.get(inventoryServiceApi.shelvingJobs)
        // if (this.directToShelfJob.id) {
        //   this.directToShelfJob = {
        //     ...this.directToShelfJob,
        //     res.data
        //   }
        // }
        this.directToShelfJob.barcode.value = barcode_value
        this.directToShelfJob.owner.name = 'John Doe'
      } catch (error) {
        throw error
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
          status: 'Created',
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
              shelf_barcode: {
                value: 'shelf1'
              },
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
              shelf_barcode: {
                value: 'shelf1'
              },
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
              shelf_barcode: {
                value: 'shelf1'
              },
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
              shelf_barcode: {
                value: 'shelf1'
              },
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
              shelf_barcode: {
                value: 'shelf1'
              },
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
              shelf_barcode: {
                value: 'shelf1'
              },
              shelf_position_id: 6
            }
          ]
        }
      } catch (error) {
        throw error
      }
    },
    async getDirectShelvingJob (id) {
      try {
        // TODO setup endpoint for getting direct to shelf jobs
        // const res = await this.$api.get(`${inventoryServiceApi.shelvingJobs}${id}`)
        // this.directToShelfJob = res.data
        return id
      } catch (error) {
        throw error
      }
    },
    async postDirectShelvingJob () {
      try {
        // TODO setup endpoint for creating a direct to shelf jobs
        // const res = await this.$api.post(inventoryServiceApi.shelvingJobs, payload)
        // this.directToShelfJob = res.data
        this.directToShelfJob = { ...this.directToShelfJob, id: 1 }
      } catch (error) {
        throw error
      }
    },
    async patchDirectShelvingJob (payload) {
      try {
        // TODO setup endpoint for patching data to a direct to shelf jobs
        // const res = await this.$api.patch(`${inventoryServiceApi.shelvingJobs}${payload.id}`, payload)
        // this.directToShelfJob = res.data
        return payload
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
