import { Helmet } from 'react-helmet-async'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { BarberCard } from './components/barber-card'
import { ServicesDrawer } from './components/services-drawer'
import { useSchedule } from '@/context/schedule-context'

export function Schedule() {
  const { selectedBarber, selectedServices } = useSchedule()

  return (
    <>
      <Helmet title="Marcar horário" />
      <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
        Escolha um profissional
      </h1>
      <div className="flex flex-col gap-5 mt-10 justify-center items-center">
        <ScrollArea className="w-full pb-5">
          <div className="flex gap-5 justify-center items-center">
            {Array.from({ length: 3 }, (_, index) => (
              <BarberCard key={index + 1} id={(index + 1).toString()} />
            ))}
            <ScrollBar orientation="horizontal" />
          </div>
        </ScrollArea>

        {selectedBarber && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
              Escolha os serviços
            </h2>
            <ServicesDrawer />
          </div>
        )}

        {selectedServices.length > 0 && (
          <div>Você escolheu {selectedServices.length} serviços</div>
        )}
      </div>
    </>
  )
}
