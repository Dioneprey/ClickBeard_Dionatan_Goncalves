import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { registerAccount } from '@/api/register-account'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/theme/theme-toggle'

const signUpForm = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpForm>({})

  const { mutateAsync: registerAccountFn } = useMutation({
    mutationFn: registerAccount,
    onError(error) {
      console.log(error)
    },
  })

  async function handleSignUp(data: SignUpForm) {
    try {
      await registerAccountFn({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      toast.success('Conta cadastrada com sucesso!', {
        action: {
          label: 'Login',
          onClick: () => navigate(`/sign-in`),
        },
      })
    } catch (error) {
      toast.error('Erro ao cadastrar conta.')
    }
  }

  return (
    <>
      <Helmet title="Cadastro" />
      <div className="p-8">
        <Button variant="ghost" asChild className="absolute right-20 top-8">
          <Link to="/sign-in">Fazer login</Link>
        </Button>

        <div className="absolute right-8 top-8">
          <ThemeToggle />
        </div>

        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta grátis
            </h1>
            <p className="text-sm text-muted-foreground">
              Cadastre-se e descubra a facilidade de marcar e gerenciar seus
              agendamentos!
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleSignUp)}>
            <div className="space-y-2">
              <Label htmlFor="name">Seu nome</Label>
              <Input id="name" type="text" {...register('name')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Sua senha</Label>
              <Input id="password" type="password" {...register('password')} />
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              Finalizar cadastro
            </Button>

            <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
              Ao continuar, você concorda com nossos{' '}
              <a className="underline underline-offset-4" href="#">
                Termos de serviço
              </a>{' '}
              e{' '}
              <a className="underline underline-offset-4" href="#">
                políticas de privacidade
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
