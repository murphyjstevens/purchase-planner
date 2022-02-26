<template>
  <div class="modal fade" ref="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-trim">
            <span>Mark Purchased</span>
            <span v-if="name" :title="name">: {{name}}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">

          <div class="col-sm-12">
            <label for="date" class="form-label">Date Purchased</label>
            <input v-model="date"
                    type="date"
                    id="date"
                    class="form-control"
                    :class="{ 'is-invalid': v$.date.$error }"
                    placeholder="MM/dd/yyyy"
                    required>
            <div class="input-errors" v-for="error of v$.date.$errors" :key="error.$uid">
              <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button"
            class="btn btn-secondary"
            @click="close()">Cancel</button>
          <button type="button"
            class="btn btn-primary"
            @click="callAction()">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
export default {
  name: 'MarkPurchasedModal',
  data () {
    return {
      callback: null,
      id: null,
      name: null,
      date: null
    }
  },
  methods: {
    open (callback, id, name) {
      this.modal.show()
      this.callback = callback
      this.id = id
      this.name = name
      this.date = this.$filters.toShortDate(new Date(), 'yyyy-MM-dd')
      this.$nextTick(() => {
        this.v$.$reset()
      })
    },
    close () {
      this.modal.hide()
    },
    callAction () {
      this.callback(this.id, this.date)
      this.close()
    }
  },
  mounted () {
    this.modal = new Modal(this.$refs.modal, {})
  },
  setup () {
    return { v$: useVuelidate() }
  },
  validations () {
    return {
      date: { required }
    }
  }
}
</script>

<style scoped lang="scss">
</style>