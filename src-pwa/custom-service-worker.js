/* eslint-env serviceworker */

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, NetworkOnly } from 'workbox-strategies'
import { Queue } from 'workbox-background-sync'

self.skipWaiting()
clientsClaim()

console.log('custom service worker active')

// Use with precache injection (caches all local files needed to run app offline)
precacheAndRoute(self.__WB_MANIFEST)

// caches api specific requests data to indexDB
registerRoute(
  ({ url }) => url.href.startsWith(process.env.VITE_INV_SERVCE_API),
  new NetworkFirst()
)

// caches all app related requests to cache storage that dont change often
// registerRoute(
//   ({ url }) => url.href.startsWith('http') && !url.href.includes('__vite_ping'),
//   new StaleWhileRevalidate()
// )

// queue for testing page (stores testing pages offline api requests)
const offlineQueue = new Queue('offlineQueue', {
  onSync: async ({ queue }) => {
    let entry
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request)
        // Data successfully synchronized
        console.log('Queued Request Successfully Sent', entry.request)
      } catch (error) {
        // Handle synchronization errors
        console.log('Queued Request Failed', entry.request, error)

        // Put the failed request back in the queue
        await queue.unshiftRequest(entry)
        throw error
      }
    }
  }
})

// if a test page api call fails due to absense of network connection we send that request to the offline queue
registerRoute(
  ({ url }) => url.href.startsWith(process.env.VITE_INV_SERVCE_API) && url.pathname == '/test',
  new NetworkOnly({
    plugins: [
      {
        fetchDidFail: async ({ request }) => {
          console.log('Request failed to send no internet available storing in queue')
          await offlineQueue.pushRequest({ request })
        }
      }
    ]
  })
)

cleanupOutdatedCaches()