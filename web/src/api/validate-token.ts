import { api } from '@/lib/axios'

export async function validateToken() {
  return await api.get('/api')
}
