import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Barber } from 'src/domain/barbershop/enterprise/entities/barber'
import { BarberRepository } from 'src/domain/barbershop/application/repositories/barber-repository'
import { PrismaBarberMapper } from '../mapper/prisma-barber-mapper'

@Injectable()
export class PrismaBarberRepository implements BarberRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const barber = await this.prisma.barber.findUnique({
      where: {
        id,
      },
      include: {
        BarberSpecialities: {
          select: {
            speciality: true,
          },
        },
      },
    })

    if (!barber) {
      return null
    }

    return PrismaBarberMapper.toDomain(barber)
  }

  async findAll() {
    const barbers = await this.prisma.barber.findMany({
      orderBy: {
        hiringDate: 'asc',
      },
      include: {
        BarberSpecialities: {
          select: {
            speciality: true,
          },
        },
      },
    })

    return barbers.map(PrismaBarberMapper.toDomain)
  }

  async create(barber: Barber) {
    const data = PrismaBarberMapper.toPrisma(barber)

    const specialitiesConnect =
      barber?.specialitiesId?.map((speciality) => {
        return {
          specialityId: speciality.toString(),
        }
      }) ?? []

    const newBarber = await this.prisma.barber.create({
      data: {
        ...data,
        BarberSpecialities: {
          createMany: {
            data: specialitiesConnect,
          },
        },
      },
    })

    return PrismaBarberMapper.toDomain(newBarber)
  }

  async save(barber: Barber) {
    const data = PrismaBarberMapper.toPrisma(barber)

    const updatedBarber = await this.prisma.barber.update({
      where: {
        id: data.id,
      },
      data,
    })

    return PrismaBarberMapper.toDomain(updatedBarber)
  }
}
