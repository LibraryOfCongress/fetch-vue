<template>
  <q-page
    padding
    class="flex flex-center column"
  >
    <h1>Scanned Bar Codes</h1>
    <ul class="demo">
      <li v-if="testData.length == 0">
        No barcodes found...
      </li>
      <li
        v-for="(barcode, i) in testData"
        :key="i"
      >
        {{ barcode }}
      </li>
    </ul>
    <h2 class="text-body1 q-mt-md text-center">
      Currently using {{ storageUsed }}MB of {{ storageAvailable }}MB Available storage
    </h2>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
// import inventoryServiceApi from '@/http/InventoryService.js';

export default defineComponent({
  name: 'IndexPage',
  data () {
    return {
      testData: [],
      scannedBarCode: [],
      storageUsed: 0,
      storageAvailable: 0
    }
  },
  mounted () {
    console.log('vue app environment loaded', process.env.VITE_ENV)
    document.addEventListener('keypress', this.keypressHandler)
    navigator.storage.estimate().then((estimate) => {
      this.storageUsed = (estimate.usage / 1024 / 1024).toFixed(2)
      this.storageAvailable = (estimate.quota / 1024 / 1024).toFixed(2)
    })
  },
  methods: {
    // async testApiCall() {
    //   try {
    //     const res = await this.$api.get(
    //       inventoryServiceApi.examplesNumbers + 12
    //     );
    //     this.testData = [res.data];
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },
    keypressHandler (event) {
      if (event.key == '!') {
        // if the appended key ! is passed we know the barcode key events are completed
        // so will add the scannedBarCode to the test data
        const barcode = this.scannedBarCode.join('')
        this.testData.push(barcode)
        this.scannedBarCode = []
      } else {
        this.scannedBarCode.push(event.key)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
h1 {
  font-size: 30px;
  color: $primary;
}

.demo {
  display: inline-block;
  width: max-content;
  min-width: 300px;
  list-style: none;
  background-color: $color-gray;
  border-radius: 4px;
  padding: 0.5rem;
}
</style>
