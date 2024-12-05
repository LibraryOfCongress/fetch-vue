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
    shelfTypes: [],
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
      // temp fix for picklist option param
      let res = null
      try {
        if (optionType == 'picklists') {
          res = await this.$api.get(inventoryServiceApi[optionType], { params: {
            size: 100,
            queue: true
          } })
        } else {
          res = await this.$api.get(inventoryServiceApi[optionType], { params: { size: 100 } })
        }
        // const res = await this.$api.get(inventoryServiceApi[optionType], { params: { size: 100 } })

        this[optionType] = res.data.items
      } catch (error) {
        throw error
      }
    },
    async postMediaType (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.mediaTypes, payload)

        this.mediaTypes = [
          ...this.mediaTypes,
          res.data
        ]
      } catch (error) {
        throw error
      }
    },
    async patchMediaType (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.mediaTypes}${payload.id}`, payload)

        // update the specific media type with the response info
        this.mediaTypes[this.mediaTypes.findIndex(mt => mt.id == payload.id)] = res.data
      } catch (error) {
        throw error
      }
    },
    async deleteMediaType (mediaTypeId) {
      try {
        await this.$api.delete(`${inventoryServiceApi.mediaTypes}${mediaTypeId}`)

        // filter out the specific media type
        this.mediaTypes = this.mediaTypes.filter(mt => mt.id !== mediaTypeId)
      } catch (error) {
        throw error
      }
    },
    async postSizeClass (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.sizeClass, payload)

        this.sizeClass = [
          ...this.sizeClass,
          res.data
        ]
      } catch (error) {
        throw error
      }
    },
    async patchSizeClass (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.sizeClass}${payload.id}`, payload)

        // update the specific size class with the response info
        this.sizeClass[this.sizeClass.findIndex(s => s.id == payload.id)] = res.data
      } catch (error) {
        throw error
      }
    },
    async deleteSizeClass (sizeClassId) {
      try {
        await this.$api.delete(`${inventoryServiceApi.sizeClass}${sizeClassId}`)

        // filter out the specific size class
        this.sizeClass = this.sizeClass.filter(s => s.id !== sizeClassId)
      } catch (error) {
        throw error
      }
    },
    async deleteSizeClassOwners (sizeClassId, payload) {
      try {
        const res = await this.$api.delete(`${inventoryServiceApi.sizeClass}${sizeClassId}/remove_owner`, { data: payload })

        // update the specific size class with the response info
        this.sizeClass[this.sizeClass.findIndex(s => s.id == sizeClassId)] = res.data
      } catch (error) {
        throw error
      }
    },
    async postShelfType (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.shelfTypes, payload)

        this.shelfTypes = [
          ...this.shelfTypes,
          res.data
        ]
      } catch (error) {
        throw error
      }
    },
    async patchShelfType (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.shelfTypes}${payload.id}`, payload)

        // update the specific shelf type with the response info
        this.shelfTypes[this.shelfTypes.findIndex(s => s.id == payload.id)] = res.data
      } catch (error) {
        throw error
      }
    },
    async deleteShelfType (shelfTypeId) {
      try {
        await this.$api.delete(`${inventoryServiceApi.shelfTypes}${shelfTypeId}`)

        // filter out the specific shelf type
        this.shelfTypes = this.shelfTypes.filter(s => s.id !== shelfTypeId)
      } catch (error) {
        throw error
      }
    },
    //TEMP testing page functions
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
