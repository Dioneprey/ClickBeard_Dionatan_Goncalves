import { AppointmentStatus } from '@/@interfaces/Appointment'

interface AppointmentStatusProps {
  status: AppointmentStatus
}

const appointmentStatusMap: Record<AppointmentStatus, string> = {
  scheduled: 'Agendado',
  canceled: 'Cancelado',
  completed: 'Finalizado',
  in_progress: 'Em andamento',
}

export function AppointmentStatusIndicator({ status }: AppointmentStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {['scheduled'].includes(status) && (
        <span className="h-2 w-2 rounded-full bg-slate-400" />
      )}

      {['canceled'].includes(status) && (
        <span className="h-2 w-2 rounded-full bg-rose-500" />
      )}

      {['in_progress'].includes(status) && (
        <span className="h-2 w-2 rounded-full bg-blue-500" />
      )}

      {['completed'].includes(status) && (
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
      )}

      <span className="font-medium text-muted-foreground">
        {appointmentStatusMap[status]}
      </span>
    </div>
  )
}
