<template>
  <div class="modal fade" id="exampleModal" ref="modalRef" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-trim" id="exampleModalLabel">
            <span v-if="!product">Add Product</span>
            <span v-if="product" :title="product.name">Update Product - {{ product.name }}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row gy-3">
              <div class="col-sm-12">
                <label class="form-label">Name</label>
                <input v-model="state.name"
                        type="text"
                        id="dialog-name"
                        class="form-control"
                        :class="{ 'is-invalid': v$.name.$error }"
                        placeholder="Name"
                        maxlength="100"
                        @blur="v$.name.$touch">
                <div class="input-errors" v-for="error of v$.name.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>

              <div class="col-sm-12">
                <label class="form-label">URL</label>
                <input v-model="state.url"
                  type="text"
                  id="dialog-url"
                  class="form-control"
                  placeholder="URL"
                  maxlength="500">
              </div>

              <div class="col-sm-12">
                <label class="form-label">Cost</label>
                <CurrencyInput v-model.number="state.cost"
                                v-select-all
                                id="dialog-cost"
                                name="cost"
                                :class="{ 'is-invalid': v$.cost.$error }"
                                :options="{ currency: 'USD', precision: 2 }"
                                @blur="v$.cost.$touch"/>
                <div class="input-errors" v-for="error of v$.cost.$errors" :key="error.$uid">
                  <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button"
                  class="btn btn-secondary"
                  @click="close()">Close</button>
          <button type="button"
                  v-if="product"
                  class="btn btn-danger"
                  @click="confirmDeleteProduct(product)">Delete</button>
          <button type="button"
                  class="btn btn-primary"
                  :disabled="v$.$invalid"
                  @click="save()">Save</button>
        </div>
      </div>
    </div>
  </div>

  <DeleteConfirmation ref="deleteConfirmationModal" />
</template>

<script setup lang="ts">
import { Modal } from 'bootstrap'
import { type Ref, ref, computed, type ComputedRef, reactive, onMounted, nextTick } from 'vue'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { useProductStore } from '@/store/product'

import CurrencyInput from '@/components/shared/CurrencyInput.vue'
import DeleteConfirmation from '@/components/shared/DeleteConfirmation.vue'
import type { Product } from '@/models'

const modalRef = ref()
let modal: Modal | null = null

const productStore = useProductStore()

const products: ComputedRef<Array<any>> = computed(() => productStore.all)

const rules = {
  name: { required },
  cost: { required },
}

const state = reactive({
  name: '',
  url: '',
  cost: 0.00,
})

const v$ = useVuelidate(rules, state)

const deleteConfirmationModal = ref()

const product: Ref<any | undefined> = ref(undefined)
const id: Ref<number | undefined> = ref(undefined)

defineExpose({
  open,
})

onMounted(() => {
  modal = new Modal(modalRef.value);
})

function open(newProduct: any) {
  modal?.show()
  reset(newProduct)
}

function close() {
  modal?.hide()
}

function reset(newProduct: any) {
  product.value = newProduct
  id.value = newProduct ? newProduct.id : undefined
  state.name = newProduct ? newProduct.name : ''
  state.url = newProduct ? newProduct.url : ''
  state.cost = newProduct ? convertCurrencyToNumber(newProduct.cost) : 0.00
  nextTick(() => {
    v$.value.$reset()
  })
}

function convertCurrencyToNumber (currency: number): number {
  return Number(currency?.toString().replace(/[^0-9.]+/g, ''))
}

function confirmDeleteProduct(oldProduct: any) {
  if (deleteConfirmationModal.value && oldProduct?.id) {
    deleteConfirmationModal.value.open(deleteProduct, oldProduct.id, oldProduct.name)
  }
}

async function deleteProduct(oldId: number): Promise<void> {
  if(!oldId) {
    return
  }
  await productStore.deleteProduct(oldId)
  close()
}

async function save () {
  if (v$.value.$invalid) {
    return
  }

  if (product.value) {
    const request: Product = {
      id: product.value.id,
      name: state.name,
      url: state.url,
      cost: state.cost,
      sortOrder: product.value.sortOrder
    } as Product;
    await productStore.update(request)
  } else {
    const newSortOrder = products.value.length + 1
    const request: Product = {
      name: state.name,
      url: state.url,
      cost: state.cost,
      sortOrder: newSortOrder
    } as Product;
    await productStore.create(request)
  }
  close()
}
</script>
