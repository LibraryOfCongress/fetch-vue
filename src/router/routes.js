
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    // We build our routes based on the containing layout component so all pages that will live under MainLayout need to be child paths
    children: [
      {
        path: '',
        component: () => import('@/pages/IndexPage.vue')
      },
      {
        path: 'item-management/:type?', // child path reads as "parent path + / + child_path" ex: /item-managment
        component: () => import('@/pages/ItemManagement.vue')
      },
      {
        path: 'accession',
        component: () => import('@/pages/Accession.vue')
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
