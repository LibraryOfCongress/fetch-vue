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
    sizeClass: [],
    mediaTypes: [],
    owners: [],
    ownerTierOptions: []
  }),
  actions: {
    resetOptionStore () {
      this.$reset()
    },
    async getOptions (optionType) {
      console.log(`this.$api: ${this.$api}`)
      console.log(`this.$axios: ${this.$axios}`)
      console.log(`inventoryServiceApi: ${inventoryServiceApi}`)
      console.log(`optionType: ${optionType}`)
      console.log(`process.env.VITE_INV_SERVCE_API: ${process.env.VITE_INV_SERVCE_API}`)
      console.log('For that matter, here is all of process.env:')
      console.log(JSON.stringify(process.env))
      try {
        const res = await this.$api.get(
          inventoryServiceApi[optionType]
        )

        this[optionType] = res.data.items
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
