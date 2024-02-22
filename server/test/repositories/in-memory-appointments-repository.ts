import dayjs from 'dayjs'
import {
  AppointmentRepository,
  AppointmentRepositoryFindAllByClientIdParams,
  AppointmentRepositoryFindAllByDayProps,
  AppointmentRepositoryFindByIdParams,
} from 'src/domain/barbershop/application/repositories/appointment-repository'

import { Appointment } from 'src/domain/barbershop/enterprise/entities/appointment'

export class InMemoryAppointmentRepository implements AppointmentRepository {
  public items: Appointment[] = []

  async findById({
    appointmentId,
    userId,
  }: AppointmentRepositoryFindByIdParams) {
    let appointment
    if (userId) {
      appointment = this.items.find(
        (item) =>
          item.id.toString() === appointmentId &&
          item.clientId.toString() === userId,
      )
    } else {
      appointment = this.items.find(
        (item) => item.id.toString() === appointmentId,
      )
    }

    if (!appointment) {
      return null
    }

    return appointment
  }

  async findAllByClientId({
    clientId,
  }: AppointmentRepositoryFindAllByClientIdParams) {
    const appointments = this.items.filter(
      (appointment) => appointment.clientId.toString() === clientId,
    )

    return {
      data: appointments,
      pageIndex: 0,
      totalCount: this.items.length,
      totalPages: 0,
    }
  }

  async findAll() {
    return {
      data: this.items,
      pageIndex: 0,
      totalCount: this.items.length,
      totalPages: 0,
    }
  }

  async findAllByDay({
    date,
    barberId,
  }: AppointmentRepositoryFindAllByDayProps) {
    const day = dayjs(date).startOf('day')

    return this.items.filter(
      (appointment) =>
        dayjs(appointment.day).isSame(day, 'day') &&
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
