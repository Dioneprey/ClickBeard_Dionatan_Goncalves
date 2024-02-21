import { env } from '@/env'

export const eventSource = new EventSource(
  `${env.VITE_API_URL}/api/events/subscribe`,
)
