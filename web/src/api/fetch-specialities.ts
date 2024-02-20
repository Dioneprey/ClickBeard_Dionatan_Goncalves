import { Speciality } from '@/@interfaces/Speciality'
import { api } from '@/lib/axios'

export async function fetchSpecialities() {
  return await api.get<{ speciality: Speciality }>('/api/specialities')
}
