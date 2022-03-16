import { ADDRESSES } from '@/helpers/constants'
import { IBestPath } from '@/types'
import { Interface } from 'ethers/lib/utils'
import { Provider } from '@/helpers/provider'
import { ethers } from 'ethers'
import Multicall from '@/abis/Multicall.json'
import YakRouterABI from '@/abis/YakRouter.json'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Boom = require('@hapi/boom')

const providerInstance = Provider.getInstance()
const provider = providerInstance.provider

const PNG = '0x60781c2586d68229fde47564546784ab3faca982'
const YAK = '0x59414b3089ce2af0010e7523dea7e2b35d776ec7'

// eslint-disable-next-line import/prefer-default-export
export const getMultipathOffer = async (
  payload: {
    fromToken: string
    toToken: string
    amount: ethers.BigNumber
  },
  maxSteps: number
): Promise<any> => {
  if (provider) {
    const { fromToken, toToken, amount } = payload
    const yakRouterAddress = ADDRESSES.helpers.yakRouter
    // divide amount by percents => get amount distribution

    const yakRouterContract = new ethers.Contract(
      yakRouterAddress,
      YakRouterABI,
      provider
    )

    try {
      const data = await yakRouterContract.findBestPathWithGas(
        amount,
        fromToken,
        toToken,
        3,
        225
      )
      // path[], amounts[]
      // [A, B, C]
      // 1. fromToken: A, toToken: B
      // 2. fromToken: B, toToken: C
      const bestPathAmountOut = data.amounts[data.amounts.length - 1]

      // try to split 1st path between DEXES: WAVAX -> JOE (by trader joe 50%), WAVAX -> JOE (by PNG 50%)
      // 0 -> PNG, 8 -> JOE
      const favoriteAdapters = [0, 8]
      console.log('path', data.path)

      let amounts = getAmountDistribution(amount)

      // BFS
      // { amount, path: { percent, amount }[] }
      const bestQueryAmountOut: any = []

      for (let i = 0; i < data.path.length - 1; i++) {
        const bestQueryAmountMatrix: any[] = []

        for (let j = 0; j < favoriteAdapters.length; j++) {
          for (
            let amountIndex = 0;
            amountIndex < amounts.length;
            amountIndex++
          ) {
            const tempQueryAmountOut = await yakRouterContract.queryAdapter(
              amounts[amountIndex],
              data.path[i],
              data.path[i + 1],
              favoriteAdapters[j]
            )

            if (bestQueryAmountMatrix[j]) {
              bestQueryAmountMatrix[j][amountIndex] = tempQueryAmountOut
            } else {
              bestQueryAmountMatrix[j] = [tempQueryAmountOut]
            }
          }
        }

        console.log(bestQueryAmountMatrix)

        bestQueryAmountOut.push({
          amountOut: ethers.BigNumber.from(0),
          path: {
            percents: favoriteAdapters.map(() => 0),
            amounts: favoriteAdapters.map(() => '0'),
            adapters: favoriteAdapters.map(() => ''),
          },
        })

        // const amount = bestQueryAmountMatrix[dexIndex][dexAmontIndex].add(
        //   bestQueryAmountMatrix[dexIndex + 1][dexAmountIndexNext]
        // )

        // // sum should be 10, e.g. 3 + 7
        // if (
        //   dexAmontIndex + 1 + (dexAmountIndexNext + 1) <= 10 &&
        //   amount.gt(bestQueryAmountOut[i].amountOut)
        // ) {
        //   bestQueryAmountOut[i].amountOut = amount
        //   bestQueryAmountOut[i].path = {
        //     percents: [dexAmontIndex + 1, dexAmountIndexNext + 1],
        //     amounts: [
        //       bestQueryAmountMatrix[dexIndex][dexAmontIndex].toString(),
        //       bestQueryAmountMatrix[dexIndex + 1][
        //         dexAmountIndexNext
        //       ].toString(),
        //     ],
        //     adapters: ['', ''],
        //   }
        // }

        // [[1, 2, 3], [1,2,3], ...]
        for (
          let dexIndex = 0;
          dexIndex < bestQueryAmountMatrix.length;
          dexIndex++
        ) {
          // CHANGE TO ALL AGGREGATORS SEARCH
          // sort by best amountOut 10/10
          // get first amount + dexIndex
          //
        }

        // new amounts when we go to next token
        amounts = getAmountDistribution(bestQueryAmountOut[i].amountOut)
      }

      console.log(JSON.stringify(bestQueryAmountOut, null, 4))
      console.log(bestPathAmountOut)

      // console.log(
      //   'bestPathAmountOut bigger bestQueryAmountOut?',
      //   bestPathAmountOut.gte(bestQueryAmountOut.amountOut)
      // )

      // console.log(
      //   'bestPathAmountOut > bestQueryAmountOut amount: ',
      //   bestPathAmountOut.gt(bestQueryAmountOut)
      // )
      // await yakRouterContract
      // 8: joe
      // 0: png
      // console.log(
      //   await getIndexOfAdapter(
      //     yakRouterContract,
      //     '0x3614657EDc3cb90BA420E5f4F61679777e4974E3'
      //   )
      // )
      return data
    } catch (err) {
      console.error(err)
    }
  }
}

// 100000000 WAVAX to JOE
// curl -X GET 'http://localhost:1337/api/swap/multipath?amount=100000000&fromTokenAddress=0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7&toTokenAddress=0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd'
//

async function getIndexOfAdapter(yakRouterContract: any, adapter: string) {
  for (let i = 0; i < 36; i++) {
    const data = await yakRouterContract.ADAPTERS(i)
    if (data === adapter) {
      return i
    }
  }
}

// can be problems with 50% of 101
function getAmountDistribution(amount: ethers.BigNumber): ethers.BigNumber[] {
  const distributionPercent = 10
  const percents = []
  const amounts = []

  for (let i = 1; i <= 100 / distributionPercent; i++) {
    percents.push(i * distributionPercent)
    amounts.push(amount.mul(i * distributionPercent).div(100))
  }

  return amounts
}
