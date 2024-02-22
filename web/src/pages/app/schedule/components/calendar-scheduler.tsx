import { FetchBarberAvailableSlotsParams } from '@/api/fetch-barber-available-slots'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Skeleton } from '@/components/ui/skeleton'
import { useSchedule } from '@/context/schedule-context'
import { isBefore, startOfDay } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { useState } from 'react'

interface CalendarSchedulerProps {
  fetchBarberAvailableSlots: ({
    barberId,
    date,
  }: FetchBarberAvailableSlotsParams) => void
  fetchBarberAvailableSlotsIsLoading: boolean
}

export function CalendarScheduler({
  fetchBarberAvailableSlots,
  fetchBarberAvailableSlotsIsLoading,
}: CalendarSchedulerProps) {
  const {
    selectedBarber,
    scheduleDateTime,
    toggleScheduleDateTime,
    setScheduleStep,
    availableSlotsInDay,
  } = useSchedule()

  const [date, setDate] = useState<Date | undefined>(scheduleDateTime.date)
  console.log(availableSlotsInDay)

  const disabledDays = (day: Date) => {
    return isBefore(day, startOfDay(new Date()))
  }

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
            fetchBarberAvailableSlots({
              barberId: selectedBarber?.id ?? '',
              date: e,
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
                  scheduleDateTime?.date === date &&
                  scheduleDateTime?.hourSlot === slot

                return (
                  <Button
                    onClick={() => {
                      toggleScheduleDateTime({
                        date,
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
