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
  ServiceData,
  ServiceSummary as ServiceSummaryType,
  useSchedule,
} from '@/context/schedule-context'
import { ServiceSummary } from './services-summary'

export function ServicesDrawer() {
  const { selectedServices, servicesSummary } = useSchedule()
  // Pegando valores temporários pois só será salvo caso clique no botão "Continuar" em <ServiceSummary />
  const [temporaryServices, setTemporaryServices] = useState<ServiceData[]>([])
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
            {Array.from({ length: 5 }, (_, index) => (
              <ServiceCard
                key={index}
                serviceData={{
                  id: (index + 1).toString(),
                  name: 'Acabamento',
                  photo: 'https://github.com/shadcn.png',
                  price: 50,
                  time: '00:30',
                }}
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
