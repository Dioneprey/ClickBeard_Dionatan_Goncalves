import { Either, left, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { AppointmentRepository } from '../repositories/appointment-repository'

import { ResourceNotFoundError } from './@errors/resource-not-found.error'
import { Appointment } from '../../enterprise/entities/appointment'
import { UsersRepository } from '../repositories/users-repository'
import { UserRole } from '../../enterprise/entities/user'

interface FetchAppointmentsUseCaseRequest {
  userId: string
}

type FetchAppointmentsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    appointments: Appointment[]
  }
>

@Injectable()
export class FetchAppointmentsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private appointmentRepository: AppointmentRepository,
  ) {}

  async execute({
    userId,
  }: FetchAppointmentsUseCaseRequest): Promise<FetchAppointmentsUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId)

    if (!userExists) {
      return left(new ResourceNotFoundError(userId))
    }

    let appointments: Appointment[] = []

    if (userExists.role === UserRole.ADMIN) {
      appointments = await this.appointmentRepository.findAll()
    } else {
      appointments = await this.appointmentRepository.findAllByClientId(userId)
    }

    return right({
      appointments,
    })
  }
}
