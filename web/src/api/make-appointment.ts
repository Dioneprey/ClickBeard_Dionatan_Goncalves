import { api } from '@/lib/axios'

export interface makeAppointmentBody {
  barberId: string
  day: Date
  hour: string
  appointmentServiceId: string
}

export async function makeAppointment({
  barberId,
  day,
  hour,
  appointmentServiceId,
}: makeAppointmentBody) {
  await api.post('/api/appointments', {
    barberId,
    day,
    hour,
    appointmentServiceId,
  })
}
