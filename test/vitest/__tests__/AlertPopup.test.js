import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { mount } from '@vue/test-utils'
import AlertPopup from '@/components/AlertPopup.vue'

installQuasarPlugin()

describe('Alert Popup Component', () => {
  it('should display an error alert with passed in text', () => {
    const wrapper = mount(AlertPopup, {
      props: {
        alertType: 'error',
        alertText: 'this is a test'
      }
    })

    expect(wrapper.find('.alert-banner').exists()).toBe(true)
    expect(wrapper.find('.alert-banner').text()).toContain('this is a test')
  })
})
