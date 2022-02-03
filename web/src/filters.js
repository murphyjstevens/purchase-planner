export const filters = {
  toCurrency (value) {
    if (typeof value !== 'number') {
      return value
    }
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
    return formatter.format(value)
  },

  toShortDate (value, format = 'MM/dd/yyyy') {
    if (!(value instanceof Date) || !format) {
      return value
    }

    const monthString = this.padZeros(value.getMonth()+1, 2)
    const dayString = this.padZeros(value.getDate(), 2)
    const yearString = this.padZeros(value.getFullYear(), 4)

    let result = format 
    result = result.replace('MM', monthString)
    result = result.replace('dd', dayString)
    result = result.replace('yyyy', yearString)
    return result
  },

  padZeros (value, numberOfDigits) {
    if (value === null || value === undefined || isNaN(value) || !numberOfDigits) return

    const valueString = value.toString()
    const characterCount = valueString.length

    if (numberOfDigits < characterCount) return
    const zeroString = '0'.repeat(numberOfDigits - characterCount)

    return zeroString + valueString
  },
}
