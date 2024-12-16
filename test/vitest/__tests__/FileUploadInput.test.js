import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { mount } from '@vue/test-utils'
import FileUploadInput from '@/components/FileUploadInput.vue'

installQuasarPlugin()

describe('File Upload Input Component', () => {
  it('should mount a dropzone box input where user will see a "click here or drag to upload prompt"', () => {
    const wrapper = mount(FileUploadInput, {
      props: {
        allowMultipleFiles: false
      }
    })

    expect(wrapper.find('.file-upload').text()).toMatch('Click Here or Drag File to Upload')
  })
})
