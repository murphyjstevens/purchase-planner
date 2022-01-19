<template>
  <div class="d-flex justify-content-center mb-3">
    <button type="button"
      @click="openAddProductDialog()"
      class="btn btn-outline-light btn-lg">
      <i class="bi-plus-lg"></i>
      Add Product
    </button>
  </div>

  <div class="container">
    <div v-for="product in products"
          :key="product.id"
          class="card">
      <div class="card-body">
        <h4 class="card-title">{{ product.name }}</h4>
        <h5 class="card-text">{{ convertToCurrency(product.totalCost) }}</h5>
        <p class="card-text">{{ product.description }}</p>
      </div>
    </div>
  </div>

  <!-- <AddProduct ref="addModal" /> -->
</template>

<script>
import { mapState } from 'vuex'
// import AddProduct from './AddProduct.vue'
export default {
  name: 'ProductList',
  components: {
    // AddProduct
  },
  computed: {
    ...mapState({
      products: state => state.products.all
    })
  },
  methods: {
    openAddProductDialog () {
      // if (this.$refs.addModal) {
      //   this.$refs.addModal.open()
      // }
    },
    convertToCurrency (valueToConvert) {
      return this.$filters.toCurrency(valueToConvert)
    }
  },
  created () {
    this.$store.dispatch('products/get')
  }
}
</script>

<style scoped lang="scss">
.card {
  background-color: white;
  color: inherit;
  text-decoration: none;
}
</style>