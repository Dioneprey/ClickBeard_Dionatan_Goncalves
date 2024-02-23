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

interface SpecialityCardProps {
  speciality: Speciality
  selectedSpecialitiesId: string[]
  setSelectedSpecialitiesId: React.Dispatch<React.SetStateAction<string[]>>
}

export function SpecialityCard({
  speciality,
  selectedSpecialitiesId,
  setSelectedSpecialitiesId,
}: SpecialityCardProps) {
  const { id, name, photo, price, time } = speciality

  const specialityIsSelected = selectedSpecialitiesId.find(
    (itemId) => itemId === id,
  )

  return (
    <Card
      onClick={() => {
        if (specialityIsSelected) {
          setSelectedSpecialitiesId((state) =>
            state.filter((item) => item !== id),
          )
        } else {
          setSelectedSpecialitiesId((state) => [...state, id])
        }
      }}
      className={`w-[200px] cursor-pointer ${specialityIsSelected && 'border-primary'}`}
    >
      <CardHeader className="flex p-2 flex-col justify-center items-center gap-2">
        <Avatar className="h-32 w-full rounded-lg">
          <AvatarImage src={photo} />
          <AvatarFallback>Especialidade</AvatarFallback>
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
