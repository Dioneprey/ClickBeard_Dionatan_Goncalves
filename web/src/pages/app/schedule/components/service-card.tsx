import { Speciality } from '@/@interfaces/Speciality'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatTime } from '@/utils/format-time-value'
import { Clock2 } from 'lucide-react'

interface ServiceCardProps {
  speciality: Speciality
  temporaryService: Speciality
  setTemporaryService: React.Dispatch<React.SetStateAction<Speciality>>
}

export function ServiceCard({
  speciality,
  temporaryService,
  setTemporaryService,
}: ServiceCardProps) {
  const { id, name, photo, price, time } = speciality

  const serviceIsSelected = temporaryService.id === id

  function toggleTemporaryService(speciality: Speciality) {
    setTemporaryService(speciality)
  }

  return (
    <Card
      onClick={() => {
        if (serviceIsSelected) {
          toggleTemporaryService({
            id: '',
            name: '',
            price: 0,
            time: '',
            photo: '',
          })
        } else {
          toggleTemporaryService({
            id,
            name,
            photo,
            price,
            time,
          })
        }
      }}
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

interface ServiceCardOnlyViewProps {
  speciality: Speciality
}

export function ServiceCardOnlyView({ speciality }: ServiceCardOnlyViewProps) {
  const { name, photo, price, time } = speciality

  return (
    <Card className="w-[200px]">
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
    </Card>
  )
}
