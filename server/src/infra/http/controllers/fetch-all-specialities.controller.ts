import { BadRequestException, Controller, Get } from '@nestjs/common'
import { SpecialityPresenter } from '../presenters/speciality-presenter'
import { FetchAllSpecialitiesUseCase } from 'src/domain/barbershop/application/use-cases/fetch-all-specialities'

@Controller('/specialities')
export class FetchAllSpecialitiesController {
  constructor(private fetchAllSpecialities: FetchAllSpecialitiesUseCase) {}

  @Get()
  async handle() {
    const result = await this.fetchAllSpecialities.execute()

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error)
    }

    const specialities = result.value.specialities

    return {
      specialities: specialities.map(SpecialityPresenter.toHTTP),
    }
  }
}
