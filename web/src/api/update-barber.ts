import { api } from '@/lib/axios'

export interface RegisterBarberBody {
  id: string
  name: string
  hiringDate: Date
  birthDate: Date
  removePhoto?: boolean
  specialities: string[]
}

export async function updateBarber({
  id,
  name,
  hiringDate,
  birthDate,
  specialities,
  removePhoto,
}: RegisterBarberBody) {
  const { data } = await api.patch<{ barberId: string }>('/api/barbers', {
    id,
    name,
    hiringDate,
    birthDate,
    specialities,
    removePhoto,
  })
  return data.barberId
}
