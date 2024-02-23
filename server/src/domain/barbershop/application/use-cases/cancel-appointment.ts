import { Either, left, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository'
import { ForbbidenActionError } from './@errors/forbbiden-action.error'
import { AppointmentRepository } from '../repositories/appointment-repository'
import { ResourceNotFoundError } from './@errors/resource-not-found.error'
import { differenceInMilliseconds, format } from 'date-fns'
import { AppointmentStatus } from '../../enterprise/entities/appointment'
import { UserRole } from '../../enterprise/entities/user'
import { SendEmail } from '../mail/send-email'

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
    private sendEmail: SendEmail,
  ) {}

  async execute({
    userId,
    appointmentId,
  }: CancelAppointmentUseCaseRequest): Promise<CancelAppointmentUseCaseResponse> {
    const [userExists, appointmentExists] = await Promise.all([
      this.usersRepository.findById(userId),
      this.appointmentRepository.findById({ appointmentId }),
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

    // Se id de quem está cancelando é diferente do id do client do agendamento, verificar se é admin e enviar email para cliente
    if (appointmentExists.clientId.toString() !== userExists.id.toString()) {
      if (userExists.role !== UserRole.ADMIN) {
        return left(new ForbbidenActionError())
      }

      const clientExists = await this.usersRepository.findById(
        appointmentExists.clientId.toString(),
      )

      if (!clientExists)
        return left(
          new ResourceNotFoundError(appointmentExists.clientId.toString()),
        )

      this.sendEmail.send({
        recipientEmail: clientExists.email,
        message: `Olá, ${clientExists.name}! Seu agendamento no dia ${format(appointmentExists.day, 'dd/MM/yyyy')} às ${appointmentExists.hour} foi cancelado por nossos profissionais, por favor, agende outro horário ou entre em contato conosco.`,
      })
    }
    appointmentExists.status = AppointmentStatus.CANCELLED

    await this.appointmentRepository.save(appointmentExists)

    return right(undefined)
  }
}
