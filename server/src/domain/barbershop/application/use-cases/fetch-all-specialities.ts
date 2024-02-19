import { Either, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { Speciality } from '../../enterprise/entities/speciality'
import { SpecialityRepository } from '../repositories/speciality-repository'

type FetchAllSpecialitiesUseCaseResponse = Either<
  undefined,
  {
    specialities: Speciality[]
  }
>

@Injectable()
export class FetchAllSpecialitiesUseCase {
  constructor(private SpecialityRepository: SpecialityRepository) {}

  async execute(): Promise<FetchAllSpecialitiesUseCaseResponse> {
    const specialities = await this.SpecialityRepository.findAll()

    return right({
      specialities,
    })
  }
}
