import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useOptionStore = defineStore('option-store', {
  state: () => ({
    optionsTotal: 0,
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
    ownersTiers: [],
    ownerTierOptions: [],
    parentOwnerOptions: [],
    picklists: [],
    refileJobs: [],
    requestsLocations: [],
    requestsPriorities: [],
    requestsTypes: [],
    shelves: [],
    users: [],
    verificationJobs: []
  }),
  actions: {
    resetOptionStore () {
      this.$reset()
    },
    async getOptions (optionType, qParams, combineOptions = false) {
      try {
        const res = await this.$api.get(inventoryServiceApi[optionType], {
          params: {
            size: this.apiPageSizeDefault,
            ...qParams
          }
        })
        if (combineOptions) {
          // combineOptions is only mainly used when we need to add to our list of options ex: paginated selects on scroll need to add to options
          // merge the results with current options and get rid of duplicates
          this[optionType] = [
            ...new Set([
              ...this[optionType],
              ...res.data.items
            ])
          ]
        } else {
          this[optionType] = res.data.items
        }

        // set the total number of rendered options which is used for pagination limits
        this.optionsTotal = res.data.total
      } catch (error) {
        throw error
      }
    },
    async getParentOwnerOptions (qParams) {
      try {
        const res = await this.$api.get(inventoryServiceApi.owners, {
          params: {
            size: this.apiPageSizeDefault,
            ...qParams
          }
        })
        this['parentOwnerOptions'] = res.data.items
      } catch (error) {
        throw error
      }
    },
    async postOwner (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.owners, payload)

        this.owners = [
          ...this.owners,
          res.data
        ]
      } catch (error) {
        throw error
      }
    },
    async patchOwner (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.owners}${payload.id}`, payload)

        // update the specific size class with the response info
        this.owners[this.owners.findIndex(o => o.id == payload.id)] = res.data
      } catch (error) {
        throw error
      }
    },
    async deleteOwner (ownerId) {
      try {
        await this.$api.delete(`${inventoryServiceApi.owners}${ownerId}`)

        // filter out the specific owner
        this.owners = this.owners.filter(o => o.id !== ownerId)
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
        return res
      } catch (error) {
        if (error.response.status == 405) {
          // return 405 error since these have messages we need to display to the user
          return error
        } else {
          throw error
        }
      }
    },
    async deleteShelfType (shelfTypeId) {
      try {
        const res = await this.$api.delete(`${inventoryServiceApi.shelfTypes}${shelfTypeId}`)

        // filter out the specific shelf type
        this.shelfTypes = this.shelfTypes.filter(s => s.id !== shelfTypeId)
        return res
      } catch (error) {
        if (error.response.status == 405) {
          // return 405 error since these have messages we need to display to the user
          return error
        } else {
          throw error
        }
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
