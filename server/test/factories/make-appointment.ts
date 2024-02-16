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
      dateTime: override.dateTime
        ? roundToNextHalfHour(dayjs(override.dateTime))
        : new Date(),
    },
    id,
  )

  return appointment
}

const roundToNextHalfHour = (date) => {
  let roundedDate = dayjs(date)
  if (roundedDate.minute() > 30) {
    // Se for maior que 30, adicione uma hora e zero os minutos
    roundedDate = roundedDate.add(1, 'hour').minute(0)
  } else if (roundedDate.minute() > 0) {
    // Se for entre 1 e 30, ajuste para 30 minutos
    roundedDate = roundedDate.minute(30)
  }
  // Zere os segundos e milissegundos
  roundedDate = roundedDate.second(0).millisecond(0)

  return roundedDate.toDate()
}
