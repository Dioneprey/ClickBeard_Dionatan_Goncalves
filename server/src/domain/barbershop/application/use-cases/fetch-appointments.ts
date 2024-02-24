import { Either, left, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { AppointmentRepository } from '../repositories/appointment-repository'

import { ResourceNotFoundError } from './@errors/resource-not-found.error'
import { Appointment } from '../../enterprise/entities/appointment'
import { UsersRepository } from '../repositories/users-repository'
import { UserRole } from '../../enterprise/entities/user'

interface FetchAppointmentsUseCaseRequest {
  userId: string
  pageIndex: number
  status?: 'scheduled' | 'completed' | 'canceled' | 'in_progress' | null
  date?: Date
}

type FetchAppointmentsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    appointments: Appointment[]
    pageIndex: number
    totalCount: number
    totalPages: number
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
    pageIndex,
    status,
    date,
  }: FetchAppointmentsUseCaseRequest): Promise<FetchAppointmentsUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId)

    if (!userExists) {
      return left(new ResourceNotFoundError(userId))
    }

    if (userExists.role === UserRole.ADMIN) {
      const findAllAppointmentsResult =
        await this.appointmentRepository.findAll({
          pageIndex,
          filters: {
            status,
            date,
          },
        })

      return right({
        appointments: findAllAppointmentsResult.data,
        pageIndex,
        totalCount: findAllAppointmentsResult.totalCount,
        totalPages: findAllAppointmentsResult.totalPages,
      })
    } else {
      const findAllAppointmentsByClientIdResult =
        await this.appointmentRepository.findAllByClientId({
          clientId: userId,
          pageIndex,
          filters: {
            status,
            date,
          },
        })

      return right({
        appointments: findAllAppointmentsByClientIdResult.data,
        pageIndex,
        totalCount: findAllAppointmentsByClientIdResult.totalCount,
        totalPages: findAllAppointmentsByClientIdResult.totalPages,
      })
    }
  }
}
