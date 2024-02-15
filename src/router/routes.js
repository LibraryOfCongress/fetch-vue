
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
        name: 'admin',
        path: 'admin/:buildingId?',
        component: () => import('@/pages/AdminPage.vue')
      },
      {
        name: 'item-management',
        path: 'item-management/:type?',
        component: () => import('@/pages/ItemManagementPage.vue')
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
      },
      {
        name: 'shelving',
        path: 'shelving',
        component: () => import('@/pages/ShelvingPage.vue')
      },
      {
        name: 'test',
        path: '/test',
        component: () => import('@/pages/TestPage.vue')
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
