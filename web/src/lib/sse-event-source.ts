import { env } from '@/env'

export const appointmentsEventSource = new EventSource(
  `${env.VITE_API_URL}/api/events/appointments/sse`,
)
