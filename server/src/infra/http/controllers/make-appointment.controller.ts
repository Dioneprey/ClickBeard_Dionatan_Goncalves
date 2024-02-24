import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
} from '@nestjs/common'
import { CurrentUser } from 'src/infra/auth/current-user.decorator'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { ForbbidenActionError } from 'src/domain/barbershop/application/use-cases/@errors/forbbiden-action.error'
import { MakeAppointmentUseCase } from 'src/domain/barbershop/application/use-cases/make-appointment'
import { Roles } from 'src/infra/auth/role.decorator'
import { UserRole } from 'src/domain/barbershop/enterprise/entities/user'

const makeAppointmentBodySchema = z.object({
  barberId: z.string(),
  day: z.coerce.date(),
  hour: z.string(),
  appointmentServiceId: z.string(),
})

type MakeAppointmentBodySchema = z.infer<typeof makeAppointmentBodySchema>
const bodyValidationPipe = new ZodValidationPipe(makeAppointmentBodySchema)

@Controller('/appointments')
export class MakeAppointmentController {
  constructor(private readonly makeAppointment: MakeAppointmentUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: MakeAppointmentBodySchema,
  ) {
    const userId = user.sub

    const { barberId, day, hour, appointmentServiceId } =
      makeAppointmentBodySchema.parse(body)

    const result = await this.makeAppointment.execute({
      appointment: {
        barberId,
        clientId: userId,
        day,
        hour,
        appointmentServiceId,
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
