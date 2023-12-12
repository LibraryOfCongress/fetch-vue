import { defineStore } from 'pinia'

export const useTemplateStore = defineStore('store-name', {
  state: () => ({
    stateProp: 0
  }),
  getters: {
    stateValue: (state) => state.stateProp
  },
  actions: {
    async incrementStateProp () {
      this.stateProp++
    }
  }
})
