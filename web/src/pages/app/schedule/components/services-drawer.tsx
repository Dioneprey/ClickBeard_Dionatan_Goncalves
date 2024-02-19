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
import { useEffect, useState } from 'react'
import {
  ServiceSummary as ServiceSummaryType,
  useSchedule,
} from '@/context/schedule-context'
import { ServiceSummary } from './services-summary'
import { Speciality } from '@/api/fetch-specialities'

export function ServicesDrawer() {
  const { selectedBarber, selectedServices, servicesSummary } = useSchedule()
  // Pegando valores temporários pois só será salvo caso clique no botão "Continuar" em <ServiceSummary />
  const [temporaryServices, setTemporaryServices] = useState<Speciality[]>([])
  const [temporaryServicesSummary, setTemporaryServicesSummary] =
    useState<ServiceSummaryType>(servicesSummary)
  const [openServiceDrawer, setOpenServiceDrawer] = useState(false)

  useEffect(() => {
    setTemporaryServices(selectedServices)
  }, [selectedServices])

  return (
    <Drawer
      onClose={() => {
        setTemporaryServices(selectedServices)
        setTemporaryServicesSummary(servicesSummary)
      }}
      open={openServiceDrawer}
      onOpenChange={setOpenServiceDrawer}
    >
      <DrawerTrigger asChild>
        <Button className="w-full">
          <ChevronUp />
          <span>Selecionar serviços</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[95vh]  justify-center items-center">
        <DrawerHeader className="flex flex-col justify-center items-center">
          <DrawerTitle>Selecione os serviços</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter className="sm:w-[80%] w-[100%] overflow-y-auto flex justify-center items-center">
          <div className="w-full flex justify-center flex-wrap gap-4 overflow-y-auto">
            {selectedBarber?.specialities.map((barberSpeciality) => (
              <ServiceCard
                key={barberSpeciality.id}
                speciality={barberSpeciality}
                temporaryServices={temporaryServices}
                temporaryServicesSummary={temporaryServicesSummary}
                setTemporaryServices={setTemporaryServices}
                setTemporaryServicesSummary={setTemporaryServicesSummary}
              />
            ))}
          </div>
          <Separator />
          <ServiceSummary
            temporaryServices={temporaryServices}
            temporaryServicesSummary={temporaryServicesSummary}
            setOpenServiceDrawer={setOpenServiceDrawer}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
