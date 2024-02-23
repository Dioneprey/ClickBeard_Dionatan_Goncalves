import { Speciality } from '@/@interfaces/Speciality'
import { api } from '@/lib/axios'

export async function fetchSpecialities() {
  const { data } = await api.get<{ specialities: Speciality[] }>(
    '/api/specialities',
  )
  return data
}
