
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/pages/IndexPage.vue')
      },
      {
        path: 'item-management', // child path reads as "parent path + / + child_path" ex: /item-managment
        component: () => import('@/pages/ItemManagement.vue')
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
