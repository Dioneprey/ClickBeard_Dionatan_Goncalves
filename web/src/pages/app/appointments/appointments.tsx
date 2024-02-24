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
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '@/context/auth-context'
import { appointmentsEventSource } from '@/lib/sse-event-source'
import { queryClient } from '@/lib/react-query'

export function Appointments() {
  const { user } = useAuth()

  const isUserAdmin = user.role === 'admin'

  const [searchParams, setSearchParams] = useSearchParams()

  const status = searchParams.get('status')
  const date = searchParams.get('date')

  const pageIndex = z.coerce
    .number()
    .transform((page) => {
      if (page <= 1) {
        return 0
      }
      return page - 1
    })
    .parse(searchParams.get('page') ?? '1')

  appointmentsEventSource.onmessage = (event) => {
    if (event.data === 'change-appointment') {
      if (pageIndex === 0) {
        queryClient.invalidateQueries({
          queryKey: ['appointments'],
        })
      }
    }
  }

  const { data: result } = useQuery({
    queryKey: ['appointments', pageIndex, status, date],
    queryFn: () =>
      fetchAppointments({
        pageIndex,
        status: status === 'all' ? null : status,
        date: date ?? undefined,
      }),
  })

  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', (pageIndex + 1).toString())

      return state
    })
  }

  return (
    <>
      <Helmet title="Agendamentos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          Agendamentos
        </h1>

        <div className="space-y-2.5">
          <AppointmentTableFilters />
          <div className="rounded-md bAppointment">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[180px]">
                    Data do atendimento
                  </TableHead>
                  <TableHead className="w-[100px]">Horário</TableHead>
                  <TableHead className="w-[160px]">Status</TableHead>
                  <TableHead>Barbeiro</TableHead>
                  {isUserAdmin && <TableHead>Cliente</TableHead>}
                  <TableHead className="w-[180px]">Valor do serviço</TableHead>
                  <TableHead className="w-[160px]">
                    Duração do serviço
                  </TableHead>
                  <TableHead className="w-[180px]">Agendado em</TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {result?.appointments &&
                  result?.appointments.map((appointment) => {
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
            onPageChange={handlePagination}
            pageIndex={result?.meta?.pageIndex ?? 0}
            totalCount={result?.meta?.totalCount ?? 0}
            totalPages={result?.meta?.totalPages ?? 1}
          />
        </div>
      </div>
    </>
  )
}
