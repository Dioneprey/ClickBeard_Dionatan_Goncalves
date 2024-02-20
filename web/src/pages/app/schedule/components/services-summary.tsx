import { Speciality } from '@/@interfaces/Speciality'
import { Button } from '@/components/ui/button'
import { useSchedule } from '@/context/schedule-context'
import { formatTime } from '@/utils/format-time-value'

interface ServiceSummaryProps {
  temporaryService: Speciality
  setOpenServiceDrawer: React.Dispatch<React.SetStateAction<boolean>>
}

export function ServiceSummary({
  temporaryService,
  setOpenServiceDrawer,
}: ServiceSummaryProps) {
  const { toggleSelectedService, setScheduleStep } = useSchedule()

  return (
    <div className="flex gap-5 items-center">
      <div className="bg-primary h-16 w-16 rounded-full flex items-center justify-center">
        <span className="text-2xl text-white">
          {temporaryService.id.length > 0 ? '1' : '0'}
        </span>
      </div>
      <div className="flex flex-col">
        <span>Serviço selecionado</span>
        <span>Duração: {formatTime(temporaryService.time)}</span>
        <span>
          Valor total:{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(temporaryService.price)}
        </span>
      </div>
      <Button
        onClick={() => {
          toggleSelectedService(temporaryService)
          setScheduleStep(2)
          setOpenServiceDrawer(false)
        }}
      >
        Continuar
      </Button>
    </div>
  )
}
