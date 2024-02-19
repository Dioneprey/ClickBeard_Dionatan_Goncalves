import {
  Prisma,
  Barber as PrismaBarber,
  Speciality as PrismaSpeciality,
} from '@prisma/client'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Barber } from 'src/domain/barbershop/enterprise/entities/barber'
import { Speciality } from 'src/domain/barbershop/enterprise/entities/speciality'

export class PrismaBarberMapper {
  static toDomain(
    raw: PrismaBarber & {
      BarberSpecialities?: { speciality: PrismaSpeciality }[]
    },
  ): Barber {
    return Barber.create(
      {
        name: raw.name,
        hiringDate: raw.hiringDate,
        birthDate: raw.birthDate,
        photo: raw.photo ?? undefined,
        specialitiesId: raw.BarberSpecialities?.map(
          (barberSpeciality) =>
            new UniqueEntityID(barberSpeciality.speciality.id),
        ),
        specialities: raw.BarberSpecialities?.map((barberSpeciality) =>
          Speciality.create({
            name: barberSpeciality?.speciality?.name,
            price: barberSpeciality?.speciality?.price,
            time: barberSpeciality?.speciality?.time,
            photo: barberSpeciality?.speciality?.photo ?? undefined,
          }),
        ),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(barber: Barber): Prisma.BarberUncheckedCreateInput {
    return {
      id: barber.id.toString(),
      name: barber.name,
      hiringDate: barber.hiringDate,
      birthDate: barber.birthDate,
      photo: barber.photo,
    }
  }
}
