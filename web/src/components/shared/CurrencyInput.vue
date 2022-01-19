<template>
  <input 
    ref="inputRef"
    type="text"
    :value="formattedValue"
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
    const { formattedValue, inputRef } = useCurrencyInput(props.options)
    return { inputRef, formattedValue }
  }
}
</script>