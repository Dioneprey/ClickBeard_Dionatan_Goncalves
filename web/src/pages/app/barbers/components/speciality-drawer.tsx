import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ChevronUp } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchSpecialities } from '@/api/fetch-specialities'
import { SpecialityCard } from './speciality-card'
import { UseFormSetValue } from 'react-hook-form'
import { RegisterSpeciality } from './register-speciality'

interface SpecialityDrawerProps {
  setValue: UseFormSetValue<{
    name: string
    hiringDate: Date
    birthDate: Date
    specialities: string[]
  }>
}

export function SpecialityDrawer({ setValue }: SpecialityDrawerProps) {
  const [openSpecialityDrawer, setOpenSpecialityDrawer] = useState(false)
  const [selectedSpecialitiesId, setSelectedSpecialitiesId] = useState<
    string[]
  >([])

  const { data: specialities } = useQuery({
    queryKey: ['fetch-specialities'],
    queryFn: fetchSpecialities,
    staleTime: Infinity,
  })

  return (
    <Drawer open={openSpecialityDrawer} onOpenChange={setOpenSpecialityDrawer}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full">
          <ChevronUp />
          <span>Selecionar especialidades</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[95vh]  justify-center items-center">
        <DrawerHeader className="flex flex-col gap-5 justify-center items-center">
          <DrawerTitle>Selecione as especialidades</DrawerTitle>
          <RegisterSpeciality />
        </DrawerHeader>
        <DrawerFooter className="sm:w-[80%] w-[100%] overflow-y-auto flex justify-center items-center">
          <div className="w-full flex justify-center flex-wrap gap-4 overflow-y-auto">
            {specialities?.specialities.map((barberSpeciality) => {
              return (
                <SpecialityCard
                  key={barberSpeciality.id}
                  speciality={barberSpeciality}
                  selectedSpecialitiesId={selectedSpecialitiesId}
                  setSelectedSpecialitiesId={setSelectedSpecialitiesId}
                />
              )
            })}
          </div>
          <Separator />

          <div className="flex gap-5 items-center">
            <div className="bg-primary h-16 w-16 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">
                {selectedSpecialitiesId.length}
              </span>
            </div>
            <div className="flex flex-col">
              <span>Especialidade(s) selecionada(s)</span>
            </div>
            <Button
              onClick={() => {
                setOpenSpecialityDrawer(false)
                setValue('specialities', selectedSpecialitiesId)
              }}
            >
              Continuar
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
