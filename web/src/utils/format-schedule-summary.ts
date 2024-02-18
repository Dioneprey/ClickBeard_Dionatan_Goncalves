import { ServiceData } from '@/context/schedule-context'

export function sumServiceTimes(times: string[]) {
  const totalMinutes = times.reduce((total, time) => {
    const [hours, minutes] = time.split(':').map(Number)
    return total + hours * 60 + minutes
  }, 0)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export function updateServicesSummary(selectedServices: ServiceData[]) {
  const selectedServicesCount = selectedServices.length
  const selectedServicesPrice = selectedServices.reduce(
    (total, service) => total + service.price,
    0,
  )
  const selectedServicesTime = sumServiceTimes(
    selectedServices.map((service) => service.time),
  )

  return {
    selectedServicesCount,
    selectedServicesPrice,
    selectedServicesTime,
  }
}
