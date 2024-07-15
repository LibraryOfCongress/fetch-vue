import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useGlobalStore } from '@/stores/global-store'

export default route(function () {
  const createHistory = process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // route guard for pending sync state
  router.beforeEach((to) => {
    const globalStore = useGlobalStore()
    if (globalStore.appPendingSync) {
      globalStore.appSyncGuard = to
      // explicitly return false to cancel the navigation if were pending sync requests
      return false
    }
  })

  // route guard for authentication
  router.beforeEach((to, from) => {
    const globalStore = useGlobalStore()
    const isLoggedIn = localStorage.getItem('user')
    if (to.meta.requiresAuth && !isLoggedIn) {
      // bind the to path to our globalStore to handle alert messages for blocked routes
      globalStore.appRouteGuard = to

      // return the user to the home page or their previous page if they are not logged in
      return from ? { name: from.name } : { name: 'home' }
    }
  })

  return router
})
