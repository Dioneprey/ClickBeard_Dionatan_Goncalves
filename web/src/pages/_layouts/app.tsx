import { useAuth } from '@/context/auth-context'
import { Navigate, Outlet } from 'react-router-dom'

import { Header } from '@/components/header'

export function AppLayout() {
  const { status } = useAuth()

  if (status === 'unauthenticated') {
    return <Navigate to="/sign-in" replace />
  }

  if (status === 'authenticated') {
    return (
      <div className="flex min-h-screen flex-col antialiased">
        <Header />

        <div className="flex flex-1 flex-col gap-4 p-8 pt-6 overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    )
  }
}
