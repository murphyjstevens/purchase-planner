<template>
  <div id="app" class="app-content d-flex flex-row justify-content-center">
    <div class="content">
      <ProductList />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductList from '@/components/ProductList.vue'
</script>

<style scoped>
  .content {
    padding: 10px;
    width: 800px;
  }
</style>
