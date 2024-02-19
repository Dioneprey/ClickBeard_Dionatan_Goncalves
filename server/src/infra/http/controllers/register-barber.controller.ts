import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
} from '@nestjs/common'
import { RegisterBarberUseCase } from 'src/domain/barbershop/application/use-cases/register-barber'
import { CurrentUser } from 'src/infra/auth/current-user.decorator'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { ForbbidenActionError } from 'src/domain/barbershop/application/use-cases/@errors/forbbiden-action.error'

const registerBarberBodySchema = z.object({
  name: z.string(),
  birthDate: z.coerce.date(),
  hiringDate: z.coerce.date(),
  specialities: z.array(z.string()),
})

type RegisterBarberBodySchema = z.infer<typeof registerBarberBodySchema>
const bodyValidationPipe = new ZodValidationPipe(registerBarberBodySchema)

@Controller('/barbers')
export class RegisterBarberController {
  constructor(private readonly registerBarber: RegisterBarberUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: RegisterBarberBodySchema,
  ) {
    const userId = user.sub

    const { name, birthDate, hiringDate, specialities } =
      registerBarberBodySchema.parse(body)

    const result = await this.registerBarber.execute({
      userId,
      barberData: {
        name,
        birthDate,
        hiringDate,
        specialities,
      },
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ForbbidenActionError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
