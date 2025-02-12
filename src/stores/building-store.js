import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useBuildingStore = defineStore('building-store', {
  state: () => ({
    buildingsTotal: 0,
    shelvesTotal: 0,
    buildings: [],
    modules: [], //TODO setup endpoint to get list of modules filtered by building id
    aisles: [], //TODO setup endpoint to get list of aisles filtered by building id, module id
    sides: [], //TODO setup endpoint to get list of sides filtered by building id, module id, aisle id
    ladders: [], //TODO setup endpoint to get list of ladders filtered by building id, module id, aisle id, side id
    shelves: [], //TODO setup endpoint to get list of shelves filtered by building id, module id, aisle id, side id, ladder id
    buildingDetails: {},
    moduleDetails: {},
    aisleDetails: {},
    sideDetails: {},
    ladderDetails: {},
    shelfDetails: {},
    shelfPositions: []
  }),
  getters: {
    renderBuildingModules: (state) => {
      let modules = []
      if (state.buildingDetails.id && state.buildingDetails.modules) {
        modules = state.buildingDetails.modules
      }
      return modules
    },
    renderBuildingOrModuleAisles: (state) => {
      let aisles = []
      if (state.moduleDetails.id && state.moduleDetails.aisles) {
        aisles = state.moduleDetails.aisles
      } else if (state.buildingDetails.id && state.buildingDetails.aisles) {
        aisles = state.buildingDetails.aisles
      }
      return aisles
    },
    renderAisleSides: (state) => {
      let sides = [
        {
          id: null,
          side_orientation: {
            name: 'Left'
          }
        },
        {
          id: 0,
          side_orientation: {
            name: 'Right'
          }
        }
      ]
      if (state.aisleDetails.id && state.aisleDetails.sides) {
        sides = state.aisleDetails.sides
      }
      return sides
    },
    renderSideLadders: (state) => {
      let ladders = []
      if (state.sideDetails.id && state.sideDetails.ladders) {
        ladders = state.sideDetails.ladders
      }
      return ladders
    },
    renderLadderShelves: (state) => {
      let shelves = []
      if (state.ladderDetails.id && state.ladderDetails.shelves) {
        shelves = state.ladderDetails.shelves
      }
      return shelves
    },
    renderShelfPositions: (state) => {
      let shelf_positions = []
      if (state.shelfDetails.id && state.shelfDetails.shelf_positions) {
        shelf_positions = state.shelfDetails.shelf_positions
      }
      return shelf_positions
    }
  },
  actions: {
    resetBuildingStore () {
      this.$reset()
    },
    resetBuildingChildren () {
      // clears state for module options downward since user will need to select an module next to populate the rest of the data
      // ex: shelving workflow - edit shelf location uses a dynamic form that loads building locations based on parent selections aisles selection derives from module ect
      this.moduleDetails = {}
      this.aisleDetails = {}
      this.sideDetails = {}
      this.ladderDetails = {}
      this.shelfDetails = {}
      this.shelves = []
      this.shelfPositions = []
    },
    resetModuleChildren () {
      // clears state for aisle options downward since user will need to select an aisle next to populate the rest of the data
      this.aisleDetails = {}
      this.sideDetails = {}
      this.ladderDetails = {}
      this.shelfDetails = {}
      this.shelves = []
      this.shelfPositions = []
    },
    resetAisleChildren () {
      // clears state for side options downward since user will need to select an side next to populate the rest of the data
      this.sideDetails = {}
      this.ladderDetails = {}
      this.shelfDetails = {}
      this.shelves = []
      this.shelfPositions = []
    },
    resetSideChildren () {
      // clears state for ladder options downward since user will need to select an ladder next to populate the rest of the data
      this.ladderDetails = {}
      this.shelfDetails = {}
      this.shelves = []
      this.shelfPositions = []
    },
    resetLadderChildren () {
      // clears state for shelf options downward since user will need to select an shelf next to populate the rest of the data
      this.shelfDetails = {}
      this.shelves = []
      this.shelfPositions = []
    },
    async getBuildingsList (qParams) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.buildings}`, {
          params: {
            size: this.apiPageSizeDefault,
            ...qParams
          }
        })
        this.buildings = res.data.items

        // keep track of response total for pagination
        this.buildingsTotal = res.data.total
      } catch (error) {
        return error
      }
    },
    async getBuildingDetails (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.buildings}${id}`)
        this.buildingDetails = res.data
        // this.buildingDetails = [
        //   {
        //     id: 1,
        //     name: 'Cabin Branch',
        //     modules: [
        //       {
        //         id: 10,
        //         name: 'module 1',
        //         aisles: [
        //           {
        //             id: 1,
        //             ladders: 12
        //           },
        //           {
        //             id: 2,
        //             ladders: 13
        //           },
        //           {
        //             id: 3,
        //             ladders: 14
        //           },
        //           {
        //             id: 4,
        //             ladders: 15
        //           }
        //         ]
        //       },
        //       {
        //         id: 11,
        //         name: 'module 2',
        //         aisles: [
        //           {
        //             id: 1,
        //             ladders: 12
        //           },
        //           {
        //             id: 2,
        //             ladders: 13
        //           },
        //           {
        //             id: 3,
        //             ladders: 14
        //           },
        //           {
        //             id: 4,
        //             ladders: 15
        //           }
        //         ]
        //       },
        //       {
        //         id: 12,
        //         name: 'module 3',
        //         aisles: [
        //           {
        //             id: 1,
        //             ladders: 12
        //           },
        //           {
        //             id: 2,
        //             ladders: 13
        //           },
        //           {
        //             id: 3,
        //             ladders: 14
        //           },
        //           {
        //             id: 4,
        //             ladders: 15
        //           }
        //         ]
        //       },
        //       {
        //         id: 13,
        //         name: 'module 4',
        //         aisles: [
        //           {
        //             id: 1,
        //             ladders: 12
        //           },
        //           {
        //             id: 2,
        //             ladders: 13
        //           },
        //           {
        //             id: 3,
        //             ladders: 14
        //           },
        //           {
        //             id: 4,
        //             ladders: 15
        //           }
        //         ]
        //       }
        //     ],
        //     available_shelves: 120
        //   },
        //   {
        //     id: 2,
        //     name: 'Fort Meade',
        //     modules: [],
        //     aisles: [
        //       {
        //         id: 1,
        //         ladders: 12
        //       },
        //       {
        //         id: 2,
        //         ladders: 13
        //       },
        //       {
        //         id: 3,
        //         ladders: 14
        //       },
        //       {
        //         id: 4,
        //         ladders: 15
        //       }
        //     ],
        //     available_shelves: 60
        //   }
        // ].find(b => b.id == id)
      } catch (error) {
        throw error
      }
    },
    async postBuilding (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.buildings, payload)

        // add the newly added building to the top of the list
        this.buildings = [
          res.data,
          ...this.buildings
        ]
      } catch (error) {
        throw error
      }
    },
    async patchBuilding (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.buildings}${payload.id}`, payload)

        // update the specific building with the response info
        this.buildings[this.buildings.findIndex(b => b.id == payload.id)] = res.data
      } catch (error) {
        throw error
      }
    },
    async getModuleDetails (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.modules}${id}`)
        this.moduleDetails = res.data
      } catch (error) {
        throw error
      }
    },
    async postModule (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.modules, payload)

        // add the newly added module to the top of the buildingDetail module array
        this.buildingDetails.modules = [
          res.data,
          ...this.buildingDetails.modules
        ]
      } catch (error) {
        throw error
      }
    },
    async patchModule (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.modules}${payload.id}`, payload)

        // update the specific module with the response info
        this.buildingDetails.modules[this.buildingDetails.modules.findIndex(m => m.id == payload.id)] = res.data
      } catch (error) {
        throw error
      }
    },
    async getAisleDetails (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.aisles}${id}`)
        this.aisleDetails = res.data
      } catch (error) {
        throw error
      }
    },
    async postAisle (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.aisles, payload)

        // add the newly added aisle to the top of the moduleDetail aisle array with a manual serialized aisle_number
        this.moduleDetails.aisles = [
          {
            ...res.data,
            aisle_number: { number: payload.aisle_number }
          },
          ...this.moduleDetails.aisles
        ]

        // generate sides left and right on the newly created aisle
        await this.postSide({
          aisle_id: res.data.id,
          side_orientation_id: 1
        }),
        await this.postSide({
          aisle_id: res.data.id,
          side_orientation_id: 2
        })
      } catch (error) {
        if (error.response.status == 422 && error.response?.data?.detail.includes('No aisle_number entity')) {
          // if we get a 422 error related to the number passed in not existing create that number and re run the aisle creation
          await this.postAisleNumber(payload.aisle_number)
          await this.postAisle(payload)
        } else {
          throw error
        }
      }
    },
    async patchAisle (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.aisles}${payload.id}`, payload)

        // update the specific aisle with the response info
        this.moduleDetails.aisles[this.moduleDetails.aisles.findIndex(a => a.id == payload.id)] = {
          ...res.data,
          aisle_number: { number: payload.aisle_number }
        }
      } catch (error) {
        throw error
      }
    },
    async postAisleNumber (aisleNumber) {
      try {
        // adds a new aisle number to the db to be utilized in aisle creation
        await this.$api.post(inventoryServiceApi.aislesNumbers, { number: aisleNumber })
      } catch (error) {
        throw error
      }
    },
    async getSideDetails (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.sides}${id}`)
        this.sideDetails = res.data
      } catch (error) {
        throw error
      }
    },
    async postSide (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.sides, payload)
        this.sideDetails = res.data
      } catch (error) {
        throw error
      }
    },
    async getLadderDetails (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.ladders}${id}`)
        this.ladderDetails = res.data
      } catch (error) {
        throw error
      }
    },
    async postLadder (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.ladders, payload)

        // add the newly added ladder to the top of the sideDetail ladders array
        this.sideDetails.ladders = [
          {
            ...res.data,
            ladder_number: { number: payload.ladder_number }
          },
          ...this.sideDetails.ladders
        ]
      } catch (error) {
        throw error
      }
    },
    async patchLadder (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.ladders}${payload.id}`, payload)

        // update the specific ladder with the response info
        this.sideDetails.ladders[this.sideDetails.ladders.findIndex(l => l.id == payload.id)] = {
          ...res.data,
          ladder_number: { number: payload.ladder_number }
        }
      } catch (error) {
        throw error
      }
    },
    async getShelveList (qParams) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.shelves}`, {
          params: {
            size: this.apiPageSizeDefault,
            ...qParams
          }
        })
        this.shelves = res.data.items

        // keep track of response total for pagination
        this.shelvesTotal = res.data.total
      } catch (error) {
        return error
      }
    },
    async getShelfDetails (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.shelves}${id}`)
        this.shelfDetails = res.data
      } catch (error) {
        throw error
      }
    },
    async postShelve (payload) {
      try {
        const res = await this.$api.post(inventoryServiceApi.shelves, payload)

        // add the newly added shelve to the top of the shelves list
        this.shelves = [
          {
            ...res.data,
            shelf_number: { number: payload.shelf_number }
          },
          ...this.shelves
        ]
      } catch (error) {
        throw error
      }
    },
    async patchShelve (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.shelves}${payload.id}`, payload)

        // update the specific shelve with the response info
        this.shelves[this.shelves.findIndex(s => s.id == payload.id)] = {
          ...res.data,
          shelf_number: { number: payload.shelf_number }
        }
      } catch (error) {
        throw error
      }
    },
    async getShelfPositionsList (shelf_id, available = false) {
      try {
        const res = await this.$api.get(inventoryServiceApi.shelvesPositions, {
          params: {
            shelf_id,
            empty: available,
            size: this.apiPageSizeDefault
          }
        })
        this.shelfPositions = res.data.items
      } catch (error) {
        throw error
      }
    },
    async postBulkLocation (payload) {
      try {
        // create a formData Object and assign the file to the formData to be passed to api as 'multipart/form-data' content
        let formData = new FormData()
        Object.entries(payload).forEach(entry => {
          const [
            key,
            value
          ] = entry
          formData.append(key, value)
        })
        const res = await this.$api.post(`${inventoryServiceApi.batchUploadLocationManagement}`, formData)
        return res
      } catch (error) {
        throw error
      }
    }
  }
})
