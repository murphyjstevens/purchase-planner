<template>
  <div class="modal fade" id="exampleModal" ref="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                <label for="dialog-name" class="form-label">Name</label>
                <input v-model="name"
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
                <label for="dialog-url" class="form-label">URL</label>
                <input v-model="url"
                  type="text"
                  id="dialog-url"
                  class="form-control"
                  placeholder="URL"
                  maxlength="500">
              </div>

              <div class="col-sm-12">
                <label for="dialog-cost" class="form-label">Cost</label>
                <CurrencyInput v-model.number="cost"
                                v-select-all
                                id="dialog-cost"
                                name="cost"
                                class="form-control"
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

<script>
import { Modal } from 'bootstrap'
import { mapState } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import CurrencyInput from './shared/CurrencyInput.vue'
import DeleteConfirmation from './shared/DeleteConfirmation.vue'

export default {
  name: 'AddProduct',
  components: {
    CurrencyInput,
    DeleteConfirmation
  },
  computed: {
    ...mapState({
      products: state => state.products.all
    })
  },
  data () {
    return {
      modal: undefined,
      product: null,
      id: null,
      name: '',
      url: '',
      cost: null
    }
  },
  setup () {
    return { v$: useVuelidate() }
  },
  mounted () {
    this.modal = new Modal(this.$refs.modal, {})
  },
  methods: {
    open (product) {
      this.modal.show()
      this.reset(product)
    },
    close () {
      this.modal.hide()
    },
    reset (product) {
      this.product = product
      this.id = product ? product.id : null
      this.name = product ? product.name : null
      this.url = product ? product.url : null
      this.cost = product ? this.convertCurrencyToNumber(product.cost) : null
      this.$nextTick(() => {
        this.v$.$reset()
      })
    },
    convertCurrencyToNumber (currency) {
      return Number(currency.replace(/[^0-9.]+/g, ''))
    },

    confirmDeleteProduct (product) {
      if (this.$refs.deleteConfirmationModal && product?.id) {
        this.$refs.deleteConfirmationModal.open(this.deleteProduct, product.id, product.name)
      }
    },
    async deleteProduct (id) {
      if (!id) {
        return
      }
      await this.$store.dispatch('products/delete', id)
      this.close()
    },
    async save () {
      if (this.v$.invalid) {
        return
      }

      if (this.product) {
        const request = {
          id: this.product.id,
          name: this.name,
          url: this.url,
          cost: this.cost,
          sortOrder: this.product.sortOrder
        }
        await this.$store.dispatch('products/update', request)
      } else {
        const newSortOrder = this.products.length + 1
        const request = {
          name: this.name,
          url: this.url,
          cost: this.cost,
          sortOrder: newSortOrder
        }
        await this.$store.dispatch('products/create', request)
      }
      this.close()
    }
  },
  validations () {
    return {
      name: { required },
      cost: { required }
    }
  }
}
</script>

<style scoped lang="scss">
  textarea {
    resize: none;
  }
</style>