import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarberProfileDrawer } from './barber-profile-drawer'
import { useSchedule } from '@/context/schedule-context'
import { Barber } from '@/api/fetch-barbers'

interface BarberCardProps {
  barberData: Barber
}

export function BarberCard({ barberData }: BarberCardProps) {
  const { selectedBarber, setSelectedBarber } = useSchedule()
  const { id, name, photo } = barberData
  return (
    <Card
      onClick={() => setSelectedBarber(barberData)}
      className={`w-[200px] cursor-pointer ${selectedBarber?.id === id && 'border-primary'}`}
    >
      <CardHeader className="flex flex-col justify-center items-center gap-2">
        <Avatar className="h-20 w-20">
          <AvatarImage src={photo} />
          <AvatarFallback>Barbeiro</AvatarFallback>
        </Avatar>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent onClick={(e) => e.stopPropagation()}>
        <Button className="w-full" asChild>
          <BarberProfileDrawer barberData={barberData} />
        </Button>
      </CardContent>
    </Card>
  )
}
