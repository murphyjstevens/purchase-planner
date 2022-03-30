<template>
  <div class="modal fade" id="exampleModal" ref="modal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-trim" id="modalTitle">
            <span v-if="!group">Add Group</span>
            <span v-if="group" :title="group.name">Update Group - {{ group.name }}</span>
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
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button"
                  class="btn btn-secondary"
                  @click="close()">Close</button>
          <button type="button"
                  v-if="group"
                  class="btn btn-danger"
                  @click="confirmDelete(group)">Delete</button>
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
import Modal from 'bootstrap/js/dist/modal'
import { mapState } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import DeleteConfirmation from './shared/DeleteConfirmation.vue'

export default {
  name: 'AddGroup',
  components: {
    DeleteConfirmation
  },
  computed: {
    ...mapState({
      groups: state => state.groups.all
    })
  },
  data () {
    return {
      modal: undefined,
      group: null,
      id: null,
      name: ''
    }
  },
  setup () {
    return { v$: useVuelidate() }
  },
  mounted () {
    this.modal = new Modal(this.$refs.modal, {})
  },
  methods: {
    open (group) {
      this.modal.show()
      this.reset(group)
    },
    close () {
      this.modal.hide()
    },
    reset (group) {
      this.group = group
      this.id = group ? group.id : null
      this.name = group ? group.name : null
      this.$nextTick(() => {
        this.v$.$reset()
      })
    },

    confirmDelete (group) {
      if (this.$refs.deleteConfirmationModal && group?.id) {
        this.$refs.deleteConfirmationModal.open(this.delete, group.id, group.name)
      }
    },
    async delete (id) {
      if (!id) {
        return
      }
      // await this.$store.dispatch('products/delete', id)
      this.close()
    },
    async save () {
      if (this.v$.invalid) {
        return
      }

      // if (this.product) {
      //   const request = {
      //     id: this.product.id,
      //     name: this.name,
      //     url: this.url,
      //     cost: this.cost,
      //     sortOrder: this.product.sortOrder
      //   }
      //   await this.$store.dispatch('products/update', request)
      // } else {
      //   const newSortOrder = this.products.length + 1
      //   const request = {
      //     name: this.name,
      //     url: this.url,
      //     cost: this.cost,
      //     sortOrder: newSortOrder
      //   }
      //   await this.$store.dispatch('products/create', request)
      // }
      this.close()
    }
  },
  validations () {
    return {
      name: { required }
    }
  }
}
</script>

<style scoped lang="scss">
</style>