import { Either, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { Speciality } from '../../enterprise/entities/speciality'
import { SpecialitiesRepository } from '../repositories/speciality-repository'

type FetchAllSpecialitiesUseCaseResponse = Either<
  undefined,
  {
    specialities: Speciality[]
  }
>

@Injectable()
export class FetchAllSpecialitiesUseCase {
  constructor(private specialitiesRepository: SpecialitiesRepository) {}

  async execute(): Promise<FetchAllSpecialitiesUseCaseResponse> {
    const specialities = await this.specialitiesRepository.findAll()

    return right({
      specialities,
    })
  }
}
