import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Param,
  Patch,
} from '@nestjs/common'
import { CurrentUser } from 'src/infra/auth/current-user.decorator'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { CancelAppointmentUseCase } from 'src/domain/barbershop/application/use-cases/cancel-appointment'
import { ForbbidenActionError } from 'src/domain/barbershop/application/use-cases/@errors/forbbiden-action.error'

@Controller('/appointments/:appointmentId/cancel')
export class CancelAppointmentController {
  constructor(private readonly cancelAppointment: CancelAppointmentUseCase) {}

  @Patch()
  async handle(
    @Param('appointmentId') appointmentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const result = await this.cancelAppointment.execute({
      userId,
      appointmentId,
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
