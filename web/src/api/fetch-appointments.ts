export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'canceled',
}

export interface Apointment {
  day: Date
  hour: string
  clientId: string
  barberId: string
  status: AppointmentStatus
  createdAt: Date
}
