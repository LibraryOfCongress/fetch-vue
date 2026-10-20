import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from 'src/components/Search/SearchBar.vue'
import { useUserStore } from 'src/stores/user-store'
import { useRoute, useRouter } from 'vue-router'
import { reactive } from 'vue'
import { useSearchStore } from '@/stores/search-store'
import { notify } from '@/utils/notify'
import { useAccessionStore } from 'src/stores/accession-store'
import { useVerificationStore } from 'src/stores/verification-store'
import { usePicklistStore } from 'src/stores/picklist-store'

installQuasarPlugin()
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => (reactive({}))),
  useRouter: vi.fn(() => ({}))
}))

vi.mock('@/utils/notify', () => ({
  notify: vi.fn()
}))

describe('SearchBar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useAccessionStore().accessionJob = {
      accessionJob: {
        trayed: false
      }
    }

    useVerificationStore().verificationJob = {
      verificationJob: {
        trayed: false
      }
    }

    usePicklistStore().picklistJob.requests = [
      {
        item: {
          status: 'test'
        },
        non_tray_item: {
          status: 'test'
        }
      }
    ]
  })

  it('should render', () => {
    let wrapper = mount(SearchBar, {
      global: {
        provide: {
          'get-item-location': vi.fn().mockReturnValue('N/A')
        }
      }
    })

    expect(wrapper.find('.search-bar')).toBeTruthy()
  })

  it('searchType should be set based on the route (Accession instance)', () => {
    vi.mocked(useRoute).mockReturnValue(
      reactive({
        name: 'accession',
        path: 'accession'
      }))

    useUserStore().userData = {
      permissions: ['can_access_accession']
    }

    const wrapper = mount(SearchBar, {
      global: {
        provide: {
          'get-item-location': vi.fn().mockReturnValue('N/A')
        }
      }
    })

    expect(wrapper.getComponent(SearchBar).componentVM.searchType === 'Accession').toBeTruthy()
  })

  it('searchType should be set based on the route (Tray instance)', () => {
    vi.mocked(useRoute).mockReturnValue(
      reactive({
        name: 'tray',
        path: 'tray'
      }))

    useUserStore().userData = {
      permissions: ['can_access_tray_detail']
    }

    const wrapper = mount(SearchBar, {
      global: {
        provide: {
          'get-item-location': vi.fn().mockReturnValue('N/A')
        }
      }
    })

    expect(wrapper.getComponent(SearchBar).componentVM.searchType === 'Tray').toBeTruthy()
  })

  it('executeExactSearch should notify with error if search fails', async () => {
    const error = Error()

    useSearchStore().getExactSearchResult.mockRejectedValue(error)

    const wrapper = mount(SearchBar, {
      global: {
        provide: {
          'get-item-location': vi.fn().mockReturnValue('N/A')
        }
      }
    })

    await wrapper.vm.executeExactSearch()

    expect(notify).toHaveBeenCalled()
  })

  it('executeExactSearch should not notify with error if search succeeds', async () => {
    useSearchStore().getExactSearchResult.mockReturnValue('success')

    const wrapper = mount(SearchBar, {
      global: {
        provide: {
          'get-item-location': vi.fn().mockReturnValue('N/A')
        }
      }
    })

    await wrapper.vm.executeExactSearch()

    expect(notify).not.toHaveBeenCalled()
  })

  describe('handlingSearchResultRouting for each search type, should perform those search actions', () => {
    const mockPush = vi.fn()

    vi.mocked(useRouter).mockReturnValue({
      push: mockPush
    })

    it('For Item', () => {
      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'item',
          path: 'item'
        }))

      useUserStore().userData = {
        permissions: ['can_access_item_detail']
      }

      const wrapper = mount(SearchBar, {
        shallow: true,
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A')
          },
          stubs: {
            QInput: {
              template: '<div>stub input, resolves warning</div>'
            }
          }
        }
      })

      wrapper.vm.handlingSearchResultRouting()

      expect(wrapper.vm.showItemQuickView).toBeTruthy()
    })
    it('For Tray', () => {
      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'tray',
          path: 'tray'
        }))

      useUserStore().userData = {
        permissions: ['can_access_tray_detail']
      }

      const wrapper = mount(SearchBar, {
        shallow: true,
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A')
          },
          stubs: {
            QInput: {
              template: '<div>stub input, resolves warning</div>'
            }
          }
        }
      })

      wrapper.vm.handlingSearchResultRouting()

      expect(mockPush).toHaveBeenCalledWith({
        name: 'record-management-tray',
        params: {
          barcode: wrapper.vm.searchText
        }
      })
    })

    it('For Shelf', () => {
      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'shelf',
          path: 'shelf'
        }))

      useUserStore().userData = {
        permissions: ['can_access_shelf_detail']
      }

      const wrapper = mount(SearchBar, {
        shallow: true,
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A')
          },
          stubs: {
            QInput: {
              template: '<div>stub input, resolves warning</div>'
            }
          }
        }
      })

      wrapper.vm.handlingSearchResultRouting()

      expect(mockPush).toHaveBeenCalledWith({
        name: 'record-management-shelf',
        params: {
          barcode: wrapper.vm.searchText
        }
      })
    })

    it('For Accession', () => {
      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'accession',
          path: 'accession'
        }))

      useUserStore().userData = {
        permissions: ['can_access_accession']
      }

      const wrapper = mount(SearchBar, {
        shallow: true,
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A')
          },
          stubs: {
            QInput: {
              template: '<div>stub input, resolves warning</div>'
            }
          }
        }
      })

      wrapper.vm.handlingSearchResultRouting()

      expect(mockPush).toHaveBeenCalledWith({
        name: 'accession',
        params: {
          jobId: wrapper.vm.searchText
        }
      })
    })

    it('For Verification', () => {
      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'verification',
          path: 'verification'
        }))

      useUserStore().userData = {
        permissions: ['can_access_verification']
      }

      const wrapper = mount(SearchBar, {
        shallow: true,
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A')
          },
          stubs: {
            QInput: {
              template: '<div>stub input, resolves warning</div>'
            }
          }
        }
      })

      wrapper.vm.handlingSearchResultRouting()

      expect(mockPush).toHaveBeenCalledWith({
        name: 'verification',
        params: {
          jobId: wrapper.vm.searchText
        }
      })
    })

    it('For Shelving, Direct', () => {
      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'shelving',
          path: 'shelving'
        }))

      useUserStore().userData = {
        permissions: ['can_access_shelving']
      }

      const wrapper = mount(SearchBar, {
        shallow: true,
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A')
          },
          stubs: {
            QInput: {
              template: '<div>stub input, resolves warning</div>'
            }
          }
        }
      })

      wrapper.vm.exactSearchResponseInfo = {
        origin: 'Direct'
      }

      wrapper.vm.handlingSearchResultRouting()

      expect(mockPush).toHaveBeenCalledWith({
        name: 'shelving-dts',
        params: {
          jobId: wrapper.vm.searchText
        }
      })
    })

    it('For Shelving, List', () => {
      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'shelving',
          path: 'shelving'
        }))

      useUserStore().userData = {
        permissions: ['can_access_shelving']
      }

      const wrapper = mount(SearchBar, {
        shallow: true,
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A')
          },
          stubs: {
            QInput: {
              template: '<div>stub input, resolves warning</div>'
            }
          }
        }
      })

      wrapper.vm.exactSearchResponseInfo = {
        origin: 'List'
      }

      wrapper.vm.handlingSearchResultRouting()

      expect(mockPush).toHaveBeenCalledWith({
        name: 'ShelveByListExecute',
        params: {
          id: wrapper.vm.searchText
        }
      })
    })

    it('For Shelving, Move', () => {
      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'shelving',
          path: 'shelving'
        }))

      useUserStore().userData = {
        permissions: ['can_access_shelving']
      }

      const wrapper = mount(SearchBar, {
        shallow: true,
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A')
          },
          stubs: {
            QInput: {
              template: '<div>stub input, resolves warning</div>'
            }
          }
        }
      })

      wrapper.vm.exactSearchResponseInfo = {
        origin: 'Move',
        mode: 'MoveTrayItem'
      }

      wrapper.vm.handlingSearchResultRouting()

      expect(mockPush).toHaveBeenCalledWith({
        name: 'shelving-move',
        params: {
          type: 'tray-item',
          jobId: wrapper.vm.searchText
        }
      })
    })

    it('For Shelving, Other', () => {
      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'shelving',
          path: 'shelving'
        }))

      useUserStore().userData = {
        permissions: ['can_access_shelving']
      }

      const wrapper = mount(SearchBar, {
        shallow: true,
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A')
          },
          stubs: {
            QInput: {
              template: '<div>stub input, resolves warning</div>'
            }
          }
        }
      })

      wrapper.vm.exactSearchResponseInfo = {
        origin: 'Other'
      }

      wrapper.vm.handlingSearchResultRouting()

      expect(mockPush).toHaveBeenCalledWith({
        name: 'shelving'
      })
    })

    it('For Request', () => {
      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'request',
          path: 'request'
        }))

      useUserStore().userData = {
        permissions: ['can_access_request']
      }

      const wrapper = mount(SearchBar, {
        shallow: true,
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A')
          },
          stubs: {
            QInput: {
              template: '<div>stub input, resolves warning</div>'
            }
          }
        }
      })

      wrapper.vm.exactSearchResponseInfo = {
        origin: 'Other'
      }
      wrapper.vm.handlingSearchResultRouting()

      expect(mockPush).toHaveBeenCalledWith({
        name: 'request-details',
        params: {
          jobId: wrapper.vm.searchText
        }
      })
    })

    it('For Picklist', () => {
      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'picklist',
          path: 'picklist'
        }))

      useUserStore().userData = {
        permissions: ['can_access_picklist']
      }

      const wrapper = mount(SearchBar, {
        shallow: true,
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A')
          },
          stubs: {
            QInput: {
              template: '<div>stub input, resolves warning</div>'
            }
          }
        }
      })

      wrapper.vm.exactSearchResponseInfo = {
        origin: 'Other'
      }
      wrapper.vm.handlingSearchResultRouting()

      expect(mockPush).toHaveBeenCalledWith({
        name: 'picklist',
        params: {
          jobId: wrapper.vm.searchText
        }
      })
    })

    it('For Refile', () => {
      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'refile',
          path: 'refile'
        }))

      useUserStore().userData = {
        permissions: ['can_access_refile']
      }

      const wrapper = mount(SearchBar, {
        shallow: true,
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A')
          },
          stubs: {
            QInput: {
              template: '<div>stub input, resolves warning</div>'
            }
          }
        }
      })

      wrapper.vm.exactSearchResponseInfo = {
        origin: 'Other'
      }
      wrapper.vm.handlingSearchResultRouting()

      expect(mockPush).toHaveBeenCalledWith({
        name: 'refile',
        params: {
          jobId: wrapper.vm.searchText
        }
      })
    })

    it('For Withdraw', () => {
      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'withdrawal',
          path: 'withdrawal'
        }))

      useUserStore().userData = {
        permissions: ['can_access_withdraw']
      }

      const wrapper = mount(SearchBar, {
        shallow: true,
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A')
          },
          stubs: {
            QInput: {
              template: '<div>stub input, resolves warning</div>'
            }
          }
        }
      })

      wrapper.vm.exactSearchResponseInfo = {
        origin: 'Other'
      }
      wrapper.vm.handlingSearchResultRouting()

      expect(mockPush).toHaveBeenCalledWith({
        name: 'withdrawal',
        params: {
          jobId: wrapper.vm.searchText
        }
      })
    })

    it('For Shipping', () => {
      vi.mocked(useRoute).mockReturnValue(
        reactive({
          name: 'shipping-execute',
          path: 'shipping-execute'
        }))

      useUserStore().userData = {
        permissions: ['can_access_shipping']
      }

      const wrapper = mount(SearchBar, {
        shallow: true,
        global: {
          provide: {
            'get-item-location': vi.fn().mockReturnValue('N/A')
          },
          stubs: {
            QInput: {
              template: '<div>stub input, resolves warning</div>'
            }
          }
        }
      })

      wrapper.vm.handlingSearchResultRouting()

      expect(mockPush).toHaveBeenCalledWith({
        name: 'shipping-execute',
        params: {
          jobId: wrapper.vm.searchText
        }
      })
    })
  })
})