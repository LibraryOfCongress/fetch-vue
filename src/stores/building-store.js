import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useBuildingStore = defineStore('building-store', {
  state: () => ({
    buildings: [],
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
    async getBuildingsList () {
      try {
        // TODO: setup api call to retrieve all buildings
        // const res = await this.$api.get(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        this.buildings = [
          {
            id: 1,
            name: 'Cabin Branch',
            modules: [
              {
                id: 10,
                name: 'module 1',
                aisles: [
                  {
                    id: 1,
                    ladders: 12
                  },
                  {
                    id: 2,
                    ladders: 13
                  },
                  {
                    id: 3,
                    ladders: 14
                  },
                  {
                    id: 4,
                    ladders: 15
                  }
                ]
              },
              {
                id: 11,
                name: 'module 2',
                aisles: [
                  {
                    id: 1,
                    ladders: 12
                  },
                  {
                    id: 2,
                    ladders: 13
                  },
                  {
                    id: 3,
                    ladders: 14
                  },
                  {
                    id: 4,
                    ladders: 15
                  }
                ]
              },
              {
                id: 12,
                name: 'module 3',
                aisles: [
                  {
                    id: 1,
                    ladders: 12
                  },
                  {
                    id: 2,
                    ladders: 13
                  },
                  {
                    id: 3,
                    ladders: 14
                  },
                  {
                    id: 4,
                    ladders: 15
                  }
                ]
              },
              {
                id: 13,
                name: 'module 4',
                aisles: [
                  {
                    id: 1,
                    ladders: 12
                  },
                  {
                    id: 2,
                    ladders: 13
                  },
                  {
                    id: 3,
                    ladders: 14
                  },
                  {
                    id: 4,
                    ladders: 15
                  }
                ]
              }
            ],
            available_shelves: 120
          },
          {
            id: 2,
            name: 'Fort Meade',
            modules: [],
            aisles: [
              {
                id: 1,
                ladders: 12
              },
              {
                id: 2,
                ladders: 13
              },
              {
                id: 3,
                ladders: 14
              },
              {
                id: 4,
                ladders: 15
              }
            ],
            available_shelves: 60
          }
        ]
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
    async getModuleDetails (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.modules}${id}`)
        this.moduleDetails = res.data
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
    async getSideDetails (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.sides}${id}`)
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
    async getShelfDetails (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.shelves}${id}`)
        this.shelfDetails = res.data
      } catch (error) {
        throw error
      }
    },
    async getShelfPositionsList (shelf_id, available = false) {
      try {
        const res = await this.$api.get(inventoryServiceApi.shelvesPositions, { params: { shelf_id, empty: available } })
        this.shelfPositions = res.data
      } catch (error) {
        throw error
      }
    }
  }
})
