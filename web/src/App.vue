<template>
  <div id="app" class="app-content d-flex flex-row justify-content-center">
    <div class="content">
      <ProductList />
    </div>
  </div>
</template>

<script>
import ProductList from './components/ProductList.vue'

export default {
  name: 'App',
  components: {
    ProductList
  }
}
</script>

<style scoped lang="scss">
  .app-content {
    .content {
      padding: 10px;
      width: 800px;
    }
  }
</style>
