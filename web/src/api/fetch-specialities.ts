import { api } from '@/lib/axios'

export interface Speciality {
  id: string
  name: string
  photo?: string
  price: number
  time: string
}

export async function fetchSpecialities() {
  return await api.get<{ speciality: Speciality }>('/api/specialities')
}
