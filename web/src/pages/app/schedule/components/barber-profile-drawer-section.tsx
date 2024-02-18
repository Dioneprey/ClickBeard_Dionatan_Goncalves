interface BarberProfileDrawerSectionProps {
  section: 'about' | 'photos' | 'reviews'
}

export function BarberProfileDrawerSection({
  section,
}: BarberProfileDrawerSectionProps) {
  return (
    <div className="h-[300px] ">
      {section === 'about' && (
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum quidem
          cum veniam voluptatibus laboriosam, similique odit maxime dolores
          possimus nesciunt consequuntur beatae debitis! Quidem, optio. Eius
          voluptatum numquam repellat consequuntur!
        </p>
      )}
      {section === 'photos' && <div>fotos</div>}
      {section === 'reviews' && <div>reviews</div>}
    </div>
  )
}
