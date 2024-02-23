import { formatDistance, differenceInYears } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { ServiceCardOnlyView } from './service-card'
import { Barber } from '@/@interfaces/Barber'
import { useAuth } from '@/context/auth-context'
import { HandleRegistrationBarber } from '@/components/handle-registration-barber'

interface BarberProfileDrawerProps {
  barberData: Barber
}

export function BarberProfileDrawer({ barberData }: BarberProfileDrawerProps) {
  const { user } = useAuth()

  const isAdmin = user.role === 'admin'

  const { name, photo, hiringDate, birthDate, specialities } = barberData

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full">
          Ver perfil
        </Button>
      </DrawerTrigger>
      <DrawerContent className="justify-center items-center">
        <DrawerHeader className="flex gap-5 justify-center ">
          <Avatar className="h-16 w-16">
            <AvatarImage src={photo} />
            <AvatarFallback>Barbeiro</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <DrawerTitle>{name}</DrawerTitle>
            <DrawerDescription>
              {differenceInYears(new Date(), birthDate)} anos
            </DrawerDescription>
            <DrawerDescription>
              Membro da equipe{' '}
              {formatDistance(hiringDate, new Date(), {
                addSuffix: true,
                locale: ptBR,
              })}
            </DrawerDescription>
            <DrawerDescription>
              {specialities.length} especialidade(s)
            </DrawerDescription>
          </div>
        </DrawerHeader>
        <DrawerFooter className="sm:w-[80%] w-[100%] flex gap-5 justify-center items-center">
          {isAdmin && (
            <div className="flex justify-between items-center">
              <Button className="w-[100px] text-center">
                <HandleRegistrationBarber
                  isUpdate={true}
                  barberData={barberData}
                />
              </Button>
            </div>
          )}
          <Separator className="w-full" />
          <div className="flex justify-between items-center">
            <span className="w-[100px] text-center">Especialidades</span>
          </div>
          <div className="w-full flex justify-center flex-wrap gap-4 overflow-y-auto">
            {barberData?.specialities.map((barberSpeciality) => {
              return (
                <ServiceCardOnlyView
                  key={barberSpeciality.id}
                  speciality={barberSpeciality}
                />
              )
            })}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
