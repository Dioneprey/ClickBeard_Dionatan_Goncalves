import { Barber } from './Barber'
import { Speciality } from './Speciality'
import { User } from './User'

export type AppointmentStatus =
  | 'scheduled'
  | 'completed'
  | 'canceled'
  | 'in_progress'
export interface Appointment {
  id: string
  barberId: string
  clientId: string
  day: Date
  hour: string
  status: AppointmentStatus
  createdAt: Date
  service: Speciality
  barber: Barber
  client: User
}
