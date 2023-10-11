<template>
  <q-page class="flex flex-center column">
    <h1>Welcome to The Fetch App</h1>
    <ul>
      <li
        v-for="data in testData"
        :key="data.number"
      >
        {{ data.number }}
      </li> 
    </ul>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import inventoryServiceApi from '@/http/InventoryService.js'

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      testData: []
    }
  },
  mounted () {
    console.log('vue app environment loaded', process.env.VITE_ENV)
    this.testApiCall()
  },
  methods: {
    async testApiCall() {
      try {
        const res = await this.$api.get(inventoryServiceApi.examplesNumbers + 12)
        this.testData = [res.data]
      } catch (err) {
        console.log(err)
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
</style>
