import { Barber } from './Barber'
import { Speciality } from './Speciality'

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'canceled',
}

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
}
