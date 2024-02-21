import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { AppointmentDetails } from './appointment-details'
import { Appointment } from '@/@interfaces/Appointment'
import {
  differenceInMilliseconds,
  format,
  formatDuration,
  intervalToDuration,
} from 'date-fns'
import { formatTime } from '@/utils/format-time-value'
import { useAuth } from '@/context/auth-context'
import { ptBR } from 'date-fns/locale'
import { AppointmentStatusIndicator } from './appointment-status'

interface AppointmentTableRowProps {
  appointment: Appointment
}

export function AppointmentTableRow({ appointment }: AppointmentTableRowProps) {
  const { user } = useAuth()

  const isUserAdmin = user.role === 'admin'

  const durationToAppointment = intervalToDuration({
    start: new Date(),
    end: appointment.day,
  })

  const formatedDurationToAppointment = formatDuration(durationToAppointment, {
    locale: ptBR,
    delimiter: ', ',
  })

  const diffInMilliseconds = differenceInMilliseconds(
    appointment.day,
    new Date(),
  )

  const diffInHours = diffInMilliseconds / (1000 * 60 * 60)
  const isMoreThanTwoHours = diffInHours > 2

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
        <AppointmentStatusIndicator status={appointment.status} />
      </TableCell>
      <TableCell className="font-medium">{appointment.barber.name}</TableCell>
      {isUserAdmin && (
        <TableCell className="font-medium">{appointment.client.name}</TableCell>
      )}
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="xs">
              <X className="mr-2 h-3 w-3" />
              Cancelar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancelar agendamento?</DialogTitle>
              <DialogDescription>
                Você só pode cancelar agendamentos com mais de 2 horas de
                antecedência.
              </DialogDescription>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      Atendimento em
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-muted-foreground">
                          {formatedDurationToAppointment}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {!isMoreThanTwoHours && (
                <span className="text-rose-400 text-sm">
                  Agendamentos com menos de 2 horas de antecedência não podem
                  ser cancelados.
                </span>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Voltar</Button>
                </DialogClose>
                <Button disabled={!isMoreThanTwoHours}>Confirmar</Button>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  )
}
