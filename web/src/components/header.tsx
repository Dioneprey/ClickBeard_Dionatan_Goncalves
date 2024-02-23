import { Clock3, FolderClock, Home, Scissors, Users } from 'lucide-react'

import { ThemeToggle } from './theme/theme-toggle'
import { Separator } from './ui/separator'
import { AccountMenu } from './account-menu'
import { NavLink } from './nav-link'
import { useAuth } from '@/context/auth-context'

export function Header() {
  const { user } = useAuth()

  const isAdmin = user.role === 'admin'

  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <Scissors className="h-6 w-6 text-primary" />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <Home className="h-4 w-4" />
            Início
          </NavLink>
          {!isAdmin && (
            <NavLink to="/agendar">
              <Clock3 className="h-4 w-4" />
              Agendar
            </NavLink>
          )}
          <NavLink to="/agendamentos">
            <FolderClock className="h-4 w-4" />
            Agendamentos
          </NavLink>
          {isAdmin && (
            <NavLink to="/barbeiros">
              <Users className="h-4 w-4" />
              Barbeiros
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}
