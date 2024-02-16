import { Prisma, User as PrismaUser } from '@prisma/client'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { User, UserRole } from 'src/domain/barbershop/enterprise/entities/user'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: UserRole[raw.role],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    const userRole = user.role === UserRole.ADMIN ? 'ADMIN' : 'CLIENT'

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: userRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
