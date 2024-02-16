import { Either, left, right } from 'src/core/either'
import { UserRole } from '../../enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository'
import { ForbbidenActionError } from './@errors/forbbiden-action-error'
import { Barber } from '../../enterprise/entities/barber'
import { Speciality } from '../../enterprise/entities/speciality'
import { BarbersRepository } from '../repositories/barber-repository'

interface MakeAppointmentUseCaseRequest {
  userId: string
  barberData: {
    name: string
    birthDate: Date
    hiringDate: Date
    specialities: string[]
  }
}

type MakeAppointmentUseCaseResponse = Either<
  ForbbidenActionError,
  {
    barber: Barber
  }
>

@Injectable()
export class MakeAppointmentUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private barbersRepository: BarbersRepository,
  ) {}

  async execute({
    userId,
    barberData,
  }: MakeAppointmentUseCaseRequest): Promise<MakeAppointmentUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId)

    // Verifying if user has permission to create a barber
    if (userExists?.role !== UserRole.ADMIN) {
      return left(new ForbbidenActionError())
    }

    const { name, birthDate, hiringDate, specialities } = barberData

    const barber = Barber.create({
      name,
      birthDate,
      hiringDate,
    })

    const barberSpecialities = specialities.map((speciality) =>
      Speciality.create({
        name: speciality,
      }),
    )

    barber.specialities = barberSpecialities

    await this.barbersRepository.create(barber)

    return right({
      barber,
    })
  }
}
