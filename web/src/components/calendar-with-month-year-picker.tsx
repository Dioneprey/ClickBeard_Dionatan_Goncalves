import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import dayjs from 'dayjs'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from './ui/button'
import { ptBR } from 'date-fns/locale'

interface CalendarWithMonthYearPickerProps {
  onChange: (...event: unknown[]) => void
  value: Date
}

export function CalendarWithMonthYearPicker({
  onChange,
  value,
}: CalendarWithMonthYearPickerProps) {
  const yearsFromStart = Array.from(
    { length: new Date().getFullYear() - 1899 },
    (_, i) => 1900 + i,
  ).reverse()

  const handleYearChange = (selectedYear: string) => {
    const newDate = dayjs(value).year(parseInt(selectedYear)).toDate()
    onChange(newDate)
  }

  const handleMonthChange = (selectedMonth: number) => {
    const newDate = dayjs(value)
      .month(selectedMonth - 1)
      .toDate()

    onChange(newDate)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full pl-3 text-left font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          {value ? (
            format(value, 'PPP', {
              locale: ptBR,
            })
          ) : (
            <span>Selecionar data</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto p-10">
        <div className="flex gap-2">
          <Select
            onValueChange={(e) => handleYearChange(e)}
            value={
              value
                ? value?.getFullYear()?.toString()
                : new Date()?.getFullYear()?.toString()
            }
          >
            <SelectTrigger className="flex-1 bg-transparent">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Ano</SelectLabel>
                {yearsFromStart.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(e) => handleMonthChange(Number(e))}
            value={
              value
                ? (value?.getMonth() + 1).toString()
                : (new Date()?.getMonth() + 1).toString()
            }
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Mês</SelectLabel>
                {new Array(
                  value && value.getFullYear() === new Date().getFullYear()
                    ? new Date().getMonth() + 1
                    : 12,
                )
                  .fill(null)
                  .map((_, index) => {
                    const month = index + 1
                    const monthNames = [
                      'Janeiro',
                      'Fevereiro',
                      'Março',
                      'Abril',
                      'Maio',
                      'Junho',
                      'Julho',
                      'Agosto',
                      'Setembro',
                      'Outubro',
                      'Novembro',
                      'Dezembro',
                    ]
                    return (
                      <SelectItem
                        key={month.toString()}
                        value={month.toString()}
                      >
                        {monthNames[index]}
                      </SelectItem>
                    )
                  })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Calendar
          key={value?.getTime()}
          className="px-0"
          mode="single"
          toDate={new Date()}
          locale={ptBR}
          today={value}
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </DialogContent>
    </Dialog>
  )
}
