<template>
  <div class="modal fade" ref="modalRef" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
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

<script setup lang="ts">
import { Modal } from 'bootstrap'
import { type Ref, ref, computed, type ComputedRef, reactive, onMounted } from 'vue'

import { mapState } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import DeleteConfirmation from '@/components/shared/DeleteConfirmation.vue'

const modalRef = ref()
let modal: Modal | null = null

const rules = {
  name: { required }
}

const state = reactive({
  name: '',
})

const v$ = useVuelidate(rules, state)

const deleteConfirmationModal = ref()

// const groups: ComputedRef<any> = computed(...mapState({groups: state => state.groups.all}))

const group: Ref<any | undefined> = ref(undefined)
const id: Ref<number | undefined> = ref(undefined)

defineExpose({
  open,
})

onMounted(() => {
  modal = new Modal(modalRef.value);
})
  
function open() {
  modal?.show()
  reset(group)
}

function close() {
  modal?.hide()
}

function reset(newGroup: any) {
  group.value = newGroup
  id.value = newGroup ? newGroup.id : undefined
  state.name = newGroup ? newGroup.name : ''
}

function confirmDelete(oldGroup: any) {
  if (deleteConfirmationModal.value && oldGroup?.id) {
    deleteConfirmationModal.value.open(deleteGroup, oldGroup.id, oldGroup.name)
  }
}

async function deleteGroup(oldId: number): Promise<void> {
  if (!oldId) {
    return
  }

  // await productStore.deleteProduct(oldId)
  close()
}

async function save() {
  if (v$.value.$invalid) {
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
  close()
}
</script>
