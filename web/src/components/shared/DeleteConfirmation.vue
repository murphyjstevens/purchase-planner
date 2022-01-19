<template>
  <div class="modal fade" ref="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <span>Confirm Delete</span>
            <span v-if="name">: {{name}}</span>
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

<script>
import { Modal } from 'bootstrap'
export default {
  name: 'DeleteConfirmation',
  data () {
    return {
      deleteCallback: null,
      id: null,
      name: null
    }
  },
  methods: {
    open (deleteCallback, id, name) {
      this.modal.show()
      this.deleteCallback = deleteCallback
      this.id = id
      this.name = name
    },
    close () {
      this.modal.hide()
    },
    callDelete () {
      this.deleteCallback(this.id)
      this.close()
    }
  },
  mounted () {
    this.modal = new Modal(this.$refs.modal, {})
  }
}
</script>

<style scoped lang="scss">
</style>