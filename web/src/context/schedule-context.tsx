import { ReactNode, createContext, useContext, useState } from 'react'

export interface ServiceData {
  id: string
  name: string
  photo: string
  price: number
  time: string
}

export interface ServiceSummary {
  selectedServicesCount: number
  selectedServicesPrice: number
  selectedServicesTime: string
}

export interface ToggleSelectedServicesParams {
  serviceData: ServiceData[]
  serviceSummary: ServiceSummary
}

interface ScheduleContextProps {
  selectedBarber?: string
  selectedServices: ServiceData[]
  servicesSummary: ServiceSummary
  setSelectedBarber: (value: string) => void
  toggleSelectedServices: ({
    serviceData,
    serviceSummary,
  }: ToggleSelectedServicesParams) => void
}

const ScheduleContext = createContext<ScheduleContextProps>({
  selectedBarber: undefined,
  selectedServices: [],
  servicesSummary: {
    selectedServicesCount: 0,
    selectedServicesPrice: 0,
    selectedServicesTime: '00:00',
  },
  setSelectedBarber: () => {},
  toggleSelectedServices: () => {},
})

export function ScheduleContextProvider({ children }: { children: ReactNode }) {
  const [selectedBarber, setSelectedBarber] = useState<string | undefined>(
    undefined,
  )
  const [selectedServices, setSelectedServices] = useState<ServiceData[]>([])
  const [servicesSummary, setServicesSummary] = useState<ServiceSummary>({
    selectedServicesCount: 0,
    selectedServicesPrice: 0,
    selectedServicesTime: '00:00',
  })

  function toggleSelectedServices({
    serviceData,
    serviceSummary,
  }: ToggleSelectedServicesParams) {
    setSelectedServices(serviceData)
    setServicesSummary(serviceSummary)
  }

  return (
    <ScheduleContext.Provider
      value={{
        selectedBarber,
        selectedServices,
        servicesSummary,
        setSelectedBarber,
        toggleSelectedServices,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  )
}

export function useSchedule() {
  return useContext(ScheduleContext)
}
