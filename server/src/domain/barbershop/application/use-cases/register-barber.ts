import { Either, left, right } from 'src/core/either'
import { UserRole } from '../../enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository'
import { ForbbidenActionError } from './@errors/forbbiden-action.error'
import { Barber } from '../../enterprise/entities/barber'
import { BarberRepository } from '../repositories/barber-repository'
import { SpecialityRepository } from '../repositories/speciality-repository'
import { ResourceNotFoundError } from './@errors/resource-not-found.error'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

interface RegisterBarberUseCaseRequest {
  userId: string
  barberData: {
    name: string
    birthDate: Date
    hiringDate: Date
    photo?: string
    specialities: string[]
  }
}

type RegisterBarberUseCaseResponse = Either<
  ForbbidenActionError | ResourceNotFoundError,
  {
    barber: Barber
  }
>

@Injectable()
export class RegisterBarberUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private barberRepository: BarberRepository,
    private specialityRepository: SpecialityRepository,
  ) {}

  async execute({
    userId,
    barberData,
  }: RegisterBarberUseCaseRequest): Promise<RegisterBarberUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId)

    // Verifying if user has permission to create a barber
    if (userExists?.role !== UserRole.ADMIN) {
      return left(new ForbbidenActionError())
    }

    const { name, birthDate, hiringDate, photo, specialities } = barberData

    const specialitiesExists = await Promise.all(
      specialities.map(async (specialityId) => {
        const speciality =
          await this.specialityRepository.findById(specialityId)

        if (!speciality) {
          return {
            id: specialityId,
            name: null,
          }
        }

        return speciality
      }),
    )

    const notFoundSpecialities = specialitiesExists.filter(
      (speciality) => speciality?.name === null,
    )

    if (notFoundSpecialities.length > 0) {
      return left(
        new ResourceNotFoundError(
          notFoundSpecialities.map((speciality) => speciality.id).join(', '),
        ),
      )
    }

    const barber = Barber.create({
      name,
      birthDate,
      photo,
      hiringDate,
    })

    barber.specialitiesId = specialities.map(
      (specialityId) => new UniqueEntityID(specialityId),
    )

    await this.barberRepository.create(barber)

    return right({
      barber,
    })
  }
}
