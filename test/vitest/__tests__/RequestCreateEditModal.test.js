import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import RequestCreateEditModal from 'src/components/Request/RequestCreateEditModal.vue'
import { vi } from 'vitest'
import { useRequestStore } from 'src/stores/request-store'
import { useUserStore } from 'src/stores/user-store'
import { notify } from 'src/utils/notify'
import { useOptionStore } from 'src/stores/option-store'
import { mount } from '@vue/test-utils'

installQuasarPlugin()

describe('RequestCreateEditModal component', () => {
  vi.mock('@/utils/notify', () => ({
    notify: vi.fn()
  }))

  let wrapper

  describe('onMounted', () => {
    it('should set system settings fields if those exist in the options store', async () => {
      useOptionStore().getSystemSetting = vi.fn().mockResolvedValue({
        value: '[]'
      })

      wrapper = mount(RequestCreateEditModal, {
        props: {
          type: 'manual'
        }
      })

      expect(JSON.stringify(wrapper.vm.systemSettingsRequiredFields)).toEqual(
        JSON.stringify([])
      )
    })
    it('if in edit mode, set up form', async () => {
      const mainProps = {
        type: 'edit',
        requestData: {
          request_type_id: 123,
          requestor_name: 'test',
          delivery_location_id: 123,
          priority_id: 123,
          external_request_id: 123,
          non_tray_item: {
            barcode: 123
          },
          item: {
            barcode: 123
          }
        }
      }

      wrapper = mount(RequestCreateEditModal, {
        props: mainProps
      })

      expect(
        wrapper.vm.manualRequestForm.requestor_name ===
          mainProps.requestData.requestor_name
      ).toBeTruthy()
    })
    it('if in manual mode, focus not set form values', () => {
      wrapper = mount(RequestCreateEditModal, {
        shallow: true,
        props: {
          type: 'manual'
        }
      })

      expect(wrapper.vm.manualRequestForm.requestor_name === null).toBeTruthy()
    })
  })

  describe('createRequestJob', () => {
    it('if manual type, should call postRequestBatchJob', async () => {
      const requestStore = useRequestStore()
      requestStore.postRequestJob.mockResolvedValue({})

      const mainProps = {
        type: 'manual'
      }

      wrapper = mount(RequestCreateEditModal, {
        props: mainProps
      })

      await wrapper.vm.createRequestJob(true)

      expect(requestStore.postRequestJob).toHaveBeenCalled()
    })

    it('if not manual type, should call postRequestBatchJob', async () => {
      const requestStore = useRequestStore()
      vi.spyOn(requestStore, 'postRequestBatchJob').mockResolvedValue({})

      useUserStore().userData = {
        user_id: 123,
        permissions: []
      }

      const mainProps = {
        type: 'other'
      }

      wrapper = mount(RequestCreateEditModal, {
        props: mainProps
      })

      wrapper.vm.requestFile = [{ file: '123' }]
      wrapper.vm.requestCreateModal = { hideModal: () => {} }

      await wrapper.vm.createRequestJob(true)

      await wrapper.vm.$nextTick()

      expect(requestStore.postRequestBatchJob).toHaveBeenCalledWith({
        file: '123',
        requested_by_id: 123
      })
    })

    it('if manual type, and error on request', async () => {
      const mainProps = {
        type: 'manual'
      }

      wrapper = mount(RequestCreateEditModal, {
        props: mainProps
      })

      await wrapper.vm.createRequestJob(true)

      expect(wrapper.vm.appActionIsLoadingData).toBe(false)
    })

    it('if not manual type, and 400 error on request', async () => {
      const requestStore = useRequestStore()
      vi.spyOn(requestStore, 'postRequestBatchJob').mockRejectedValue({
        response: { status: 400 }
      })

      const mockHandleCSVDownload = vi.fn()

      const mainProps = {
        type: 'other?'
      }

      wrapper = mount(RequestCreateEditModal, {
        global: {
          provide: { 'handle-csv-download': mockHandleCSVDownload }
        },
        props: mainProps
      })

      wrapper.vm.requestFile = [{ file: '123' }]

      await wrapper.vm.createRequestJob(true)

      expect(wrapper.vm.appActionIsLoadingData).toBe(false)
      expect(mockHandleCSVDownload).toHaveBeenCalled()
    })

    it('if not manual type, and 401 error on request', async () => {
      const requestStore = useRequestStore()
      vi.spyOn(requestStore, 'postRequestBatchJob').mockRejectedValue({
        response: { status: 401 }
      })

      const mockHandleCSVDownload = vi.fn()

      const mainProps = {
        type: 'other?'
      }

      wrapper = mount(RequestCreateEditModal, {
        props: mainProps
      })

      wrapper.vm.requestFile = [{ file: '123' }]

      await wrapper.vm.createRequestJob(true)

      expect(wrapper.vm.appActionIsLoadingData).toBe(false)
      expect(mockHandleCSVDownload).not.toHaveBeenCalled()
    })
  })

  describe('editRequestJob', () => {
    it('on success should notify success', async () => {
      const mainProps = {
        requestData: {
          id: 123
        }
      }

      wrapper = mount(RequestCreateEditModal, {
        props: mainProps
      })

      wrapper.vm.requestCreateModal = { hideModal: () => {} }

      await wrapper.vm.editRequestJob()

      expect(notify).toHaveBeenCalledWith({
        type: 'positive',
        message: 'Successfully updated the request.'
      })
    })
    it('on failure should notify failure', async () => {
      useRequestStore().patchRequestJob = vi.fn().mockRejectedValue({})
      wrapper = mount(RequestCreateEditModal, {})

      await wrapper.vm.editRequestJob()

      expect(notify).toHaveBeenCalledWith({
        type: 'negative',
        message: 'Failed to update request'
      })
    })
  })
})
