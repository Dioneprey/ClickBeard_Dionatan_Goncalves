import { User } from '@/@interfaces/User'
import { api } from '@/lib/axios'

export async function getUserProfile() {
  return await api.get<{ user: User }>('/api/accounts')
}
