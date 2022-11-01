<template>
  <div class="modal fade" ref="modalRef" tabindex="-1" aria-hidden="true">
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
            <label class="form-label">Date Purchased</label>
            <input v-model="state.date"
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

<script setup lang="ts">
import { type Ref, ref, nextTick, reactive, onMounted } from 'vue';
import { Modal } from 'bootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const modalRef = ref()
let modal: Modal | null = null

const state = reactive({
  date: toShortDate(new Date(), 'yyyy-MM-dd')
})

const rules = {
  date: { required }
}

const v$ = useVuelidate(rules, state)

let callback: undefined | ((id: number, date: string) => Promise<void>) = undefined
const id: Ref<number | undefined> = ref(undefined)
const name: Ref<string | undefined> = ref(undefined)

defineExpose({
  open,
})

onMounted(() => {
  modal = new Modal(modalRef.value);
})

function open(cb: (id: number, date: string) => Promise<void>, newId: number, newName: string) {
  modal?.show()
  callback = cb
  id.value = newId
  name.value = newName
  state.date = toShortDate(new Date(), 'yyyy-MM-dd')
  nextTick(() => {
    v$.value.$reset()
  })
}

function close() {
  modal?.hide()
}

function callAction() {
  if (callback && id.value) {
    callback(id.value, state.date)
    close()
  }
}

function toShortDate(toConvertDate: Date, format: string): string {
  if (!(toConvertDate instanceof Date) || !format) {
      return ''
    }

    const monthString = padZeros(toConvertDate.getMonth()+1, 2)
    const dayString = padZeros(toConvertDate.getDate(), 2)
    const yearString = padZeros(toConvertDate.getFullYear(), 4)

    let result = format 
    result = result.replace('MM', monthString)
    result = result.replace('dd', dayString)
    result = result.replace('yyyy', yearString)
    return result
}

function padZeros (value: number, numberOfDigits: number): string {
  if (value === null || value === undefined || isNaN(value) || !numberOfDigits) return ''

  const valueString = value.toString()
  const characterCount = valueString.length

  if (numberOfDigits < characterCount) return ''
  const zeroString = '0'.repeat(numberOfDigits - characterCount)

  return zeroString + valueString
}
</script>
