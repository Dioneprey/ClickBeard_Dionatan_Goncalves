import { Either, left, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { AppointmentRepository } from '../repositories/appointment-repository'

import { BarberRepository } from '../repositories/barber-repository'
import { ResourceNotFoundError } from './@errors/resource-not-found.error'
import { getAllBarberSlotsInDay } from '../utils/get-all-barber-slots-in-day'
import dayjs from 'dayjs'
import { NoMoreSlotsInDayError } from './@errors/no-more-slots-in-day.error'

interface FetchBarberAvailableSlotsUseCaseRequest {
  date: Date
  barberId: string
}

type FetchBarberAvailableSlotsUseCaseResponse = Either<
  ResourceNotFoundError | NoMoreSlotsInDayError,
  {
    availableSlots: string[]
  }
>

@Injectable()
export class FetchBarberAvailableSlotsUseCase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private barberRepository: BarberRepository,
  ) {}

  async execute({
    date,
    barberId,
  }: FetchBarberAvailableSlotsUseCaseRequest): Promise<FetchBarberAvailableSlotsUseCaseResponse> {
    const barberExists = await this.barberRepository.findById(barberId)

    if (!barberExists) {
      return left(new ResourceNotFoundError(barberId))
    }

    if (dayjs(date).isBefore(dayjs().startOf('day'))) {
      return left(
        new NoMoreSlotsInDayError({
          day: dayjs(date).format('DD/MM/YYYY'),
        }),
      )
    }

    const appointmentsInDay = await this.appointmentRepository.findAllByDay({
      date,
      barberId,
      onlyPendents: true,
    })

    const reservedSlots = appointmentsInDay.map(
      (appointment) => appointment.hour,
    )

    const allSlotsInDay = getAllBarberSlotsInDay(date)

    const availableSlots = allSlotsInDay.filter(
      (time) => !reservedSlots.includes(time),
    )

    return right({
      availableSlots,
    })
  }
}
