import { ADDRESSES, AVALANCHE_CHAIN_ID, MaxUint256 } from '@/helpers/constants'
import { Interface } from 'ethers/lib/utils'
import { Provider } from '@/helpers/provider'
import { ethers } from 'ethers'
import { toBaseUnit } from '@/helpers/toBaseUnit'
import PairABI from '@/abis/PairABI.json'
import tokenList from '@/assets/tokenlist/defi.tokenlist.json'
import type { BigNumber } from 'bignumber.js'

const defaultTokenDecimals = 18

const providerInstance = Provider.getInstance()
const provider = providerInstance.provider

export const approveTokenSpender = (
  fromAddress: string,
  tokenAddress: string,
  amount: string
) => {
  const spender = ADDRESSES.helpers.yakRouter

  const tokenInDecimals =
    tokenList.tokens.find((v) => v.address.toLowerCase() === fromAddress)
      ?.decimals ?? defaultTokenDecimals

  let value: BigNumber | string = amount

  if (amount !== MaxUint256) {
    value = toBaseUnit(String(amount), tokenInDecimals)
  }

  const iface = new Interface([
    'function approve(address spender, uint256 value) returns (bool)',
  ])
  const fragment = iface.getFunction('approve')

  const encodedData = iface.encodeFunctionData(fragment, [
    spender,
    value.toString(10),
  ])
  const txData = {
    from: fromAddress,
    to: tokenAddress,
    data: encodedData,
    chainId: '0x' + AVALANCHE_CHAIN_ID.toString(16),
  }

  return txData
}

export const getTokenAllowanceAmount = async (
  fromAddress: string,
  tokenAddress: string
) => {
  const spender = ADDRESSES.helpers.yakRouter

  const ERC20Contract = new ethers.Contract(tokenAddress, PairABI, provider)

  try {
    const data = await ERC20Contract.allowance(fromAddress, spender)

    return data.toString()
  } catch (err) {
    console.error('get allowance error', err)
  }
}
