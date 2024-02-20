import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ChevronUp } from 'lucide-react'
import { ServiceCard } from './service-card'
import { Separator } from '@/components/ui/separator'
import { useSchedule } from '@/context/schedule-context'
import { ServiceSummary } from './services-summary'
import { useState } from 'react'
import { Speciality } from '@/@interfaces/Speciality'

export function ServicesDrawer() {
  const { selectedBarber, selectedService } = useSchedule()
  // Pegando valores temporários pois só será salvo caso clique no botão "Continuar" em <ServiceSummary />
  const [temporaryService, setTemporaryService] =
    useState<Speciality>(selectedService)
  const [openServiceDrawer, setOpenServiceDrawer] = useState(false)

  return (
    <Drawer
      onClose={() => {
        setTemporaryService(selectedService)
      }}
      open={openServiceDrawer}
      onOpenChange={setOpenServiceDrawer}
    >
      <DrawerTrigger asChild>
        <Button className="w-full">
          <ChevronUp />
          <span>Selecionar serviço</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[95vh]  justify-center items-center">
        <DrawerHeader className="flex flex-col justify-center items-center">
          <DrawerTitle>Selecione o serviço</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter className="sm:w-[80%] w-[100%] overflow-y-auto flex justify-center items-center">
          <div className="w-full flex justify-center flex-wrap gap-4 overflow-y-auto">
            {selectedBarber?.specialities.map((barberSpeciality) => {
              return (
                <ServiceCard
                  key={barberSpeciality.id}
                  speciality={barberSpeciality}
                  temporaryService={temporaryService}
                  setTemporaryService={setTemporaryService}
                />
              )
            })}
          </div>
          <Separator />
          <ServiceSummary
            temporaryService={temporaryService}
            setOpenServiceDrawer={setOpenServiceDrawer}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
