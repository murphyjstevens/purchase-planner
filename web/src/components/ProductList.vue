<template>
  <div class="container">
    <div class="d-flex justify-content-between mb-3">
      <div class="dropdown">
        <button type="button"
          class="btn btn-outline-light btn-lg dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          :disabled="showPurchased">
          <i class="bi-plus-lg"></i>
          Add
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" @click="openAddProductDialog()" href="javascript:void(0)">Product</a></li>
          <li><a class="dropdown-item" @click="openAddGroupDialog()" href="javascript:void(0)">Group</a></li>
        </ul>
      </div>
      <button type="button"
              @click="toggleShowPurchased()"
              class="btn btn-outline-light btn-lg"
              :title="showPurchased ? 'Hide Purchased' : 'Show Purchased'">
        <i :class="{ 'bi-eye-slash-fill': showPurchased, 'bi-eye-fill': !showPurchased }"></i>
      </button>
    </div>

    <div v-for="product in products"
          :key="product.id"
          class="card">
      <div class="card-body">
        <div class="card-title d-flex flex-row">
          <span class="text-trim" :title="product.name">{{ product.name }}</span>
          <div class="white-space-nowrap">
            <span v-if="product.purchasedDate"
                  class="subtext me-2">Purchased on {{ new Date(product.purchasedDate).toDateString() }}</span>
            <button type="button"
                    v-if="!product.purchasedDate"
                    @click="editProduct(product)"
                    class="btn btn-primary btn-sm me-2"
                    title="Edit">
              <i class="bi-pencil-fill"></i>
            </button>
            <button type="button"
                    v-if="!product.purchasedDate"
                    @click="reorder(product, true)"
                    class="btn btn-secondary btn-sm me-2"
                    title="Reorder Up"
                    :disabled="product.sortOrder === 1">
              <i class="bi-arrow-up"></i>
            </button>
            <button type="button"
                    v-if="!product.purchasedDate"
                    @click="reorder(product, false)"
                    class="btn btn-secondary btn-sm me-2"
                    title="Reorder Down"
                    :disabled="product.sortOrder === products.length">
              <i class="bi-arrow-down"></i>
            </button>
            <button type="button"
                    v-if="!product.purchasedDate"
                    @click="confirmMarkPurchased(product)"
                    class="btn btn-secondary btn-sm"
                    title="Show">
              <i class="bi-eye-slash-fill"></i>
            </button>
            <button type="button"
                    v-if="product.purchasedDate"
                    @click="confirmDeleteProduct(product)"
                    class="btn btn-danger btn-sm"
                    title="Delete">
              <i class="bi-trash-fill"></i>
            </button>
          </div>
        </div>
        <h5>{{ convertToCurrency(product.cost) }}</h5>
        <a :href="product.url" target="_blank" class="text-trim">{{ product.url }}</a>
      </div>
    </div>
  </div>

  <AddGroup ref="addGroupModal" />
  <AddProduct ref="addProductModal" />
  <MarkPurchasedModal ref="markPurchasedModal" />
  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script>
import 'bootstrap/js/dist/dropdown'
import { mapState } from 'vuex'
import AddGroup from './AddGroup.vue'
import AddProduct from './AddProduct.vue'
import MarkPurchasedModal from './MarkPurchasedModal.vue'
import DeleteConfirmation from './shared/DeleteConfirmation.vue'

export default {
  name: 'ProductList',
  components: {
    AddGroup,
    AddProduct,
    DeleteConfirmation,
    MarkPurchasedModal
  },
  computed: {
    ...mapState({
      products: state => state.products.all
    })
  },
  data () {
    return {
      showPurchased: false
    }
  },
  methods: {
    openAddGroupDialog () {
      if (this.$refs.addGroupModal) {
        this.$refs.addGroupModal.open()
      }
    },
    editProduct(product) {
      if (this.$refs.addProductModal) {
        this.$refs.addProductModal.open(product)
      }
    },
    openAddProductDialog () {
      if (this.$refs.addProductModal) {
        this.$refs.addProductModal.open()
      }
    },
    convertToCurrency (valueToConvert) {
      return this.$filters.toCurrency(valueToConvert)
    },

    toggleShowPurchased () {
      this.showPurchased = !this.showPurchased
      this.$store.dispatch('products/get', this.showPurchased)
    },

    confirmDeleteProduct (product) {
      if (this.$refs.deleteConfirmationModal && product) {
        this.$refs.deleteConfirmationModal.open(this.deleteProduct, product.id, product.name)
      }
    },
    async deleteProduct (id) {
      await this.$store.dispatch('products/delete', id)
    },

    confirmMarkPurchased (product) {
      if (this.$refs.markPurchasedModal && product?.id) {
        this.$refs.markPurchasedModal.open(this.markPurchased, product.id, product.name)
      }
    },

    async markPurchased (id, date) {
      if (!id || !date) {
        return
      }
      const request = {
        id,
        date
      }
      await this.$store.dispatch('products/markPurchased', request)
    },

    async reorder (product, isUp) {
      if ((isUp && product.sortOrder === 0) ||
        (!isUp && product.sortOrder === this.products.reduce((a, b) => a.sortOrder > b.sortOrder ? a : b))) {
        return
      }
      const newOrder = isUp ? product.sortOrder - 1 : product.sortOrder + 1
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

.subtext {
  font-size: 15px;
  font-weight: 100;
}
</style>