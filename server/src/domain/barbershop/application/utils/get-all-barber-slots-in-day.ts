import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
dayjs.extend(isToday)

export function getAllBarberSlotsInDay(date: Date) {
  let startTime = dayjs().hour(8).minute(0) // Define o horário de início às 08:00
  const endTime = dayjs().hour(17).minute(30) // O horário de término é às 18:00, portanto o ultimo horário disponível para atendimento é às 17:30
  const searchDate = dayjs(date).startOf('day')
  const currentDate = dayjs()

  if (searchDate.isToday()) {
    // Se data de pesquisa for igual a hoje, trazer horários à partir da próxima meia hora
    startTime =
      currentDate.minute() >= 30
        ? currentDate.add(1, 'hour').minute(0)
        : currentDate.minute(30)
  }

  const allSlotsInDay: string[] = []

  while (startTime.isBefore(endTime) || startTime.isSame(endTime)) {
    allSlotsInDay.push(startTime.format('HH:mm')) // Adiciona o horário atual ao array
    startTime = startTime.add(30, 'minute')
  }

  return allSlotsInDay
}
