import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { useAuth } from '@/context/auth-context'

const signInForm = z.object({
  email: z.string().email(),
  password: z.string(),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const { SignIn: SignInFn } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>()

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: SignInFn,
    onError: (error) => {
      console.log(error)
      toast.error(
        'Erro ao fazer login, por favor, tente novamente mais tarde.',
        { closeButton: true },
      )
    },
    onSuccess: () => {
      toast.success(
        'Login feito com sucesso, você será redirecionado para a aplicação.',
        { closeButton: true },
      )

      navigate('/', {
        replace: true,
      })
    },
  })

  async function handleSignIn({ email, password }: SignInForm) {
    await authenticate({ email, password })
  }

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <Button variant="ghost" asChild className="absolute right-20 top-8">
          <Link to="/sign-up">Se cadastrar</Link>
        </Button>
        <div className="absolute right-8 top-8">
          <ThemeToggle />
        </div>

        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar aplicação
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie seus horários com facilidade. Faça login para agendar e
              acompanhar seus cortes e serviços!
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)}>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Seu e-mail</Label>
                <Input id="email" type="email" {...register('email')} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Sua senha</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                />
              </div>
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              Acessar
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
