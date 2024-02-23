import { api } from '@/lib/axios'

export interface RegisterBarberBody {
  name: string
  hiringDate: Date
  birthDate: Date
  photo?: string | null
  specialities: string[]
}

export async function updateBarber({
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
