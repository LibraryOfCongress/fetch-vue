import { defineStore } from 'pinia'
import inventoryServiceApi from '@/http/InventoryService.js'

export const useGroupStore = defineStore('group-store', {
  state: () => ({
    groupList: [],
    groupDetails: {
      id: null,
      name: null,
      permissions: [],
      users: []
    }
  }),
  actions: {
    resetGroupStore () {
      this.$reset()
    },
    resetGroupDetails () {
      this.groupDetails = {
        id: null,
        name: null,
        permissions: [],
        users: []
      }
    },
    async getAdminGroupList () {
      try {
        // TODO: add groups endpoint
        // const res = await this.$api.get(inventoryServiceApi.groups)
        // this.groupList = res.data.items
        this.groupList = [
          {
            id: 1,
            name: 'Group 1'
          }
        ]
      } catch (error) {
        throw error
      }
    },
    async getAdminGroup (id) {
      try {
        const res = await this.$api.get(`${inventoryServiceApi.groups}${id}`)
        this.groupDetails = res.data
      } catch (error) {
        throw error
      }
    },
    async postAdminGroup (payload) {
      try {
        // TODO: add groups endpoint
        // const res = await this.$api.post(inventoryServiceApi.groups, payload)
        // this.groupDetails = res.data

        this.groupDetails = {
          id: 123,
          name: payload.name,
          permissions: []
        }
      } catch (error) {
        throw error
      }
    },
    async patchAdminGroup (payload) {
      try {
        const res = await this.$api.patch(`${inventoryServiceApi.groups}${payload.id}`, payload)
        this.groupDetails = res.data
      } catch (error) {
        throw error
      }
    },
    async deleteAdminGroup (id) {
      try {
        await this.$api.delete(`${inventoryServiceApi.groups}${id}`)
        this.groupList = this.groupList.filter(g => g.id !== id)
      } catch (error) {
        throw error
      }
    },
    async postAdminGroupUser (groupId, userId) {
      try {
        await this.$api.post(`${inventoryServiceApi.groups}${groupId}/add_user/${userId}`)

        //TODO check if we need to refresh the group list
      } catch (error) {
        throw error
      }
    },
    async deleteAdminGroupUser (groupId, userId) {
      try {
        await this.$api.delete(`${inventoryServiceApi.groups}${groupId}/add_user/${userId}`)

        // delete the user from the specified group
        this.groupList.find(g => g.id == groupId).users.filter(usr => usr.id !== userId)
      } catch (error) {
        throw error
      }
    }
  }
})
