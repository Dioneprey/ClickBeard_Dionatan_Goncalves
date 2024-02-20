import { fetchBarberAvailableSlots } from '@/api/fetch-barber-available-slots'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Skeleton } from '@/components/ui/skeleton'
import { useSchedule } from '@/context/schedule-context'
import { useMutation } from '@tanstack/react-query'
import { isBefore, startOfDay } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { useState } from 'react'

export function CalendarScheduler() {
  const {
    selectedBarber,
    scheduleDateTime,
    toggleScheduleDateTime,
    setScheduleStep,
    availableSlotsInDay,
    setAvailableSlotsInDay,
  } = useSchedule()
  const [
    fetchBarberAvailableSlotsIsLoading,
    setFetchBarberAvailableSlotsIsLoading,
  ] = useState(false)
  const [date, setDate] = useState<Date | undefined>(
    scheduleDateTime?.date ? new Date(scheduleDateTime?.date) : undefined,
  )

  const disabledDays = (day: Date) => {
    return isBefore(day, startOfDay(new Date()))
  }

  const { mutateAsync: fetchBarberAvailableSlotsFn } = useMutation({
    mutationFn: fetchBarberAvailableSlots,
    onMutate: () => {
      setAvailableSlotsInDay([])
      setFetchBarberAvailableSlotsIsLoading(true)
      toggleScheduleDateTime({
        date: undefined,
        hourSlot: undefined,
      })
    },
    onSuccess: (data) => {
      setAvailableSlotsInDay(data)

      setFetchBarberAvailableSlotsIsLoading(false)
    },
    onError: () => {
      setFetchBarberAvailableSlotsIsLoading(false)
    },
  })

  return (
    <>
      <Calendar
        mode="single"
        // @ts-expect-error algun erro de tipagem que aparece vez ou outra mas não interfere no comportamento
        locale={ptBR}
        disabled={fetchBarberAvailableSlotsIsLoading || disabledDays}
        selected={date}
        // @ts-expect-error algun erro de tipagem que aparece vez ou outra mas não interfere no comportamento
        onSelect={(e: Date) => {
          if (e) {
            setDate(e)
            fetchBarberAvailableSlotsFn({
              barberId: selectedBarber?.id ?? '',
              date: e.toISOString(),
            })
          }
        }}
        className="rounded-md border"
      />

      {fetchBarberAvailableSlotsIsLoading ? (
        <div className="flex gap-2 justify-center md:max-w-[80%] w-fullitems-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="flex-shrink-0 h-16 w-16 rounded-full flex flex-col items-center justify-center"
            />
          ))}
        </div>
      ) : (
        <>
          {date && availableSlotsInDay.length < 1 ? (
            <span className="text-rose-500">
              Sem horários livres para o dia e serviço(s) selecionado(s).
            </span>
          ) : (
            <div className="flex gap-2 w-full pb-3 overflow-x-auto 2xl:justify-center">
              {availableSlotsInDay.map((slot) => {
                const isSlotChosed =
                  scheduleDateTime?.date === date?.toISOString() &&
                  scheduleDateTime?.hourSlot === slot

                return (
                  <Button
                    onClick={() => {
                      toggleScheduleDateTime({
                        date: date?.toISOString() ?? '',
                        hourSlot: slot,
                      })
                      setScheduleStep(3)
                    }}
                    key={slot}
                    className={`cursor-pointer ${isSlotChosed ? 'bg-primary' : 'bg-emerald-500'} hover:bg-primary/80 h-16 w-16 rounded-full flex flex-col`}
                  >
                    <span className="text-lg text-white font-semibold">
                      {slot}
                    </span>
                    <span className="text-md -mt-2 text-white">Livre</span>
                  </Button>
                )
              })}
            </div>
          )}
        </>
      )}
    </>
  )
}
