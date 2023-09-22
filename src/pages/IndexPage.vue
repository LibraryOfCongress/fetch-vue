<template>
  <q-page class="flex flex-center">
    <h1>Welcome to The Fetch App</h1>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import inventoryServiceApi from '@/http/InventoryService.js'

export default defineComponent({
  name: 'IndexPage',
  mounted () {
    console.log('vue app environment loaded', process.env.VITE_ENV)
    this.$api.get(inventoryServiceApi.examplesNumbers + 12).then((err) => console.log(err))
  }
})
</script>

<style lang="scss" scoped>
h1 {
  font-size: 30px;
  color: $primary;
}
</style>
