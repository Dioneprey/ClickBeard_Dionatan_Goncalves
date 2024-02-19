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
import { useState } from 'react'
import { BarberProfileDrawerSection } from './barber-profile-drawer-section'
import { Barber } from '@/api/fetch-barbers'

interface BarberProfileDrawerProps {
  barberData: Barber
}

export function BarberProfileDrawer({ barberData }: BarberProfileDrawerProps) {
  const [activeSection, setActiveSection] = useState<
    'about' | 'photos' | 'reviews'
  >('about')

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
        <DrawerFooter className="sm:w-[80%] w-[100%] flex justify-center items-center">
          <div className="flex justify-between items-center gap-2">
            <Button
              onClick={() => setActiveSection('about')}
              variant={activeSection === 'about' ? 'default' : 'outline'}
              className="w-[100px] text-center"
            >
              Sobre
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <Button
              onClick={() => setActiveSection('photos')}
              variant={activeSection === 'photos' ? 'default' : 'outline'}
              className="w-[100px] text-center"
            >
              Fotos
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <Button
              onClick={() => setActiveSection('reviews')}
              variant={activeSection === 'reviews' ? 'default' : 'outline'}
              className="w-[100px] text-center"
            >
              Avaliações
            </Button>
          </div>
          <Separator className="w-full" />
          <BarberProfileDrawerSection
            barberData={barberData}
            section={activeSection}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
