import { Provider } from '@/helpers/provider'
import { ethers } from 'ethers'
import PairABI from '@/abis/PairABI.json'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Boom = require('@hapi/boom')

const providerInstance = Provider.getInstance()
const provider = providerInstance.provider

// eslint-disable-next-line import/prefer-default-export
export const getERC20Balance = async (
  tokenAddress: string,
  walletAddress: string
) => {
  const ERC20Contract = new ethers.Contract(tokenAddress, PairABI, provider)

  try {
    const data = await ERC20Contract.balanceOf(walletAddress)

    return data
  } catch (err) {
    console.error('getERC20balance error', err)
    throw Boom.badRequest('getERC20balance error')
  }
}
