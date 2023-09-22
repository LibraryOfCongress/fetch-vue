import { template } from 'lodash'

export default {
  // example structure for handling api endpoints based on business entities
  // can be called with the api filter like so
  // this.$api.get(endpoints.inventoryService.getEntry, { id: entryId })
  inventoryService: {
    createEntry: template('/entry'),
    getEntry: template('/entry/<% id %>')
  }
}