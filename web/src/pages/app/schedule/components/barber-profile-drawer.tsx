import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { BarberProfileDrawerSection } from './barber-profile-drawer-section'

export function BarberProfileDrawer() {
  const [activeSection, setActiveSection] = useState<
    'about' | 'photos' | 'reviews'
  >('about')

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full">
          Ver perfil
        </Button>
      </DrawerTrigger>
      <DrawerContent className="justify-center items-center">
        <DrawerHeader className="flex flex-col justify-center items-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>Barbeiro</AvatarFallback>
          </Avatar>
          <DrawerTitle>Nome do barbeiro</DrawerTitle>
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
          <BarberProfileDrawerSection section={activeSection} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
