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
import { Roles } from 'src/infra/auth/role.decorator'
import { UserRole } from 'src/domain/barbershop/enterprise/entities/user'

const registerBarberBodySchema = z.object({
  name: z.string(),
  hiringDate: z.coerce.date(),
  birthDate: z.coerce.date(),
  specialities: z.array(z.string()),
})

type RegisterBarberBodySchema = z.infer<typeof registerBarberBodySchema>
const bodyValidationPipe = new ZodValidationPipe(registerBarberBodySchema)

@Controller('/barbers')
export class RegisterBarberController {
  constructor(private readonly registerBarber: RegisterBarberUseCase) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: RegisterBarberBodySchema,
  ) {
    const userId = user.sub

    const { name, hiringDate, birthDate, specialities } =
      registerBarberBodySchema.parse(body)

    const result = await this.registerBarber.execute({
      userId,
      barberData: {
        name,
        hiringDate,
        birthDate,
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

    const barber = result.value.barber

    return {
      barberId: barber.id.toString(),
    }
  }
}
