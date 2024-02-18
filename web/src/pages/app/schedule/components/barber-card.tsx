import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarberProfileDrawer } from './barber-profile-drawer'
import { useSchedule } from '@/context/schedule-context'

interface BarberCardProps {
  id: string
}

export function BarberCard({ id }: BarberCardProps) {
  const { selectedBarber, setSelectedBarber } = useSchedule()

  return (
    <Card
      onClick={() => setSelectedBarber(id)}
      className={`w-[200px] cursor-pointer ${selectedBarber === id && 'border-primary'}`}
    >
      <CardHeader className="flex flex-col justify-center items-center gap-2">
        <Avatar className="h-20 w-20">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>Barbeiro</AvatarFallback>
        </Avatar>
        <CardTitle>Carlos</CardTitle>
      </CardHeader>
      <CardContent onClick={(e) => e.stopPropagation()}>
        <Button className="w-full" asChild>
          <BarberProfileDrawer />
        </Button>
      </CardContent>
    </Card>
  )
}
