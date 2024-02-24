import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Patch,
} from '@nestjs/common'
import { CurrentUser } from 'src/infra/auth/current-user.decorator'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { ForbbidenActionError } from 'src/domain/barbershop/application/use-cases/@errors/forbbiden-action.error'
import { Roles } from 'src/infra/auth/role.decorator'
import { UserRole } from 'src/domain/barbershop/enterprise/entities/user'
import { UpdateBarberUseCase } from 'src/domain/barbershop/application/use-cases/update-barber'

const updateBarberBodySchema = z.object({
  id: z.string(),
  name: z.string(),
  hiringDate: z.coerce.date(),
  removePhoto: z.boolean().optional(),
  birthDate: z.coerce.date(),
  specialities: z.array(z.string()),
})

type UpdateBarberBodySchema = z.infer<typeof updateBarberBodySchema>
const bodyValidationPipe = new ZodValidationPipe(updateBarberBodySchema)

@Controller('/barbers')
export class UpdateBarberController {
  constructor(private readonly updateBarber: UpdateBarberUseCase) {}

  @Patch()
  @Roles(UserRole.ADMIN)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: UpdateBarberBodySchema,
  ) {
    const userId = user.sub

    const { id, name, hiringDate, birthDate, removePhoto, specialities } =
      updateBarberBodySchema.parse(body)

    const result = await this.updateBarber.execute({
      userId,
      barberData: {
        id,
        name,
        removePhoto,
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
