import { Injectable } from '@nestjs/common'
import { UsersRepository } from 'src/domain/barbershop/application/repositories/users-repository'
import { PrismaService } from '../prisma.service'
import { User } from 'src/domain/barbershop/enterprise/entities/user'
import { PrismaUserMapper } from '../mapper/prisma-user-mapper'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}
  async findById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async create(user: User) {
    const data = PrismaUserMapper.toPrisma(user)

    const newUser = await this.prisma.user.create({
      data,
    })

    return PrismaUserMapper.toDomain(newUser)
  }

  async save(user: User) {
    const data = PrismaUserMapper.toPrisma(user)

    const updatedUser = await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })

    return PrismaUserMapper.toDomain(updatedUser)
  }
}
