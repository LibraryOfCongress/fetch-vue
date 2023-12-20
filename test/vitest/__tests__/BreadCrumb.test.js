import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BreadCrumb from '@/components/BreadCrumb.vue'

installQuasarPlugin()

afterEach(() => {
  vi.clearAllMocks()
})

// mock vue router which is used by the breadcrumb component
const mockRoutePush = vi.fn()
vi.mock('vue-router', async () => {
  return {
    RouterView: {},
    useRouter: () => {
      return {
        push: mockRoutePush
      }
    }
  }
})

describe('Bread Crumb Component', () => {
  it('should mount component with a back button', () => {
    const wrapper = mount(BreadCrumb)

    expect(wrapper.find('.essential-link').text()).toContain('Back')
  })

  it('navigates the user backwards on click of the back button'), async () => {
    const wrapper = mount(BreadCrumb)

    await wrapper.find('.q-item').click()

    expect(mockRoutePush).toHaveBeenCalled()
  }
})
