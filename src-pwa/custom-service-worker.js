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

console.log('Custom service worker active')

// Use with precache injection (caches all local files needed to run app offline)
precacheAndRoute(self.__WB_MANIFEST)

// Custom manual sync function for Queue class that can be triggered from the vue client
Queue.prototype.manualSync = async function () {
  let entry
  while ((entry = await this.shiftRequest())) {
    try {
      const res = await fetch(entry.request)
      const resdata = await res.json()
      // Data successfully synchronized send response data back to client
      console.log('Queued Request Successfully Sent', res, resdata)
      const clients = await self.clients.matchAll()
      for (const client of clients) {
        client.postMessage({ url: res.url, response: resdata })
      }
    } catch (error) {
      // Handle synchronization errors
      console.log('Queued Request Failed', entry.request, error)

      // Put the failed request back in the queue
      await this.unshiftRequest(entry)
      throw error
    }
  }
}

// Queue (stores offline api requests)
const offlineQueue = new Queue('offlineQueue', {
  // Cancel the auto replayRequest call when user comes back online since we want to manaully trigger this
  onSync: async () => {
    // Send message to client to notify there are pending requests in queue
    const clients = await self.clients.matchAll()
    for (const client of clients) {
      client.postMessage({ message: 'pending sync' })
    }
  }
})
// Automated queue system
// const offlineQueue = new Queue('offlineQueue', {
//   onSync: async ({ queue }) => {
//     console.log('test onsync', queue)
//     let entry
//     while ((entry = await queue.shiftRequest())) {
//       try {
//         const res = await fetch(entry.request).then(response => response.json())
//         // Data successfully synchronized send response data back to client
//         console.log('Queued Request Successfully Sent', res)
//         const clients = await self.clients.matchAll()
//         for (const client of clients) {
//           client.postMessage(res)
//         }
//       } catch (error) {
//         // Handle synchronization errors
//         console.log('Queued Request Failed', entry.request, error)

//         // Put the failed request back in the queue
//         await queue.unshiftRequest(entry)
//         throw error
//       }
//     }
//   }
// })

// Listen for replayRequest message from frontend to trigger sync on the offline queue
self.addEventListener('message', async (event) => {
  if (event.data === 'triggerBackgroundSync') {
    await offlineQueue.manualSync()

    // Send message to client to notify sync is complete
    const clients = await self.clients.matchAll()
    for (const client of clients) {
      client.postMessage({ message: 'sync complete' })
    }
  }
})

// If a test page api call fails due to absense of network connection we send that request to the offline queue
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

// Caches all other api specific request data except the /tiers endpoint
registerRoute(
  ({ url }) => {
    return url.href.startsWith(process.env.VITE_INV_SERVCE_API) && !url.href.includes('/tiers')
  },
  new NetworkFirst()
)

cleanupOutdatedCaches()