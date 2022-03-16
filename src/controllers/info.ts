import { ADDRESSES } from '@/helpers/constants'
import { Controller, Get } from 'amala'
import tokenList from '@/assets/tokenlist/defi.tokenlist.json'

@Controller('/api/info')
export default class InfoController {
  @Get('/tokens')
  getTokensList() {
    return tokenList.tokens
  }

  @Get('/providers')
  getProvidersList() {
    return ADDRESSES.routers
  }
}
