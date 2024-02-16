import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { ConfigService } from '@nestjs/config'
import { Env } from './env/env'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )
  app.setGlobalPrefix('api')
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['POST', 'PUT', 'PATCH', 'DELETE', 'GET'],
  })

  const envService = app.get<ConfigService<Env, true>>(EnvService)
  const port = envService.get('PORT')

  await app.listen(port).then(() => {
    console.log(`(Click Beard) HTTP server running on port: ${port}!`)
  })
}
bootstrap()
