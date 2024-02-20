import { Appointment, AppointmentStatus } from '@/@interfaces/Appointment'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatTime } from '@/utils/format-time-value'
import { format } from 'date-fns'

interface AppointmentDetailsProps {
  appointment: Appointment
}

export function AppointmentDetails({ appointment }: AppointmentDetailsProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Agendamento</DialogTitle>
        <DialogDescription>Detalhes do agendamento</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Data do atendimento
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">
                    {format(appointment?.day, 'dd/MM/yyyy')} {appointment.hour}
                  </span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Status</TableCell>
              <TableCell className="flex justify-end">
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
                    {appointment.status === AppointmentStatus.CANCELLED &&
                      'Cancelado'}
                    {appointment.status === AppointmentStatus.COMPLETED &&
                      'Finalizado'}
                    {appointment.status === AppointmentStatus.SCHEDULED &&
                      'Agendado'}
                  </span>
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">Barbeiro</TableCell>
              <TableCell className="flex justify-end">
                {appointment.barber.name}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">
                Agendado em
              </TableCell>
              <TableCell className="flex justify-end">
                {format(appointment?.createdAt, 'dd/MM/yyyy HH:mm')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serviço</TableHead>
              <TableHead className="text-right"></TableHead>
              <TableHead className="text-right">Duração</TableHead>
              <TableHead className="text-right">Preço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{appointment.service.name}</TableCell>
              <TableCell className="text-right"></TableCell>
              <TableCell className="text-right">
                {formatTime(appointment.service.time)}
              </TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(appointment.service.price)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  )
}
