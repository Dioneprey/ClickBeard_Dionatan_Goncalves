import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AppointmentTableFiltersProps {
  filterAppointments: (status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED') => void
}

export function AppointmentTableFilters({
  filterAppointments,
}: AppointmentTableFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold">Filtros:</span>
      <Select
        defaultValue="all"
        onValueChange={(e: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED') =>
          filterAppointments(e)
        }
      >
        <SelectTrigger className="h-8 w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="SCHEDULED">Agendado</SelectItem>
          <SelectItem value="COMPLETED">Finalizado</SelectItem>
          <SelectItem value="CANCELLED">Cancelado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
