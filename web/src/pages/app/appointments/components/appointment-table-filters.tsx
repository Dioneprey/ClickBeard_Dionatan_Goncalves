import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, Search, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

const ordersFiltersSchema = z.object({
  status: z.string().optional(),
  date: z.coerce.date().optional(),
})

type OrderFiltersSchema = z.infer<typeof ordersFiltersSchema>

export function AppointmentTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const status = searchParams.get('status')
  const date = searchParams.get('date')

  const { handleSubmit, reset, control } = useForm<OrderFiltersSchema>({
    defaultValues: {
      status: status ?? 'all',
      date: date ? new Date(date) : undefined,
    },
  })

  function handleFilter(data: OrderFiltersSchema) {
    const status = data.status?.toString()
    const date = data.date?.toString()

    setSearchParams((prev) => {
      if (status) {
        prev.set('status', status)
      } else {
        prev.delete('status')
      }
      if (date) {
        prev.set('date', date)
      } else {
        prev.delete('date')
      }

      prev.set('page', '1')

      return prev
    })
  }

  function handleClearFilters() {
    setSearchParams((prev) => {
      prev.delete('status')
      prev.delete('date')
      prev.set('page', '1')

      return prev
    })

    reset({
      status: 'all',
      date: undefined,
    })
  }

  const hasAnyFilter = !!status

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex sm:flex-row flex-col sm:items-center items-start gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>
      <Controller
        control={control}
        name="status"
        render={({ field: { name, onChange, value, disabled } }) => {
          return (
            <Select
              name={name}
              value={value}
              onValueChange={onChange}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 sm:w-[180px] w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="completed">Finalizado</SelectItem>
                <SelectItem value="in_progress">Em andamento</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          )
        }}
      />
      <Controller
        control={control}
        name="date"
        render={({ field: { onChange, value } }) => {
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'sm:w-[240px] w-full pl-3 text-left font-normal',
                    !value && 'text-muted-foreground',
                  )}
                >
                  {value ? format(value, 'PPP') : <span>Selecionar data</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )
        }}
      />
      <Button
        className="sm:w-auto w-full"
        type="submit"
        variant="secondary"
        size="xs"
      >
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>
      <Button
        className="sm:w-auto w-full"
        type="button"
        variant="outline"
        size="xs"
        disabled={!hasAnyFilter}
        onClick={handleClearFilters}
      >
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  )
}
