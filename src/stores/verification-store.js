import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js';

export const useVerificationStore = defineStore('verification', {
  state: () => ({
    verificationJob: {
      id: null,
      type: null,
      owner: null,
      container_size: null,
      media_type: null,
      status: ''
    }
  }),
  actions: {
    resetVerificationStore () {
      this.$reset()
    },
    async getVerificationJobList () {
      try {
        // TODO: setup api call to retrieve all the verification jobs
        // const res = await this.$api.get(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        const res = {
          data: [
            {
              id: 1234567891,
              type: 1,
              owner: 'John Doe',
              container_size: 'B Low',
              media_type: 'Vinyl Recording',
              status: 'Paused'
            },
            {
              id: 1234567892,
              type: 2,
              owner: 'John Doe',
              container_size: 'A High',
              media_type: 'Vinyl Recording',
              status: 'Running'
            },
            {
              id: 1234567893,
              type: 1,
              owner: 'John Doe',
              container_size: 'B High',
              media_type: 'Vinyl Recording',
              status: 'In Queue'
            },
            {
              id: 1234567894,
              type: 2,
              owner: 'John Doe',
              container_size: 'A Low',
              media_type: 'Vinyl Recording',
              status: 'In Queue'
            }
          ]
        }
        return res
      } catch (error) {
        return error
      }
    },
    async getVerificationJob (id) {
      try {
        // TODO: setup api call to retrieve an verification job
        // const res = await this.$api.get(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        // this.verificationJob = res.data
        this.verificationJob = {
          ...this.verificationJob,
          status: 'Running',
          type: 2,
          id
        }
      } catch (error) {
        return error
      }
    }
  }
})
