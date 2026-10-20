import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RequestBatchJobDetails from 'src/components/Request/RequestBatchJobDetails.vue'
import { reactive, ref } from 'vue'
import { api } from 'src/boot/axios'
import { notify } from 'src/utils/notify'
import { usePicklistStore } from 'src/stores/picklist-store'
import { useRequestStore } from 'src/stores/request-store'


installQuasarPlugin()

const { mockDialog } = vi.hoisted(() => ({
  mockDialog: vi.fn()
}))

vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useQuasar: () => ({
      dialog: mockDialog
    })
  }
})

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

vi.mock('src/boot/axios', () => ({
  api: {
    delete: vi.fn()
  }
}))

describe('RequestBatchJobDetails', () => {
  let wrapper
  beforeEach(() => {
    vi.clearAllMocks()
  })
  describe('onBeforeMount', () => {
    it('should set requestTableVisibleColumns if screen size is xs', async () => {
      wrapper = mount(RequestBatchJobDetails, {
        shallow: true,
        global: {
          provide: {
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      expect(
        wrapper.vm.requestTableVisibleColumns).toEqual([
        'id',
        'request_type',
        'barcode',
        'requestor_name'
      ])
    })
  })

  describe('getStatusColor', () => {
    it('returns the correct mapped color for different status inputs', () => {
      wrapper = mount(RequestBatchJobDetails, {
        shallow: true,
        global: {
          provide: {
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      expect(wrapper.vm.getStatusColor('New')).toBe('info')

      expect(wrapper.vm.getStatusColor('Processing')).toBe('warning')

      expect(wrapper.vm.getStatusColor('Completed')).toBe('positive')

      expect(wrapper.vm.getStatusColor('Failed')).toBe('negative')

      expect(wrapper.vm.getStatusColor('Unknown')).toBe('grey')
    })
  })

  describe('headerSubtitle', () => {
    it('should compile the header subtitle based on state', () => {
      const mockFormatDateTime = vi.fn().mockReturnValue({ date: '8/31/2026' })

      wrapper = mount(RequestBatchJobDetails, {
        shallow: true,
        global: {
          provide: {
            'format-date-time': mockFormatDateTime,
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.requestBatchJob = {
        file_type: 'type',
        file_name: 'name',
        requests: [{ id: 1 }],
        user: {
          first_name: 'first',
          last_name: 'last'
        },
        create_dt: 'doesnt matter, mocked anyway'
      }

      expect(wrapper.vm.headerSubtitle).toBe(
        'type • name • 1 items • first last • 8/31/2026'
      )
    })
  })

  describe('confirmDeleteBatch', () => {
    it('should open the modal and, if succeeded delete api call, should call delete', async () => {
      mockDialog.mockReturnValue({
        onOk: vi.fn((callback) => {
          callback() // Immediately trigger OK
          return {
            onCancel: vi.fn(),
            onDismiss: vi.fn()
          }
        })
      })

      wrapper = mount(RequestBatchJobDetails, {
        shallow: true,
        global: {
          provide: {
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          },
          mocks: {
            $q: {
              dialog: mockDialog
            }
          }
        }
      })

      wrapper.vm.requestBatchJob = {
        id: 1
      }

      api.delete.mockReturnValue({})

      wrapper.vm.confirmDeleteBatch()

      await flushPromises()

      expect(mockDialog).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Delete Batch Upload'
        })
      )

      expect(api.delete).toHaveBeenCalled()
    })
    it('should open the modal with options and, if failed delete api call, should notify', async () => {
      mockDialog.mockReturnValue({
        onOk: vi.fn((callback) => {
          callback() // Immediately trigger OK
          return {
            onCancel: vi.fn(),
            onDismiss: vi.fn()
          }
        })
      })

      wrapper = mount(RequestBatchJobDetails, {
        shallow: true,
        global: {
          provide: {
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          },
          mocks: {
            $q: {
              dialog: mockDialog
            }
          }
        }
      })

      api.delete.mockRejectedValue({
        error: 'error'
      })

      wrapper.vm.confirmDeleteBatch()

      await flushPromises()

      expect(notify).toHaveBeenCalled()
    })
  })

  describe('loadRequestJob', () => {
    it('on success, route updates to request-details', async () => {
      const requestStore = useRequestStore()
      vi.spyOn(requestStore, 'getRequestJob').mockResolvedValue()

      wrapper = mount(RequestBatchJobDetails, {
        shallow: true,
        global: {
          provide: {
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.loadRequestJob('1')

      await flushPromises()

      expect(mockRouterPush).toHaveBeenCalledWith(expect.objectContaining({ name: 'request-details' }))
    })

    it('on failure, should notify', async () => {
      const requestStore = useRequestStore()
      vi.spyOn(requestStore, 'getRequestJob').mockRejectedValue({ error: 'error' })

      wrapper = mount(RequestBatchJobDetails, {
        shallow: true,
        global: {
          provide: {
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.loadRequestJob('1')

      await flushPromises()

      expect(notify).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }))
    })
  })

  describe('createPickListJob', async () => {
    it('on success, should notify and call getRequestBatchJob', async () => {
      const requestStore = useRequestStore()
      vi.spyOn(requestStore, 'getRequestBatchJob').mockResolvedValue()

      const picklistStore = usePicklistStore()
      vi.spyOn(picklistStore, 'postPicklistJob').mockResolvedValue()

      wrapper = mount(RequestBatchJobDetails, {
        shallow: true,
        global: {
          provide: {
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.requestTableComponent = {
        clearSelectedData: vi.fn()
      }

      wrapper.vm.createPickListJob()

      await flushPromises()

      expect(requestStore.getRequestBatchJob).toHaveBeenCalledWith(1)
      expect(notify).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }))
    })


    it('on failure, should notify', async () => {
      const requestStore = useRequestStore()
      vi.spyOn(requestStore, 'getRequestBatchJob').mockRejectedValue({ error: 'error' })

      const picklistStore = usePicklistStore()
      vi.spyOn(picklistStore, 'postPicklistJob').mockRejectedValue({ error: 'error' })
      picklistStore.picklistJob = { requests: [] }

      wrapper = mount(RequestBatchJobDetails, {
        shallow: true,
        global: {
          provide: {
            'format-date-time': vi.fn().mockReturnValue('N/A'),
            'get-item-location': vi.fn().mockReturnValue('N/A'),
            'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
          }
        }
      })

      wrapper.vm.requestTableComponent = {
        clearSelectedData: vi.fn()
      }

      wrapper.vm.createPickListJob()

      await flushPromises()

      expect(requestStore.getRequestBatchJob).not.toHaveBeenCalledWith(1)
      expect(notify).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }))
    })

    describe('updatePickListJob', () => {
      it('on success, should notify and call getRequestBatchJob', async () => {
        const requestStore = useRequestStore()
        vi.spyOn(requestStore, 'getRequestBatchJob').mockResolvedValue()

        const picklistStore = usePicklistStore()
        vi.spyOn(picklistStore, 'patchPicklistJobItem').mockResolvedValue()
        picklistStore.picklistJob = { requests: [] }


        const wrapper = mount(RequestBatchJobDetails, {
          shallow: true,
          global: {
            provide: {
              'format-date-time': vi.fn().mockReturnValue('N/A'),
              'get-item-location': vi.fn().mockReturnValue('N/A'),
              'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
            }
          }
        })

        wrapper.vm.addToPickListJob = 1
        wrapper.vm.selectedRequestItems = [{ id: 1 }]

        wrapper.vm.requestTableComponent = {
          clearSelectedData: vi.fn()
        }

        wrapper.vm.updatePickListJob()

        await flushPromises()

        expect(picklistStore.patchPicklistJobItem).toHaveBeenCalledWith({
          id: 1,
          request_ids: [1]
        })

        expect(requestStore.getRequestBatchJob).toHaveBeenCalledWith(1)
        expect(notify).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }))
      })

      it('on failure, should notify', async () => {
        const requestStore = useRequestStore()
        vi.spyOn(requestStore, 'getRequestBatchJob').mockResolvedValue()

        const picklistStore = usePicklistStore()
        vi.spyOn(picklistStore, 'patchPicklistJobItem').mockRejectedValue({ error: 'error' })


        const wrapper = mount(RequestBatchJobDetails, {
          shallow: true,
          global: {
            provide: {
              'format-date-time': vi.fn().mockReturnValue('N/A'),
              'get-item-location': vi.fn().mockReturnValue('N/A'),
              'render-item-barcode-display': vi.fn().mockReturnValue('N/A')
            }
          }
        })

        wrapper.vm.requestTableComponent = {
          clearSelectedData: vi.fn()
        }

        wrapper.vm.updatePickListJob()

        await flushPromises()

        expect(requestStore.getRequestBatchJob).not.toHaveBeenCalled()
        expect(notify).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }))
      })
    })
  })
})
