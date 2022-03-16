import { Server } from 'http'
import { bootstrapControllers } from 'amala'
import { koaSwagger } from 'koa2-swagger-ui'
import { resolve } from 'path'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import env from '@/helpers/env'

const app = new Koa()

export default async function () {
  const router = new Router()
  await bootstrapControllers({
    app,
    router,
    controllers: [resolve(__dirname, '../controllers/*')],
    disableVersioning: true,
  })
  app.use(cors({ origin: '*' }))
  app.use(bodyParser())
  app.use(router.routes())
  app.use(router.allowedMethods())

  app.use(
    koaSwagger({
      title: 'Yield Yak Aggregator API',
      routePrefix: '/swagger', // host at /swagger instead of default /docs
      swaggerOptions: {
        url: '/api/docs', // example path to json
        basePath: '/api',
      },
    })
  )

  return new Promise<Server>((resolve, reject) => {
    const connection = app
      .listen(env.PORT)
      .on('listening', () => {
        console.log(`HTTP is listening on ${env.PORT}`)
        resolve(connection)
      })
      .on('error', reject)
  })
}
