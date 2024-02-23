import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface HomeItemsCardProps {
  href: string
  title: string
  description: string
  icon: ReactNode
}

export function HomeItemsCard({
  href,
  title,
  description,
  icon,
}: HomeItemsCardProps) {
  return (
    <Link to={`/${href}`}>
      <Card className="w-[280px] cursor-pointer">
        <CardHeader>
          <CardTitle className="flex flex-col justify-center items-center gap-2">
            {icon}
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
