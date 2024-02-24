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

interface UpdateBarberUseCaseRequest {
  userId: string
  barberData: {
    id: string
    name: string
    hiringDate: Date
    birthDate: Date
    removePhoto?: boolean
    specialities: string[]
  }
}

type UpdateBarberUseCaseResponse = Either<
  ForbbidenActionError | ResourceNotFoundError,
  {
    barber: Barber
  }
>

@Injectable()
export class UpdateBarberUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private barberRepository: BarberRepository,
    private specialityRepository: SpecialityRepository,
  ) {}

  async execute({
    userId,
    barberData,
  }: UpdateBarberUseCaseRequest): Promise<UpdateBarberUseCaseResponse> {
    const [userExists, barberExists] = await Promise.all([
      this.usersRepository.findById(userId),
      this.barberRepository.findById(barberData.id),
    ])

    // Verifying if user has permission to create a barber
    if (userExists?.role !== UserRole.ADMIN) {
      return left(new ForbbidenActionError())
    }

    if (!barberExists) {
      return left(new ResourceNotFoundError(barberData.id))
    }

    const { name, hiringDate, birthDate, removePhoto, specialities } =
      barberData

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

    barberExists.name = name
    barberExists.hiringDate = hiringDate
    barberExists.birthDate = birthDate
    barberExists.photo = removePhoto ? '' : barberExists.photo

    barberExists.specialitiesId = specialities.map(
      (specialityId) => new UniqueEntityID(specialityId),
    )

    await this.barberRepository.save(barberExists)

    return right({
      barber: barberExists,
    })
  }
}
