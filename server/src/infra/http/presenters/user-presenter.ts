import { User } from 'src/domain/barbershop/enterprise/entities/user'

export class UserPresenter {
  static toHTTP(user: User | null) {
    if (user === null) {
      return {}
    }

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }
  }
}
