import { Either, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { Barber } from '../../enterprise/entities/barber'
import { BarberRepository } from '../repositories/barber-repository'

type FetchBarbersUseCaseResponse = Either<
  undefined,
  {
    barbers: Barber[]
  }
>

@Injectable()
export class FetchBarbersUseCase {
  constructor(private BarberRepository: BarberRepository) {}

  async execute(): Promise<FetchBarbersUseCaseResponse> {
    const barbers = await this.BarberRepository.findAll()

    return right({
      barbers,
    })
  }
}
