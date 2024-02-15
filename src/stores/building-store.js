import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js'

export const useBuildingStore = defineStore('building-details', {
  state: () => ({
    buildings: [],
    buildingDetails: {}
  }),
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
    async getBuildingDetails (buildingId) {
      try {
        // TODO: setup api call to retrieve the building
        // const res = await this.$api.get(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
        this.buildingDetails = [
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
        ].find(b => b.id == buildingId)
      } catch (error) {
        return error
      }
    }
  }
})
