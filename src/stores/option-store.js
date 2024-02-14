import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useOptionStore = defineStore('options', {
  state: () => ({
    containerTypes: [
      {
        id: 1,
        name: 'Non-Trayed'
      },
      {
        id: 2,
        name: 'Trayed'
      }
    ],
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
      },
      {
        id: 5,
        name: 'C high'
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
      },
      {
        id: 4,
        name: 'Vinyl Recording'
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
      },
      {
        id: 3,
        name: 'Colonel Sanders'
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
