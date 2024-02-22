import { Either, left, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository'
import { ForbbidenActionError } from './@errors/forbbiden-action.error'
import { AppointmentRepository } from '../repositories/appointment-repository'
import { ResourceNotFoundError } from './@errors/resource-not-found.error'
import { differenceInMilliseconds } from 'date-fns'
import { AppointmentStatus } from '../../enterprise/entities/appointment'

interface CancelAppointmentUseCaseRequest {
  userId: string
  appointmentId: string
}

type CancelAppointmentUseCaseResponse = Either<
  ResourceNotFoundError | ForbbidenActionError,
  undefined
>

@Injectable()
export class CancelAppointmentUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private appointmentRepository: AppointmentRepository,
  ) {}

  async execute({
    userId,
    appointmentId,
  }: CancelAppointmentUseCaseRequest): Promise<CancelAppointmentUseCaseResponse> {
    const [userExists, appointmentExists] = await Promise.all([
      this.usersRepository.findById(userId),
      this.appointmentRepository.findById({ appointmentId, userId }),
    ])

    if (!userExists) return left(new ResourceNotFoundError(userId))
    if (!appointmentExists)
      return left(new ResourceNotFoundError(appointmentId))

    // Verifica se tem menos de 2 horas até a data do agendamento

    const diffInMilliseconds = differenceInMilliseconds(
      appointmentExists.day,
      new Date(),
    )

    const diffInHours = diffInMilliseconds / (1000 * 60 * 60)
    const isLessThanTwoHours = diffInHours < 2

    if (isLessThanTwoHours) {
      return left(new ForbbidenActionError())
    }

    appointmentExists.status = AppointmentStatus.CANCELLED

    await this.appointmentRepository.save(appointmentExists)

    return right(undefined)
  }
}
