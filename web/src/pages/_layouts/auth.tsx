import { useAuth } from '@/context/auth-context'
import { Scissors } from 'lucide-react'
import { Navigate, Outlet } from 'react-router-dom'

export function AuthLayout() {
  const { status } = useAuth()

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2 antialiased">
      <div className="h-full w-full bg-white relative md:block hidden">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
          <div className="flex items-center gap-3 text-lg text-foreground">
            <Scissors className="h-5 w-5 text-primary" />
            <span className="font-semibold">click.beard</span>
          </div>
          <footer className="text-sm">
            Painel do parceiro &copy; click.beard - {new Date().getFullYear()}
          </footer>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
