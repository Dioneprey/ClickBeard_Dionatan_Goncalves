import { CalendarWithMonthYearPicker } from '@/components/calendar-with-month-year-picker'
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

import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { SpecialityDrawer } from '../pages/app/barbers/components/speciality-drawer'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchSpecialities } from '@/api/fetch-specialities'
import { DropzoneInput } from '@/components/dropzone-input'
import { useState } from 'react'
import { registerBarber } from '@/api/register-barber'
import { queryClient } from '@/lib/react-query'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'

import { UploadBarberImage } from '@/api/upload-barber-image'
import { Barber } from '@/@interfaces/Barber'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { updateBarber } from '@/api/update-barber'

const ordersFiltersSchema = z.object({
  name: z.string().min(1, { message: 'Informe o nome do barbeiro' }),
  hiringDate: z.coerce.date(),
  birthDate: z.coerce.date({
    required_error: 'ordersFiltersSchema',
  }),
  specialities: z
    .array(z.string())
    .min(1, { message: 'Informe ao menos uma especialidade' }),
})

type RegistrationBarberSchema = z.infer<typeof ordersFiltersSchema>

interface HandleRegistrationBarberProps {
  isUpdate?: boolean
  barberData?: Barber
}

export function HandleRegistrationBarber({
  isUpdate,
  barberData,
}: HandleRegistrationBarberProps) {
  const [registrationBarberDialogOpen, setRegistrationBarberDialogOpen] =
    useState(false)
  const [tempSelectedImageFile, setTempSelectedImageFile] =
    useState<File | null>(null)
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false)

  const {
    handleSubmit,
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationBarberSchema>({
    resolver: zodResolver(ordersFiltersSchema),
    defaultValues: {
      hiringDate: new Date(),
      birthDate: barberData?.birthDate
        ? new Date(barberData?.birthDate)
        : undefined,
      name: barberData?.name,
      specialities: barberData?.specialities.map((speciality) => speciality.id),
    },
  })

  const specialitiesId = watch('specialities')

  const { data: specialities } = useQuery({
    queryKey: ['fetch-specialities'],
    queryFn: fetchSpecialities,
    staleTime: Infinity,
  })

  function handleTemporaryImage(file: File | null) {
    setTempSelectedImageFile(file)
  }

  async function handleRegistrationBarber(data: RegistrationBarberSchema) {
    if (isUpdate) {
      updateBarberFn({
        ...data,
        id: barberData?.id ?? '',
        removePhoto: removeCurrentImage,
      })
    } else {
      registerBarberFn(data)
    }
  }

  const { mutateAsync: registerBarberFn, isPending: registerBarberIsPending } =
    useMutation({
      mutationFn: registerBarber,
      onSuccess: async (barberId) => {
        if (tempSelectedImageFile) {
          await UploadBarberImage(tempSelectedImageFile, barberId)
        }
        queryClient.invalidateQueries({
          queryKey: ['fetch-barbers'],
        })
        setRegistrationBarberDialogOpen(false)
        toast.success('Barbeiro cadastrado com sucesso', { closeButton: true })
      },
    })

  const { mutateAsync: updateBarberFn, isPending: updateBarberIsPending } =
    useMutation({
      mutationFn: updateBarber,
      onSuccess: async (barberId) => {
        if (tempSelectedImageFile) {
          await UploadBarberImage(tempSelectedImageFile, barberId)
        }
        queryClient.invalidateQueries({
          queryKey: ['fetch-barbers'],
        })
        setRegistrationBarberDialogOpen(false)
        toast.success('Barbeiro atualizado com sucesso', { closeButton: true })
      },
    })

  return (
    <Dialog
      onOpenChange={(open: boolean) => {
        setRegistrationBarberDialogOpen(open)
        setRemoveCurrentImage(false)
      }}
      open={registrationBarberDialogOpen}
    >
      <DialogTrigger asChild>
        <Button>{isUpdate ? 'Editar barbeiro' : 'Cadastrar novo'}</Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto h-full">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Editar barbeiro' : 'Novo barbeiro'}
          </DialogTitle>
          <DialogDescription>Informe os dados do barbeiro</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleRegistrationBarber)}
          className="space-y-10"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nome do barbeiro</Label>
            <Input {...register('name')} />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="birthDate">Data de contratação do barbeiro</Label>
            <Controller
              control={control}
              name="hiringDate"
              render={({ field: { onChange, value } }) => {
                return (
                  <CalendarWithMonthYearPicker
                    onChange={onChange}
                    value={value}
                  />
                )
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="birthDate">Data de nascimento do barbeiro</Label>
            <Controller
              control={control}
              name="birthDate"
              render={({ field: { onChange, value } }) => {
                return (
                  <CalendarWithMonthYearPicker
                    onChange={onChange}
                    value={value}
                  />
                )
              }}
            />
            {errors.birthDate && (
              <span className="text-red-500 text-xs">
                Informe a data de nascimento do barbeiro
              </span>
            )}
          </div>
          <div className="gap-2 flex flex-col">
            <Label htmlFor="name">Especialidade(s)</Label>
            <div className="text-muted-foreground flex gap-2">
              <span className="font-semibold">Selecionados:</span>
              <span>
                {specialitiesId?.length > 0
                  ? specialitiesId
                      .map((item) => {
                        return specialities?.specialities.find(
                          (speciality) => speciality.id === item,
                        )?.name
                      })
                      .join(', ')
                  : 'nenhum'}
              </span>
            </div>
            <SpecialityDrawer
              barberSpecialities={
                barberData?.specialities.map((item) => item.id) ?? []
              }
              setValue={setValue}
            />
            {errors.specialities && (
              <span className="text-red-500 text-xs">
                Informe ao menos uma especialidade
              </span>
            )}
          </div>
          <div className="gap-2 flex flex-col">
            <Label htmlFor="name" className="flex gap-2">
              <span>Foto</span>
              <span className="text-xs text-muted-foreground">Opcional</span>
            </Label>

            {!removeCurrentImage && barberData?.photo && (
              <div className="flex flex-col gap-2 items-start">
                <Label>Atual</Label>
                <div className="flex gap-2 items-center">
                  <Avatar className="w-12 h-12 rounded-md">
                    <AvatarImage src={barberData?.photo} />
                    <AvatarFallback className="rounded-md">NM</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button
                      onClick={() => setRemoveCurrentImage(true)}
                      type="button"
                      variant={'destructive'}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <DropzoneInput
              disabled={false}
              isLoading={false}
              returnFile={handleTemporaryImage}
            />
          </div>

          <Button
            disabled={registerBarberIsPending || updateBarberIsPending}
            className="w-full"
          >
            {registerBarberIsPending || updateBarberIsPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isUpdate ? 'Atualizando...' : 'Registrando...'}
              </>
            ) : (
              <span>{isUpdate ? 'Editar barbeiro' : 'Registrar barbeiro'}</span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
