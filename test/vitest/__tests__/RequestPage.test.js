import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import RequestPage from 'src/pages/RequestPage.vue'
import { describe, vi, beforeEach, it, expect } from 'vitest'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { mount } from '@vue/test-utils'
import { useRequestStore } from 'src/stores/request-store'
import { useOptionStore } from 'src/stores/option-store'

installQuasarPlugin()
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => reactive({})),
  useRouter: vi.fn(() => ({}))
}))
describe('RequestPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  describe('onMounted', async () => {
    it('should call getOptions if jobId is in the route params', async () => {
      const optionsStore = useOptionStore()
      vi.spyOn(optionsStore, 'getOptions').mockResolvedValue({})

      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'requests',
          path: 'requests',
          params: {
            notJobId: '123'
          }
        })
      )

      mount(RequestPage, {})

      expect(optionsStore.getOptions).toHaveBeenCalled()
    })
    it('should call getRequestBatchJob if request-batch is the route name', async () => {
      const requestStore = useRequestStore()
      vi.spyOn(requestStore, 'getRequestBatchJob').mockResolvedValue({})

      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'request-batch',
          path: 'request-batch',
          params: {
            jobId: '123'
          }
        })
      )

      mount(RequestPage, {})

      expect(requestStore.getRequestBatchJob).toHaveBeenCalled()
    })
    it('should call getRequestJob if request-details is the route name', async () => {
      const requestStore = useRequestStore()
      vi.spyOn(requestStore, 'getRequestJob').mockResolvedValue({})

      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'request-details',
          path: 'request-details',
          params: {
            jobId: '123'
          }
        })
      )

      mount(RequestPage, {
        shallow: true
      })

      expect(requestStore.getRequestJob).toHaveBeenCalled()
    })
  })
})
