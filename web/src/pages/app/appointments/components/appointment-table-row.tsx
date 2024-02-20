import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { AppointmentDetails } from './appointment-details'
import { Appointment, AppointmentStatus } from '@/@interfaces/Appointment'
import { format } from 'date-fns'
import { formatTime } from '@/utils/format-time-value'

interface AppointmentTableRowProps {
  appointment: Appointment
}

export function AppointmentTableRow({ appointment }: AppointmentTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>
          <AppointmentDetails appointment={appointment} />
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {format(appointment?.day, 'dd/MM/yyyy')}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {appointment.hour}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {appointment.status === AppointmentStatus.CANCELLED && (
            <span className="h-2 w-2 rounded-full bg-red-500" />
          )}
          {appointment.status === AppointmentStatus.COMPLETED && (
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          )}
          {appointment.status === AppointmentStatus.SCHEDULED && (
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
          )}
          <span className="font-medium text-muted-foreground">
            {appointment.status === AppointmentStatus.CANCELLED && 'Cancelado'}
            {appointment.status === AppointmentStatus.COMPLETED && 'Finalizado'}
            {appointment.status === AppointmentStatus.SCHEDULED && 'Agendado'}
          </span>
        </div>
      </TableCell>
      <TableCell className="font-medium">{appointment.barber.name}</TableCell>
      <TableCell className="font-medium">
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(appointment.service.price)}
      </TableCell>
      <TableCell className="font-medium">
        {formatTime(appointment.service.time)}
      </TableCell>
      <TableCell>
        {format(appointment?.createdAt, 'dd/MM/yyyy HH:mm')}
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="xs">
          <X className="mr-2 h-3 w-3" />
          Cancelar
        </Button>
      </TableCell>
    </TableRow>
  )
}
