import dayjs from 'dayjs'
import {
  AppointmentRepository,
  AppointmentRepositoryFindAllByDayProps,
} from 'src/domain/barbershop/application/repositories/appointment-repository'

import { Appointment } from 'src/domain/barbershop/enterprise/entities/appointment'

export class InMemoryAppointmentRepository implements AppointmentRepository {
  public items: Appointment[] = []

  async findAll() {
    return this.items
  }

  async findAllByDay({
    date,
    barberId,
  }: AppointmentRepositoryFindAllByDayProps) {
    const day = dayjs(date).startOf('day')

    return this.items.filter(
      (appointment) =>
        dayjs(appointment.dateTime).isSame(day, 'day') &&
        appointment.barberId.toString() === barberId,
    )
  }

  async create(appointment: Appointment) {
    this.items.push(appointment)
    return appointment
  }

  async save(appointment: Appointment) {
    const itemIndex = this.items.findIndex((item) => item.id === appointment.id)

    this.items[itemIndex] = appointment
    return appointment
  }
}
