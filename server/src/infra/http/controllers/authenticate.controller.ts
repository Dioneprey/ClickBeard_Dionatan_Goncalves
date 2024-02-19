import {
  Controller,
  Post,
  UsePipes,
  Body,
  UnauthorizedException,
  BadRequestException,
  HttpCode,
} from '@nestjs/common'
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation.pipe'

import { z } from 'zod'
import { Public } from 'src/infra/auth/public'
import { AuthenticateUseCase } from 'src/domain/barbershop/application/use-cases/authenticate'
import { WrongCredentialsError } from 'src/domain/barbershop/application/use-cases/@errors/wrong-credentials.error'

const authenticateBodyBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodyBodySchema = z.infer<typeof authenticateBodyBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticate: AuthenticateUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodyBodySchema))
  async handle(@Body() body: AuthenticateBodyBodySchema) {
    const { email, password } = body

    const result = await this.authenticate.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { accessToken }
  }
}
