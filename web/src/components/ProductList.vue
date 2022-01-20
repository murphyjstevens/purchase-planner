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
        <div class="card-title flex-row">
          <span>{{ product.name }}</span>
          <div>
            <button type="button"
                    @click="reorder(product, true)"
                    class="btn btn-secondary btn-sm me-2"
                    title="Reorder Up"
                    :disabled="product.sortOrder === 1">
              <i class="bi bi-arrow-up"></i>
            </button>
            <button type="button"
                    @click="reorder(product, false)"
                    class="btn btn-secondary btn-sm me-2"
                    title="Reorder Down"
                    :disabled="product.sortOrder === products.length">
              <i class="bi bi-arrow-down"></i>
            </button>
            <button type="button"
                    @click="confirmDeleteProduct(product)"
                    class="btn btn-danger btn-sm"
                    title="Delete">
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>
        <h5 class="card-text">{{ convertToCurrency(product.cost) }}</h5>
        <a :href="product.url" target="_blank" class="card-text text-trim">{{ product.url }}</a>
      </div>
    </div>
  </div>

  <AddProduct ref="addModal" />
  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script>
import { mapState } from 'vuex'
import AddProduct from './AddProduct.vue'
import DeleteConfirmation from './shared/DeleteConfirmation.vue'

export default {
  name: 'ProductList',
  components: {
    AddProduct,
    DeleteConfirmation
  },
  computed: {
    ...mapState({
      products: state => state.products.all
    })
  },
  methods: {
    openAddProductDialog () {
      if (this.$refs.addModal) {
        this.$refs.addModal.open()
      }
    },
    convertToCurrency (valueToConvert) {
      return this.$filters.toCurrency(valueToConvert)
    },

    confirmDeleteProduct (product) {
      if (this.$refs.deleteConfirmationModal && product) {
        this.$refs.deleteConfirmationModal.open(this.deleteProduct, product.id, product.name)
      }
    },
    async deleteProduct (id) {
      await this.$store.dispatch('products/delete', id)
    },

    async reorder (product, isUp) {
      if ((isUp && product.sortOrder === 0) ||
        (!isUp && product.sortOrder === this.products.reduce((a, b) => a.sortOrder > b.sortOrder ? a : b))) {
        return
      }
      console.log(product)
      const newOrder = isUp ? product.sortOrder - 1 : product.sortOrder + 1
      console.log(newOrder)
      const otherProduct = this.products.find(p => p.sortOrder === newOrder)
      if (!otherProduct) {
        console.error('Could not find sort order')
        return
      }
      const reorderRequest = {
        item1: {
          id: product.id,
          sortOrder: newOrder
        },
        item2: {
          id: otherProduct.id,
          sortOrder: product.sortOrder
        }
      }
      await this.$store.dispatch('products/reorder', reorderRequest)
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
  margin: 15px 0;

  .card-title {
    justify-content: space-between;
    align-items: center;
    font-size: 24px;
    font-weight: 500;
  }
}
</style>