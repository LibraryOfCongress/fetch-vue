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
      side_id: '',
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
    shelvingJobContainers: (state) => {
      let containerList = []
      if (state.shelvingJob.id) {
        containerList = containerList.concat(state.shelvingJob.trays, state.shelvingJob.non_tray_items)
      }
      // return the list sorted alphnumerically
      return containerList.sort(new Intl.Collator('en', { numeric:true, sensitivity:'accent' }).compare)
    },
    allContainersShelved: (state) => {
      if (state.shelvingJob.id && state.shelvingJob.status !== 'Created') {
        // if were in a normal shelving job we can check the status to determine if containers need to be verfiied or not
        console.log(state, state.shelvingJobContainers)
        return state.shelvingJobContainers.some(c => !c.verified) ? false : true
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
        side_id: '',
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
    async getShelfByBarcode (barcode_value) {
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
        this.shelvingJob = res.data
        this.originalShelvingJob = { ...this.shelvingJob }
      } catch (error) {
        throw error
      }
    },
    async postShelvingJob (payload, qParams) {
      try {
        const res = await this.$api.post(inventoryServiceApi.shelvingJobs, payload, { params: qParams })
        this.shelvingJob = res.data
        this.originalShelvingJob = { ...this.shelvingJob }
      } catch (error) {
        throw error
      }
    },
    async patchShelvingJob (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.shelvingJobs}${payload.id}`, payload)
        this.shelvingJob = res.data
        this.originalShelvingJob = { ...res.data }
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
      this.shelvingJobContainer = this.shelvingJobContainers.find(container => container.barcode.value == barcode_value)
    },
    async postShelvingJobContainer (payload) {
      try {
        // TODO wire up shelving job container detail endpoint to patch data
        const res = await this.$api.patch(`${inventoryServiceApi.shelvingJobs}${payload.container_id}/reassign-container-location`, payload)
        this.shelvingJobContainer = {
          ...this.shelvingJobContainer,
          ...res.data
        }

        // update the container at the shelving job level as well
        if (payload.trayed) {
          this.shelvingJob.trays[this.shelvingJob.trays.findIndex(container => container.id == payload.container_id)] = this.shelvingJobContainer
        } else {
          this.shelvingJob.non_tray_items[this.shelvingJob.non_tray_items.findIndex(container => container.id == payload.container_id)] = this.shelvingJobContainer
        }
        this.originalShelvingJob = { ...this.shelvingJob }
      } catch (error) {
        throw error
      }
    }
  }
})
