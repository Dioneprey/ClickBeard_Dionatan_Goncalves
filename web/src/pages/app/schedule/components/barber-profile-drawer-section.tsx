import { Barber } from '@/api/fetch-barbers'
import { ServiceCardOnlyView } from './service-card'

interface BarberProfileDrawerSectionProps {
  barberData: Barber
  section: 'about' | 'photos' | 'reviews'
}

export function BarberProfileDrawerSection({
  section,
  barberData,
}: BarberProfileDrawerSectionProps) {
  return (
    <div className="h-[300px] overflow-y-auto flex">
      {section === 'about' && (
        <div className="w-full flex justify-center flex-wrap gap-4 overflow-y-auto">
          {barberData?.specialities.map((barberSpeciality) => {
            return (
              <ServiceCardOnlyView
                key={barberSpeciality.id}
                speciality={barberSpeciality}
              />
            )
          })}
        </div>
      )}
      {section === 'photos' && <div>fotos</div>}
      {section === 'reviews' && <div>reviews</div>}
    </div>
  )
}
