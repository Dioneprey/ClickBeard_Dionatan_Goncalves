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
import dayjs from 'dayjs'
import { SlotAlreadyReservedError } from './@errors/slot-already-reserved.error'

interface MakeAppointmentUseCaseRequest {
  appointment: {
    barberId: string
    clientId: string
    day: Date
    hour: string
    appointmentServices: string[]
  }
}

type MakeAppointmentUseCaseResponse = Either<
  ForbbidenActionError,
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
  ) {}

  async execute({
    appointment,
  }: MakeAppointmentUseCaseRequest): Promise<MakeAppointmentUseCaseResponse> {
    const { barberId, clientId, day, hour, appointmentServices } = appointment

    const [userExists, barberExists] = await Promise.all([
      this.usersRepository.findById(clientId),
      this.barberRepository.findById(barberId),
    ])

    if (!userExists) return left(new ResourceNotFoundError(clientId))
    if (!barberExists) return left(new ResourceNotFoundError(barberId))

    const appointmentsInDay = await this.appointmentRepository.findAllByDay({
      date: day,
      barberId,
    })

    if (dayjs(day).isBefore(new Date())) {
      return left(
        new NoMoreSlotsInDayError({
          day: dayjs(day).format('DD/MM/YYYY'),
          slot: hour,
        }),
      )
    }

    const allSlotsInDay = getAllBarberSlotsInDay(day)

    if (allSlotsInDay.length === 0) {
      return left(
        new NoMoreSlotsInDayError({
          day: dayjs(day).format('DD/MM/YYYY'),
          slot: hour,
        }),
      )
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
      day,
      hour,
    })

    newAppointment.servicesId = appointmentServices.map(
      (specialityId) => new UniqueEntityID(specialityId),
    )

    await this.appointmentRepository.create(newAppointment)

    return right({
      appointment: newAppointment,
    })
  }
}
