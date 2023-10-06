/* eslint-env serviceworker */

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

self.skipWaiting()
clientsClaim()

// Use with precache injection (caches all local files needed to run app offline)
precacheAndRoute(self.__WB_MANIFEST)

//TODO: setup cache registery for api calls here
// registerRoute(
//   new RegExp('api_url_here'),
//   new NetworkFirst()
// )

registerRoute(
  ({url}) => url.href.startsWith('http') && !url.href.includes('__vite_ping'),
  new StaleWhileRevalidate()
)

cleanupOutdatedCaches()