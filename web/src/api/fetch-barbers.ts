import { api } from '@/lib/axios'
import { Speciality } from './fetch-specialities'

export interface Barber {
  id: string
  name: string
  photo?: string
  hiringDate: Date
  birthDate: Date
  specialities: Speciality[]
}

export async function fetchBarbers() {
  const { data } = await api.get<{ barbers: Barber[] }>('/api/barbers')

  return data.barbers
}
