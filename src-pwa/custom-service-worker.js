/* eslint-env serviceworker */

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst } from 'workbox-strategies'
import { Queue } from 'workbox-background-sync'

self.skipWaiting()
clientsClaim()

console.log('custom service worker active')

// Use with precache injection (caches all local files needed to run app offline)
precacheAndRoute(self.__WB_MANIFEST)

// queue (stores offline api requests)
const offlineQueue = new Queue('offlineQueue', {
  onSync: async ({ queue }) => {
    let entry
    while ((entry = await queue.shiftRequest())) {
      try {
        const res = await fetch(entry.request).then(response => response.json())
        // Data successfully synchronized send response data back to client
        console.log('Queued Request Successfully Sent', res)
        const clients = await self.clients.matchAll()
        for (const client of clients) {
          client.postMessage(res)
        }
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
self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(process.env.VITE_INV_SERVCE_API) && event.request.url.includes('/owners/tiers')) {
    if (!self.navigator.onLine) {
      const promiseChain = fetch(event.request.clone()).catch(() => {
        console.log('Request failed to send no internet available storing in queue')
        return offlineQueue.pushRequest({ request: event.request })
      })

      event.waitUntil(promiseChain)
    }
  }
})

// caches all other api specific request data
registerRoute(
  ({ url }) => {
    url.href.startsWith(process.env.VITE_INV_SERVCE_API)
  },
  new NetworkFirst()
)

cleanupOutdatedCaches()