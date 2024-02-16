import { Either, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { AppointmentRepository } from '../repositories/appointment-repository'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
dayjs.extend(isToday)

interface FetchBarberAvailableSlotsUseCaseRequest {
  date: Date
  barberId: string
}

type FetchBarberAvailableSlotsUseCaseResponse = Either<
  undefined,
  {
    availableSlots: string[]
  }
>

@Injectable()
export class FetchBarberAvailableSlotsUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute({
    date,
    barberId,
  }: FetchBarberAvailableSlotsUseCaseRequest): Promise<FetchBarberAvailableSlotsUseCaseResponse> {
    const appointmentsInDay = await this.appointmentRepository.findAllByDay({
      date,
      barberId,
    })

    const reservedSlots = appointmentsInDay.map((appointment) =>
      dayjs(appointment.dateTime).format('HH:mm'),
    )

    let startTime = dayjs().hour(8).minute(0) // Define o horário de início às 08:00
    const endTime = dayjs().hour(18).minute(0) // Define o horário de término às 18:00
    const searchDate = dayjs(date).startOf('day')
    const currentDate = dayjs()

    if (searchDate.isToday()) {
      // Se data de pesquisa for igual a hoje, trazer horários à partir da próxima meia hora
      startTime =
        currentDate.minute() >= 30
          ? currentDate.add(1, 'hour').minute(0)
          : currentDate.minute(30)
    }

    const allSlotsInDay: string[] = []

    while (startTime.isBefore(endTime) || startTime.isSame(endTime)) {
      allSlotsInDay.push(startTime.format('HH:mm')) // Adiciona o horário atual ao array
      startTime = startTime.add(30, 'minute')
    }

    const availableSlots = allSlotsInDay.filter(
      (time) => !reservedSlots.includes(time),
    )

    return right({
      availableSlots,
    })
  }
}
