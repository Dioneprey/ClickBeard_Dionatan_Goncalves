import { Appointment } from '@/@interfaces/Appointment'
import { api } from '@/lib/axios'

export interface FetchAppointmentsQuery {
  pageIndex?: number | null
  status?: string | null
}

interface FetchAppointmentsResponse {
  appointments: Appointment[]
  meta: {
    pageIndex: number
    totalCount: number
    totalPages: number
  }
}

export async function fetchAppointments({
  pageIndex,
  status,
}: FetchAppointmentsQuery) {
  const { data } = await api.get<FetchAppointmentsResponse>(
    '/api/appointments',
    {
      params: {
        pageIndex,
        status,
      },
    },
  )

  return data
}
