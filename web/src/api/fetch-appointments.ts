import { Appointment } from '@/@interfaces/Appointment'
import { api } from '@/lib/axios'

export async function fetchAppointments() {
  const { data } = await api.get<{ appointments: Appointment[] }>(
    '/api/appointments',
  )

  if (data.appointments) return data.appointments
  return []
}
