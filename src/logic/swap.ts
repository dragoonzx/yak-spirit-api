import { ADDRESSES, AVALANCHE_CHAIN_ID } from '@/helpers/constants'
import { BigNumber } from 'bignumber.js'
import { Provider } from '@/helpers/provider'
import { Interface } from 'ethers/lib/utils'
import { getTokenAllowanceAmount } from './approveToken'
import { IBestPath } from '@/types'
import { getERC20Balance } from './getERC20Balance'
const Boom = require('@hapi/boom')

type GetSwapDataProps = {
  trade: IBestPath
  fromAVAX: boolean
  toAVAX: boolean
  signer: string
}

const providerInstance = Provider.getInstance()
const provider = providerInstance.provider
const yakRouterAddress = ADDRESSES.helpers.yakRouter
const fee = 0

export const getSwapTxData = async (payload: GetSwapDataProps) => {
  const signer = payload.signer

  if (signer) {
    const { trade, fromAVAX, toAVAX } = payload

    const formattedTrade = {
      amountIn: trade.amounts[0],
      amountOut: trade.amounts[trade.amounts.length - 1],
      path: trade.path,
      adapters: trade.adapters,
    }

    const gasPrice = await provider.getGasPrice()

    if (fromAVAX) {
      const balance = await provider.getBalance(signer)
      if (
        new BigNumber(trade.amounts[0]).gt(new BigNumber(balance.toString()))
      ) {
        throw Boom.badRequest('Not enough balance')
      }

      try {
        const iface = new Interface([
          'function swapNoSplitFromAVAX(tuple(uint256 amountIn, uint256 amountOut, address[] path, address[] adapters) _trade, address _to, uint256 _fee)',
        ])
        const fragment = iface.getFunction('swapNoSplitFromAVAX')

        const encodedData = iface.encodeFunctionData(fragment, [
          formattedTrade,
          signer,
          fee,
        ])

        const txData = {
          from: signer,
          to: yakRouterAddress,
          data: encodedData,
          value: '0x' + new BigNumber(trade.amounts[0]).toString(16),
          gasPrice: gasPrice.toHexString(),
          chainId: '0x' + AVALANCHE_CHAIN_ID.toString(16),
        }

        return txData
      } catch (err) {
        console.error(err)
        throw Boom.badRequest('swap from avax error')
      }
    } else {
      const fromTokenAddress = trade.path[0]
      const allowance = await getTokenAllowanceAmount(signer, fromTokenAddress)

      if (new BigNumber(trade.amounts[0]).gt(new BigNumber(allowance))) {
        throw Boom.badRequest('Not enough allowance')
      }

      const tokenBalance = await getERC20Balance(trade.path[0], signer)

      if (
        new BigNumber(trade.amounts[0]).gt(
          new BigNumber(tokenBalance.toString())
        )
      ) {
        throw Boom.badRequest('Not enough balance')
      }

      try {
        if (toAVAX) {
          const iface = new Interface([
            'function swapNoSplitToAVAX(tuple(uint256 amountIn, uint256 amountOut, address[] path, address[] adapters) _trade, address _to, uint256 _fee)',
          ])
          const fragment = iface.getFunction('swapNoSplitToAVAX')

          const encodedData = iface.encodeFunctionData(fragment, [
            formattedTrade,
            signer,
            fee,
          ])

          const txData = {
            from: signer,
            to: yakRouterAddress,
            data: encodedData,
            gasPrice: gasPrice.toHexString(),
            chainId: '0x' + AVALANCHE_CHAIN_ID.toString(16),
          }

          return txData
        } else {
          const iface = new Interface([
            'function swapNoSplit(tuple(uint256 amountIn, uint256 amountOut, address[] path, address[] adapters) _trade, address _to, uint256 _fee)',
          ])
          const fragment = iface.getFunction('swapNoSplit')

          const encodedData = iface.encodeFunctionData(fragment, [
            formattedTrade,
            signer,
            fee,
          ])

          const txData = {
            from: signer,
            to: yakRouterAddress,
            data: encodedData,
            gasPrice: gasPrice.toHexString(),
            chainId: '0x' + AVALANCHE_CHAIN_ID.toString(16),
          }

          return txData
        }
      } catch (err) {
        console.error(err)
        throw Boom.badRequest('swap from token error')
      }
    }
  }
}
