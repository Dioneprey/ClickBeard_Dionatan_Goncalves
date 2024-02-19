import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { FetchBarberAvailableSlotsUseCase } from 'src/domain/barbershop/application/use-cases/fetch-barber-available-slots'
import { ResourceNotFoundError } from 'src/domain/barbershop/application/use-cases/@errors/resource-not-found.error'

const registerBarberParamsSchema = z.object({
  date: z.string().refine(
    (data) => {
      const parsedDate = new Date(data)
      return !isNaN(parsedDate.getTime())
    },
    {
      message: 'Invalid date format',
    },
  ),
  barberId: z.string(),
})

type RegisterBarberParamsSchema = z.infer<typeof registerBarberParamsSchema>
const paramsValidationPipe = new ZodValidationPipe(registerBarberParamsSchema)

@Controller('/barbers/available-slots')
export class FetchBarberAvailableSlotsController {
  constructor(
    private fetchBarberAvailableSlots: FetchBarberAvailableSlotsUseCase,
  ) {}

  @Get()
  async handle(@Query(paramsValidationPipe) query: RegisterBarberParamsSchema) {
    const { barberId, date } = query
    const result = await this.fetchBarberAvailableSlots.execute({
      barberId,
      date: new Date(date),
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

    const availableSlots = result.value.availableSlots

    return {
      availableSlots,
    }
  }
}
