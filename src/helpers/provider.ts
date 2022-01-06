import { ethers } from 'ethers'
import { AVALANCHE_RPC_URL } from './constants'

export class Provider {
  private static instance: Provider
  public provider: ethers.providers.JsonRpcProvider

  private constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(AVALANCHE_RPC_URL)
  }

  public static getInstance(): Provider {
    if (!Provider.instance) {
      Provider.instance = new Provider()
    }

    return Provider.instance
  }
}
