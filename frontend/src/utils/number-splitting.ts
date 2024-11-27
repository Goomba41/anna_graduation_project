function numberToSplittedString(value: number | string, type: 'float' | 'integer' = 'integer') {
  let result: string = ''
  let param = value

  if (typeof value === 'number') {
    if (type === 'float') param = value.toFixed(2)
    param = param.toString()
  } else if (typeof value === 'string') {
    if (Number.isNaN(parseFloat(value))) {
      param = '0'
    } else {
      param = type === 'float' ? parseFloat(value).toFixed(2) : parseInt(value, 10)
      param = param.toString()
    }
  }

  if (typeof param === 'string') {
    let integerPart = param.split('.')[0]
    const decimalPart = param.split('.')[1] || ''

    integerPart = integerPart.split(/(?=(?:...)*$)/).join(' ')

    result = integerPart

    if (decimalPart) {
      result = [integerPart, decimalPart].join('.')
    }
  }

  return result
}

export default numberToSplittedString
