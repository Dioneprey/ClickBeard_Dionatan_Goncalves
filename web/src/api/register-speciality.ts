import { api } from '@/lib/axios'

export interface RegisterSpecialityBody {
  name: string
  price: number
  photo?: string
}

export async function registerSpeciality({
  name,
  price,
  photo,
}: RegisterSpecialityBody) {
  const { data } = await api.post<{ specialityId: string }>(
    '/api/specialities',
    {
      name,
      price,
      photo,
    },
  )
  return data.specialityId
}
