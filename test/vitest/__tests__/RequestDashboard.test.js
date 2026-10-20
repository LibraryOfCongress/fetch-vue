import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { mount } from '@vue/test-utils'
import RequestDashboard from 'src/components/Request/RequestDashboard.vue'
import { useIlsConfigurationStore } from 'src/stores/ils-configuration-store'
import { usePicklistStore } from 'src/stores/picklist-store'
import { useRequestStore } from 'src/stores/request-store'
import { useUserStore } from 'src/stores/user-store'
import { notify } from 'src/utils/notify'
import { vi, describe, beforeEach } from 'vitest'
import { reactive, ref } from 'vue'

installQuasarPlugin()

const mockRouterPush = vi.fn()
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => reactive({})),
  useRouter: vi.fn(() => ({ push: mockRouterPush }))
}))

vi.mock('@/composables/useCurrentScreenSize.js', () => ({
  useCurrentScreenSize: () => ({
    currentScreenSize: ref('xs')
  })
}))

vi.mock('@/composables/usePermissionHandler.js', () => ({
  usePermissionHandler: () => ({
    checkUserPermission: vi.fn().mockReturnValue(true)
  })
}))

vi.mock('@/utils/notify', () => ({
  notify: vi.fn()
}))

describe('RequestDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  let wrapper
  describe('onBeforeMount', () => {
    it('should call requestTableVisibleColumns if screen size is xs', async () => {
      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      expect(
        JSON.stringify(wrapper.vm.requestTableVisibleColumns) ===
          JSON.stringify([
            'id',
            'request_type',
            'barcode_value',
            'requestor_name'
          ])
      ).toBeTruthy()
    })
  })
  describe('handlePickListModalOpen', () => {
    it('when user has no default building set, show picklistModal', async () => {
      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      useUserStore().userData = {
        user_id: 123,
        default_building_id: null
      }

      wrapper.vm.handlePickListModalOpen('Create')

      expect(wrapper.vm.showPickListModal === 'Create').toBeTruthy()
    })

    it('when user has building set, should call getRequestJobList', async () => {
      useUserStore().userData = {
        default_building_id: 2,
        permissions: []
      }

      const requestStore = useRequestStore()
      requestStore.getRequestJobList.mockResolvedValue({})

      let wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })


      await wrapper.vm.handlePickListModalOpen('Create')

      expect(requestStore.getRequestJobList).toHaveBeenCalled()
    })

    it('when user has building set, should call getRequestJobList', async () => {
      useUserStore().userData = {
        default_building_id: 2,
        permissions: []
      }

      const requestStore = useRequestStore()
      requestStore.getRequestJobList.mockResolvedValue({})

      let wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.picklistModalComponent = ref('val')

      await wrapper.vm.handlePickListModalOpen('Create')

      expect(requestStore.getRequestJobList).toHaveBeenCalled()
    })

    it('when user has building set, and getRequestJobList fails, should notify', async () => {
      useUserStore().userData = {
        default_building_id: 2,
        permissions: []
      }

      const requestStore = useRequestStore()
      requestStore.getRequestJobList.mockRejectedValue(new Error('error'))

      let wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })


      await wrapper.vm.handlePickListModalOpen('Edit')

      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'negative' })
      )
    })
  })

  describe('triggerIlsSyncModalOpen', () => {
    it('should fetch ILS configurations', async () => {
      const ilsStore = useIlsConfigurationStore()
      vi.spyOn(ilsStore, 'getIlsConfigurations').mockResolvedValue([{ id: 1 }])

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      await wrapper.vm.triggerIlsSyncModalOpen()

      expect(wrapper.vm.loadingIlsConfigs).toBe(false)
    })

    it('on error, should notify', async () => {
      const ilsStore = useIlsConfigurationStore()
      vi.spyOn(ilsStore, 'getIlsConfigurations').mockRejectedValue(new Error('error'))

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      await wrapper.vm.triggerIlsSyncModalOpen()

      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'negative' })
      )
    })
  })

  describe('submitIlsSyncRequest', () => {
    it('should syncs requests and closes modal', async () => {
      const ilsStore = useIlsConfigurationStore()
      vi.spyOn(ilsStore, 'syncIlsRequests').mockResolvedValue(true)

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.selectedIlsConfigsToSync = [1]
      await wrapper.vm.submitIlsSyncRequest()

      expect(ilsStore.syncIlsRequests).toHaveBeenCalled()
      expect(wrapper.vm.showSyncIlsRequestsModal).toBe(false)
    })

    it('should notify on failure', async () => {
      const ilsStore = useIlsConfigurationStore()
      vi.spyOn(ilsStore, 'syncIlsRequests').mockRejectedValue(new Error('Sync error'))

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      await wrapper.vm.submitIlsSyncRequest()

      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Failed to trigger ILS Sync' })
      )
    })
  })

  describe('loadRequestJobs', () => {
    it('if not in picklist mode, should call getRequestJobList', async () => {
      wrapper.vm.requestDisplayType = 'request_view'
      const requestStore = useRequestStore()
      const spy = vi.spyOn(requestStore, 'getRequestJobList').mockResolvedValue([])

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      await wrapper.vm.loadRequestJobs()

      expect(spy).toHaveBeenCalled()
    })

    it('should apply picklist filters if in picklist mode', async () => {
      const requestStore = useRequestStore()
      const spy = vi.spyOn(requestStore, 'getRequestJobList').mockResolvedValue([])

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.showCreatePickList = false
      wrapper.vm.columnFilters = {
        id: 123,
        request_type: ['test'],
        barcode: '123',
        external_request_id: '123',
        building_id: [
          1,
          2
        ],
        requestor_name: 'test',
        status: ['test'],
        priority: ['test'],
        media_type: ['test'],
        delivery_location: ['test'],
        location: 'place'
      }

      await wrapper.vm.loadRequestJobs({ page: 1 })

      expect(spy).toHaveBeenCalledWith({
        page: 1,
        queue: true,
        unassociated_pick_list: false,
        id: 123,
        request_type: ['test'],
        barcode_value: '123',
        external_request_id: '123',
        building_id: [
          1,
          2
        ],
        requestor_name: 'test',
        status: ['test'],
        priority: ['test'],
        media_type: ['test'],
        delivery_location: ['test'],
        item_location: 'place'
      })
    })

    it('if not in piclist mode, should call getRequestBatchJobList', async () => {
      const requestStore = useRequestStore()
      const spy = vi.spyOn(requestStore, 'getRequestBatchJobList').mockResolvedValue([])

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.requestDisplayType = 'batch_view'

      wrapper.vm.batchColumnFilters = {
        file_type: 'type',
        status: ['status'],
        user_name: 'name'
      }

      await wrapper.vm.loadRequestJobs({ sort: 'desc' })

      expect(spy).toHaveBeenCalledWith({
        sort: 'desc',
        file_type: 'type',
        status: ['status'],
        user_name: 'name'
      })
    })

    it('on api failure, notifies', async () => {
      wrapper.vm.requestDisplayType = 'request_view'
      const requestStore = useRequestStore()
      vi.spyOn(requestStore, 'getRequestJobList').mockRejectedValue(new Error('error'))

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      await wrapper.vm.loadRequestJobs()

      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'negative' })
      )
    })
  })

  describe('applyColumnFilters', () => {
    it('if resetTableComponent exists, should call resetTablePagination', () => {
      const resetSpy = vi.fn()

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.requestTableComponent = { resetTablePagination: resetSpy }

      wrapper.vm.applyColumnFilters()

      expect(resetSpy).toHaveBeenCalled()
    })
  })

  describe('clearColumnFilters', () => {
    it('if in request view, should clear columnFilters props', () => {
      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.requestDisplayType = 'request_view'
      wrapper.vm.columnFilters.id = 99

      wrapper.vm.clearColumnFilters()

      expect(wrapper.vm.columnFilters.id).toBeNull()
    })

    it('if not in request view, should reset batchColumnFilters props', () => {
      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.requestDisplayType = 'batch_view'
      wrapper.vm.batchColumnFilters.file_type = 'type'

      wrapper.vm.clearColumnFilters()

      expect(wrapper.vm.batchColumnFilters.file_type).toBeNull()
    })
  })

  describe('loadRequestJob', () => {
    it('if requestDisplayType is batch_view, routes to batch-details', async () => {
      const requestStore = useRequestStore()
      vi.spyOn(requestStore, 'getRequestBatchJob').mockResolvedValue({})

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.requestDisplayType = 'batch_view'

      await wrapper.vm.loadRequestJob(1)

      expect(mockRouterPush).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'request-batch' })
      )
    })

    it('if requestDisplayType is request_view, routes to request-details', async () => {
      const requestStore = useRequestStore()
      vi.spyOn(requestStore, 'getRequestJob').mockResolvedValue({})

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.requestDisplayType = 'request_view'

      await wrapper.vm.loadRequestJob(1)

      expect(mockRouterPush).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'request-details' })
      )
    })

    it('if error on getRequestJob, notifies', async () => {
      const requestStore = useRequestStore()
      vi.spyOn(requestStore, 'getRequestJob').mockRejectedValue(new Error('Not found'))

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.requestDisplayType = 'request_view'

      await wrapper.vm.loadRequestJob(1)

      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'negative' })
      )
    })
  })

  describe('createPickListJob', () => {
    it('should notify of success', async () => {
      const requestStore = useRequestStore()
      vi.spyOn(requestStore, 'getRequestJobList').mockResolvedValue([])

      const picklistStore = usePicklistStore()
      vi.spyOn(picklistStore, 'postPicklistJob').mockResolvedValue()

      picklistStore.picklistJob = {
        id: 1,
        requests: [
          {
            non_tray_item: {
              status: 'status'
            }
          }
        ]
      }

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.selectedRequestItems = [{ id: 1 }]
      wrapper.vm.requestTableComponent = {
        resetTablePagination: vi.fn(),
        clearSelectedData: vi.fn()
      }

      await wrapper.vm.createPickListJob()

      expect(picklistStore.postPicklistJob).toHaveBeenCalled()
      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'positive' })
      )
    })

    it('should notify on failure', async () => {
      const picklistStore = usePicklistStore()
      vi.spyOn(picklistStore, 'postPicklistJob').mockRejectedValue(new Error('error'))

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.requestTableComponent = {
        resetTablePagination: vi.fn(),
        clearSelectedData: vi.fn()
      }

      await wrapper.vm.createPickListJob()

      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'negative' })
      )
    })
  })

  describe('updatePickListJob', () => {
    it('should patch picklist items successfully, and notify of success', async () => {
      const picklistStore = usePicklistStore()
      vi.spyOn(picklistStore, 'patchPicklistJobItem').mockResolvedValue()

      picklistStore.picklistJob = {
        id: 1,
        requests: [
          {
            non_tray_item: {
              status: 'status'
            }
          }
        ]
      }

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      await wrapper.vm.updatePickListJob()

      expect(picklistStore.patchPicklistJobItem).toHaveBeenCalled()
      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'positive' })
      )
    })

    it('should notify on failure', async () => {
      const picklistStore = usePicklistStore()
      vi.spyOn(picklistStore, 'patchPicklistJobItem').mockRejectedValue(new Error('error'))

      wrapper = mount(RequestDashboard, {
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-nested-key-path': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      await wrapper.vm.updatePickListJob()

      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'negative' })
      )
    })
  })
})
