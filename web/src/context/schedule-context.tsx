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
  scheduleStep: number
  availableSlotsInDay: string[]
  resetSchedule: () => void
  setScheduleStep: React.Dispatch<React.SetStateAction<number>>
  toggleSelectedServices: ({
    speciality,
    serviceSummary,
  }: ToggleSelectedServicesParams) => void
  setAvailableSlotsInDay: React.Dispatch<React.SetStateAction<string[]>>
  setSelectedBarber: (value: Barber) => void
  toggleScheduleDateTime: ({ date, hourSlot }: ScheduleDateTime) => void
  handleMakeAppointment: () => void
}

const ScheduleContext = createContext<ScheduleContextProps>({
  selectedBarber: undefined,
  selectedServices: [],
  servicesSummary: {
    selectedServicesCount: 0,
    selectedServicesPrice: 0,
    selectedServicesTime: '00:00',
  },
  scheduleStep: 0,
  availableSlotsInDay: [],
  scheduleDateTime: undefined,
  resetSchedule: () => {},
  setScheduleStep: () => {},
  setSelectedBarber: () => {},
  toggleSelectedServices: () => {},
  setAvailableSlotsInDay: () => {},
  toggleScheduleDateTime: () => {},
  handleMakeAppointment: () => {},
})

export function ScheduleContextProvider({ children }: { children: ReactNode }) {
  const [scheduleStep, setScheduleStep] = useState(0)
  const [selectedBarber, setSelectedBarber] = useState<Barber | undefined>(
    undefined,
  )
  const [scheduleDateTime, setScheduleDateTime] = useState<
    ScheduleDateTime | undefined
  >(undefined)
  const [selectedServices, setSelectedServices] = useState<Speciality[]>([])
  const [availableSlotsInDay, setAvailableSlotsInDay] = useState<string[]>([])
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

  function resetSchedule() {
    setSelectedBarber(undefined)
    setSelectedServices([])
    setServicesSummary({
      selectedServicesCount: 0,
      selectedServicesPrice: 0,
      selectedServicesTime: '00:00',
    })
    setScheduleStep(0)
    setScheduleDateTime({
      date: undefined,
      hourSlot: undefined,
    })
    setAvailableSlotsInDay([])
  }

  function handleMakeAppointment() {
    const appointment = {
      barberId: selectedBarber?.id,
      day: scheduleDateTime?.date,
      hour: scheduleDateTime?.hourSlot,
      appointmentServices: selectedServices.map((service) => service.id),
    }
    console.log(appointment)
  }

  return (
    <ScheduleContext.Provider
      value={{
        selectedBarber,
        selectedServices,
        servicesSummary,
        scheduleDateTime,
        availableSlotsInDay,
        scheduleStep,
        resetSchedule,
        setScheduleStep,
        setSelectedBarber,
        setAvailableSlotsInDay,
        toggleSelectedServices,
        toggleScheduleDateTime,
        handleMakeAppointment,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  )
}

export function useSchedule() {
  return useContext(ScheduleContext)
}
