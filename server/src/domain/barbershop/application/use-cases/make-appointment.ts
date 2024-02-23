import { Either, left, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository'
import { ForbbidenActionError } from './@errors/forbbiden-action.error'
import { BarberRepository } from '../repositories/barber-repository'
import { Appointment } from '../../enterprise/entities/appointment'
import { AppointmentRepository } from '../repositories/appointment-repository'
import { ResourceNotFoundError } from './@errors/resource-not-found.error'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { getAllBarberSlotsInDay } from '../utils/get-all-barber-slots-in-day'
import { NoMoreSlotsInDayError } from './@errors/no-more-slots-in-day.error'
import { format, parseISO, setHours, setMinutes } from 'date-fns'
import dayjs from 'dayjs'
import { SlotAlreadyReservedError } from './@errors/slot-already-reserved.error'
import { InvalidAppointmentSlotError } from './@errors/invalid-appointment-slot.error'
import { SendEmail } from '../mail/send-email'

interface MakeAppointmentUseCaseRequest {
  appointment: {
    barberId: string
    clientId: string
    day: Date
    hour: string
    appointmentServiceId: string
  }
}

type MakeAppointmentUseCaseResponse = Either<
  | ForbbidenActionError
  | InvalidAppointmentSlotError
  | NoMoreSlotsInDayError
  | SlotAlreadyReservedError,
  {
    appointment: Appointment
  }
>

@Injectable()
export class MakeAppointmentUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private barberRepository: BarberRepository,
    private appointmentRepository: AppointmentRepository,
    private sendEmail: SendEmail,
  ) {}

  async execute({
    appointment,
  }: MakeAppointmentUseCaseRequest): Promise<MakeAppointmentUseCaseResponse> {
    const { barberId, clientId, day, hour, appointmentServiceId } = appointment

    const [userExists, barberExists] = await Promise.all([
      this.usersRepository.findById(clientId),
      this.barberRepository.findById(barberId),
    ])

    const [appointmentHour, appointmentMinutes] = hour?.split(':').map(Number)

    const date = parseISO(day.toISOString()) // data não vem com o horário do agendamento, então pega a data do dia mais o horário informado "00:00"

    const updatedAppointmentDate = setMinutes(
      setHours(date, appointmentHour),
      appointmentMinutes,
    )

    if (!userExists) return left(new ResourceNotFoundError(clientId))
    if (!barberExists) return left(new ResourceNotFoundError(barberId))

    const appointmentsInDay = await this.appointmentRepository.findAllByDay({
      date: updatedAppointmentDate,
      barberId,
      onlyPendents: true,
    })

    // Verifica se a data de agendamento é anterior a hoje
    if (dayjs(updatedAppointmentDate).isBefore(dayjs().startOf('day'))) {
      return left(
        new NoMoreSlotsInDayError({
          day: dayjs(updatedAppointmentDate).format('DD/MM/YYYY'),
          slot: hour,
        }),
      )
    }

    const allSlotsInDay = getAllBarberSlotsInDay(updatedAppointmentDate)

    // Não há possíveis horários vagos no dia
    if (allSlotsInDay.length === 0) {
      return left(
        new NoMoreSlotsInDayError({
          day: dayjs(updatedAppointmentDate).format('DD/MM/YYYY'),
          slot: hour,
        }),
      )
    }

    const isSlotValid = allSlotsInDay.filter((time) => time.includes(hour))

    // Horário passado está fora do horário de funcionamento da barbearia, ou não há mais horários livres
    if (isSlotValid.length < 1) {
      return left(new InvalidAppointmentSlotError(hour))
    }

    const reservedSlots = appointmentsInDay.map(
      (appointment) => appointment.hour,
    )

    const isSlotAlreadyReserved = reservedSlots.find((time) => time === hour)

    if (isSlotAlreadyReserved) {
      return left(new SlotAlreadyReservedError(hour))
    }

    const newAppointment = Appointment.create({
      barberId: new UniqueEntityID(barberId),
      clientId: new UniqueEntityID(clientId),
      serviceId: new UniqueEntityID(appointmentServiceId),
      day: updatedAppointmentDate,
      client: userExists,
      hour,
    })

    await this.appointmentRepository.create(newAppointment)

    this.sendEmail.send({
      recipientEmail: userExists.email,
      message: `Olá, ${userExists.name}! Seu agendamento com o barbeiro ${barberExists.name} no dia ${format(day, 'dd/MM/yyyy')} às ${hour} foi realizado com sucesso`,
    })

    return right({
      appointment: newAppointment,
    })
  }
}
