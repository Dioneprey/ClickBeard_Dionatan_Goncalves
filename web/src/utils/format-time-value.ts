// Pega valores como "00:10" e retorna "10min"
export function formatTime(timeString: string) {
  const [hours, minutes] = timeString.split(':')

  // Converte as horas e minutos para números inteiros
  const numHours = parseInt(hours, 10)
  const numMinutes = parseInt(minutes, 10)

  // Constrói a string formatada
  let formattedTime = ''
  if (numHours > 0) {
    formattedTime += `${numHours}h`
  }
  if (numMinutes > 0) {
    formattedTime += numHours > 0 ? `${numMinutes}min` : `${numMinutes}min`
  }

  return formattedTime
}
