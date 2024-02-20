import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
} from '@nestjs/common'
import { ResourceNotFoundError } from 'src/domain/barbershop/application/use-cases/@errors/resource-not-found.error'
import { FetchAppointmentsUseCase } from 'src/domain/barbershop/application/use-cases/fetch-appointments'
import { CurrentUser } from 'src/infra/auth/current-user.decorator'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { AppointmentPresenter } from '../presenters/appointments-presenter'

@Controller('/appointments')
export class FetchAppointmentsController {
  constructor(private fetchAppointments: FetchAppointmentsUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub
    const result = await this.fetchAppointments.execute({
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const appointments = result.value.appointments

    return {
      appointments: appointments.map(AppointmentPresenter.toHTTP),
    }
  }
}
