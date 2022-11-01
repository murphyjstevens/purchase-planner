<template>
  <div class="container">
    <div class="d-flex justify-content-between mb-3">
      <div class="dropdown">
        <button type="button"
          class="btn btn-outline-light btn-lg"
          aria-expanded="false"
          @click="openAddProductDialog()"
          :disabled="showPurchased">
          <i class="bi-plus-lg"></i>
          Add
        </button>
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

  <AddProduct ref="addProductModal" />
  <MarkPurchasedModal ref="markPurchasedModal" />
  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script setup lang="ts">
import { type Ref, ref, type ComputedRef, computed, onMounted } from 'vue'

import { useProductStore } from '@/store/product'
import AddProduct from './AddProduct.vue'
import MarkPurchasedModal from './MarkPurchasedModal.vue'
import DeleteConfirmation from './shared/DeleteConfirmation.vue'
import type Product from '@/models/product'

const productStore = useProductStore()

const addProductModal = ref()
const markPurchasedModal = ref()
const deleteConfirmationModal = ref()

const showPurchased: Ref<boolean> = ref(false)

const products: ComputedRef<any> = computed(() => productStore.all)

onMounted(() => {
  productStore.get(false)
})

function editProduct(product: Product) {
  if (addProductModal.value) {
    addProductModal.value.open(product)
  }
}

function openAddProductDialog() {
  if (addProductModal.value) {
    addProductModal.value.open()
  }
}

function convertToCurrency (valueToConvert: number) {
  if (typeof valueToConvert !== 'number') {
    return valueToConvert
  }
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
  return formatter.format(valueToConvert)
}

function toggleShowPurchased() {
  showPurchased.value = !showPurchased.value
  productStore.get(showPurchased.value)
}

function confirmDeleteProduct(product: Product) {
  if (deleteConfirmationModal.value && product) {
    deleteConfirmationModal.value.open(deleteProduct, product.id, product.name)
  }
}

async function deleteProduct(id: number) {
  productStore.deleteProduct(id)
}

function confirmMarkPurchased(product: Product) {
  if (markPurchasedModal.value && product?.id) {
    markPurchasedModal.value.open(markPurchased, product.id, product.name)
  }
}

async function markPurchased(id: number, date: string): Promise<void> {
  if (!id || !date) {
    return
  }
  const request = { id, date }
  await productStore.markPurchased(request)
}

async function reorder(product: Product, isUp: boolean) {
  if ((isUp && product.sortOrder === 0) ||
      (!isUp && product.sortOrder === products.value.reduce((a: Product, b: Product) => a.sortOrder > b.sortOrder ? a : b))) {
      return
    }
  const newOrder = isUp ? product.sortOrder - 1 : product.sortOrder + 1
  const otherProduct = products.value.find((p: Product) => p.sortOrder === newOrder)
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
  await productStore.reorder(reorderRequest)
}

</script>

<style scoped>
.card {
  background-color: white;
  color: inherit;
  text-decoration: none;
  margin: 15px 0;
}

.card-title {
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
}

.subtext {
  font-size: 15px;
  font-weight: 100;
}
</style>