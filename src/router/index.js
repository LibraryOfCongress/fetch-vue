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

  router.beforeEach((to) => {
    const globalStore = useGlobalStore()
    if (globalStore.appPendingSync) {
      globalStore.appSyncGuard = to
      // explicitly return false to cancel the navigation if were pending sync requests
      return false
    }
  })

  return router
})
