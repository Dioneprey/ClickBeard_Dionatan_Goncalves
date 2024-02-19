import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { SpecialityRepository } from 'src/domain/barbershop/application/repositories/speciality-repository'
import { PrismaSpecialityMapper } from '../mapper/prisma-speciality-mapper'
import { Speciality } from 'src/domain/barbershop/enterprise/entities/speciality'

@Injectable()
export class PrismaSpecialityRepository implements SpecialityRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const speciality = await this.prisma.speciality.findUnique({
      where: {
        id,
      },
    })

    if (!speciality) {
      return null
    }

    return PrismaSpecialityMapper.toDomain(speciality)
  }

  async findAll() {
    const specialitys = await this.prisma.speciality.findMany()

    return specialitys.map(PrismaSpecialityMapper.toDomain)
  }

  async create(speciality: Speciality) {
    const data = PrismaSpecialityMapper.toPrisma(speciality)

    const newSpeciality = await this.prisma.speciality.create({
      data,
    })

    return PrismaSpecialityMapper.toDomain(newSpeciality)
  }

  async save(speciality: Speciality) {
    const data = PrismaSpecialityMapper.toPrisma(speciality)

    const updatedSpeciality = await this.prisma.speciality.update({
      where: {
        id: data.id,
      },
      data,
    })

    return PrismaSpecialityMapper.toDomain(updatedSpeciality)
  }
}
