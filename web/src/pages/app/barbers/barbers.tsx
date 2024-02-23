import { fetchBarbers } from '@/api/fetch-barbers'
import { useAuth } from '@/context/auth-context'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Navigate } from 'react-router-dom'
import { BarberCard } from '../schedule/components/barber-card'
import { HandleRegistrationBarber } from '@/components/handle-registration-barber'

export function Barbers() {
  const { user } = useAuth()
  const isAdmin = user.role === 'admin'

  const { data: barbers /*, isLoading: isLoadingFetchBarbers */ } = useQuery({
    queryKey: ['fetch-barbers'],
    queryFn: fetchBarbers,
    staleTime: Infinity,
  })

  if (!isAdmin) {
    return <Navigate to="/" replace />
  } else
    return (
      <>
        <Helmet title="Barbeiros" />
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            Barbeiros
          </h1>
          <HandleRegistrationBarber />
        </div>

        <div className="flex flex-wrap gap-5 mt-10 justify-center">
          {barbers?.map((barber) => {
            return (
              <BarberCard barberData={barber} onlyView={true} key={barber.id} />
            )
          })}
        </div>
      </>
    )
}
