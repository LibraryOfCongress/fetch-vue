/* eslint-env serviceworker */

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'

self.skipWaiting()
clientsClaim()

// Use with precache injection (caches all local files needed to run app offline)
precacheAndRoute(self.__WB_MANIFEST)

// caches api specific request data to indexDB
registerRoute(
  ({ url }) => url.href.startsWith(process.env.VITE_INV_SERVCE_API),
  new NetworkFirst()
)

// caches all app related requests to cache storage
registerRoute(
  ({ url }) => url.href.startsWith('http') && !url.href.includes('__vite_ping'),
  new StaleWhileRevalidate()
)

cleanupOutdatedCaches()