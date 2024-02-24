import { useAuth } from '@/context/auth-context'
import { Helmet } from 'react-helmet-async'
import { HomeItemsCard } from './components/home-items-card'
import { Clock3, FolderClock, Users } from 'lucide-react'

export function Home() {
  const { user } = useAuth()
  const isAdmin = user.role === 'admin'
  return (
    <>
      <Helmet title="Início" />

      <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold leading-tight tracking-tighter">
        Olá, {user.name}, seja bem-vindo!
      </h1>
      <span className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
        O que precisa para hoje?
      </span>
      <div className="flex sm:flex-row sm:items-start items-center flex-col gap-5 mt-10">
        {!isAdmin && (
          <HomeItemsCard
            href="agendar"
            title="Marcar horário"
            description="Realize agendamentos de serviços"
            icon={<Clock3 className="h-8 w-8 text-primary" />}
          />
        )}
        <HomeItemsCard
          href="agendamentos"
          title="Agendamentos"
          description="Veja o histórico dos seus agendamentos"
          icon={<FolderClock className="h-8 w-8 text-primary" />}
        />

        {isAdmin && (
          <HomeItemsCard
            href="barbeiros"
            title="Barbeiros"
            description="Visualize nossos profissionais e seus serviços"
            icon={<Users className="h-8 w-8 text-primary" />}
          />
        )}
      </div>
    </>
  )
}
