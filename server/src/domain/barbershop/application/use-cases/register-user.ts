import { Either, left, right } from 'src/core/either'
import { User } from '../../enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './@errors/user-already-exists.error'
import { HashGenerator } from '../cryptography/hash-generator'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User
  }
>

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const hasUserWithSameEmail = await this.usersRepository.findByEmail(email)

    if (hasUserWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.usersRepository.create(user)

    return right({
      user,
    })
  }
}
