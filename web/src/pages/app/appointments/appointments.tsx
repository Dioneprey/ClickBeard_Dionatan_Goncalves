import { Helmet } from 'react-helmet-async'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AppointmentTableFilters } from './components/appointment-table-filters'
import { AppointmentTableRow } from './components/appointment-table-row'
import { Pagination } from '@/components/ui/pagination'
import { useQuery } from '@tanstack/react-query'
import { fetchAppointments } from '@/api/fetch-appointments'
import { AppointmentStatus } from '@/@interfaces/Appointment'
import { useEffect, useState } from 'react'

export function Appointments() {
  const { data: appointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments,
  })

  const [filteredAppointments, setFilteredAppointments] = useState(appointments)

  // Atualize o estado sempre que appointments mudar.
  useEffect(() => {
    setFilteredAppointments(appointments)
  }, [appointments])

  function handleFilterAppointments(
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'all',
  ) {
    if (status === 'all') {
      setFilteredAppointments(appointments)
    } else {
      const newFilteredAppointments = appointments?.filter(
        (appointment) => appointment.status === AppointmentStatus[status],
      )
      setFilteredAppointments(newFilteredAppointments)
    }
  }

  return (
    <>
      <Helmet title="Agendamentos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          Agendamentos
        </h1>

        <div className="space-y-2.5">
          <AppointmentTableFilters
            filterAppointments={handleFilterAppointments}
          />
          <div className="rounded-md bAppointment">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[180px]">
                    Data do atendimento
                  </TableHead>
                  <TableHead className="w-[100px]">Horário</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead>Barbeiro</TableHead>
                  <TableHead className="w-[180px]">Valor do serviço</TableHead>
                  <TableHead className="w-[160px]">
                    Duração do serviço
                  </TableHead>
                  <TableHead className="w-[180px]">Agendado em</TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredAppointments &&
                  filteredAppointments.map((appointment) => {
                    return (
                      <AppointmentTableRow
                        key={appointment.id}
                        appointment={appointment}
                      />
                    )
                  })}
              </TableBody>
            </Table>
          </div>
          <Pagination
            pageIndex={0}
            totalCount={filteredAppointments ? filteredAppointments.length : 0}
            perPage={10}
          />
        </div>
      </div>
    </>
  )
}
