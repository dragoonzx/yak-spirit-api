import { ADDRESSES } from '@/helpers/constants'
import {
  AVAX,
  ERROR_NOT_ENOUGH_BALANCE,
  WALLET_ADDRESS,
  WAVAX,
  bestPathObject,
} from '@/__tests__/fixtures'
import { Server } from 'http'
import request from 'supertest'
import runApp from '@/helpers/runApp'

describe('Swap endpoint', () => {
  let server: Server

  beforeAll(async () => {
    server = await runApp()
  })

  afterAll(() => {
    return new Promise<void>((resolve, reject) => {
      server.close((err) => {
        err ? reject(err) : resolve()
      })
    })
  })

  it('should return best path quote object', async () => {
    const response = await request(server).get(
      `/api/swap/quote?amount=10&fromTokenAddress=${AVAX}&toTokenAddress=${WAVAX}`
    )
    expect(Object.keys(response.body).length).toBe(
      Object.keys(bestPathObject).length
    )
    expect(response.body).toHaveProperty('adapters')
    expect(response.body).toHaveProperty('amounts')
    expect(response.body).toHaveProperty('path')
  })

  it('should return tx data for best path swap', async () => {
    const response = await request(server).get(
      `/api/swap?amount=0.01&fromAddress=${WALLET_ADDRESS}&fromTokenAddress=${AVAX}&toTokenAddress=${WAVAX}`
    )

    expect(response.body).toHaveProperty('data')
    expect(response.body).toHaveProperty('to', ADDRESSES.helpers.yakRouter)
    expect(response.body).toHaveProperty('from', WALLET_ADDRESS)
  })

  it('should return error if insufficient balance', async () => {
    const response = await request(server).get(
      `/api/swap?amount=10000000&fromAddress=${WALLET_ADDRESS}&fromTokenAddress=${AVAX}&toTokenAddress=${WAVAX}`
    )

    expect(response.body.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message', ERROR_NOT_ENOUGH_BALANCE)
  })
})
