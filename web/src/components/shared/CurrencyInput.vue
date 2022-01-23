<template>
  <input 
    ref="inputRef"
    type="text"
    class="form-control text-right">
</template>

<script>
import { watch } from 'vue'
import { useCurrencyInput } from 'vue-currency-input'

export default {
  name: 'CurrencyInput',
  props: {
    modelValue: Number,
    options: Object
  },
  setup (props) {
    const { inputRef, setValue } = useCurrencyInput(props.options)

    watch(
      () => props.modelValue,
      (value) => {
        setValue(value)
      }
    )

    return { inputRef }
  },
}
</script>