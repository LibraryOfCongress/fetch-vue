import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useOptionStore = defineStore('options', {
  state: () => ({
    containerOptions: [
      {
        id: 1,
        name: 'A High'
      },
      {
        id: 2,
        name: 'A Low'
      },
      {
        id: 3,
        name: 'B High'
      },
      {
        id: 4,
        name: 'B Low'
      }
    ],
    mediaOptions: [
      {
        id: 1,
        name: 'Document'
      },
      {
        id: 2,
        name: 'Music'
      },
      {
        id: 3,
        name: 'Video'
      }
    ],
    ownerOptions: [
      {
        id: 1,
        name: 'John Doe'
      },
      {
        id: 2,
        name: 'George Washington'
      }
    ],
    ownerTierOptions: []
  }),
  actions: {
    resetOptionStore () {
      this.$reset()
    },
    async getOptions () {
      try {
        // TODO: setup api call to retrieve select options
        // const res = await this.$api.get(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
      } catch (error) {
        return error
      }
    },
    async getOwnerTierList () {
      try {
        const res = await this.$api.get(inventoryServiceApi.ownersTiers)
        this.ownerTierOptions = res.data.items
      } catch (error) {
        return error
      }
    },
    async postOwnerTier (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.ownersTiers, payload)

        this.ownerTierOptions = [
          ...this.ownerTierOptions,
          res.data
        ]
      } catch (error) {
        return error
      }
    }
  }
})
