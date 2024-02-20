import { api } from '@/lib/axios'

export interface FetchBarberAvailableSlotsParams {
  barberId: string
  date: Date
}

export async function fetchBarberAvailableSlots({
  barberId,
  date,
}: FetchBarberAvailableSlotsParams) {
  const { data } = await api.get<{ availableSlots: string[] }>(
    `/api/barbers/available-slots?barberId=${barberId}&date=${date.toISOString()}`,
  )
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return data.availableSlots
}
