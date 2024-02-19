import { useSchedule } from '@/context/schedule-context'

export function MultiStepSchedule() {
  const { scheduleStep } = useSchedule()

  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-2 rounded-xl w-[160px] ${scheduleStep >= 1 ? 'bg-primary' : 'bg-secondary'}`}
      ></div>
      <div
        className={`h-2 rounded-xl w-[160px] ${scheduleStep >= 2 ? 'bg-primary' : 'bg-secondary'}`}
      ></div>
      <div
        className={`h-2 rounded-xl w-[160px] ${scheduleStep === 3 ? 'bg-primary' : 'bg-secondary'}`}
      ></div>
    </div>
  )
}
