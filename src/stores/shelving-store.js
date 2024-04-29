import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'
import { useGlobalStore } from './global-store'
const globalStore = useGlobalStore()

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
      side_id: null,
      status: '',
      trays: [],
      non_tray_items: [],
      verification_jobs: []
    },
    originalShelvingJob: null,
    directToShelfJob: {
      id: null,
      shelf_barcode: {
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
      status: '',
      trays: [],
      non_tray_items: []
    },
    shelvingJobContainer: {
      id: null,
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
      shelf_position: {
        shelf_position_number: {
          number: null
        }
      },
      scanned_for_shelving: false
    }
  }),
  getters: {
    shelvingJobContainers: (state) => {
      let containerList = []
      if (state.shelvingJob.id) {
        containerList = containerList.concat(state.shelvingJob.trays, state.shelvingJob.non_tray_items)
      } else if (state.directToShelfJob.id) {
        containerList = containerList.concat(state.directToShelfJob.trays, state.directToShelfJob.non_tray_items)
      }
      // return the list sorted alphnumerically
      return containerList.sort(new Intl.Collator('en', { numeric:true, sensitivity:'accent' }).compare)
    },
    allContainersShelved: (state) => {
      if (state.shelvingJob.id && state.shelvingJob.status !== 'Created') {
        // if were in a normal shelving job we can check the status to determine if containers need to be verfiied or not
        return state.shelvingJobContainers.some(c => !c.scanned_for_shelving) ? false : true
      } else if (state.directToShelfJob.id) {
        // if were in a direct to shelving job we can check if there is an id to determine if containers need to be verfiied or not
        return state.shelvingJobContainers.length == 0 || state.shelvingJobContainers.some(c => !c.scanned_for_shelving) ? false : true
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
        side_id: null,
        status: '',
        verification_jobs: [],
        trays: [],
        non_tray_items: []
      }
      this.originalShelvingJob = null
    },
    resetShelvingJobContainer () {
      this.shelvingJobContainer = {
        id: null,
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
        shelf_position: {
          shelf_position_number: {
            number: null
          }
        },
        scanned_for_shelving: false
      }
    },
    async getShelfByBarcode (barcode_value) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.shelvesBarcode}${barcode_value}`)
        if (this.directToShelfJob.id) {
          this.directToShelfJob = {
            ...this.directToShelfJob,
            shelf_barcode: res.data.barcode,
            owner: res.data.owner,
            size_class: res.data.size_class
          }
        }
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
        if (globalStore.appIsOffline) {
          // this will only occur when user is pausing/resuming when offline
          navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.shelvingJobs}${payload.id}` })
        }
        const res = await this.$api.patch(`${inventoryServiceApi.shelvingJobs}${payload.id}`, payload)
        this.shelvingJob = res.data
        this.originalShelvingJob = { ...res.data }
      } catch (error) {
        if (globalStore.appIsOffline) {
          return
        } else {
          throw error
        }
      }
    },
    async getDirectShelvingJob (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.shelvingJobs}${id}`)
        this.directToShelfJob = { ...this.directToShelfJob, ...res.data }
      } catch (error) {
        throw error
      }
    },
    async postDirectShelvingJob (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.shelvingJobs, payload)
        this.directToShelfJob = { ...this.directToShelfJob, ...res.data }
      } catch (error) {
        throw error
      }
    },
    async patchDirectShelvingJob (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.shelvingJobs}${payload.id}`, payload)
        this.directToShelfJob = { ...this.directToShelfJob, ...res.data }
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
        if (globalStore.appIsOffline) {
          navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.shelvingJobs}${payload.job_id}/reassign-container-location` })
        }
        const res = await this.$api.post(`${inventoryServiceApi.shelvingJobs}${payload.job_id}/reassign-container-location`, payload)
        this.shelvingJobContainer.shelf_position_id = res.data.shelf_position_id
        this.shelvingJobContainer.shelf_position.shelf_position_number.number = payload.shelf_position_number
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
        if (globalStore.appIsOffline) {
          return
        } else {
          throw error
        }
      }
    },
    async postDirectShelvingJobContainer (payload) {
      try {
        if (globalStore.appIsOffline) {
          navigator.serviceWorker.controller.postMessage({ queueIncomingApiCall: `${inventoryServiceApi.shelvingJobs}${payload.job_id}/reassign-container-location` })
        }
        const res = await this.$api.post(`${inventoryServiceApi.shelvingJobs}${payload.job_id}/reassign-container-location`, payload)
        this.shelvingJobContainer = {
          ...this.shelvingJobContainer,
          ...res.data
        }

        // update the containers at the direct shelving job level and add the new container
        if (this.shelvingJobContainer.container_type?.type == 'Tray') {
          this.directToShelfJob.trays = [
            ...this.directToShelfJob.trays,
            this.shelvingJobContainer
          ]
        } else {
          this.directToShelfJob.non_tray_items = [
            ...this.directToShelfJob.non_tray_items,
            this.shelvingJobContainer
          ]
        }
      } catch (error) {
        if (globalStore.appIsOffline) {
          return
        } else {
          throw error
        }
      }
    }
  }
})
