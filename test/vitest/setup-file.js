// This file will be run before each test file
import indexeddb from 'fake-indexeddb'

// eslint-disable-next-line no-undef
globalThis.indexedDB = indexeddb

// globally mocks the quueue db in indexDb for components that use background sync
let request = indexedDB.open('workbox-background-sync', 1)
request.onupgradeneeded = function () {
  let db = request.result
  let store = db.createObjectStore('requests', { keyPath: 'id' })
  store.createIndex('queueName', 'title', { unique: true })
}
