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
                    @click="confirmDeleteProduct(product)"
                    class="btn btn-danger btn-sm">
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>
        <h5 class="card-text">{{ convertToCurrency(product.cost) }}</h5>
        <a :href="product.url" class="card-text">{{ product.url }}</a>
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