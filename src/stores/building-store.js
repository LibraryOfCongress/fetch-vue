import { defineStore } from 'pinia'
// import inventoryServiceApi from '@/http/InventoryService.js'

export const useBuildingStore = defineStore('building-details', {
  state: () => ({
    buildings: [
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
        available_shelves: 60
      }
    ]
  }),
  actions: {
    resetBuildingStore () {
      this.$reset()
    },
    async getBuildings () {
      try {
        // TODO: setup api call to retrieve select buildings
        // const res = await this.$api.get(
        //   inventoryServiceApi.examplesNumbers + 12
        // )
      } catch (error) {
        return error
      }
    }
  }
})
