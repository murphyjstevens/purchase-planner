<template>
  <div class="modal fade" ref="modalRef" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-trim">
            <span>Confirm Delete</span>
            <span v-if="name" :title="name">: {{name}}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <span>Are you sure you would like to delete this item?</span>
        </div>
        <div class="modal-footer">
          <button type="button"
            class="btn btn-secondary"
            @click="close()">Cancel</button>
          <button type="button"
            class="btn btn-danger"
            @click="callDelete()">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Modal } from 'bootstrap'
import { type Ref, ref, onMounted } from 'vue';

const modalRef = ref()
let modal: Modal | null = null;

let callback: undefined | ((id: number) => void) = undefined
const id: Ref<number | undefined> = ref(undefined)
const name: Ref<string | undefined> = ref(undefined)

defineExpose({
  open,
})

onMounted(() => {
  modal = new Modal(modalRef.value);
})

function open(deleteCallback: (id: number) => void, newId: number, newName: string) {
  modal?.show()
  callback = deleteCallback
  id.value = newId
  name.value = newName
}

function close(): void {
  modal?.hide()
}

function callDelete(): void {
  if (callback && id.value) {
    callback(id.value)
    close()
  }
}
</script>
