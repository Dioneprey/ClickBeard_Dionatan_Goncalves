import { Appointment } from '@/@interfaces/Appointment'
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
import { AppointmentStatusIndicator } from './appointment-status'
import { useAuth } from '@/context/auth-context'

interface AppointmentDetailsProps {
  appointment: Appointment
}

export function AppointmentDetails({ appointment }: AppointmentDetailsProps) {
  const { user } = useAuth()

  const isUserAdmin = user.role === 'admin'

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
                <AppointmentStatusIndicator status={appointment.status} />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">Barbeiro</TableCell>
              <TableCell className="flex justify-end">
                {appointment.barber.name}
              </TableCell>
            </TableRow>

            {isUserAdmin && (
              <TableRow>
                <TableCell className="text-muted-foreground">Cliente</TableCell>
                <TableCell className="flex justify-end">
                  {appointment.client.name}
                </TableCell>
              </TableRow>
            )}

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
