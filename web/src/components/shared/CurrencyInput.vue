<template>
  <input 
    ref="inputRef"
    type="text"
    class="form-control text-right">
</template>

<script>
import { useCurrencyInput } from 'vue-currency-input'

export default {
  name: 'CurrencyInput',
  props: {
    modelValue: Number,
    options: Object
  },
  setup (props) {
    const { inputRef } = useCurrencyInput(props.options)
    return { inputRef }
  }
}
</script>