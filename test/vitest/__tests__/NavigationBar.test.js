import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { mount } from '@vue/test-utils'
import NavigationBar from '@/components/NavigationBar.vue'

installQuasarPlugin()

describe('Navigation Bar Component', () => {
  it('should mount component with a top and side nav', () => {
    const wrapper = mount(NavigationBar)

    expect(wrapper.find('.q-header').exists()).toBe(true)
    expect(wrapper.find('.q-drawer-container').exists()).toBe(true)
  })

  it('should hide the side nav if user triggers the menu button', () => {
    const wrapper = mount(NavigationBar)

    expect(wrapper.vm.leftDrawerOpen).toBe(true)
    wrapper.find('.q-toolbar .q-btn').trigger('click')
    expect(wrapper.vm.leftDrawerOpen).toBe(false)
  })
})
