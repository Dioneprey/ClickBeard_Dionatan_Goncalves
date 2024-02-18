import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ServiceData, ServiceSummary } from '@/context/schedule-context'
import { updateServicesSummary } from '@/utils/format-schedule-summary'
import { formatTime } from '@/utils/format-time-value'
import { Clock2 } from 'lucide-react'

interface ServiceCardProps {
  serviceData: ServiceData
  temporaryServices: ServiceData[]
  temporaryServicesSummary: ServiceSummary
  setTemporaryServices: React.Dispatch<React.SetStateAction<ServiceData[]>>
  setTemporaryServicesSummary: React.Dispatch<
    React.SetStateAction<ServiceSummary>
  >
}

interface ToggleTemporaryServiceParams {
  method: 'ADD' | 'REMOVE'
  serviceData: ServiceData
}

export function ServiceCard({
  serviceData,
  temporaryServices,
  setTemporaryServices,
  setTemporaryServicesSummary,
}: ServiceCardProps) {
  const { id, name, photo, price, time } = serviceData

  const serviceIsSelected = temporaryServices.some(
    (service) => service.id === id,
  )

  const method = serviceIsSelected ? 'REMOVE' : 'ADD'

  function toggleTemporaryService({
    method,
    serviceData,
  }: ToggleTemporaryServiceParams) {
    if (method === 'ADD') {
      setTemporaryServices((prevState) => {
        const newState = [...prevState, serviceData]
        setTemporaryServicesSummary(updateServicesSummary(newState))
        return newState
      })
    } else if (method === 'REMOVE') {
      setTemporaryServices((prevState) => {
        const newState = prevState.filter(
          (service) => service.id !== serviceData.id,
        )
        setTemporaryServicesSummary(updateServicesSummary(newState))
        return newState
      })
    }
  }

  return (
    <Card
      onClick={() =>
        toggleTemporaryService({
          method,
          serviceData: {
            id,
            name,
            photo,
            price,
            time,
          },
        })
      }
      className={`w-[200px] cursor-pointer ${serviceIsSelected && 'border-primary'}`}
    >
      <CardHeader className="flex p-2 flex-col justify-center items-center gap-2">
        <Avatar className="h-32 w-full rounded-lg">
          <AvatarImage src={photo} />
          <AvatarFallback>Serviço</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-1">
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(price)}
          </CardDescription>
          <Badge className="flex items-center gap-1">
            <Clock2 className="h-4 w-4" />
            <span>{formatTime(time)}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent onClick={(e) => e.stopPropagation()}></CardContent>
    </Card>
  )
}
