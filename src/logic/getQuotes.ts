import { ADDRESSES } from '@/helpers/constants'
import { BigNumber } from 'bignumber.js'
import { IBestPath } from '@/types'
import { Provider } from '@/helpers/provider'
import { ethers } from 'ethers'
import YakRouterABI from '@/abis/YakRouter.json'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Boom = require('@hapi/boom')

const providerInstance = Provider.getInstance()
const provider = providerInstance.provider

// eslint-disable-next-line import/prefer-default-export
export const fetchPrices = async (
  payload: {
    fromToken: string
    toToken: string
    amount: BigNumber
  },
  maxSteps: number
): Promise<IBestPath | undefined> => {
  if (provider) {
    const { fromToken, toToken, amount } = payload
    const yakRouterAddress = ADDRESSES.helpers.yakRouter
    const yakRouterContract = new ethers.Contract(
      yakRouterAddress,
      YakRouterABI,
      provider
    )
    const gasPrice = await provider.getGasPrice()

    try {
      const data = await yakRouterContract.findBestPathWithGas(
        amount.toString(10),
        fromToken,
        toToken,
        maxSteps,
        gasPrice
      )
      return data
    } catch (err) {
      console.error('fetchPrices error', err)
      throw Boom.badRequest('fetchPrices error')
    }
  }
}
