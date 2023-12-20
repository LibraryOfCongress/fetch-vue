import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { mount } from '@vue/test-utils'
import SearchInput from '@/components/SearchInput.vue'

installQuasarPlugin()

describe('Search Input Component', () => {
  it('should mount component with passed in placeholder text in the dom', () => {
    const wrapper = mount(SearchInput, {
      props: {
        placeholder: 'this is a search input'
      }
    })

    expect(wrapper.find('.search-input input').attributes().placeholder).toMatch('this is a search input')
  })
})
