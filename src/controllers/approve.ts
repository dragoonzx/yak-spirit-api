import { ADDRESSES, MaxUint256 } from '@/helpers/constants'
import { Controller, Get, Query } from 'amala'
import {
  approveTokenSpender,
  getTokenAllowanceAmount,
} from '@/logic/approveToken'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Boom = require('@hapi/boom')

@Controller('/approve')
export default class ApproveController {
  @Get('/spender')
  getYakRouter() {
    const yakRouterAddressToApprove = {
      address: ADDRESSES.helpers.yakRouter,
    }

    return yakRouterAddressToApprove
  }

  @Get('/transaction')
  getTxDataForTokenApprove(
    @Query('fromAddress') fromAddress: string,
    @Query('tokenAddress') tokenAddress: string,
    @Query('amount') amount?: string
  ) {
    if (!(fromAddress && tokenAddress)) {
      throw Boom.badRequest('Missing query params')
    }

    if (!amount) {
      amount = MaxUint256
    }

    const txData = approveTokenSpender(fromAddress, tokenAddress, amount)
    return txData
  }

  @Get('/allowance')
  async getAllowedTokensAmount(
    @Query('fromAddress') fromAddress: string,
    @Query('tokenAddress') tokenAddress: string
  ) {
    if (!(fromAddress && tokenAddress)) {
      throw Boom.badRequest('Missing query params')
    }

    const allowance = await getTokenAllowanceAmount(fromAddress, tokenAddress)

    return {
      allowance,
    }
  }
}
