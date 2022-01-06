import BigNumber from 'bignumber.js'
import tokenList from '@/assets/tokenlist/defi.tokenlist.json'

export const WALLET_ADDRESS = '0xB02279F5D6F34851634Aa48ffa4d6d127c0b6998'

export const amountIn = '1000000000000000000'
export const WAVAX = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'
export const PNG = '0x60781C2586D68229fde47564546784ab3fACA982'
export const AVAX = '0x0000000000000000000000000000000000000000'

export const tokenListLength = tokenList.tokens.length

export const txDataObjectWithoutValue = {
  from: '0xB02279F5D6F34851634Aa48ffa4d6d127c0b6998',
  to: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  data: '0x095ea7b3000000000000000000000000c4729e56b831d74bbc18797e0e17a295fa77488c0000000000000000000000000000000000000000000000008ac7230489e80000',
  chainId: '0xa86a',
}

export const txDataObject = {
  from: '0xB02279F5D6F34851634Aa48ffa4d6d127c0b6998',
  to: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  data: '0x095ea7b3000000000000000000000000c4729e56b831d74bbc18797e0e17a295fa77488c0000000000000000000000000000000000000000000000008ac7230489e80000',
  chainId: '0xa86a',
  value: '0xa86a',
}

export const bestPathObject = {
  amounts: [new BigNumber(0)],
  path: ['0x'],
  gasEstimate: new BigNumber(0),
  adapters: ['0x'],
}

export const ERROR_NOT_ENOUGH_BALANCE = 'Not enough balance'

describe('init fixtures', () => {
  it('should always return true', () => {
    expect(1).toBe(1)
  })
})
