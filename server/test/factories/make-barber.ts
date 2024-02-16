import { faker } from '@faker-js/faker'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import {
  Barber,
  BarberProps,
} from 'src/domain/barbershop/enterprise/entities/barber'

export function makeBarber(
  override: Partial<BarberProps> = {},
  id?: UniqueEntityID,
) {
  const barber = Barber.create(
    {
      name: faker.person.fullName(),
      birthDate: faker.date.anytime(),
      hiringDate: new Date(),
      ...override,
    },
    id,
  )

  return barber
}
