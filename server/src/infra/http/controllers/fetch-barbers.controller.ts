import { BadRequestException, Controller, Get } from '@nestjs/common'
import { FetchBarbersUseCase } from 'src/domain/barbershop/application/use-cases/fetch-barbers'
import { BarberPresenter } from '../presenters/barber-presenter'

@Controller('/barbers')
export class FetchBarbersController {
  constructor(private fetchBarbers: FetchBarbersUseCase) {}

  @Get()
  async handle() {
    const result = await this.fetchBarbers.execute()

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error)
    }

    const barbers = result.value.barbers

    return {
      barbers: barbers.map(BarberPresenter.toHTTP),
    }
  }
}
