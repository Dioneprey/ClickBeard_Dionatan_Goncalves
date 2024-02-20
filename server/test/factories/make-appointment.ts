import dayjs from 'dayjs'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import {
  Appointment,
  AppointmentProps,
} from 'src/domain/barbershop/enterprise/entities/appointment'

export function makeAppointment(
  override: Partial<AppointmentProps> = {},
  id?: UniqueEntityID,
) {
  const appointment = Appointment.create(
    {
      ...override,
      clientId: override.clientId ?? new UniqueEntityID(),
      barberId: override.barberId ?? new UniqueEntityID(),
      day: override.day ?? dayjs().add(1, 'day').startOf('day').toDate(),
      hour: override.hour ?? '',
    },
    id,
  )

  return appointment
}
