import { api } from '@/lib/axios'

export interface cancelAppointmentParam {
  appointmentId: string
}

export async function cancelAppointment({
  appointmentId,
}: cancelAppointmentParam) {
  await api.patch(`/api/appointments/${appointmentId}/cancel`)
}
