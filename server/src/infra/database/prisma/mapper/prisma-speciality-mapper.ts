import { Prisma, Speciality as PrismaSpeciality } from '@prisma/client'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Speciality } from 'src/domain/barbershop/enterprise/entities/speciality'

export class PrismaSpecialityMapper {
  static toDomain(raw: PrismaSpeciality): Speciality {
    return Speciality.create(
      {
        name: raw.name,
        price: raw.price,
        time: raw.time,
        photo: raw?.photo ?? undefined,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    speciality: Speciality,
  ): Prisma.SpecialityUncheckedCreateInput {
    return {
      id: speciality.id.toString(),
      name: speciality.name,
      price: speciality.price,
      time: speciality.time,
      photo: speciality.photo,
    }
  }
}
