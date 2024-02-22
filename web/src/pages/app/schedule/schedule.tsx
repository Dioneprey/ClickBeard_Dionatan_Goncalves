import { Helmet } from 'react-helmet-async'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { BarberCard } from './components/barber-card'
import { ServicesDrawer } from './components/services-drawer'
import { defaultDateTime, useSchedule } from '@/context/schedule-context'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchBarbers } from '@/api/fetch-barbers'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarScheduler } from './components/calendar-scheduler'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { CalendarDays, ChevronLeft, Eraser, Frown } from 'lucide-react'
import { MultiStepSchedule } from './components/multi-step-schedule'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
import { fetchBarberAvailableSlots } from '@/api/fetch-barber-available-slots'
import { useNavigate } from 'react-router-dom'
import { Barber } from '@/@interfaces/Barber'

export function Schedule() {
  const navigate = useNavigate()

  const {
    selectedBarber,
    selectedService,
    scheduleDateTime,
    scheduleStep,
    setScheduleStep,
    resetSchedule,
    setAvailableSlotsInDay,
    toggleScheduleDateTime,
    handleMakeAppointment,
  } = useSchedule()

  const [makeAppointmentLoading, setMakeAppointmentLoading] = useState(false)
  const [
    fetchBarberAvailableSlotsIsLoading,
    setFetchBarberAvailableSlotsIsLoading,
  ] = useState(false)

  const { data: barbers, isLoading: isLoadingFetchBarbers } = useQuery({
    queryKey: ['fetch-barbers'],
    queryFn: fetchBarbers,
    staleTime: Infinity,
  })

  const { mutateAsync: fetchBarberAvailableSlotsFn } = useMutation({
    mutationFn: fetchBarberAvailableSlots,
    onMutate: () => {
      setAvailableSlotsInDay([])
      setFetchBarberAvailableSlotsIsLoading(true)
      toggleScheduleDateTime(defaultDateTime)
    },
    onSuccess: (data) => {
      setAvailableSlotsInDay(data)
      setFetchBarberAvailableSlotsIsLoading(false)
    },
    onError: () => {
      setFetchBarberAvailableSlotsIsLoading(false)
    },
  })

  const { mutateAsync: handleMakeAppointmentMutation } = useMutation({
    mutationFn: handleMakeAppointment,
    onMutate: () => {
      setMakeAppointmentLoading(true)
    },
    onError: (error) => {
      setMakeAppointmentLoading(false)
      if (
        // @ts-expect-error Mensagem de erro do back end vem dessa forma
        error?.response?.data?.message?.includes('already reserved') ||
        // @ts-expect-error Mensagem de erro do back end vem dessa forma
        error?.response?.data?.message?.includes('is not valid.')
      ) {
        toast.error(
          'Horário não está mais disponível, por favor, escolha outro.',
        )
        setAvailableSlotsInDay([])
        toggleScheduleDateTime({
          date: undefined,
          hourSlot: '',
        })
        setScheduleStep(2)
      }
    },
    onSuccess() {
      setMakeAppointmentLoading(false)
      toast.success('Horário agendado com sucesso', {
        action: {
          label: 'Agendamentos',
          onClick: () => navigate(`/agendamentos`),
        },
      })
      resetSchedule()
    },
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
                    className="w-[300px] py-5 h-[280px] rounded-lg"
                    key={index + 1}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {
                // @ts-expect-error possible undefine
                barbers?.length < 1 ? (
                  <div className="flex flex-col gap-5 justify-center items-center mt-[200px]">
                    <Frown className="h-16 w-16" />
                    <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
                      Ops, parece que não foi cadastrado nenhum profissional.
                    </h2>
                  </div>
                ) : (
                  <div className="flex gap-5 justify-center items-center">
                    {barbers?.map((barber: Barber) => (
                      <BarberCard key={barber.id} barberData={barber} />
                    ))}
                    <ScrollBar orientation="horizontal" />
                  </div>
                )
              }
            </>
          )}
        </ScrollArea>

        {selectedBarber.name.length > 0 && (
          <div className="flex flex-col items-center gap-5">
            {scheduleStep >= 2 && (
              <Button
                onClick={() => {
                  setScheduleStep((prevState) => prevState - 1)
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <span>
                  <ChevronLeft />
                </span>
                <span>Voltar</span>
              </Button>
            )}
            <MultiStepSchedule />
            <Button onClick={() => resetSchedule()} variant="outline">
              <Eraser />
            </Button>
          </div>
        )}

        {scheduleStep === 1 && selectedBarber && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
              Escolha o serviço
            </h2>
            <ServicesDrawer />
          </div>
        )}
        {scheduleStep === 2 && selectedService && (
          <CalendarScheduler
            fetchBarberAvailableSlots={fetchBarberAvailableSlotsFn}
            fetchBarberAvailableSlotsIsLoading={
              fetchBarberAvailableSlotsIsLoading
            }
          />
        )}

        {scheduleStep === 3 && scheduleDateTime?.date && (
          <div className="flex p-10 border rounded-xl flex-col items-center justify-center">
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
              Serviço:{' '}
              <span className="font-semibold">{selectedService.name}</span>{' '}
              (duração : {selectedService.time}h)
            </span>
            <div className="w-full mt-5">
              <Button
                disabled={makeAppointmentLoading}
                onClick={() => handleMakeAppointmentMutation()}
                className="w-full"
              >
                Confirmar
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
