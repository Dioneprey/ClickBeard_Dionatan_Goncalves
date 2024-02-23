import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { DropzoneInput } from '@/components/dropzone-input'
import { useState } from 'react'
import { registerSpeciality } from '@/api/register-speciality'
import { queryClient } from '@/lib/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadSpecialityImage } from '@/api/upload-speciality-image'

const ordersFiltersSchema = z.object({
  name: z.string().min(1, { message: 'Informe o nome da especialidade' }),
  price: z.coerce
    .number()
    .min(1, { message: 'Informe o preço da especialidade' }),
})

type RegisterSpecialitySchema = z.infer<typeof ordersFiltersSchema>

export function RegisterSpeciality() {
  const [registerSpecialityDialogOpen, setRegisterSpecialityDialogOpen] =
    useState(false)
  const [tempSelectedImageFile, setTempSelectedImageFile] =
    useState<File | null>(null)

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterSpecialitySchema>({
    resolver: zodResolver(ordersFiltersSchema),
  })

  function handleTemporaryImage(file: File | null) {
    setTempSelectedImageFile(file)
  }

  async function handleRegisterSpeciality(data: RegisterSpecialitySchema) {
    registerSpecialityFn(data)
  }

  const { mutateAsync: registerSpecialityFn, isPending } = useMutation({
    mutationFn: registerSpeciality,
    onSuccess: async (specialityId) => {
      if (tempSelectedImageFile) {
        await UploadSpecialityImage(tempSelectedImageFile, specialityId)
      }
      queryClient.invalidateQueries({
        queryKey: ['fetch-specialities'],
      })
      setRegisterSpecialityDialogOpen(false)
      toast.success('Especialidade cadastrada com sucesso')
    },
  })

  return (
    <Dialog
      onOpenChange={setRegisterSpecialityDialogOpen}
      open={registerSpecialityDialogOpen}
    >
      <DialogTrigger asChild>
        <Button>Cadastrar nova</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova especialidade</DialogTitle>
          <DialogDescription>
            Informe os dados da nova especialidade
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleRegisterSpeciality)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nome da especialidade</Label>
            <Input {...register('name')} />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <span>Preço</span>{' '}
              <span className="text-xs text-muted-foreground">R$</span>
            </Label>
            <Input type="number" {...register('price')} />
            {errors.price && (
              <span className="text-red-500 text-xs ">
                {errors.price.message}
              </span>
            )}
          </div>

          <div className="gap-2 flex flex-col">
            <Label htmlFor="name" className="flex gap-2">
              <span>Foto</span>
              <span className="text-xs text-muted-foreground">Opcional</span>
            </Label>

            <DropzoneInput
              disabled={false}
              isLoading={false}
              returnFile={handleTemporaryImage}
            />
          </div>
          <Button disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Registrando...
              </>
            ) : (
              '   Registrar especialidade'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
