import { Controller, Get, Query } from 'amala'
import { WAVAX, ZERO_ADDRESS } from '@/helpers/constants'
import { ethers } from 'ethers'
import { fetchPrices } from '@/logic/getQuotes'
import { getMultipathOffer } from '@/logic/getMultipathOffer'
import { getSwapTxData } from '@/logic/swap'
import { toBaseUnit } from '@/helpers/toBaseUnit'
import tokenList from '@/assets/tokenlist/defi.tokenlist.json'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Boom = require('@hapi/boom')

const defaultTokenDecimals = 18

@Controller('/swap')
export default class SwapController {
  @Get('/quote')
  async getBestPathOffer(
    @Query('amount') amount: number,
    @Query('fromTokenAddress') fromTokenAddress: string,
    @Query('toTokenAddress') toTokenAddress: string,
    @Query('maxSteps') maxSteps?: number
  ) {
    if (!(amount && fromTokenAddress && toTokenAddress)) {
      throw Boom.badRequest('Missing query params')
    }

    if (!maxSteps) {
      maxSteps = 3
    }

    const tokenInDecimals =
      tokenList.tokens.find(
        (v) => v.address.toLowerCase() === fromTokenAddress.toLowerCase()
      )?.decimals ?? defaultTokenDecimals

    fromTokenAddress =
      fromTokenAddress === ZERO_ADDRESS ? WAVAX : fromTokenAddress
    toTokenAddress = toTokenAddress === ZERO_ADDRESS ? WAVAX : toTokenAddress
    const bigAmount = toBaseUnit(String(amount), tokenInDecimals)

    const data = await fetchPrices(
      {
        fromToken: fromTokenAddress,
        toToken: toTokenAddress,
        amount: bigAmount,
      },
      maxSteps
    )

    if (!data) {
      return data
    }

    const formattedData = {
      amounts: data.amounts,
      adapters: data.adapters,
      path: data.path,
      gasEstimate: data.gasEstimate,
    }

    return formattedData
  }

  @Get('/')
  async getTxDataForSwap(
    @Query('fromAddress') from: string,
    @Query('amount') amount: number,
    @Query('fromTokenAddress') fromTokenAddress: string,
    @Query('toTokenAddress') toTokenAddress: string,
    @Query('slippage') slippage?: number,
    @Query('maxSteps') maxSteps?: number
  ) {
    if (!(from && amount && fromTokenAddress && toTokenAddress)) {
      throw Boom.badRequest('Missing query params')
    }

    const bestPathOffer = await this.getBestPathOffer(
      amount,
      fromTokenAddress,
      toTokenAddress,
      maxSteps
    )

    if (!bestPathOffer) {
      throw Boom.badRequest('Best path not found')
    }

    if (!slippage) {
      slippage = 0.2
    }

    const slippagePercent = slippage * 100

    const offerWithSlippage = {
      ...bestPathOffer,
      amounts: bestPathOffer.amounts.map((amount: any, index: any) =>
        index === 0
          ? amount.toString()
          : amount
              .mul(10000 - slippagePercent)
              .div('10000')
              .toString()
      ),
    }

    const payload = {
      trade: offerWithSlippage,
      fromAVAX: fromTokenAddress === ZERO_ADDRESS,
      toAVAX: toTokenAddress === ZERO_ADDRESS,
      signer: from,
    }
    return getSwapTxData(payload)
  }

  // curl -X GET 'http://localhost:1337/api/swap/multipath?amount=10000&fromTokenAddress=0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7&toTokenAddress=0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd'
  // @Get('/multipath')
  // async getMultipathOffer(
  //   @Query('amount') amount: number,
  //   @Query('fromTokenAddress') fromTokenAddress: string,
  //   @Query('toTokenAddress') toTokenAddress: string,
  //   @Query('maxSteps') maxSteps?: number
  // ) {
  //   if (!(amount && fromTokenAddress && toTokenAddress)) {
  //     throw Boom.badRequest('Missing query params')
  //   }

  //   if (!maxSteps) {
  //     maxSteps = 3
  //   }

  //   // get all routes from input to output tokens

  //   const tokenInDecimals =
  //     tokenList.tokens.find(
  //       (v) => v.address.toLowerCase() === fromTokenAddress.toLowerCase()
  //     )?.decimals ?? defaultTokenDecimals

  //   fromTokenAddress =
  //     fromTokenAddress === ZERO_ADDRESS ? WAVAX : fromTokenAddress
  //   toTokenAddress = toTokenAddress === ZERO_ADDRESS ? WAVAX : toTokenAddress
  //   const bigAmount = ethers.utils.parseUnits(String(amount), tokenInDecimals)

  //   const data = await getMultipathOffer(
  //     {
  //       fromToken: fromTokenAddress,
  //       toToken: toTokenAddress,
  //       amount: bigAmount,
  //     },
  //     maxSteps
  //   )

  //   // if (!data) {
  //   //   return data
  //   // }

  //   // const formattedData = {
  //   //   amounts: data.amounts,
  //   //   adapters: data.adapters,
  //   //   path: data.path,
  //   //   gasEstimate: data.gasEstimate,
  //   // }

  //   // return formattedData
  // }
}
