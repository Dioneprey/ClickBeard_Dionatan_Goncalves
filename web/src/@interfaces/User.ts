export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'client'
  createdAt: Date
}
