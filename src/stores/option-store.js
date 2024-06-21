import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useOptionStore = defineStore('option-store', {
  state: () => ({
    buildings: [],
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
    sizeClass: [],
    mediaTypes: [],
    owners: [],
    ownerTierOptions: [],
    picklists: [],
    refileJobs: [],
    requestsLocations: [],
    requestsPriorities: [],
    requestsTypes: [],
    users: []
  }),
  actions: {
    resetOptionStore () {
      this.$reset()
    },
    async getOptions (optionType) {
      try {
        const res = await this.$api.get(
          inventoryServiceApi[optionType]
        )

        this[optionType] = res.data.items
      } catch (error) {
        throw error
      }
    },
    async getOwnerTierList () {
      try {
        const res = await this.$api.get(inventoryServiceApi.ownersTiers)
        this.ownerTierOptions = res.data.items
      } catch (error) {
        throw error
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
        throw error
      }
    }
  }
})
