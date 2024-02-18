import { Either, left, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './@errors/resource-not-found.error'

interface GetUserProfileUseCaseRequest {
  userId: string
}

type GetUserProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    userProfile: User
  }
>

@Injectable()
export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId)

    if (!userExists) {
      return left(new ResourceNotFoundError(userId))
    }

    return right({
      userProfile: userExists,
    })
  }
}
