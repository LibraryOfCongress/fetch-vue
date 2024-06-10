const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    // We build our routes based on the containing layout component so all pages that will live under MainLayout need to be child paths
    // Keep routes sorted alphabetically by path
    children: [
      {
        name: 'home',
        path: '',
        component: () => import('@/pages/IndexPage.vue')
      },
      {
        name: 'accession',
        path: 'accession/:jobId?', // child path reads as "parent path + / + child_path" ex: /accession
        component: () => import('@/pages/AccessionPage.vue')
      },
      {
        name: 'accession-container',
        path: 'accession/:jobId?/scan-items/:containerId?',
        component: () => import('@/pages/AccessionPage.vue'),
        beforeEnter ({ params }) {
          if (!params.containerId) {
            return {
              name: 'accession',
              params: {
                jobId: params.jobId
              }
            }
          }
        }
      },
      {
        name: 'admin-home',
        path: 'admin',
        component: () => import('@/pages/AdminPage.vue')
      },
      {
        name: 'admin-building-view',
        path: 'admin/buildings/:buildingId?',
        component: () => import('@/pages/AdminPage.vue')
      },
      {
        name: 'admin-groups',
        path: 'admin/groups/:groupId?',
        component: () => import('@/pages/AdminPage.vue')
      },
      {
        name: 'item-management',
        path: 'item-management/:type?',
        component: () => import('@/pages/ItemManagementPage.vue')
      },
      {
        name: 'picklist',
        path: 'picklist/:jobId?',
        component: () => import('@/pages/PicklistPage.vue')
      },
      {
        name: 'refile',
        path: 'refile/:jobId?',
        component: () => import('@/pages/RefilePage.vue')
      },
      {
        name: 'request',
        path: 'request/:jobId?',
        component: () => import('@/pages/RequestPage.vue')
      },
      {
        name: 'shelving',
        path: 'shelving/:jobId?',
        component: () => import('@/pages/ShelvingPage.vue')
      },
      {
        name: 'shelving-dts',
        path: 'shelving/direct-to-shelve/:jobId?',
        component: () => import('@/pages/ShelvingPage.vue')
      },
      {
        name: 'test',
        path: '/test',
        component: () => import('@/pages/TestPage.vue')
      },
      {
        name: 'verification',
        path: 'verification/:jobId?',
        component: () => import('@/pages/VerificationPage.vue')
      },
      {
        name: 'verification-container',
        path: 'verification/:jobId?/scan-items/:containerId?',
        component: () => import('@/pages/VerificationPage.vue'),
        beforeEnter ({ params }) {
          if (!params.containerId) {
            return {
              name: 'verification',
              params: {
                jobId: params.jobId
              }
            }
          }
        }
      }
    ]
  },
  // Always leave this as last one,
  // 404 page for unknown links
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue')
  }
]

export default routes
