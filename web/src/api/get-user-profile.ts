import { UserData } from '@/context/auth-context'
import { api } from '@/lib/axios'

export async function getUserProfile() {
  return await api.get<{ user: UserData }>('/api/accounts')
}
