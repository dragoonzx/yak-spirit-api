import { BigNumber } from 'bignumber.js'

function isString(s: unknown) {
  return typeof s === 'string' || s instanceof String
}

// eslint-disable-next-line import/prefer-default-export
export function toBaseUnit(value: string, decimals: number) {
  if (!isString(value)) {
    throw new Error('Pass strings to prevent floating point precision issues.')
  }
  const ten = new BigNumber(10)
  const base = ten.pow(new BigNumber(decimals))

  // Is it negative?
  const negative = value.substring(0, 1) === '-'
  if (negative) {
    value = value.substring(1)
  }

  if (value === '.') {
    throw new Error(
      `Invalid value ${value} cannot be converted to` +
        ` base unit with ${decimals} decimals.`
    )
  }

  // Split it into a whole and fractional part
  const comps = value.split('.')
  if (comps.length > 2) {
    throw new Error('Too many decimal points')
  }

  let whole: string | BigNumber = comps[0]
  let fraction: string | BigNumber = comps[1]

  if (!whole) {
    whole = '0'
  }
  if (!fraction) {
    fraction = '0'
  }
  if (fraction.length > decimals) {
    throw new Error('Too many decimal places')
  }

  while (fraction.length < decimals) {
    fraction += '0'
  }

  whole = new BigNumber(whole)
  fraction = new BigNumber(fraction)
  let wei = whole.multipliedBy(base).plus(fraction)

  if (negative) {
    wei = wei.absoluteValue()
  }

  return new BigNumber(wei.toString(10), 10)
}
