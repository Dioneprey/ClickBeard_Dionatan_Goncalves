import { Helmet } from 'react-helmet-async'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { BarberCard } from './components/barber-card'
import { ServicesDrawer } from './components/services-drawer'
import { useSchedule } from '@/context/schedule-context'
import { useQuery } from '@tanstack/react-query'
import { Barber, fetchBarbers } from '@/api/fetch-barbers'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarScheduler } from './components/calendar-scheduler'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { CalendarDays } from 'lucide-react'

export function Schedule() {
  const {
    selectedBarber,
    selectedServices,
    servicesSummary,
    scheduleDateTime,
  } = useSchedule()

  const { data: barbers, isLoading: isLoadingFetchBarbers } = useQuery({
    queryKey: ['fetch-barbers'],
    queryFn: fetchBarbers,
    staleTime: Infinity,
  })

  return (
    <>
      <Helmet title="Marcar horário" />
      <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
        Escolha um profissional
      </h1>
      <div className="flex flex-col gap-5 mt-10 justify-center items-center">
        <ScrollArea className="w-full pb-5">
          {isLoadingFetchBarbers ? (
            <>
              <div className="flex gap-5 justify-center items-center">
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton
                    className="w-[200px] h-[230px] rounded-lg"
                    key={index + 1}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex gap-5 justify-center items-center">
              {barbers?.map((barber: Barber) => (
                <BarberCard key={barber.id} barberData={barber} />
              ))}
              <ScrollBar orientation="horizontal" />
            </div>
          )}
        </ScrollArea>

        {selectedBarber && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
              Escolha os serviços
            </h2>
            <ServicesDrawer />
          </div>
        )}

        {selectedServices.length > 0 && <CalendarScheduler />}

        {scheduleDateTime?.date && (
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">CONFIRME SUA RESERVA</span>
            <span className="mb-5">Verifique se está tudo certo</span>
            <span className="flex items-center gap-1">
              <span>
                <CalendarDays />
              </span>
              <span className="font-semibold">
                {format(scheduleDateTime.date, 'EEEE', {
                  // @ts-expect-error tipagem de import
                  locale: ptBR,
                }).toLocaleUpperCase()}
              </span>
            </span>
            <span className="text-xl font-bold">
              {format(scheduleDateTime.date, 'dd/MM/yyyy')} -{' '}
              {scheduleDateTime.hourSlot}
            </span>
            <span>
              <span>Profissional:</span>{' '}
              <span className="font-bold"> {selectedBarber?.name}</span>
            </span>
            <span>
              Serviço(s):{' '}
              {selectedServices.map((service, serviceIndex) => (
                <span key={service.id} className="font-semibold">
                  {service.name}
                  {serviceIndex < selectedServices.length - 1 ? ' + ' : ''}
                </span>
              ))}{' '}
              (duração : {servicesSummary.selectedServicesTime}h)
            </span>
          </div>
        )}
      </div>
    </>
  )
}
