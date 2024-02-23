import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { ResourceNotFoundError } from 'src/domain/barbershop/application/use-cases/@errors/resource-not-found.error'
import { FetchAppointmentsUseCase } from 'src/domain/barbershop/application/use-cases/fetch-appointments'
import { CurrentUser } from 'src/infra/auth/current-user.decorator'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { AppointmentPresenter } from '../presenters/appointments-presenter'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const fetchAppointmentsQuerySchema = z.object({
  pageIndex: z.coerce.number().optional().nullable(),
  status: z
    .enum(['scheduled', 'completed', 'canceled', 'in_progress'])
    .optional()
    .nullable(),
  date: z.coerce.date().optional(),
})

type FetchAppointmentsQuerySchema = z.infer<typeof fetchAppointmentsQuerySchema>
const queryValidationPipe = new ZodValidationPipe(fetchAppointmentsQuerySchema)
@Controller('/appointments')
export class FetchAppointmentsController {
  constructor(private fetchAppointments: FetchAppointmentsUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) query: FetchAppointmentsQuerySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { pageIndex, status, date } =
      fetchAppointmentsQuerySchema.parse(query)

    const userId = user.sub
    const result = await this.fetchAppointments.execute({
      userId,
      pageIndex: pageIndex ?? 0,
      status,
      date,
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
    const totalCount = result.value.totalCount
    const totalPages = result.value.totalPages

    return {
      appointments: appointments.map(AppointmentPresenter.toHTTP),
      meta: {
        pageIndex,
        totalCount,
        totalPages,
      },
    }
  }
}
