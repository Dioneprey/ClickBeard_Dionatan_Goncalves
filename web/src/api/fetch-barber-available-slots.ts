import { api } from '@/lib/axios'

interface FetchBarberAvailableSlotsParams {
  barberId: string
  date: string
}

export async function fetchBarberAvailableSlots({
  barberId,
  date,
}: FetchBarberAvailableSlotsParams) {
  const { data } = await api.get<{ availableSlots: string[] }>(
    `/api/barbers/available-slots?barberId=${barberId}&date=${date}`,
  )
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return data.availableSlots
}
