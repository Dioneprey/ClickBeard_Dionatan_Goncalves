import { faker } from '@faker-js/faker'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import {
  Speciality,
  SpecialityProps,
} from 'src/domain/barbershop/enterprise/entities/speciality'

export function makeSpeciality(
  override: Partial<SpecialityProps> = {},
  id?: UniqueEntityID,
) {
  const speciality = Speciality.create(
    {
      name: faker.lorem.word(),
      ...override,
    },
    id,
  )

  return speciality
}
