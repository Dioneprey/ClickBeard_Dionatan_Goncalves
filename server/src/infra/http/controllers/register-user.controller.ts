import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { RegisterUserUseCase } from 'src/domain/barbershop/application/use-cases/register-user'
import { UserAlreadyExistsError } from 'src/domain/barbershop/application/use-cases/@errors/user-already-exists.error'
import { Public } from 'src/infra/auth/public'

const registerUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>
const bodyValidationPipe = new ZodValidationPipe(registerUserBodySchema)

@Public()
@Controller('/accounts')
export class RegisterUserController {
  constructor(private readonly registerUser: RegisterUserUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: RegisterUserBodySchema) {
    const { name, email, password } = registerUserBodySchema.parse(body)

    const result = await this.registerUser.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
