import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global-store', {
  state: () => ({
    appIsOffline: false,
    appIsLoadingData: false,
    appActionIsLoadingData: false,
    appTableIsLoadingData: false,
    appPendingSync: false,
    appSyncGuard: null,
    appRouteGuard: null
  })
})
