import { ADDRESSES } from '@/helpers/constants'
import { Server } from 'http'
import { tokenListLength } from '@/__tests__/fixtures'
import request from 'supertest'
import runApp from '@/helpers/runApp'

describe('Info endpoint', () => {
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

  it('should return list of tokens', async () => {
    const response = await request(server).get('/api/info/tokens')
    expect(response.body).toHaveLength(tokenListLength)
  })

  it('should return providers list', async () => {
    const response = await request(server).get('/api/info/providers')
    expect(response.body).toHaveLength(ADDRESSES.routers.length)
  })
})
