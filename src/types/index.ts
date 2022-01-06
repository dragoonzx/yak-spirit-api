import { BigNumber } from 'bignumber.js'

export interface IBestPath {
  amounts: BigNumber[]
  adapters: string[]
  path: string[]
  gasEstimate: BigNumber
}
