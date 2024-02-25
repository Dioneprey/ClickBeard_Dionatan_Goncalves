import { fetchBarbers } from '@/api/fetch-barbers'
import { useAuth } from '@/context/auth-context'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Navigate } from 'react-router-dom'
import { BarberCard } from '../schedule/components/barber-card'
import { HandleRegistrationBarber } from '@/components/handle-registration-barber'
import { Skeleton } from '@/components/ui/skeleton'

export function Barbers() {
  const { user } = useAuth()
  const isAdmin = user.role === 'admin'

  const { data: barbers, isLoading: isLoadingFetchBarbers } = useQuery({
    queryKey: ['fetch-barbers'],
    queryFn: fetchBarbers,
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

        {isLoadingFetchBarbers ? (
          <>
            <div className="flex gap-5 justify-center items-center">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton
                  className="w-[300px] py-5 h-[280px] rounded-lg"
                  key={index + 1}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            {
              // @ts-expect-error possible undefine
              barbers?.length < 1 ? (
                <div className="flex flex-col gap-5 justify-center items-center">
                  <h2 className="text-2xl text-center font-bold leading-tight tracking-tighter md:text-3xl">
                    Nenhum profissional cadastrado.
                  </h2>
                </div>
              ) : (
                <div className="flex flex-wrap gap-5 mt-10 justify-center">
                  {barbers?.map((barber) => {
                    return (
                      <BarberCard
                        barberData={barber}
                        onlyView={true}
                        key={barber.id}
                      />
                    )
                  })}
                </div>
              )
            }
          </>
        )}
      </>
    )
}
