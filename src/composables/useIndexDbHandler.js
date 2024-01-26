import { ref, onBeforeMount } from 'vue'

export function useIndexDbHandler () {

  const indexDb = ref(null)

  async function getIndexDb () {
    return new Promise((resolve, reject) => {

      let request = window.indexedDB.open('global-data')

      request.onupgradeneeded = () => {
        const db = request.result
        // build our store schema here for the global store will use for the app
        db.createObjectStore('ownerTiers', { keyPath: 'id' })

        // takes the stores name and key term path (can have multiple key terms) and if its unique (can have duplicates or just one)
        // store.createIndex('owner', ['name'], { unique: false })
      }

      request.onsuccess = (event) => {
        resolve(event.target.result)
      }

      request.onerror = (err) => {
        console.log('Error opening db', err)
        reject('Error')
      }
    })
  }

  async function getDataInIndexDb (dataStore) {
    return new Promise((resolve, reject) => {
      const trans = indexDb.value.transaction([dataStore], 'readonly')
      const store = trans.objectStore(dataStore)
      let data = []

      // if dataStore exists in indexdb we iterate through it all and add it to data so it can be returned to the frontend
      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result
        if (cursor) {
          data.push(cursor.value)
          cursor.continue()
        }
      }

      trans.oncomplete = () => {
        resolve(data[0])
      }

      trans.onerror = (err) => {
        console.log('Error getting data from db', err)
        reject('Error')
      }
    })
  }

  async function addDataToIndexDb (dataStore, dataToAdd) {
    return new Promise((resolve, reject) => {
      const trans = indexDb.value.transaction([dataStore], 'readwrite')
      const store = trans.objectStore(dataStore)
      store.put({ id: 1, data: dataToAdd })

      // const storeData = store.get(keyTerm)
      // // if storeData exists in defined store, we add/update the passed in data
      // storeData.onsuccess = () => {
      //   // storeData.keyterm.result = dataToAdd
      //   store.put(storeData)
      // }

      trans.oncomplete = () => {
        resolve()
      }

      trans.onerror = (err) => {
        console.log('Error getting data from db', err)
        reject('Error')
      }
    })
  }

  async function deleteDataInIndexDb (dataStore, keyTerm = 1) {
    return new Promise((resolve, reject) => {
      const trans = indexDb.value.transaction([dataStore], 'readwrite')
      const store = trans.objectStore(dataStore)
      const storeToDelete = store.delete(keyTerm)

      // if storeData exists in defined store, we add/update the passed in data
      storeToDelete.onsuccess = () => {
        console.log(`${keyTerm} has been removed`)
      }

      trans.oncomplete = () => {
        resolve()
      }

      trans.onerror = (err) => {
        console.log('Error getting data from db', err)
        reject('Error')
      }
    })
  }

  onBeforeMount(async () => {
    indexDb.value = await getIndexDb()
  })

  return {
    indexDb,
    getDataInIndexDb,
    addDataToIndexDb,
    deleteDataInIndexDb
  }
}
