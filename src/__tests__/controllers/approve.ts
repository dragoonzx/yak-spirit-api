import { ADDRESSES, WAVAX } from '@/helpers/constants'
import { Server } from 'http'
import { WALLET_ADDRESS, txDataObjectWithoutValue } from '@/__tests__/fixtures'
import request from 'supertest'
import runApp from '@/helpers/runApp'

describe('Approve endpoint', () => {
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

  it('should return Yak Router address as spender', async () => {
    const response = await request(server).get('/api/approve/spender')
    expect(response.body.address.toLowerCase()).toBe(
      ADDRESSES.helpers.yakRouter.toLowerCase()
    )
  })

  it('should return tx data for token approve', async () => {
    const response = await request(server).get(
      `/api/approve/transaction?fromAddress=${WALLET_ADDRESS}&tokenAddress=${WAVAX}&amount=10`
    )
    expect(response.body).toMatchObject(txDataObjectWithoutValue)
  })

  it('should return error if query params are missing', async () => {
    const response = await request(server).get(`/api/approve/transaction`)
    expect(response.body.statusCode).toBe(400)
  })

  it('should return allowed to spend token amount', async () => {
    const response = await request(server).get(
      `/api/approve/allowance?fromAddress=${WALLET_ADDRESS}&tokenAddress=${WAVAX}`
    )
    expect(response.body).toHaveProperty('allowance')
  })
})
