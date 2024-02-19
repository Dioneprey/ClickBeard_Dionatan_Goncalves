import { Barber } from '@/api/fetch-barbers'
import { Speciality } from '@/api/fetch-specialities'
import { ReactNode, createContext, useContext, useState } from 'react'

export interface ServiceSummary {
  selectedServicesCount: number
  selectedServicesPrice: number
  selectedServicesTime: string
}

export interface ToggleSelectedServicesParams {
  speciality: Speciality[]
  serviceSummary: ServiceSummary
}

export interface ScheduleDateTime {
  date?: string
  hourSlot?: string
}

interface ScheduleContextProps {
  selectedBarber?: Barber
  selectedServices: Speciality[]
  servicesSummary: ServiceSummary
  scheduleDateTime?: ScheduleDateTime
  setSelectedBarber: (value: Barber) => void
  toggleSelectedServices: ({
    speciality,
    serviceSummary,
  }: ToggleSelectedServicesParams) => void
  toggleScheduleDateTime: ({ date, hourSlot }: ScheduleDateTime) => void
}

const ScheduleContext = createContext<ScheduleContextProps>({
  selectedBarber: undefined,
  selectedServices: [],
  servicesSummary: {
    selectedServicesCount: 0,
    selectedServicesPrice: 0,
    selectedServicesTime: '00:00',
  },
  scheduleDateTime: undefined,
  setSelectedBarber: () => {},
  toggleSelectedServices: () => {},
  toggleScheduleDateTime: () => {},
})

export function ScheduleContextProvider({ children }: { children: ReactNode }) {
  const [selectedBarber, setSelectedBarber] = useState<Barber | undefined>(
    undefined,
  )
  const [scheduleDateTime, setScheduleDateTime] = useState<
    ScheduleDateTime | undefined
  >(undefined)
  const [selectedServices, setSelectedServices] = useState<Speciality[]>([])
  const [servicesSummary, setServicesSummary] = useState<ServiceSummary>({
    selectedServicesCount: 0,
    selectedServicesPrice: 0,
    selectedServicesTime: '00:00',
  })

  function toggleSelectedServices({
    speciality,
    serviceSummary,
  }: ToggleSelectedServicesParams) {
    setSelectedServices(speciality)
    setServicesSummary(serviceSummary)
  }

  function toggleScheduleDateTime({ date, hourSlot }: ScheduleDateTime) {
    setScheduleDateTime({ date, hourSlot })
  }
  console.log(scheduleDateTime)

  return (
    <ScheduleContext.Provider
      value={{
        selectedBarber,
        selectedServices,
        servicesSummary,
        scheduleDateTime,
        setSelectedBarber,
        toggleSelectedServices,
        toggleScheduleDateTime,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  )
}

export function useSchedule() {
  return useContext(ScheduleContext)
}
