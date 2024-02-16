import { Appointment } from '../../enterprise/entities/appointment'

export interface AppointmentRepositoryFindAllByDayProps {
  date: Date
  barberId: string
}

export abstract class AppointmentRepository {
  abstract findAll(): Promise<Appointment[]>
  abstract findAllByDay({
    date,
    barberId,
  }: AppointmentRepositoryFindAllByDayProps): Promise<Appointment[]>

  abstract create(appointment: Appointment): Promise<Appointment>
  abstract save(appointment: Appointment): Promise<Appointment>
}
