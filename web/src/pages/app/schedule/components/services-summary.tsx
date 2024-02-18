import { Button } from '@/components/ui/button'
import {
  ServiceData,
  ServiceSummary as ServiceSummaryType,
  useSchedule,
} from '@/context/schedule-context'
import { formatTime } from '@/utils/format-time-value'

interface ServiceSummaryProps {
  temporaryServices: ServiceData[]
  temporaryServicesSummary: ServiceSummaryType
  setOpenServiceDrawer: React.Dispatch<React.SetStateAction<boolean>>
}

export function ServiceSummary({
  temporaryServices,
  temporaryServicesSummary,
  setOpenServiceDrawer,
}: ServiceSummaryProps) {
  const { toggleSelectedServices } = useSchedule()

  return (
    <div className="flex gap-5 items-center">
      <div className="bg-primary h-16 w-16 rounded-full flex items-center justify-center">
        <span className="text-2xl text-white">
          {temporaryServicesSummary.selectedServicesCount}
        </span>
      </div>
      <div className="flex flex-col">
        <span>Serviço(s) selecionado(s)</span>
        <span>
          Duração: {formatTime(temporaryServicesSummary.selectedServicesTime)}
        </span>
        <span>
          Valor total:{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(temporaryServicesSummary.selectedServicesPrice)}
        </span>
      </div>
      <Button
        disabled={temporaryServicesSummary.selectedServicesCount === 0}
        onClick={() => {
          toggleSelectedServices({
            serviceData: temporaryServices,
            serviceSummary: temporaryServicesSummary,
          })
          setOpenServiceDrawer(false)
        }}
      >
        Continuar
      </Button>
    </div>
  )
}
