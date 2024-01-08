
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    // We build our routes based on the containing layout component so all pages that will live under MainLayout need to be child paths
    children: [
      {
        name: 'home',
        path: '',
        component: () => import('@/pages/IndexPage.vue')
      },
      {
        name: 'test',
        path: '/test',
        component: () => import('@/pages/TestPage.vue')
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
        name: 'itme-management',
        path: 'item-management/:type?',
        component: () => import('@/pages/ItemManagementPage.vue')
      },
      {
        name: 'shelving',
        path: 'shelving',
        component: () => import('@/pages/ShelvingPage.vue')
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  // 404 page for unknown links
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue')
  }
]

export default routes
