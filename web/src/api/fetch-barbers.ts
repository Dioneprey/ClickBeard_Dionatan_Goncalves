import { api } from '@/lib/axios'
import { Barber } from '@/@interfaces/Barber'

export async function fetchBarbers() {
  const { data } = await api.get<{ barbers: Barber[] }>('/api/barbers')

  return data.barbers
}
