import { api } from '@/lib/axios'

export interface RegisterBarberBody {
  name: string
  hiringDate: Date
  birthDate: Date
  photo?: string
  specialities: string[]
}

export async function registerBarber({
  name,
  hiringDate,
  birthDate,
  specialities,
  photo,
}: RegisterBarberBody) {
  const { data } = await api.post<{ barberId: string }>('/api/barbers', {
    name,
    hiringDate,
    birthDate,
    specialities,
    photo,
  })
  return data.barberId
}
