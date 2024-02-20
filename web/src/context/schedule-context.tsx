import { Barber } from '@/@interfaces/Barber'
import { Speciality } from '@/@interfaces/Speciality'
import { makeAppointment } from '@/api/make-appointment'
import { ReactNode, createContext, useContext, useState } from 'react'

export interface ScheduleDateTime {
  date?: Date
  hourSlot: string
}

interface ScheduleContextProps {
  selectedBarber: Barber
  selectedService: Speciality
  scheduleDateTime: ScheduleDateTime
  scheduleStep: number
  availableSlotsInDay: string[]
  resetSchedule: () => void
  setScheduleStep: React.Dispatch<React.SetStateAction<number>>
  toggleSelectedService: (speciality: Speciality) => void
  setAvailableSlotsInDay: React.Dispatch<React.SetStateAction<string[]>>
  setSelectedBarber: (value: Barber) => void
  toggleScheduleDateTime: ({ date, hourSlot }: ScheduleDateTime) => void
  handleMakeAppointment: () => Promise<void>
}

export const defaultService = {
  id: '',
  name: '',
  price: 0,
  time: '',
  photo: '',
}

export const defaultBarber = {
  id: '',
  name: '',
  birthDate: new Date(),
  hiringDate: new Date(),
  specialities: [],
  photo: '',
}

export const defaultDateTime = {
  date: undefined,
  hourSlot: '',
}

const ScheduleContext = createContext<ScheduleContextProps>({
  selectedBarber: defaultBarber,
  selectedService: defaultService,
  scheduleStep: 0,
  availableSlotsInDay: [],
  scheduleDateTime: defaultDateTime,
  resetSchedule: () => {},
  setScheduleStep: () => {},
  setSelectedBarber: () => {},
  toggleSelectedService: () => {},
  setAvailableSlotsInDay: () => {},
  toggleScheduleDateTime: () => {},
  handleMakeAppointment: async () => {},
})

export function ScheduleContextProvider({ children }: { children: ReactNode }) {
  const [scheduleStep, setScheduleStep] = useState(0)
  const [selectedBarber, setSelectedBarber] = useState<Barber>(defaultBarber)
  const [scheduleDateTime, setScheduleDateTime] =
    useState<ScheduleDateTime>(defaultDateTime)
  const [selectedService, setselectedService] =
    useState<Speciality>(defaultService)
  const [availableSlotsInDay, setAvailableSlotsInDay] = useState<string[]>([])

  function toggleSelectedService(speciality: Speciality) {
    setselectedService(speciality)
  }

  function toggleScheduleDateTime({ date, hourSlot }: ScheduleDateTime) {
    setScheduleDateTime({ date, hourSlot })
  }

  function resetSchedule() {
    setSelectedBarber(defaultBarber)
    setselectedService(defaultService)

    setScheduleStep(0)
    setScheduleDateTime(defaultDateTime)
    setAvailableSlotsInDay([])
  }

  async function handleMakeAppointment() {
    const appointment = {
      barberId: selectedBarber.id,
      day: scheduleDateTime.date ?? new Date(),
      hour: scheduleDateTime.hourSlot,
      appointmentServiceId: selectedService?.id,
    }

    await makeAppointment(appointment)
  }

  return (
    <ScheduleContext.Provider
      value={{
        selectedBarber,
        selectedService,
        scheduleDateTime,
        availableSlotsInDay,
        scheduleStep,
        resetSchedule,
        setScheduleStep,
        setSelectedBarber,
        setAvailableSlotsInDay,
        toggleSelectedService,
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
